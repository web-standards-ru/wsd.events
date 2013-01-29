# -*- coding: utf-8 -*-

import json
import time
from datetime import datetime, timedelta

import pytz
from flask import Flask, render_template, redirect
from jinja2 import TemplateNotFound
import jinja_filters

app = Flask(__name__)


def add_null(val):
    return val if val >= 10 else "0{num}".format(num=val)


def parseDate(el):
    date = [int(x) for x in el['date'].split("-")]
    el['date'] = datetime(date[2], date[1], date[0], tzinfo=pytz.timezone(el['timezone']))
    return el


def load_data(sources):
    return (json.load(open('data/{filename}.json'.format(filename=i))) for i in sources)


def format_name(person):
    return u'{firstname} {lastname}'.format(firstname=person['firstName'], lastname=person['lastName'])


def get_speaker_by_id(speaker_id, speakers):
    return filter(lambda speaker: speaker['id'] == speaker_id, speakers)[0]


app.jinja_env.filters['day'] = jinja_filters.day
app.jinja_env.filters['month'] = jinja_filters.month
app.jinja_env.filters['year'] = jinja_filters.year


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
    date = '{day}-{month}-{year}'.format(day=add_null(day), month=add_null(month), year=year)
    events = json.load(open('data/events.json'))
    event = reduce(lambda init, x: x if x['date'] == date else init, events, None)
    path = '/events/{event_id}/'.format(event_id=event['id'])

    return redirect(path) if event else (render_template('page-not-found.html'), 404)


@app.route('/events/<event_id>/')
def event(event_id):
    sources_list = ('events', 'partners', 'presentations', 'speakers')
    events, partners, presentations, speakers = load_data(sources_list)

    event = reduce(lambda init, x: x if x['id'] == event_id else init, events, None)

    if not event:
        return render_template('page-not-found.html'), 404

    parseDate(event)

    if 'schedule' in event:
        for item in event['schedule']['presentations']:
            if 'presentation' in item:
                item['presentation'] = presentations[item['presentation']]

        presentation_speakers = map(
            lambda x: x['presentation'].get('speakers'),
            filter(
                lambda x: 'presentation' in x,
                event['schedule']['presentations']
            )
        )

        speakers_keys = reduce(lambda d, el: d.extend(el) or d, presentation_speakers, [])

        speakers = filter(
            lambda x: x['id'] in speakers_keys,
            sorted(speakers, key=lambda x: x['lastName'])
        )

        speakers_dict = {speaker['id']: format_name(speaker) for speaker in speakers}

        start_time = event['schedule']['startTime'].split(":")
        clock = event['date'] + timedelta(hours=int(start_time[0]), minutes=int(start_time[1]))

        for item in event['schedule']['presentations']:
            item['time'] = "{h}:{m}".format(h=clock.hour, m=add_null(clock.minute))
            clock += timedelta(minutes=int(item['duration']))
    else:
        speakers = []
        speakers_dict = {}

    if 'registration' in event and 'force_close' not in event['registration']:
        show_registration = event['registration']['open'] < time.time() < event['registration']['close']
    else:
        show_registration = False

    event['archived'] = datetime.now(pytz.utc) > event['date'] + timedelta(days=1)

    return render_template('event.html',
                           event=event,
                           speakers=speakers,
                           speakers_dict=speakers_dict,
                           partners=partners,
                           show_registration=show_registration
    )


@app.route('/events/<event_id>/register/')
def register(event_id):
    return u'Регистрация на событие'


@app.route('/<staticpage>/')
def staticpage(staticpage):
    try:
        return render_template('staticpages/%s.html' % staticpage)
    except TemplateNotFound, e:
        return render_template('page-not-found.html'), 404


if __name__ == '__main__':
    app.debug = True
    app.run()
