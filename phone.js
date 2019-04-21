var server = "http://192.168.253.1/find"
var sth = argMap['sth']
var mode = "0"
var skey = "test key"
var data = http.post(server, {'sth': sth,'skey': skey,'mode': mode})
data = data.split("\'").join("\"")
data = JSON.parse(data)
switch (data['code']) {
    case -1:
        speak('有东西没填')
        break;
    case 0:
        speak('你要找的是哪个？' + data['similar_names'].join('，还是'))
        break;
    case 1:
        speak(data['name'] + '在' + data['places'].join('，和'))
        break;
    case 2:
        speak('找不到诶')
        break;      
    default:
        break;
}