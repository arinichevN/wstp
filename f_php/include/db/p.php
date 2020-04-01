<?php

namespace db;

$db_connection;

function init($db_conninfo) {
    global $db_connection;
    $db_connection = \pg_connect($db_conninfo);
    pg_set_error_verbosity(PGSQL_ERRORS_VERBOSE);
    if (!$db_connection) {
        throw new \Exception("Connection to database failed");
    }
}

/**
 * Call it after you have asked database the last time
 * @return void
 */
function suspend() {
    global $db_connection;
    if (!pg_close($db_connection)) {
        throw new \Exception('can not close db connection');
    }
}

function getData(&$q) {
    global $db_connection;
    $r = pg_query($db_connection, $q);
    if ($r) {
        return $r;
    } else {
        throw new \Exception("query failed: " . pg_last_error($db_connection));
    }
}

function getDataM(&$q) {
    $r = getData($q);
    if (pg_result_status($r) !== PGSQL_COMMAND_OK) {
		pg_free_result($r);
        throw new \Exception('\db\getDataM failed');
    }
    $n = pg_affected_rows($r);
    pg_free_result($r);
    return $n;
}
//command shall be executed
function command(&$q) {
    $r = getData($q);
    if (pg_result_status($r) !== PGSQL_COMMAND_OK) {
		pg_free_result($r);
        throw new \Exception('\db\command failed');
    }
    pg_free_result($r);
}
function commandF(&$q) {
    $result = getData($q);
    if (pg_result_status($result) !== PGSQL_COMMAND_OK) {
        return false;
    }
    return TRUE;
}
//some rows shall be affected
function updateQ(&$q) {
    $result = getData($q);
    if (pg_result_status($result) !== PGSQL_COMMAND_OK) {
		pg_free_result($r);
        throw new \Exception('\db\updateQ failed');
    }
    if(pg_affected_rows($result)<=0){
		pg_free_result($r);
        throw new \Exception('\db\updateQ: no rows updated');
    }
    pg_free_result($r);
}
//one row shall be affected
function singleRowQ(&$q) {
    $result = getData($q);
    if (pg_result_status($result) !== PGSQL_COMMAND_OK) {
		pg_free_result($r);
        throw new \Exception('\db\updateQ failed');
    }
    if(pg_affected_rows($result)<=0){
		pg_free_result($r);
        throw new \Exception('\db\updateQ: no rows updated');
    }
    pg_free_result($r);
}
function getDataP(&$q) {
    echo $q;
    $result = getData($q);
    //if ($result === true) {
    //    throw new Exception('sql error: returned nothing');
    //}
    $row = pg_fetch_assoc($result, 0);
    if (isset($row['status']) && isset($row['message'])) {
        switch ($row['status']) {
            case 'done':
                return ['message' => $row['message']];
                break;
            case 'error':
                throw new \Exception($row['message']);
                break;
        }
    } else {
        throw new \Exception('\db\getDataP failed');
    }
}

function getCount($q) {
    global $db_connection;
    $r = getData($q);
    $row = pg_fetch_row($r, 0);
    pg_free_result($r);
    if ($row) {
        return (int) $row[0];
    } else {
        throw new \Exception('\db\getCount invalid data');
    }
}

function getRow($q) {
    global $db_connection;
    $r = getData($q);
    if (pg_num_rows($r) === 0) {
		pg_free_result($r);
        return null;
    }
    $row = pg_fetch_assoc($r, 0);
    pg_free_result($r);
    if ($row) {
        return $row;
    } else {
        throw new \Exception('\db\getRow invalid data');
    }
}

function getCell($q) {
    global $db_connection;
    $r = getData($q);
    if (pg_num_rows($r) === 0) {
		pg_free_result($r);
        return null;
    }
    $row = pg_fetch_row($r, 0);
    pg_free_result($r);
    if ($row) {
        return $row[0];
    } else {
        throw new \Exception('\db\getCell invalid data');
    }
}

function query($q) {
    global $db_connection;
    return pg_query($db_connection, $q);
}

function free_result(&$r) {
    pg_free_result($r);
}

function fetch_row(&$r) {
    return pg_fetch_row($r, null);
}

function fetch_assoc(&$r) {
    return pg_fetch_assoc($r);
}

function escape_literal(&$v) {
    global $db_connection;
    return pg_escape_literal($db_connection, $v);
}

function escape_identifier(&$v) {
    global $db_connection;
    return pg_escape_identifier($db_connection, $v);
}
