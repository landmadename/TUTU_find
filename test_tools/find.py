import requests
import json

data = {'sth': '数据线',
        'skey': 'test key',
        'mode': 1
        }
r = requests.post("http://47.100.40.72:8080/find", data=data)
print(json.loads(r.text))
