//把@{num}个@{sth}放(在|进)@{path}
//把@{sth}放(在|进)@{path}

var server = "http://47.100.40.72:30001/post"
var sth = argMap['sth']
var path = argMap['path']
var num = argMap['num']
var mode = "0"
var skey = "test key"
var data


function ChineseToNumber(chnStr){
    var rtn = 0;
    var section = 0;
    var number = 0;
    var secUnit = false;
    if(chnStr[0] == '十'){
        chnStr = '一' + chnStr;
    }
    var str = chnStr.split('');
    var chnNumChar = {
        零:0,
        一:1,
        二:2,
        三:3,
        四:4,
        五:5,
        六:6,
        七:7,
        八:8,
        九:9
    };

    var chnNameValue = {
        十:{value:10, secUnit:false},
        百:{value:100, secUnit:false},
        千:{value:1000, secUnit:false},
        万:{value:10000, secUnit:true},
        亿:{value:100000000, secUnit:true}
    }


    for(var i = 0; i < str.length; i++){
        var num = chnNumChar[str[i]];
        if(typeof num !== 'undefined'){
            number = num;
            if(i === str.length - 1){
                section += number;
            }
        }else{
            var unit = chnNameValue[str[i]].value;
            secUnit = chnNameValue[str[i]].secUnit;
            if(secUnit){
                section = (section + number) * unit;
                rtn += section;
                section = 0;
            }else{
                section += (number * unit);
            }
            number = 0;
        }
    }
    return rtn + section;
}


if(!!num && isNaN(num)){
    num = ChineseToNumber(num)
}else{
    num = (parseInt(num) || 1)
}
path = path.split('的')
var item = [0,
            sth,
            num,
            "",
            "",
            "in_time",
            '',
            '+']
item.splice(5, 0, path.join("$"))
data = JSON.stringify({"type": "items", "data": [item]})
data = http.post(server, {"skey": skey, "data": data})
data = JSON.parse(data)
switch (data['code']) {
    case -1:
        speak('有东西没填')
        break;
    case 0:
        speak('出错嘞')
        break;
    case 1:
        speak('OKOK')
        break;      
    default:
        break;
}