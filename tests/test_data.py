# -*- coding: utf-8 -*-

import unittest
import json


def load_data(sources):
    return (json.load(open('data/{filename}.json'.format(filename=i))) for i in sources)


class TestEventsData(unittest.TestCase):
    def setUp(self):
        sources = ('events', 'partners', 'presentations', 'speakers')
        self.events, self.partners, self.presentations, self.speakers = load_data(sources)

    def test_events(self):
        for event in self.events:
            try:
                self.current_event = event['id']
            finally:
                self.check_required_fields(event)

            if 'partners' in event:
                for partners_group in event['partners']:
                    self.check_partner(partners_group.values()[0])
            if 'schedule' in event:
                if 'presentations' in event['schedule']:
                    self.check_schedule(event['schedule']['presentations'])

    def check_partner(self, partners):
        errors = []
        for partner in partners:
            if partner not in self.partners:
                errors.append('Cannot find partner "{partner}"'.format(partner=partner))
        if errors:
            self.fail('Event "{event}"\n{errors}'.format(event=self.current_event, errors='\n'.join(errors)))

    def check_schedule(self, presentations):
        errors = []
        for presentation in presentations:
            if 'presentation' in presentation:
                presentation_key = presentation['presentation']
                if presentation_key not in self.presentations:
                    errors.append('Cannot find presentation "{presentation}"'.format(presentation=presentation_key))
        if errors:
            self.fail('Event "{event}"\n{errors}'.format(event=self.current_event, errors='\n'.join(errors)))

    def check_required_fields(self, event):
        self.assertIn('id', event, 'Event without Id')
        self.assertIn('date', event, 'Event "{event}" without date'.format(event=self.current_event))
        self.assertIn('timezone', event, 'Event "{event}" without timezone'.format(event=self.current_event))
