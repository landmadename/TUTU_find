import requests
import json

data = {'skey': 'test key',
        }
r = requests.post("http://47.100.40.72:8080/get", data=data)
print(r.text)
