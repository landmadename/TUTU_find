import requests
import json

data = {'skey': 'test key',
        }
r = requests.post("http://47.100.40.72:30001/get", data=data)
print(r.text)
print("------------------------------------------------------------")
print("------------------------------------------------------------")
print(json.loads(r.text))
