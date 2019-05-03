import requests
import json

data = {'skey': 'test key',
        }
r = requests.post("http://localhost/get", data=data)
print(r.text)