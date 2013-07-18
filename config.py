# coding=utf-8
import os
from utils.system import get_env_variable

PROJECT_ROOT = os.path.dirname(os.path.abspath(__file__))

DATA_DIR = os.path.join(PROJECT_ROOT, 'data')


class Config(object):
    CSRF_ENABLED = True
    SECRET_KEY = get_env_variable('WSD_SECRET_KEY')
