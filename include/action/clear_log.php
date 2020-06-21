<?php


$af = function($p) {
	$data = [];
	\db\initR(DB_PATH);
	$q = "delete from log where channel_id = {$p['channel_id']}";
	$r = \db\command($q);
	\db\suspend();
	return $data;
};
