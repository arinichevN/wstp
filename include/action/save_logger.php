<?php

$af = function($p) {
	$r = true;
	\db\init(DB_PATH);
	$q = "delete from logger;";
	$r = $r && \db\commandF($q);
	foreach ($p['rows'] as $row) {
		$q = "insert into logger (id, interval, max_rows) values ({$row['id']}, {$row['interval']}, {$row['max_rows']});";
		$r = $r && \db\commandF($q);
	}
	\db\suspend();
	if (!$r) {
		throw new \Exception('some of updates failed');
	}
};

