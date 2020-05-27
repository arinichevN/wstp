<?php

$af = function($p) {
	$r = true;
	\db\init(DB_PATH);
	$channel_id = $p['channel_id'];
	$max_rows = $p['max_rows'];
	$q = "select count(*) from log where channel_id=$channel_id;";
	$n = \db\getInt($q);
	foreach ($p['rows'] as $row) {
		if($n < $max_rows){
			$q = "insert into log (channel_id, mark, value) values ($channel_id, {$row['mark']}, {$row['value']});";
			$r = $r && \db\commandF($q);
			if($r){$n++;}
		}else{
			$q = "update log set mark={$row['mark']}, value={$row['value']} where id=$channel_id and mark = (select min(mark) from log where id=$channel_id);";
			$r = $r && \db\commandF($q);
		}
	}
	\db\suspend();
	if (!$r) {
		throw new \Exception('some of DB queries failed');
	}
};

