<?php


$af = function($p) {
	$data = [];
	\db\initR(DB_PATH);
	$q = "select * from {$p['tbl']} order by id asc";
	$r = \db\getData($q);
	while ($row = \db\fetch_assoc($r)) {
		\array_push($data, $row);
	}
	\db\suspend();
	return $data;
};
