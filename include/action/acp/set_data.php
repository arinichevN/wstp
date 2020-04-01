<?php

$af = function($p) {
	$sock = \acp\connect($p['ip_addr'], $p['port'], 3);
	\acp\send($p['packs'], $sock);
	\acp\suspend($sock);
};
