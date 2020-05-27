<?php


$af = function($p) {
	$data = [];
	\db\initR(DB_PATH);
	$q = "select * from log where channel_id = {$p['channel_id']} order by mark asc";
	$r = \db\getData($q);
	while ($row = \db\fetch_assoc($r)) {
		\array_push($data, $row);
	}
	\db\suspend();
	return $data;
};
