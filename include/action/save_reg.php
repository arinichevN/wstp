<?php

$af = function($p) {
	$r = true;
	\db\init(DB_PATH);
	$q = "delete from reg;";
	$r = $r && \db\commandF($q);
	foreach ($p['rows'] as $row) {
		$q = "insert into reg (id, method, pid_id, pos2_id) values ({$row['id']}, {$row['method']}, {$row['pid_id']}, {$row['pos2_id']});";
		$r = $r && \db\commandF($q);
	}
	\db\suspend();
	if (!$r) {
		throw new \Exception('some of updates failed');
	}
};

