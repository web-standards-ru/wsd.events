# coding=utf-8

import json
from flask.ext.wtf import Form, TextField
from flask.ext.wtf import DataRequired, Email


class RegistrationForm(Form):
    firstName = TextField(u"Имя")
    lastName = TextField(u"Фамилия")
    email = TextField(u"Адрес электронной почты", validators=[
        DataRequired(message=u"Обязательное поле"),
        Email(u"Введите действующий адрес электронной почты")
    ])
    twitter = TextField(u"Ник в твиттере")
    company = TextField(u"Место работы или учёбы")
    position = TextField(u"Должность")
