<?php

$af = function($p) {
	$r = true;
	\db\init(DB_PATH);
	$q = "delete from peer;";
	$r = $r && \db\commandF($q);
	foreach ($p['rows'] as $row) {
		$q = "insert into peer (id, ip_addr, port) values ({$row['id']}, '{$row['ip_addr']}', {$row['port']});";
		$r = $r && \db\commandF($q);
	}
	\db\suspend();
	if (!$r) {
		throw new \Exception('some of updates failed');
	}
};

