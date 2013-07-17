# coding=utf-8
from utils.system import get_env_variable

CSRF_ENABLED = True
SECRET_KEY = get_env_variable('WSD_SECRET_KEY')