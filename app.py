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
    print el
    print el['date']
    date = [int(x) for x in el['date'].split("-")]
    el['timestamp'] = time.mktime((date[2], date[1], date[0], 0, 0, 0, 0, 0, 0))


def day(ts):
    return datetime.fromtimestamp(ts).strftime("%d")


def year(ts):
    return datetime.fromtimestamp(ts).strftime("%Y")


def month(ts, case='v'):
    months = {
        'i': (u'январь', u'февраль',u'март',u'апрель', u'май', u'июнь', u'июль', u'август', u'сентябрь', u'октябрь', u'ноябрь', u'декабрь'),
        'v': (u'января', u'февраля',u'марта', u'апреля', u'мая', u'июня', u'июля', u'августа', u'сентября', u'октября', u'ноября', u'декабря')
    }
    return months[case][int(datetime.fromtimestamp(ts).strftime("%m"))-1]

app.jinja_env.filters['day'] = day
app.jinja_env.filters['month'] = month
app.jinja_env.filters['year'] = year


@app.route('/')
def index():
    import random

    data = {i:json.load(open('data/%s.json' % i)) for i in ['events', 'presentations', 'speakers']}

    for id in data['events']:
        data['events'][id]['id'] = id
        addTimestamp(data['events'][id])

    events = sorted(data['events'].values(), key=lambda el: el['timestamp'])

    events_dict = {}

    for event in reversed(events):
        event_date = event['date']
        event['url'] = '/'.join(['%s' % s for s in event_date.split('-')[::-1]])
        year = event['date'].split("-")[2]
        if not events_dict.has_key(year):
            events_dict[year] = []
        events_dict[year].append(event)

    speakers = sorted(
        [(key, data['speakers'][key]) for key in data['speakers']],
        key=lambda x: x[1]['lastName']
    )

    presentations = random.sample(filter(lambda x: x.has_key('video_id'), data['presentations'].values()), 3)

    map(lambda x: setSpeakerById(x, data['speakers']), presentations)

    today = time.time() + 60 * 60 * 24

    return render_template('index.html', history=events_dict, speakers=speakers,
        presentations=presentations, today=today)


@app.route('/<int:year>/<int:month>/<int:day>/')
def legacy_event(year, month, day):
    events = json.load(open('data/events.json'))
    event_date = '%s-%s-%s' % (add_null(day), add_null(month), year)

    event = (k for k, v in events.iteritems() if v['date'] == event_date)
    if len(list(event)):
        event_id = list(event)[0]
        return redirect('/events/%s/' % event_id)
    else:
        return render_template('page-not-found.html'), 404



@app.route('/events/<id>/')
def event(id):
    data = {i:json.load(open('data/%s.json' % i)) for i in ['events', 'partners', 'presentations', 'speakers']}

    print id

    if data['events'].has_key(id):
        event = data['events'][id]
    else:
        return render_template('page-not-found.html'), 404

    addTimestamp(event)

    if event.has_key('schedule'):
        for schedule_item in event['schedule']['presentations']:
            if schedule_item.has_key('presentation'):
                schedule_item['presentation'] = data['presentations'][schedule_item['presentation']]

        speakers_keys = [x['presentation']['speaker'] for x in filter(lambda x: x.has_key('presentation'), event['schedule']['presentations'])]

        speakers = sorted(
            [(key, data['speakers'][key]) for key in speakers_keys],
            key=lambda x: x[1]['lastName']
        )

        speakers_dict = {x:'%s %s' % (y['firstName'], y['lastName']) for x, y in speakers}


        date = datetime.utcfromtimestamp(event['timestamp'])

        start_time = event['schedule']['startTime'].split(":")
        clock = date + timedelta(hours=int(start_time[0]), minutes=int(start_time[1]))

        for item in event['schedule']['presentations']:
            item['time'] = "%s:%s" % (clock.hour, add_null(clock.minute))
            clock += timedelta(minutes=int(item['duration']))
    else:
        speakers = []
        speakers_dict = {}


    if event.has_key('registration'):
        if event['registration']['open'] < time.time() < event['registration']['close'] and not event['registration'].has_key('force_close'):
            show_registration = True
        else:
            show_registration = False
    else:
        show_registration = False

    event['archived'] = time.time() > event['timestamp'] + 86400

    return render_template('event.html', data=data, event=event, speakers=speakers,
        speakers_dict=speakers_dict, partners=data['partners'], show_registration = show_registration)


@app.route('/<int:year>/<int:month>/<int:day>/register/')
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
