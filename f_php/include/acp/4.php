<?php

namespace acp;

define("ACPP_BUFFER_SIZE", 1024);

define("ACPP_DELIMITER_START", "<");
define("ACPP_DELIMITER_COLUMN", ";");
define("ACPP_DELIMITER_END", ">");

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

function getData($sock, $packs, $pack_count){
	send($packs, $sock);
	return responseReadMPack($sock, $pack_count);
}


function getText($sock, $packs){
	send($packs, $sock);
	return responseReadText($sock);
}
