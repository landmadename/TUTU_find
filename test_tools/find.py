import requests
import json

data = {'sth': '数据线',
        'skey': 'test key',
        'mode': 1
        }
r = requests.post("http://localhost/find", data=data)
print(json.loads(r.text))
