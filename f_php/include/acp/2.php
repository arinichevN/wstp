<?php

namespace acpp;

define("ACPP_BUFFER_SIZE", 1024);

define("ACPP_DELIMITER_START", "*");
define("ACPP_DELIMITER_COLUMN", ":");
define("ACPP_DELIMITER_END", ";");

define("ACPP_RESP_APP_BUSY", "B");
define("ACPP_RESP_APP_IDLE", "I");


define("ACPP_CMD_APP_START", "ast");
define("ACPP_CMD_APP_STOP", "asp");
define("ACPP_CMD_APP_EXIT", "aex");
define("ACPP_CMD_APP_RESET", "ars");
define("ACPP_CMD_APP_PING", "apn");
define("ACPP_CMD_APP_HELP", "ahl");
define("ACPP_CMD_APP_PRINT", "apr");
define("ACPP_CMD_APP_TIME", "atm");
define("ACPP_CMD_APP_NO", "ano");

define("ACPP_CMD_GET_FTS", "cgfts");
define("ACPP_CMD_GET_ITS", "gits");
define("ACPP_CMD_GET_INT", "gi");
define("ACPP_CMD_GET_NEXT_ITEM", "gni");
define("ACPP_CMD_SET_FLOAT", "sf");
define("ACPP_CMD_SET_INT", "si");

define("ACPP_CMD_SET_PWM_DUTY_CYCLE", "spwmds");
define("ACPP_CMD_SET_PWM_PERIOD", "spwmp");
define("ACPP_CMD_SET_PWM_RESOLUTION", "spwmr");
define("ACPP_CMD_SET_PWM_DUTY_CYCLE_MIN", "spwmdsi");
define("ACPP_CMD_SET_PWM_DUTY_CYCLE_MAX", "spwmdsa");
define("ACPP_CMD_SET_PM_DUTY_CYCLE", "spmdc");
define("ACPP_CMD_SET_PM_DUTY_TIME_MIN", "spmdtm");
define("ACPP_CMD_SET_PM_IDLE_TIME_MIN", "spmitm");

define("ACPP_CMD_STOP", "sp");
define("ACPP_CMD_START", "st");
define("ACPP_CMD_RESET", "rs");
define("ACPP_CMD_GET_DATA", "gd");

define("ACPP_CMD_PROG_STOP", "psp");
define("ACPP_CMD_PROG_START", "pst");
define("ACPP_CMD_PROG_RESET", "prs");
define("ACPP_CMD_PROG_ENABLE", "penl");
define("ACPP_CMD_PROG_DISABLE", "pdsl");
define("ACPP_CMD_PROG_ADD", "padd");
define("ACPP_CMD_PROG_DELETE", "pdel");
define("ACPP_CMD_PROG_GET_DATA_RUNTIME", "pgdr");
define("ACPP_CMD_PROG_GET_DATA_INIT", "pgdi");
define("ACPP_CMD_PROG_GET_DATA", "pgd");
define("ACPP_CMD_PROG_GET_ERROR", "pgerr");
define("ACPP_CMD_PROG_GET_ENABLED", "pgenl");
define("ACPP_CMD_PROG_NEXT_STEP", "pnstp");
define("ACPP_CMD_PROG_PREV_STEP", "ppstp");

define("ACPP_CMD_CHANNEL_STOP", "csp");
define("ACPP_CMD_CHANNEL_START", "cst");
define("ACPP_CMD_CHANNEL_RESET", "crs");
define("ACPP_CMD_CHANNEL_ENABLE", "cenl");
define("ACPP_CMD_CHANNEL_DISABLE", "cdsl");
define("ACPP_CMD_CHANNEL_ADD", "cadd");
define("ACPP_CMD_CHANNEL_DELETE", "cdel");
define("ACPP_CMD_CHANNEL_GET_DATA_RUNTIME", "cgdr");
define("ACPP_CMD_CHANNEL_GET_DATA_INIT", "cgdi");
define("ACPP_CMD_CHANNEL_GET_DATA", "cgd");
define("ACPP_CMD_CHANNEL_GET_ERROR", "cgerr");
define("ACPP_CMD_CHANNEL_GET_ENABLED", "cgenl");
define("ACPP_CMD_CHANNEL_GET_FTS", "cgfts");


