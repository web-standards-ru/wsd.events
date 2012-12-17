# -*- coding: utf-8 -*-

import json
import time
from datetime import datetime, timedelta

from flask import Flask, render_template, redirect
from jinja2 import TemplateNotFound

app = Flask(__name__)

def add_null(val):
    return val if val >= 10 else "0%s" % val


def setSpeakerById(dict, speakers):
    dict['speaker'] = speakers[dict['speaker']]
    return dict


def addTimestamp(el):
    date = [int(x) for x in el['date'].split("-")]
    el['timestamp'] = time.mktime((date[2], date[1], date[0], 0, 0, 0, 0, 0, 0))
    return el


def day(ts):
    return datetime.fromtimestamp(ts).strftime("%d").lstrip('0')


def year(ts):
    return datetime.fromtimestamp(ts).strftime("%Y")


def month(ts, case='v'):
    months = {
        'i': (u'январь', u'февраль', u'март', u'апрель', u'май', u'июнь', u'июль', u'август', u'сентябрь', u'октябрь',
              u'ноябрь', u'декабрь'),
        'v': (u'января', u'февраля', u'марта', u'апреля', u'мая', u'июня', u'июля', u'августа', u'сентября', u'октября',
              u'ноября', u'декабря')
    }
    return months[case][int(datetime.fromtimestamp(ts).strftime("%m")) - 1]

app.jinja_env.filters['day'] = day
app.jinja_env.filters['month'] = month
app.jinja_env.filters['year'] = year


@app.context_processor
def utility_processor():
    def get_static(path, static_dir=app.static_folder):
        import os

        f = os.path.join(static_dir, path)
        return ("%s/%s?v=%s") % (app.static_url_path, path, int(os.stat(f).st_mtime))

    return dict(get_static=get_static)


@app.route('/')
def index():
    import random
    from itertools import groupby

    data = {i: json.load(open('data/%s.json' % i)) for i in ['events', 'presentations', 'speakers']}

    return render_template('index.html',
        history=groupby(
            sorted(
                map(addTimestamp, data['events']),
                key=lambda x: x['timestamp'],
                reverse=True),
            key=lambda x: x['date'].split("-")[2]
        ),
        speakers=sorted(data['speakers'], key=lambda x: x['lastName']),
        presentations=random.sample(filter(lambda x: 'videoId' in x, data['presentations'].values()), 3),
        today=time.time() + 60 * 60 * 24
    )


@app.route('/<int:year>/<int:month>/<int:day>/')
def legacy_event(year, month, day):
    date = '%s-%s-%s' % (add_null(day), add_null(month), year)
    events = json.load(open('data/events.json'))
    event = reduce(lambda init, x: x if x['date'] == date else init, events, None)

    return redirect('/events/%s/' % event['id']) if event else (render_template('page-not-found.html'), 404)


@app.route('/events/<id>/')
def event(id):
    events, partners, presentations, speakers = (json.load(open('data/%s.json' % i))
        for i in ('events', 'partners', 'presentations', 'speakers'))

    event = reduce(lambda init, x: x if x['id'] == id else init, events, None)

    if not event:
        return render_template('page-not-found.html'), 404

    addTimestamp(event)

    if 'schedule' in event:
        for item in event['schedule']['presentations']:
            if 'presentation' in item:
                item['presentation'] = presentations[item['presentation']]

        speakers_keys = map(
            lambda x: x['presentation'].get('speaker'),
            filter(
                lambda x: 'presentation' in x,
                event['schedule']['presentations']
            )
        )

        speakers = filter(
            lambda x: x['id'] in speakers_keys,
            sorted(speakers, key=lambda x: x['lastName'])
        )

        speakers_dict = dict((x['id'], '%s %s' % (x['firstName'], x['lastName'])) for x in speakers)

        date = datetime.utcfromtimestamp(event['timestamp'])

        start_time = event['schedule']['startTime'].split(":")
        clock = date + timedelta(hours=int(start_time[0]), minutes=int(start_time[1]))

        for item in event['schedule']['presentations']:
            item['time'] = "%s:%s" % (clock.hour, add_null(clock.minute))
            clock += timedelta(minutes=int(item['duration']))
    else:
        speakers = []
        speakers_dict = {}

    if 'registration' in event and 'force_close' not in event['registration']:
        show_registration = event['registration']['open'] < time.time() < event['registration']['close']
    else:
        show_registration = False

    event['archived'] = time.time() > event['timestamp'] + 86400

    return render_template('event.html',
        event=event,
        speakers=speakers,
        speakers_dict=speakers_dict,
        partners=partners,
        show_registration=show_registration
    )


@app.route('/events/<id>/register/')
def register(year, month, day):
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
