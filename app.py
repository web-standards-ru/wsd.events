# -*- coding: utf-8 -*-

import os
import json
import time
from datetime import datetime, timedelta

import pytz
from flask import Flask, render_template, redirect, flash
from jinja2 import TemplateNotFound
import jinja_filters
from utils import helpers
from forms import RegistrationForm
from mailsnake.exceptions import *

app = Flask(__name__, static_folder='templates/static', template_folder='templates')
app.config.from_object('config')

# TODO: Move it to config
app_root = os.path.abspath(os.path.dirname(__name__))
pres_dir = os.path.join(app_root, 'pres/')


def process_register(data, list_id):
    from mailsnake import MailSnake
    api_key = os.environ['MAILCHIMP_API_KEY']

    ms = MailSnake(api_key)
    try:
        status = ms.listSubscribe(
            id=list_id,
            email_address=data['email'],
            double_optin=False,
            merge_vars={
                "FNAME": data['firstName'],
                "LNAME": data['lastName'],
                "COMPANY": data['company'],
                "POSITION": data['position'],
                "TWITTER": data['twitter']
            }
        )
        return {
            'success': status
        }
    except ListAlreadySubscribedException, e:
        return {
            'success': False,
            'message': u'Адрес электронной почты {} уже зарегистрирован'.format(data['email']),
        }
    except MailSnakeException, e:
        # TODO: Нужно логгировать ошибки
        print e.message
        return {
            'success': False,
            'message': u'Возникла непредвиденная ошибка',
        }


def parseDate(el):
    date = [int(x) for x in el['date'].split("-")]
    timezone = pytz.timezone(el['timezone'])
    el['date'] = timezone.localize(datetime(date[2], date[1], date[0]))
    return el


def parseRegistrationOpen(el):
    date = [int(x) for x in el['registration']['openDate'].split("-")]
    time = [int(x) for x in el['registration']['openTime'].split(":")]
    timezone = pytz.timezone(el['timezone'])
    dt = datetime(date[2], date[1], date[0], time[0], time[1])
    el['registration']['open'] = timezone.localize(dt)


def parseRegistrationClose(el):
    date = [int(x) for x in el['registration']['closeDate'].split("-")]
    time = [int(x) for x in el['registration']['closeTime'].split(":")]
    timezone = pytz.timezone(el['timezone'])
    dt = datetime(date[2], date[1], date[0], time[0], time[1])
    el['registration']['close'] = timezone.localize(dt)


def load_data(sources):
    return (json.load(open('data/{filename}.json'.format(filename=i))) for i in sources)


def format_name(person):
    return u'{firstname} {lastname}'.format(firstname=person['firstName'], lastname=person['lastName'])


def get_speaker_by_id(speaker_id, speakers):
    return filter(lambda speaker: speaker['id'] == speaker_id, speakers)[0]


def get_file(name, extensions=('zip', 'pdf',)):
    for ext in extensions:
        filename = '.'.join((name, ext))
        abspath = os.path.join(pres_dir, filename)
        if os.path.exists(abspath):
            return {
                "name": filename,
                "size": os.path.getsize(abspath),
                "type": ext.upper()
            }

app.jinja_env.filters['day'] = jinja_filters.day
app.jinja_env.filters['month'] = jinja_filters.month
app.jinja_env.filters['year'] = jinja_filters.year
app.jinja_env.filters['filesize'] = jinja_filters.filesize


@app.context_processor
def utility_processor():
    def get_static(path, static_dir=app.static_folder):
        import os

        f = os.path.join(static_dir, path)
        return "{root}/{path}?v={token}".format(root=app.static_url_path, path=path, token=int(os.stat(f).st_mtime))

    return dict(get_static=get_static)


@app.route('/')
def index():
    import random
    from itertools import groupby

    sources_list = ('events', 'presentations', 'speakers')
    events, presentations, speakers = load_data(sources_list)

    presentations = random.sample(filter(lambda x: 'videoId' in x, presentations.values()), 3)

    for presentation in presentations:
        presentation['speakers'] = map(lambda speaker: format_name(get_speaker_by_id(speaker, speakers)),
                                       presentation['speakers'])

    return render_template('index.html',
                           history=groupby(
                               sorted(
                                   map(parseDate, events),
                                   key=lambda x: x['date'],
                                   reverse=True),
                               key=lambda x: x['date'].year
                           ),
                           speakers=sorted(speakers, key=lambda x: x['lastName']),
                           presentations=presentations,
                           today=datetime.now(pytz.utc)
    )


@app.route('/<int:year>/<int:month>/<int:day>/')
def legacy_event(year, month, day):
    date = '{day}-{month}-{year}'.format(day=helpers.add_null(day), month=helpers.add_null(month), year=year)
    events = json.load(open('data/events.json'))
    event = reduce(lambda init, x: x if x['date'] == date else init, events, None)
    path = '/events/{event_id}/'.format(event_id=event['id'])

    return redirect(path) if event else (render_template('page-not-found.html'), 404)


@app.route('/events/<event_id>/', methods=['GET', 'POST'])
def event(event_id):
    sources_list = ('events', 'partners', 'presentations', 'speakers')
    events, partners, presentations, speakers = load_data(sources_list)

    event = reduce(lambda init, x: x if x['id'] == event_id else init, events, None)

    if not event:
        return render_template('page-not-found.html'), 404

    parseDate(event)

    if 'schedule' in event:
        start_time = event['schedule']['startTime'].split(":")
        clock = event['date'] + timedelta(hours=int(start_time[0]), minutes=int(start_time[1]))

        presentation_speakers = []

        for item in event['schedule']['presentations']:
            item['time'] = "{h}:{m}".format(h=clock.hour, m=helpers.add_null(clock.minute))
            clock += timedelta(minutes=int(item['duration']))

            if 'presentation' in item:
                presentation_id = item['presentation']
                item['presentation'] = presentations[presentation_id]
                item['presentation']['file'] = get_file(presentation_id)
                presentation_speakers.append(item['presentation'].get('speakers'))

        speakers_keys = reduce(lambda d, el: d.extend(el) or d, presentation_speakers, [])

        speakers = filter(
            lambda x: x['id'] in speakers_keys,
            sorted(speakers, key=lambda x: x['lastName'])
        )

        speakers_dict = {speaker['id']: format_name(speaker) for speaker in speakers}

    else:
        speakers = []
        speakers_dict = {}

    if 'registration' in event and 'force_close' not in event['registration']:
        parseRegistrationOpen(event)
        parseRegistrationClose(event)
        show_registration = event['registration']['open'] < datetime.now(pytz.utc) < event['registration']['close']
        registration_form = RegistrationForm(prefix="regform_")
        if registration_form.validate_on_submit():
            register = process_register(registration_form.data, event['registration']['mailchimpListId'])
            if register.get('success'):
                flash(u'Спасибо, ваша заявка принята')
                return redirect('/events/{}'.format(event_id))
            else:
                flash(register.get('message'))
    else:
        show_registration = False
        registration_form = None

    event['archived'] = datetime.now(pytz.utc) > event['date'] + timedelta(days=1)

    return render_template('event.html',
                           event=event,
                           speakers=speakers,
                           speakers_dict=speakers_dict,
                           partners=partners,
                           show_registration=show_registration,
                           registration_form=registration_form,
    )


@app.route('/<staticpage>/')
def staticpage(staticpage):
    try:
        return render_template('staticpages/%s.html' % staticpage)
    except TemplateNotFound, e:
        return render_template('page-not-found.html'), 404


if __name__ == '__main__':
    app.debug = True
    app.run()
