import requests
import json

data = {'skey': 'test key',
        'data': '{"type": "items","data":[[19, "\\u8ba1\\u7b97\\u5668", 199999, "", "", "\\u5bb6\\u91cc$\\u5c0f\\u5367\\u5ba4$\\u7b2c\\u4e00\\u4e2a\\u62bd\\u5c49", "", "", "!"]]}'
        }
r = requests.post("http://47.100.40.72:30001/post", data=data)
print(r.text)
print("------------------------------------------------------------")
print("------------------------------------------------------------")
print(json.loads(r.text))
