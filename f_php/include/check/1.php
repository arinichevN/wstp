<?php

namespace check;

function _name($v) {
    $p2 = "/^[\w ]+$/u";
    if (preg_match_all($p2, $v) === 1) {
        return true;
    } else {
        return false;
    }
}

function _text($v) {
    $p2 = "/^[\w-,.:;()\"\"\\n ]+$/u";
    if (preg_match_all($p2, $v) === 1) {
        return true;
    } else {
        return false;
    }
}
function _commentText($v) {
    $p2 = "/^[\x{0021}\x{0022}\x{0025}\x{0028}-\x{003b}\x{003d}\x{003f}\x{0040}-\x{005a}\x{0061}-\x{007a}\x{0410}-\x{044F}(\\n) ]+$/u";
    if (preg_match_all($p2, $v) === 1) {
        return true;
    } else {
        return false;
    }
}
function _articleText($v) {
    $p2 = "/^[\x{0021}\x{0022}\x{0025}\x{0028}-\x{005a}\x{005b}\x{005d}\x{0061}-\x{007a}\x{0410}-\x{044F}(\\n) ]+$/u";
    if (preg_match_all($p2, $v) === 1) {
        return true;
    } else {
        return false;
    }
}
function _sha1($v) {
    if  (preg_match_all('/^[A-Za-z0-9]{40}$/', $v) === 1) {
        return true;
    }
    return false;
}
function _d4(&$v) {
    if (preg_match_all('/^[0-9]{4}$/', $v) === 1) {
        return true;
    }
    return false;
}
function isName($v) {
    if (!(_name($v))) {
        throw new \Exception('check param: contains invalid characters');
    }
}

function isText($v, $l) {
    if (!isset($v)) {
        throw new \Exception('check param: text not set');
    }
    if (!_text($v)) {
        throw new \Exception('check param: contains invalid characters');
    }
    if (mb_strlen($v,'UTF-8') > $l) {
        throw new \Exception('check param: text too long');
    }
}
function isCommentText($v, $l) {
    if (!isset($v)) {
        throw new \Exception('check param: text not set');
    }
    if (!_commentText($v)) {
        throw new \Exception('check param: contains invalid characters');
    }
    if (mb_strlen($v,'UTF-8') > $l) {
        throw new \Exception('check param: text too long');
    }
}
function isArticleText($v, $l) {
    if (!isset($v)) {
        throw new \Exception('check param: text not set');
    }
    if (!_articleText($v)) {
        throw new \Exception('check param: contains invalid characters');
    }
    if (mb_strlen($v,'UTF-8') > $l) {
        throw new \Exception('check param: text too long');
    }
}
function isSearchText($v){
    if (!isset($v)) {
        throw new \Exception('check param: text not set');
    }
    if (!_text($v)) {
        throw new \Exception('check param: contains invalid characters');
    }
}
function isFixed($p, $values) {
    if (!isset($p)) {
        throw new \Exception('check param: text not set');
    }
    if (is_array($values)) {
        $f = true;
        foreach ($values as $value) {
            if ($p === $value) {
                $f = false;
            }
        }
        if ($f) {
            throw new \Exception('check param: not in acceptable set');
        }
    } else {
        if ($p !== $values) {
            throw new \Exception('check param: not in acceptable set');
        }
    }
}

function isIdInt($input=null) {
    if (!isset($input)) {
        throw new \Exception('check param: is not set');
    }
    //$input = (int) $input;
    if (!(is_int($input))) {
        throw new \Exception('check param: is not int');
    }
}

function isInt($value) {
    if (!is_int($value)) {
        if (is_array($value)) {
            throw new \Exception('check param: is not int');
        }
        $s = (string) $value;
        $ls = strlen($value);
        $i = (int) $value;
        $si = (string) $i;
        $li = strlen($si);
        if ($ls !== $li) {
            throw new \Exception('check param: is not int');
        }
        if (is_bool($value)) {
            throw new \Exception('check param: is not int');
        }
    }
}

function intAr($a) {
    foreach ($a as $v) {
        if (is_array($v)) {
            intAr($v);
        } else {
            if (!is_int($v)) {
                throw new \Exception('check param: is not int');
            }
        }
    }
}

function intRange($value, $min, $max) {
    is_numeric($value);
    if (!($value >= $min && $value <= $max)) {
        throw new \Exception('check param: out of range');
    }
}

function dateStr($value) {
    if (preg_match_all('/^\d{4}-\d{2}-\d{2}$/', $value) !== 1) {
        throw new \Exception('check param: not in format Y-m-d');
    }
    try {
        $d = new DateTime($value);
    } catch (\Exception $exc) {
        throw new \Exception('check param: can not parse as date');
    }
}
