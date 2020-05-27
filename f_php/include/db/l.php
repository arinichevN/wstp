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
    $r = $db_connection->query($q);
    return $r;
}

function getDataAll($q) {
    global $db_connection;
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
    $db_connection->exec($q);

}

function commandF(&$q) {
    global $db_connection;
    return $db_connection->exec($q);
}

function query($q) {
    global $db_connection;
    return $db_connection->query($q);
}

function fetch_assoc($r) {
    global $db_connection;
    return $r->fetchArray(SQLITE3_ASSOC);
}

function getInt($q){
	global $db_connection;
	$r=$db_connection->query($q);
	$row = $r->fetchArray(SQLITE3_NUM);
	$r->finalize();
	if ($row) {
        return (int) $row[0];
    } else {
        throw new \Exception('\db\getInt failed');
    }
	
}
