import os
from db_operator.db_operator import db
from flask import Flask, render_template, flash, redirect
from flask import url_for, request, send_from_directory


app = Flask(__name__)
app.secret_key = 'lalalalololo'
app.config.from_pyfile('settings.py')
d = db()


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


def frech_data():
    sth = request.form.get('sth')
    skey = request.form.get('skey')
    mode = request.form.get('mode')
    if not (sth and skey and mode):
        return False
    mode = int(mode)
    return (skey, sth, mode)


@app.route('/find', methods=['POST'])
def find():
    args = frech_data()
    print(args)
    if args is False:
        return str({'code': -1,
                    })

    flag, data = d.find(args[0], args[1], args[2])

    if flag == 0:
        return str({'code': flag,
                    'similar_names': data
                    })
    elif flag == 1:
        name = data[0][0]
        places = [i[4].replace('$', '的') for i in data]
        return str({'code': flag,
                    'name': name,
                    'places': places
                    })
    elif flag == 2:
        return str({'code': flag
                    })


@app.route('/get')
def get():
    return 'all my data'


@app.route('/post', methods=['POST'])
def post():
    return 'ok'
