import requests
import json

data = {'sth': '数据线',
        'skey': 'test key',
        'mode': 1
        }
r = requests.post("http://47.100.40.72:30001/find", data=data)
print(r.text)
print("------------------------------------------------------------")
print("------------------------------------------------------------")
print(json.loads(r.text))
