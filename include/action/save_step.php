<?php

$af = function($p) {
	$r = true;
	\db\init(DB_PATH);
	$q = "delete from step;";
	$r = $r && \db\commandF($q);
	foreach ($p['rows'] as $row) {
		$q = "insert into step (id, goal, reach_time, hold_time, next_id) values ({$row['id']}, {$row['goal']}, {$row['reach_time']}, {$row['hold_time']}, {$row['next_id']});";
		$r = $r && \db\commandF($q);
	}
	\db\suspend();
	if (!$r) {
		throw new \Exception('some of updates failed');
	}
};

