<?php


$af = function($p) {
	$data = [];
	\db\init(DB_PATH);
	$q = "delete from log where channel_id = {$p['channel_id']}";
	\db\command($q);
	\db\suspend();
	return $data;
};
