<?php

namespace uds;

$uds;

function init() {
    global $uds_path, $uds;
    $errorno = -1;
    $errorstr = "";
    $timeout = 3;
    $uds = stream_socket_client('unix://' . $uds_path, $errorno, $errorstr, $timeout);
    if (!$uds) {
        throw new \Exception("uds connection failed: " . $errorstr . "; error number: " . $errorno);
    }
    stream_set_timeout($uds, $timeout);
    stream_set_blocking($uds, 1);
}

function suspend() {
    global $uds;
    fclose($uds);
}

function getDataS(&$q, $s) {
    global $uds;
    $r = "";
    if (!fwrite($uds, $q)) {
        throw new \Exception("getDataS: can not write");
    }
    if (!($r = fread($uds, $s))) {
        throw new \Exception("getDataS: can not read response");
    }
    return $r;
}

function sgInt($q) {
    global $uds;
    if (!fwrite($uds, $q)) {
        throw new \Exception("sgInt: can not write");
    }
    if (!($r = fread($uds, PHP_INT_SIZE))) {
        throw new \Exception("sgInt: can not read response");
    }
    $data = unpack("i", $r);
    return $data[1];
}

function sgStr($q) {
    global $uds;
    if (!fwrite($uds, $q)) {
        throw new \Exception("sgStr: can not write");
    }
    $s = "";
    while (true) {
        $r = fread($uds, 1);
        if ($r==="") {
            break;
        }
        $s.=$r;
    }
    return $s;
}
function getIntSeq($q) {
        \uds\init();
        $kind = \uds\getKind($q);
        if ($kind === "t") {
            $size = \uds\getInt();
            if ($size > 0) {
                $r = \uds\getData($size);
                $data = unpack("i*", $r);
                return $data;
            }
        }else{
            throw new \Exception("getIntSeq: controller refusal");
        }
        return NULL;
    }
function sendQ($q) {
    global $uds;
    if (!fwrite($uds, $q)) {
        throw new \Exception("sendQ: can not write");
    }
}

function getData($s) {
    global $uds;
    if (!($r = fread($uds, $s))) {
        throw new \Exception("getData: can not read response");
    }
    return $r;
}

function getKind($q) {
    global $uds;
    $r = "";
    if (!fwrite($uds, $q)) {
        throw new \Exception("getKind: can not write");
    }
    if (!($r = fread($uds, 1))) {
        throw new \Exception("getKind: can not read response");
    }
    $data = unpack("C", $r);
    return chr($data[1]);
}

function getInt() {
    global $uds;
    if (!($r = fread($uds, PHP_INT_SIZE))) {
        throw new \Exception("getInt: can not read response");
    }
    $data = unpack("i", $r);
    return $data[1];
}

function getChar() {
    global $uds;
    if (!($r = fread($uds, PHP_INT_SIZE))) {
        throw new \Exception("getChar: can not read response");
    }
    $data = unpack("C", $r);
    return $data[1];
}
