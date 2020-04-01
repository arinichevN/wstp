<?php

$af = function($p) {
	$r = true;
	\db\init(DB_PATH);
	$q = "delete from rchannel;";
	$r = $r && \db\commandF($q);
	foreach ($p['rows'] as $row) {
		$q = "insert into rchannel (id) values ({$row['id']});";
		$r = $r && \db\commandF($q);
	}
	\db\suspend();
	if (!$r) {
		throw new \Exception('some of updates failed');
	}
};

