<?php

$af = function($p) {
	$r = true;
	\db\init(DB_PATH);
	$q = "delete from sensor;";
	$r = $r && \db\commandF($q);
	foreach ($p['rows'] as $row) {
		$q = "insert into sensor (id, interval, remote_id, peer_id) values ({$row['id']}, {$row['interval']}, {$row['remote_id']}, {$row['peer_id']});";
		$r = $r && \db\commandF($q);
	}
	\db\suspend();
	if (!$r) {
		throw new \Exception('some of updates failed');
	}
};

