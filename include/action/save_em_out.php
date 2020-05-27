<?php

$af = function($p) {
	$r = true;
	\db\init(DB_PATH);
	$q = "delete from em_out;";
	$r = $r && \db\commandF($q);
	foreach ($p['rows'] as $row) {
		$q = "insert into em_out (id, out) values ({$row['id']}, {$row['out']});";
		$r = $r && \db\commandF($q);
	}
	\db\suspend();
	if (!$r) {
		throw new \Exception('some of updates failed');
	}
};

