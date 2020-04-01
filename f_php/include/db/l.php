<?php

namespace db;

$db_connection;

function init($conninfo) {
    global $db_connection;
    $db_connection = new \SQLite3($conninfo, SQLITE3_OPEN_READWRITE);
    $db_connection->enableExceptions(true);
}

function initR($conninfo) {
    global $db_connection;
    $db_connection = new \SQLite3($conninfo, SQLITE3_OPEN_READONLY);
    $db_connection->enableExceptions(true);
}

/**
 * Call it after you have asked database the last time
 * @return void
 */
function suspend() {
    global $db_connection;
    $db_connection->close();
}

function getData($q) {
    global $db_connection;
//    $err = null;
//    $r = sqlite_query($db_connection, $q, $err);
//    if (!$r) {
//        throw new \Exception("getData: query failed: $err");
//    }
    $r = $db_connection->query($q);
    return $r;
}

function getDataAll($q) {
    global $db_connection;
//    $r = sqlite_array_query($db_connection, $q, SQLITE_ASSOC);
//    if (!$r) {
//        throw new \Exception("getDataAll: query failed: " . sqlite_error_string(sqlite_last_error($db_connection)));
//    }
    $r = $db_connection->query($q);
    $arr = [];
    while ($row = $r->fetchArray(SQLITE3_ASSOC)) {
        \array_push($arr, $row);
    }
    return $arr;
}

//command shall be executed
function command($q) {
    global $db_connection;
//    try {
    $db_connection->exec($q);
//    } catch (Exception $e) {
//        throw new \Exception("command: query failed: " . $e->getMessage());
//    }
}

function commandF(&$q) {
    global $db_connection;
//    $r = sqlite_exec($db_connection, $q);
//    if (!$r) {
//        return false;
//    }
//    return true;
    return $db_connection->exec($q);
}

function query($q) {
    global $db_connection;
    // return sqlite_query($db_connection, $q);
    return $db_connection->query($q);
}

function fetch_assoc($r) {
    global $db_connection;
    // return sqlite_fetch_array($r, SQLITE_ASSOC);
    return $r->fetchArray(SQLITE3_ASSOC);
}
