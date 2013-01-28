# coding: utf-8

months = {
    'i': (u'январь', u'февраль', u'март', u'апрель', u'май', u'июнь', u'июль', u'август', u'сентябрь', u'октябрь',
          u'ноябрь', u'декабрь'),
    'v': (u'января', u'февраля', u'марта', u'апреля', u'мая', u'июня', u'июля', u'августа', u'сентября', u'октября',
          u'ноября', u'декабря')
}


def day(date):
    return int(date.day)


def year(date):
    return date.year


def month(date, case='v'):
    return months[case][date.month - 1]
