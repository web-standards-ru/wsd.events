# coding=utf-8


def add_null(val):
    """Добавление ведущего нуля к переданному значению"""
    return val if val >= 10 else "0{num}".format(num=val)

if __name__ == "__main__":
    print add_null(1)
    print add_null(10)
    print add_null("a")