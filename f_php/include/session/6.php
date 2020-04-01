<?php

namespace session;


function start() {
    global $user;
    $user['name'] = null;
	$user['role'] = null;
	$user['role_rank'] = null;
	$user['valid_interval'] = null;
	\db\init(DB_PATH);
	if (isset($_COOKIE['id']) && is_id($_COOKIE['id'])) {
		check_old_user($_COOKIE['id']);
	}
}

function logout(){
	global $user;
	\db\init(DB_PATH);
	$q = "update public.user set session_stop_time=localtimestamp where name='{$user['name']}'";
	\db\command($q);
}

function check_new_user($n, $p) {
    global $user;
    $q = "select name, kind, extract(epoch from valid_interval) as delay from public.user where name='{$n}' and pswd='{$p}'";
    $r = \db\getData($q);
	while ($row = \db\fetch_assoc($r)) {
		$user['name'] = $row['name'];
		$user['role'] = $row['kind'];
		$user['valid_interval'] = $row['delay'];
	}
	\db\free_result($r);
	if(!is_null($user['name']) && !is_null($user['role'])){
		$user['role_rank'] = getRoleRank($user['role']);
		update($n, $user['valid_interval']);
	}
	\db\suspend();
}

function check_old_user($id) {
    global $user;
    $q = "select name, kind, extract(epoch from valid_interval) as delay from public.user where session_id='{$id}' and session_stop_time > localtimestamp";
    $r = \db\getData($q);
	while ($row = \db\fetch_assoc($r)) {
		$user['name'] = $row['name'];
		$user['role'] = $row['kind'];
		$user['valid_interval'] = $row['delay'];
	}
	\db\free_result($r);
	if(!is_null($user['name']) && !is_null($user['role'])){
		$user['role_rank'] = getRoleRank($user['role']);
		update($user['name'], $user['valid_interval']);
	}
}

function getRoleRank($role){
	$q = "select val from public.user_kind_rank where user_kind='{$role}' limit 1";
    $r = \db\getData($q);
    $out = null;
	while ($row = \db\fetch_assoc($r)) {
		$out = $row['val'];
		break;
	}
	\db\free_result($r);
	return $out;
}
//if role1_rank < role2_rank then user with role1 will be authorized to do role2 action
function authorize($valid_users) {
    global $user;
    $nok = true;
    $rok = true;
    if(isset($valid_users['name'])){
	    foreach ($valid_users['name'] as $name) {
			if(strcmp($user['name'], $name) === 0){
				return 1;
			}
		}
		$nok = false;
	}
	if(isset($valid_users['role'])){
		if(is_null($user['role_rank'])){
			return false;
		}
	    foreach ($valid_users['role'] as $role) {
			$rank = getRoleRank($role);
			if(!is_null($rank)){
				if($user['role_rank'] <= $rank){
					return true; 
				}
			}
		}
		$rok = false;
	}
	if($nok && $rok){
		return 1;
	}
    return 0;
}
function update($n, $tm){
	$nid = null;
	$c = 0;
    do {
        $nid = getId();
        $q = "select count(*) from public.user where session_id='{$nid}'";
        $c = \db\getCount($q);
    } while ($c > 0);
     $t = time() + (int)$tm;
    \setcookie("id", $nid, $t);
	$q = "update public.user set session_stop_time=(localtimestamp + '{$tm}'), session_id='{$nid}' where name='{$n}'";
	\db\command($q);
}
function is_n($v) {
    if  (preg_match_all('/^[A-Za-z0-9]{3,8}$/', $v) === 1) {
        return true;
    }
    return false;
}
function is_p($v) {
    if  (preg_match_all('/^[A-Za-z0-9]{3,8}$/', $v) === 1) {
        return true;
    }
    return false;
}
function is_id($v) {
   if  (preg_match_all('/^[A-Za-z0-9]{1,12}$/', $v) === 1) {
        return true;
    }
    return false;
}
function getId() {
    return (string) rand(0, getrandmax());
}

