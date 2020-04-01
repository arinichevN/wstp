<?php

$af = function($p) {
	$r = true;
	\db\init(DB_PATH);
	$q = "delete from channel;";
	$r = $r && \db\commandF($q);
	foreach ($p['rows'] as $row) {
		$q = "insert into channel (id, em_id, sensor_id, step_id, reg_id) values ({$row['id']}, {$row['em_id']}, {$row['sensor_id']}, {$row['step_id']}, {$row['reg_id']});";
		$r = $r && \db\commandF($q);
	}
	\db\suspend();
	if (!$r) {
		throw new \Exception('some of updates failed');
	}
};

