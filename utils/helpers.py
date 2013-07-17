# coding=utf-8
import pytz
from datetime import datetime


def add_null(val):
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


if __name__ == "__main__":
    print add_null(1)
    print add_null(10)
    print add_null("a")

    print "-" * 8

    print parseDate("04-04-1983")
    print parseDate("04-04-1983", "Europe/Moscow")
    print parseDate("04/04/1983", "Europe/Moscow", "/")