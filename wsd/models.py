# coding=utf-8
import os
from datetime import datetime, timedelta

import pytz
from flask.helpers import json

from config import DATA_DIR, PRESENTATIONS_DIR
from utils import helpers


class JSONData(object):
    def __init__(self, filename):
        f = open(os.path.join(DATA_DIR, '{}.json'.format(filename)))
        self.data = json.load(f)

    def order_by(self, *args):
        result = self.data
        for arg in args:
            reverse = False
            if arg.startswith('-'):
                reverse = True
                arg = arg[1:]
            result = sorted(result, key=lambda x: x[arg], reverse=reverse)
        return result

    def get(self, key, value=None):
        try:
            return self.data.get(key)
        except AttributeError:
            if value is None:
                value = key
                key = 'id'
            try:
                return filter(lambda elem: elem[key] == value, self.data)[0]
            except IndexError:
                pass

    def filter(self, key):
        try:
            return filter(lambda x: key in x, self.data.values())
        except AttributeError:
            return filter(lambda x: key in x, self.data)


class Events(JSONData):
    def __init__(self, filename):
        super(Events, self).__init__(filename)
        for event in self.data:
            event['date_string'] = event['date']
            event['date'] = helpers.parseDate(event['date'], event['timezone'])
            event['archived'] = datetime.now(pytz.utc) > event['date'] + timedelta(days=1)
            if 'registration' in event and 'force_close' not in event['registration']:
                pass
            else:
                event['show_registration'] = False
                event['registration_form'] = None

    @staticmethod
    def parsRegistrationOpen():
        pass

    @staticmethod
    def parseRegistrationClose():
        pass

    def getByDate(self, day, month, year):
        date = '{}-{}-{}'.format(helpers.addNull(day), helpers.addNull(month), year)
        return self.get('date_string', date)


class Event(object):
    def __init__(self, data):
        self.data = data
        self._setRegistrationStates()
        self['archived'] = datetime.now(pytz.utc) > self['date'] + timedelta(days=1)

    def __setitem__(self, key, value):
        self.data[key] = value

    def __getitem__(self, item):
        return self.data[item]

    def __contains__(self, item):
        return item in self.data

    def _setRegistrationStates(self):
        if 'registration' in self:
            self['registration']['open'] = helpers.parseDateTime(self['registration']['openDate'],
                                                                 self['registration']['openTime'],
                                                                 self['timezone'])
            self['registration']['close'] = helpers.parseDateTime(self['registration']['closeDate'],
                                                                  self['registration']['closeTime'],
                                                                  self['timezone'])

    def showRegistration(self):
        return 'registration' in self \
            and 'force_close' not in self['registration'] \
            and self['registration']['open'] < datetime.now(pytz.utc) < self['registration']['close']

    def getData(self, speakers, presentations):
        if 'schedule' not in self:
            return {}
        schedule = self['schedule']
        presentation_speakers = []

        start_time = schedule['startTime'].split(":")
        clock = self['date'] + timedelta(hours=int(start_time[0]), minutes=int(start_time[1]))

        for item in self['schedule']['presentations']:
            item['time'] = "{h}:{m}".format(h=clock.hour, m=helpers.addNull(clock.minute))
            clock += timedelta(minutes=int(item['duration']))

            if 'presentation' in item:
                item['presentation'] = presentations.get(item['presentation'])
                presentation_speakers.append(item['presentation'].get('speakers'))

        speakers_keys = reduce(lambda d, el: d.extend(el) or d, presentation_speakers, [])

        event_speakers = filter(
            lambda x: x['id'] in speakers_keys,
            speakers.order_by('lastName')
        )

        speakers_dict = {speaker['id']: Speakers.full_name(speaker) for speaker in event_speakers}

        return {
            'schedule': schedule,
            'speakers': event_speakers,
            'speakers_dict': speakers_dict,
        }


class Partners(JSONData):
    def __setitem__(self, key, value):
        self.data[key] = value

    def __getitem__(self, item):
        return self.data[item]

    def __contains__(self, item):
        return item in self.data


class Presentations(JSONData):
    def __init__(self, filename, speakers):
        super(Presentations, self).__init__(filename)
        for k, v in self.data.iteritems():
            v['speakers_names'] = map(lambda speaker: Speakers.full_name(speakers.get(speaker)), v['speakers'])
            v['file'] = helpers.getFile(k, PRESENTATIONS_DIR)


class Speakers(JSONData):
    @staticmethod
    def full_name(person):
        if person is None:
            return
        return u'{} {}'.format(person.get('firstName'), person.get('lastName'))
