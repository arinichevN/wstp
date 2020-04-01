<?php

$af = function($p) {
	$sock = \acp\connect($p['ip_addr'], $p['port'], 3);
	$data = \acp\getData($sock, $p['packs'], $p['pack_count']);
	\acp\suspend($sock);
	return $data;
};
