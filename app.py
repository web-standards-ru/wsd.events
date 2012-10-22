# -*- coding: utf-8 -*-

import json

from flask import Flask

app = Flask(__name__)

@app.route('/')
def hello_world():

    return u'Главная'


@app.route('/<int:year>/<int:month>/<int:day>/')
def event(year, month, day):

    return u'Событие'


@app.route('/<int:year>/<int:month>/<int:day>/register/')
def register(year, month, day):

    return u'Регистрация на событие'


if __name__ == '__main__':
    app.debug = True
    app.run()
