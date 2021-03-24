let $sq = [];
let $tmo = 4000;
let $uc = null;
function send(c, d, a) {
	let dest = window.location.protocol + '//' + window.location.host + window.location.pathname;
	let start = new Date();
	$sq.push([c, d, a, start, dest]);
	if ($sq.length === 1) {
		execute();
	}
}
function sendTo(c, d, a, dest) {
	let destf = window.location.protocol + '//' + window.location.host + window.location.pathname + dest + '.php';
	let start = new Date();
	$sq.push([c, d, a, start, destf]);
	if ($sq.length === 1) {
		execute();
	}
}
function execute() {
	let r = new XMLHttpRequest();
	r.timeout = 5000;
	let timedout = false;
	let timer = window.setTimeout(function () {
		timedout = true;
		r.abort();
		$sq[0][0].abort($sq[0][2], 'execute: timeout', null, null, null);
		donext();
	}, $tmo);
	r.onreadystatechange = function () {
		if (r.readyState === 4 && !timedout) {
			window.clearTimeout(timer);
			if (r.status === 200) {
				processResponse(r.responseText, $sq[0][2]);
			} else {
				processResponse('{"c_status":2,"message":"HTTP response status is not 200"}', $sq[0][2]);
			}
	
		}
	};
	//  r.timeout = 10000;
	r.open("POST", $sq[0][4], true);
	r.setRequestHeader('Content-Type', 'application/json');
	let data = JSON.stringify($sq[0][1]);
	//console.log("send: ", data);
	r.send(data);
}
function processResponse(r, action) {
	let finish = new Date();
	let dt = finish.getTime() - $sq[0][3].getTime();
	if (r !== '') {
		let response = null;
		try {
			response = JSON.parse(r);
		} catch (e) {
			$sq[0][0].abort(action, 'processResponse: can not parse json',null, dt, null);
			donext();
			return;
		}
		let user = response.user;
		let data = response.data;
		if($uc){
			$uc.setUserName(user);
		}
		//c_status 0-error while action execution, 1-ok, 2-error before any action execution
		switch (response.status) {
			case 0:
			case 1:
				for (let i = 0; i < data.length; i++) {
					if (data[i].status === 1) {
						$sq[0][0].confirm(action, data[i].data, i, dt, user);
					} else {
						$sq[0][0].abort(action, data, i, dt, user);
					}
				}
				break;
			case 2:
				$sq[0][0].abort(action, data, null, dt, user);
				break;
			case 3:
				$sq[0][0].abort(action, data, null, dt, user);
				updateApp(d.message);
				break;
		}
	} else {
		$sq[0][0].abort(action, 'processResponse: response is empty', null, dt, null);
	}
	donext();
}
function donext() {
	$sq.shift();
		if ($sq.length !== 0) {
		execute();
	}
}

