# -*- coding: utf-8 -*-
from flask import Flask

app = Flask(__name__, static_folder='../templates/static', template_folder='../templates')
app.config.from_object('config.Config')

from .views import *
