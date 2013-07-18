# coding=utf-8

import os
import json
from datetime import datetime, timedelta

import pytz
from flask import render_template, redirect, flash
from jinja2 import TemplateNotFound
from mailsnake.exceptions import *

from utils import helpers, jinjaFilters
from forms import RegistrationForm

from . import app

# TODO: Move it to config
from wsd.models import Events, Speakers, Presentations, Event, Partners

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

app.jinja_env.filters['day'] = jinjaFilters.day
app.jinja_env.filters['month'] = jinjaFilters.month
app.jinja_env.filters['year'] = jinjaFilters.year
app.jinja_env.filters['filesize'] = jinjaFilters.filesize


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

    events = Events('events')
    speakers = Speakers('speakers')
    presentations = Presentations('presentations', speakers)

    return render_template('index.html',
                           history=groupby(
                               events.order_by('-date'),
                               key=lambda x: x['date'].year
                           ),
                           speakers=speakers.order_by('lastName'),
                           presentations=random.sample(presentations.filter('videoId'), 3),
                           today=datetime.now(pytz.utc)
    )


@app.route('/<int:year>/<int:month>/<int:day>/')
def legacy_event(year, month, day):
    events = Events('events')
    event = events.getByDate(day, month, year)
    if event:
        return redirect('/events/{}/'.format(event['id']))
    else:
        return render_template('page-not-found.html'), 404


@app.route('/events/<event_id>/', methods=['GET', 'POST'])
def event(event_id):
    events = Events('events')
    speakers = Speakers('speakers')
    partners = Partners('partners')
    presentations = Presentations('presentations', speakers)

    event = Event(events.get(event_id))

    if not event:
        return render_template('page-not-found.html'), 404

    data = event.getData(speakers, presentations)

    return render_template('event.html',
                           event=event,
                           schedule=data.get('schedule'),
                           speakers=data.get('speakers'),
                           speakers_dict=data.get('speakers_dict'),
                           partners=partners,
                           show_registration=event.showRegistration(),
                           registration_form=None,
    )


@app.route('/<staticpage>/')
def staticpage(staticpage):
    try:
        return render_template('staticpages/%s.html' % staticpage)
    except TemplateNotFound, e:
        return render_template('page-not-found.html'), 404
