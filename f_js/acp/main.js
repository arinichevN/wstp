const ACPP_DELIMITER_START=					"<";
const ACPP_DELIMITER_COLUMN=				";";
const ACPP_DELIMITER_END=					">";

const ACPP_SIGN_REQUEST_GET=				'?';
const ACPP_SIGN_REQUEST_SET=				'&';
const ACPP_SIGN_REQUEST_GET_BROADCAST=		'*';
const ACPP_SIGN_REQUEST_SET_BROADCAST=		'#';
const ACPP_SIGN_RESPONSE=					'!';

function acp_buildRequest(arr){
	return ACPP_DELIMITER_START + arr.join(ACPP_DELIMITER_COLUMN) + ACPP_DELIMITER_END;
}

function acp_parsePack(buf_str, format) {
	let data = [];
	let pack = "";
	for (let i = 0; i < buf_str.length; i++) {
		if (buf_str[i] === ACPP_DELIMITER_END) {
			arr = pack.split(ACPP_DELIMITER_COLUMN);
			row = cpObj(format);
			let j = 0;
			for(let p in row){
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

function acp_parseResponse(buf_str, format) {
	//console.log(buf_str);
	let data = [];
	let pack = "";
	for (let i = 0; i < buf_str.length; i++) {
		if (buf_str[i] === ACPP_DELIMITER_END) {
			arr = pack.split(ACPP_DELIMITER_COLUMN ); 
			sign = arr.shift();
			if(sign !== ACPP_SIGN_RESPONSE){
				console.warn("bad sign", sign);
				return null;
			}
			let row = cpObj(format);
			let j = 0;
			for(let p in row){
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

function acp_parseResponseArr(buf_str, format) {
	//console.log(buf_str);
	let data = [];
	let pack = "";
	for (let i = 0; i < buf_str.length; i++) {
		if (buf_str[i] === ACPP_DELIMITER_END) {
			arr = pack.split(ACPP_DELIMITER_COLUMN ); 
			sign = arr.shift();
			if(sign !== ACPP_SIGN_RESPONSE){
				console.warn("bad sign", sign);
				return null;
			}
			let row = [];
			for(let ri=0; ri<format.length; ri++){
				row.push(format[ri]);
			}
			let j = 0;
			for(let ri=0; ri<format.length; ri++){
				row[ri] = arr[j];
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


function acp_secureStr(str){
	let out = '';
	for(let i = 0; i<str.length;i++){
		let c = str.charAt(i);
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
