import os
from flask import Flask, render_template, flash, redirect
from flask import url_for, request, send_from_directory


if os.getcwd() == '/home/lmn':
    os.chdir('/home/lmn/TUTU_find')
app = Flask(__name__)
app.secret_key = 'lalalalololo'
app.config.from_pyfile('settings.py')


def load_data(fp):
    import json

    def get_data(data):
        for i in data:
            path.append(i)
            if isinstance(data[i], list):
                for ii in data[i]:
                    things.append(ii.split(',') + ["的".join(path)])
            else:
                get_data(data[i])
            path.pop()

    path = []
    things = []
    with open(fp, encoding="utf-8") as f:
        data = json.load(f)

    get_data(data)
    return things


@app.route('/')
def index():
    things = load_data("data/data.json")
    find = request.args.get('find')
    result = [i[-1] for i in things if i[0] == find]
    if result == []:
        return '哪里我也不知道'
    else:
        return '，和'.join(result)
