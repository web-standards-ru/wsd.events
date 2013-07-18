# -*- coding: utf-8 -*-
from flask import Flask
from config import STATIC_DIR, TEMPLATES_DIR

app = Flask(__name__, static_folder=STATIC_DIR, template_folder=TEMPLATES_DIR)
app.config.from_object('config.Config')

from .views import *
