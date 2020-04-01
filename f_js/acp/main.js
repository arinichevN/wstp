var ACPP_DELIMITER_START=	"<";
var ACPP_DELIMITER_COLUMN=	";";
var ACPP_DELIMITER_END=		">";

function acp_buildPackS(v1){
	var out = ACPP_DELIMITER_START + v1 + ACPP_DELIMITER_END;
	return out;
}

function acp_buildPackSI(v1, v2){
	var out = ACPP_DELIMITER_START + v1 + ACPP_DELIMITER_COLUMN + v2 + ACPP_DELIMITER_END;
	return out;
}

function acp_buildPackSII(v1, v2, v3){
	var out = ACPP_DELIMITER_START + v1 + ACPP_DELIMITER_COLUMN + v2 + ACPP_DELIMITER_COLUMN + v3 + ACPP_DELIMITER_END;
	return out;
}

function acp_buildPackSIII(v1, v2, v3, v4){
	var out = ACPP_DELIMITER_START + v1 + ACPP_DELIMITER_COLUMN + v2 + ACPP_DELIMITER_COLUMN + v3 + ACPP_DELIMITER_COLUMN + v4 + ACPP_DELIMITER_END;
	return out;
}

function acp_buildPackSIF(v1, v2, v3, precision){
	var out = ACPP_DELIMITER_START + v1 + ACPP_DELIMITER_COLUMN + v2 + ACPP_DELIMITER_COLUMN + v3.toFixed(precision) + ACPP_DELIMITER_END;
	return out;
}

function acp_parsePack(buf_str, format) {
    var data = [];
    var pack = "";
    var field_count = format.length;
    for (var i = 0; i < buf_str.length; i++) {
        if (buf_str[i] === ACPP_DELIMITER_END) {
            arr = pack.split(ACPP_DELIMITER_COLUMN, field_count);
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
