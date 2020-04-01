<?php

$af = function($p) {
	$r = true;
	\db\init(DB_PATH);
	$q = "delete from pid;";
	$r = $r && \db\commandF($q);
	foreach ($p['rows'] as $row) {
		$q = "insert into pid (id, mode, kp, ki, kd, out_min, out_max) values ({$row['id']}, {$row['mode']}, {$row['kp']}, {$row['ki']}, {$row['kd']}, {$row['out_min']}, {$row['out_max']});";
		$r = $r && \db\commandF($q);
	}
	\db\suspend();
	if (!$r) {
		throw new \Exception('some of updates failed');
	}
};

