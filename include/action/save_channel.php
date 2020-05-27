<?php

$af = function($p) {
	$r = true;
	\db\init(DB_PATH);
	$q = "delete from channel;";
	$r = $r && \db\commandF($q);
	foreach ($p['rows'] as $row) {
		$q = "insert into channel (id, em_id, eem_id, eem_out_id, bem_id, bem_out_id, sensor_id, step_id, reg_id, logger_id) values ({$row['id']}, {$row['em_id']}, {$row['eem_id']}, {$row['eem_out_id']}, {$row['bem_id']}, {$row['bem_out_id']}, {$row['sensor_id']}, {$row['step_id']}, {$row['reg_id']}, {$row['logger_id']});";
		$r = $r && \db\commandF($q);
	}
	\db\suspend();
	if (!$r) {
		throw new \Exception('some of updates failed');
	}
};