function connect($addr, $port, $timeout=1) {
    $sock_addr = "tcp://" . $addr . ":" . $port;
	$sock = stream_socket_client($sock_addr, $errno, $errstr);
    if (!$sock) {
        throw new \Exception("socket connection failed: $errno - $errstr");
    }
    stream_set_timeout($sock, $timeout);
    return $sock;
}

function tryconnect($addr, $port, $timeout=1) {
    $sock_addr = "tcp://" . $addr . ":" . $port;
	$sock = stream_socket_client($sock_addr, $errno, $errstr);
    if (!$sock) {
		return $sock;
    }
    stream_set_timeout($sock, $timeout);
    return $sock;
}

function send($buf, $sock) {
    $buf_len = \strlen($buf); //echo $buf;
    $n = fwrite($sock, $buf);
    if ($n !== $buf_len) {
        throw new \Exception("acp\send: expected to write: $buf_len, but written: $n");
    }
}

function suspend( $sock) {
    fclose($sock);
}

function requestSend($sock, $cmd, $data=NULL, $pack_data_fun=NULL) {
    $buf = "";
    $buf = ACPP_DELIMITER_START . $cmd . ACPP_DELIMITER_BLOCK;
    if (!is_null($data) && !is_null($pack_data_fun)) {
        $buf .= $pack_data_fun($data);
    }
    $buf.=ACPP_DELIMITER_END;
    send($buf, $sock);
}

function requestSendCmd($sock, $cmd) {
    return requestSend($sock, $cmd, NULL, NULL);
}

function getmFTS($sock, $cmd, $list) {
	foreach ($list as $value) {
		$buf = ACPP_DELIMITER_START . $value . ACPP_DELIMITER_COLUMN . $cmd . ACPP_DELIMITER_END;
		send($buf, $sock);
	}
	return responseReadMNParse([
        'id' => null,
        'value' => null,
        'tv_sec' => null,
        'tv_nsec' => null,
        'state' => null
            ], count($list), $sock);
}

function requestSendI2List($sock, $cmd, $list) {
	foreach ($list as $value) {
		$v0 = intval($value['p0']);
		$v1 = intval($value['p1']);
		$buf = ACPP_DELIMITER_START . $v0 . ACPP_DELIMITER_COLUMN . $cmd . ACPP_DELIMITER_COLUMN . $v1 . ACPP_DELIMITER_END;
		send($buf, $sock);
	}
}

function requestSendI1F1List($sock,$cmd, $list) {
	foreach ($list as $value) {
		$v0 = intval($value['p0']);
		$v1 = floatval($value['p1']);
		$buf = ACPP_DELIMITER_START . $v0 . ACPP_DELIMITER_COLUMN . $cmd . ACPP_DELIMITER_COLUMN . $v1 . ACPP_DELIMITER_END;
		send($buf, $sock);
	}
}

function requestSendI1S1List($sock,$cmd, $list) {
        foreach ($list as $value) {
            $v0 = intval($value['p0']);
            $v1 = $value['p1'];
            $buf = ACPP_DELIMITER_START . $v0 . ACPP_DELIMITER_COLUMN . $cmd . ACPP_DELIMITER_COLUMN . $v1 . ACPP_DELIMITER_END;
			send($buf, $sock);
        }
}

function getBufParseStateData($sock) {
    $buf = \sock\getBuf(ACPP_BUFFER_SIZE);
    if (\strlen($buf) === 0) {
        throw new \Exception("getBufParseStateData: controller returned nothing");
    }
    $block_count = 0;
    $str = "";
    for ($i = 0; $i < \strlen($buf); $i++) {
        if ($buf[$i] === ACPP_DELIMITER_BLOCK) {
            $block_count++;
            continue;
        }
        if ($block_count === 1) {
            $str.=$buf[$i];
        }
        if ($block_count > 2) {
            break;
        }
    }
    return $str;
}

