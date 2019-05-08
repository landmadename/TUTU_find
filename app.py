import os
import json
from db_operator.db_operator import db
from flask import Flask, render_template, flash, redirect
from flask import url_for, request, send_from_directory


app = Flask(__name__)
app.secret_key = 'lalalalololo'
app.config.from_pyfile('settings.py')
d = db()


def load_data(data):
    import json

    def get_data(data):
        for i in data:
            path.append(i)
            if i == 'thing':
                for ii in data[i]:
                    ii.insert(5, "$".join(path[:-1]))
                    things.append(ii)
            else:
                get_data(data[i])
            path.pop()

    path = []
    things = []
    get_data(data)
    return things


def pack(data):
    big_box = {}
    for row in data:
        place = row[5].split('$')
        path = big_box
        for e, i in enumerate(place):
            path.setdefault(i, {})
            path = path.get(i)
        path.setdefault('thing', [])
        path = path.get('thing')
        path.append(row[:5] + row[-2:] + ('', ))
    return big_box


def frech_find_args():
    sth = request.form.get('sth')
    skey = request.form.get('skey')
    mode = request.form.get('mode')
    if not (sth and skey and mode):
        return False
    mode = int(mode)
    return (skey, sth, mode)


def frech_get_args():
    skey = request.form.get('skey')
    if not skey:
        return False
    return skey


def frech_post_args():
    skey = request.form.get('skey')
    data = request.form.get('data')
    if not (skey and data):
        return False
    return (skey, data)


@app.route('/find', methods=['POST'])
def find():
    args = frech_find_args()
    print(args)
    if args is False:
        return json.dumps({'code': -1,
                           })

    flag, data = d.find(args[0], args[1], args[2])

    if flag == 0:
        return json.dumps({'code': flag,
                           'similar_names': data
                           })
    elif flag == 1:
        name = data[0][0]
        places = [i[4].replace('$', '的') for i in data]
        return json.dumps({'code': flag,
                           'name': name,
                           'places': places
                           })
    elif flag == 2:
        return json.dumps({'code': flag
                           })


@app.route('/get', methods=['POST'])
def get():
    args = frech_get_args()
    print(args)
    if args is False:
        return json.dumps({'code': -1,
                           })
    data = d.get(args)
    if data == []:                      # skey没有数据
        return json.dumps({'code': 0,
                           })
    else:
        return json.dumps({'code': 1,
                           'data': pack(data)
                           })


@app.route('/post', methods=['POST'])
def post():
    to_post = {'+': [],
               '-': [],
               '!': []}
    args = frech_post_args()
    if args is False:
        return json.dumps({'code': -1,
                           })

    try:
        data = json.loads(data)
        type = data['type']
	data = data['data']
        assert type == 'box' or type == 'items'
    except Exception as e:
        return json.dumps({'code': 0,
                           })
    if type == 'box':
        try:
            things = load_data(args[1])
        except Exception as e:
            return json.dumps({'code': 0,
                               })
    else:
        things = data
    things = [i for i in things if i[-1] != '']
    for i in things:
        try:
            to_post[i[-1]].append(i[:-1])
        except Exception as e:
            pass
    d.post(args[0], to_post)
    return str(d.get(args[0]))
