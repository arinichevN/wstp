<?php

$af = function($p) {
	$r = true;
	\db\init(DB_PATH);
	$q = "delete from pos2;";
	$r = $r && \db\commandF($q);
	foreach ($p['rows'] as $row) {
		$q = "insert into pos2 (id, mode, hys, out_min, out_max) values ({$row['id']}, {$row['mode']}, {$row['hys']}, {$row['out_min']}, {$row['out_max']});";
		$r = $r && \db\commandF($q);
	}
	\db\suspend();
	if (!$r) {
		throw new \Exception('some of updates failed');
	}
};

