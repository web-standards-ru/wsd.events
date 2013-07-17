# coding=utf-8
import os
import pytz
from datetime import datetime


def addNull(val):
    """Добавление ведущего нуля к переданному значению"""
    return val if val >= 10 else "0{num}".format(num=val)


def parseDate(date_string, tz_str=None, sep="-"):
    """Преобразование строкового представления даты в datetime"""
    date = [int(x) for x in date_string.split(sep)]
    dt = datetime(date[2], date[1], date[0])
    if tz_str is None:
        return dt
    tz = pytz.timezone(tz_str)
    return tz.localize(dt)


def getFile(name, path, extensions=('zip', 'pdf',)):
    """Получение информации о файле по имени и пути"""
    for ext in extensions:
        filename = '.'.join((name, ext))
        abspath = os.path.join(path, filename)
        if os.path.exists(abspath):
            return {
                "name": filename,
                "size": os.path.getsize(abspath),
                "type": ext.upper()
            }


if __name__ == "__main__":
    print addNull(1)
    print addNull(10)
    print addNull("a")

    print "-" * 8

    print parseDate("04-04-1983")
    print parseDate("04-04-1983", "Europe/Moscow")
    print parseDate("04/04/1983", "Europe/Moscow", "/")