function rowToArr($str, $items_count) {
    $data = \explode(ACPP_DELIMITER_COLUMN, $str, $items_count);
    if (\count($data) !== $items_count) {
        throw new \Exception("rowToArr: bad format");
    }
    return $data;
}

function rowToStr($str) {
    $out=\str_replace(ACPP_DELIMITER_COLUMN, " ", $str);
    return $out;
}

//function getData($buf_str, $rowArr) {
    //$data = [];
    //$str = "";
    //$field_count = \count($rowArr);
    //for ($i = 0; $i < \strlen($buf_str); $i++) {
        //if ($buf_str[$i] === ACPP_DELIMITER_END) {
            //return $data;
        //}
       
        //if ($buf_str[$i] === ACPP_DELIMITER_ROW) {
            //$arr = rowToArr($str, $field_count);
            //$row = array_merge([], $rowArr);
            //$j = 0;
            //foreach ($row as $key => $value) {
                //$row[$key] = $arr[$j];
                //$j++;
            //}
            //\array_push($data, $row);
            //$str = null;
            //continue;
        //}
        //$str.=$buf_str[$i];
    //}
    //return $data;
//}

function getData($buf_str, $rowArr) {
    $data = [];
    $pack = "";
    $field_count = \count($rowArr);
    for ($i = 0; $i < \strlen($buf_str); $i++) {
		if ($buf_str[$i] === ACPP_DELIMITER_START) {
			//continue;
		}
        if ($buf_str[$i] === ACPP_DELIMITER_END) {
            $arr = rowToArr($pack, $field_count);
            $row = array_merge([], $rowArr);
            $j = 0;
            foreach ($row as $key => $value) {
                $row[$key] = $arr[$j];
                $j++;
            }
            \array_push($data, $row);
            $pack = null;
            continue;
        }
        if ($buf_str[$i] === ACPP_DELIMITER_START) {
			continue;
		}
        $pack.=$buf_str[$i];
    }
    return $data;
}

function getRowStr($buf_str) {
    $data = "";
    $str = "";
    $block_count = 0;
    for ($i = 0; $i < \strlen($buf_str); $i++) {
        if ($buf_str[$i] === ACPP_DELIMITER_END) {
            return $data;
        }
        if ($buf_str[$i] === ACPP_DELIMITER_ROW) {
            $row_str = rowToStr($str);
            $data .=$row_str;
            $str = null;
        }
        $str.=$buf_str[$i];
    }
    return $data;
}

function responseRead($sock) {
	$buf =  fread($sock, ACPP_BUFFER_SIZE);
    if (\strlen($buf) === 0) {
        throw new \Exception("responseRead: controller returned nothing");
    }
    return $buf;
}

function responseReadNParse($rowArr,$sock) {
    $buf = responseRead($sock);
    $data = getData($buf, $rowArr);
    if ($data === false) {
        throw new \Exception("responseRead: bad format");
    }
    return $data;
}

//function responseReadMNParse($rowArr, $sock) {
    //$buf = responseReadText($sock);
    //$data = getData($buf, $rowArr);
    //if ($data === false) {
        //throw new \Exception("responseReadMNParse: bad format");
    //}
    //return $data;
//}

function responseReadMNParse($rowArr, $pack_count, $sock) {
    $buf = responseReadMPack($sock, $pack_count);
    $data = getData($buf, $rowArr);
    if ($data === false) {
        throw new \Exception("responseReadMNParse: bad format");
    }
    return $data;
}

function responseReadRows($sock) {
    $buf = responseRead($sock);
    $data = getRowStr($buf);
    if ($data === false) {
        throw new \Exception("responseReadRows: bad format");
    }
    return $data;
}

function responseGetSeq($buf_str) {
    $seq_str = "";
    for ($i = 0; $i < \strlen($buf_str); $i++) {
        if ($buf_str[$i] === ACPP_DELIMITER_COLUMN) {
            break;
        }
        $seq_str.=$buf_str[$i];
    }
    return intval($seq_str, 10);
}

