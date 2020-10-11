var ACPP_DELIMITER_START=	"<";
var ACPP_DELIMITER_COLUMN=	";";
var ACPP_DELIMITER_END=		">";

var ACPP_SIGN_REQUEST_GET=				'?'
var ACPP_SIGN_REQUEST_SET=				'&'
var ACPP_SIGN_REQUEST_GET_BROADCAST=		'*'
var ACPP_SIGN_REQUEST_SET_BROADCAST=		'#'
var ACPP_SIGN_RESPONSE=					'!'

function acp_buildRequestI(sign, v1){
	var out = ACPP_DELIMITER_START + sign + ACPP_DELIMITER_COLUMN + v1 + ACPP_DELIMITER_END;
	return out;
}

function acp_buildRequestII(sign, v1, v2){
	var out = ACPP_DELIMITER_START + sign + ACPP_DELIMITER_COLUMN + v1 + ACPP_DELIMITER_COLUMN + v2 + ACPP_DELIMITER_END;
	return out;
}

function acp_buildRequestIII(sign, v1, v2, v3){
	var out = ACPP_DELIMITER_START + sign + ACPP_DELIMITER_COLUMN + v1 + ACPP_DELIMITER_COLUMN + v2 + ACPP_DELIMITER_COLUMN + v3 + ACPP_DELIMITER_END;
	return out;
}

function acp_buildRequestIIII(sign, v1, v2, v3, v4){
	var out = ACPP_DELIMITER_START + sign + ACPP_DELIMITER_COLUMN + v1 + ACPP_DELIMITER_COLUMN + v2 + ACPP_DELIMITER_COLUMN + v3 + ACPP_DELIMITER_COLUMN + v4 + ACPP_DELIMITER_END;
	return out;
}

function acp_buildRequestIIF(sign, v1, v2, v3, precision){
	var out = ACPP_DELIMITER_START + sign + ACPP_DELIMITER_COLUMN + v1 + ACPP_DELIMITER_COLUMN + v2 + ACPP_DELIMITER_COLUMN + v3.toFixed(precision) + ACPP_DELIMITER_END;
	return out;
}

function acp_buildRequestIIS(sign, v1, v2, v3){
	var out = ACPP_DELIMITER_START + sign + ACPP_DELIMITER_COLUMN + v1 + ACPP_DELIMITER_COLUMN + v2 + ACPP_DELIMITER_COLUMN + v3 + ACPP_DELIMITER_END;
	return out;
}

function acp_parsePack(buf_str, format) {
    var data = [];
    var pack = "";
    for (var i = 0; i < buf_str.length; i++) {
        if (buf_str[i] === ACPP_DELIMITER_END) {
            arr = pack.split(ACPP_DELIMITER_COLUMN);
            row = cpObj(format);
            var j = 0;
            for(var p in row){
				row[p] = arr[j];
				j++;
			}
            data.push(row);
            pack = "";
            continue;
        }
        if (buf_str[i] === ACPP_DELIMITER_START) {
			continue;
		}
        pack+=buf_str[i];
    }
   // console.log("out:", data);
    return data;
}

function acp_parseResponse(buf_str, format) {console.log(buf_str);
    var data = [];
    var pack = "";
    for (var i = 0; i < buf_str.length; i++) {
        if (buf_str[i] === ACPP_DELIMITER_END) {
            arr = pack.split(ACPP_DELIMITER_COLUMN ); 
            sign = arr.shift();
            if(sign !== ACPP_SIGN_RESPONSE){
				console.warn("bad sign", sign);
				return null;
			}
            row = cpObj(format);
            var j = 0;
            for(var p in row){
				row[p] = arr[j];
				j++;
			}
            data.push(row);
            pack = "";
            continue;
        }
        if (buf_str[i] === ACPP_DELIMITER_START) {
			continue;
		}
        pack+=buf_str[i];
    }
   // console.log("out:", data);
    return data;
}

function acp_buildCommands(){
	var i = 0;
	for(var p in CMD_){
		CMD_[p] = i;
		i++;
	}
}

function acp_secureStr(str){
	var out = '';
	for(var i = 0; i<str.length;i++){
		var c = str.charAt(i);
		switch(c){
			case ACPP_DELIMITER_START:
			case ACPP_DELIMITER_COLUMN:
			case ACPP_DELIMITER_END:
			case ACPP_SIGN_REQUEST_GET:
			case ACPP_SIGN_REQUEST_SET:
			case ACPP_SIGN_REQUEST_GET_BROADCAST:
			case ACPP_SIGN_REQUEST_SET_BROADCAST:
			case ACPP_SIGN_RESPONSE:
				out += " ";
				continue;
		}
		out += c;
	}
	return out;
};
	
function acp_init(){
	acp_buildCommands();
}
