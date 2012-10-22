# -*- coding: utf-8 -*-

import json

from flask import Flask, render_template

app = Flask(__name__)

def add_null(val):
    return val if val >= 10 else "0%s" % val


@app.route('/')
def hello_world():

    return u'Главная'


@app.route('/<int:year>/<int:month>/<int:day>/')
def event(year, month, day):
    data = {}
    for i in ['events', 'partners', 'presentations', 'speakers']:
        data[i] = json.load(open('data/%s.json' % i))

    event_date = '%s-%s-%s' % (add_null(day), add_null(month), year)

    try:
        event = filter(lambda x: x if x['date'] == event_date else False, data['events'].values())[0]
    except IndexError:
        return render_template('page_not_found.html'), 404
    except Exception:
        return render_template('server_error.html'), 500

    return unicode(event)


@app.route('/<int:year>/<int:month>/<int:day>/register/')
def register(year, month, day):

    return u'Регистрация на событие'


if __name__ == '__main__':
    app.debug = True
    app.run()