function responseGetInl($buf_str) {
    $inl_str = "";
    $f1 = 0;
    for ($i = 0; $i < \strlen($buf_str); $i++) {
        if ($buf_str[$i] === ACPP_DELIMITER_COLUMN) {
            $f1 = 1;
            continue;
        }
        if (!$f1) {
            continue;
        }
        if ($buf_str[$i] === ACPP_DELIMITER_BLOCK) {
            break;
        }
        $inl_str.=$buf_str[$i];
    }
    return intval($inl_str, 10);
}

function responseGetData($buf_str) {
    $data = "";
    $n = 0;
    for ($i = 0; $i < \strlen($buf_str); $i++) {
        if ($buf_str[$i] === ACPP_DELIMITER_BLOCK) {
            $n++;
            continue;
        }
        if ($n < 1) {
            continue;
        }
        if ($n > 1) {
            break;
        }
        $data.=$buf_str[$i];
    }
    return $data;
}

function bufferGetNextItem($arr, $seq) {
    foreach ($arr as $value) {
        if ($value["seq"] === $seq + 1) {
            return $value["data"];
        }
    }
    return NULL;
}

function responseReadText($sock) {
	$out = "";
	while(1){
		$buf =  fread($sock, ACPP_BUFFER_SIZE);
		if (\strlen($buf) === 0) {
	        return $out;
	    }
	    for ($i = 0; $i < \strlen($buf); $i++) {
			if($buf[$i] == ACPP_DELIMITER_END){
				$out .= substr($buf, 0, -1);
				return $out;
			}
		}
		$out .=$buf;
	}
	return $out;
}

function responseReadMPack($sock, $pack_count) {
	$out = "";
	for($c=0; $c < $pack_count; ){
		$buf =  fread($sock, ACPP_BUFFER_SIZE);
		if (\strlen($buf) === 0) {
	        return $out;
	    }
	    for ($i = 0; $i < \strlen($buf); $i++) {
			if($buf[$i] == ACPP_DELIMITER_END){
				$c++;
			}
		}
		$out .=$buf;
	}
	//echo $out;
	return $out;
}



function parseDate($buf_str) {
    $str = "";
    for ($i = 0; $i < \strlen($buf_str); $i++) {
        if ($i < 3) {
            continue;
        }
        if ($buf_str[$i] === "\n") {
            break;
        }
        $str.=$buf_str[$i];
    }
    $arr = rowToArr($str, 6);
    $data = [
        'year' => $arr[0],
        'month' => $arr[1],
        'day' => $arr[2],
        'hour' => $arr[3],
        'min' => $arr[4],
        'sec' => $arr[5]
    ];
    return $data;
}

function getDate() {
    $buf = \sock\getBuf(ACPP_BUFFER_SIZE);
    if (\strlen($buf) === 0) {
        throw new \Exception("getDate: controller returned nothing");
    }
    if (!crc_check($buf)) {
        throw new \Exception("getDate: crc check failed");
    }
    $data = parseDate($buf);
    if ($data === false) {
        throw new \Exception("getDate: bad format");
    }
    return $data;
}

function getFTS($sock) {
    return responseReadNParse([
        'id' => null,
        'value' => null,
        'tv_sec' => null,
        'tv_nsec' => null,
        'state' => null
            ], $sock);
}

//function getmFTS($sock) {
    //return responseReadMNParse([
        //'id' => null,
        //'value' => null,
        //'tv_sec' => null,
        //'tv_nsec' => null,
        //'state' => null
            //], $sock);
//}

function parseString($buf_str) {
    $str = "";
    for ($i = 0; $i < \strlen($buf_str); $i++) {
        if ($i < 3) {
            continue;
        }
        if ($buf_str[$i] === "\n") {
            break;
        }
        $str.=$buf_str[$i];
    }
    return $str;
}

function getString() {
    $buf = \sock\getBuf(ACPP_BUFFER_SIZE);
    if (\strlen($buf) === 0) {
        throw new \Exception("getString: controller returned nothing");
    }
    if (!crc_check($buf)) {
        throw new \Exception("getString: crc check failed");
    }
    $data = parseString($buf);
    if ($data === false) {
        throw new \Exception("getString: bad format");
    }
    return $data;
}
