<?php

$app_version = 2;
$basePath = '';
$name = '';
$user = ['name'=>null, 'role' => null, 'role_rank' => null, 'valid_interval' => null ];

class ExceptionS extends \Exception {
  public function errorMessage() {
    //error message
    $errorMsg = 'Error on line '.$this->getLine().' in '.$this->getFile().': '.$this->getMessage();
    return $errorMsg;
  }
}

function go($appDir) {
    global $basePath, $name;
    $basePath = $appDir;
    try{
	    if (is_string($appDir)) {
	        require($basePath . DIRECTORY_SEPARATOR . 'config/main.php');
	        $c = f_getConfig();
	    }
	    if (isset($c['name'])) {
	        $name = $c['name'];
	        unset($c['name']);
	    }
		if (isset($c['db']['use'])) {
	        require 'include' . DIRECTORY_SEPARATOR . 'db' . DIRECTORY_SEPARATOR . $c['db']['use'] . '.php';
	        if (isset($c['db']['conninfo'])) {
	            $db_conninfo = $c['db']['conninfo'];
	            try {
	                \db\init($db_conninfo);
	            } catch (\Exception $exc) {
	                $response = [
	                    'status' => 2,
	                    'data' => $exc->getMessage(),
	                    'user' => $user['name']
	                ];
	                $code = $exc->getCode();
	                if ($code === 3) {
	                    $response['status'] = 3;
	                }
	                send($response);
	                return;
	            }
	        }
	        unset($c['db']);
	    }
	
	    if (isset($c['session']['use'])) {
	        require 'include' . DIRECTORY_SEPARATOR . 'session' . DIRECTORY_SEPARATOR . $c['session']['use'] . '.php';
	        unset($c['session']);
	        \session\start();
	    }
		if (isset($c['acp']['use'])) {
	        require 'include' . DIRECTORY_SEPARATOR . 'acp' . DIRECTORY_SEPARATOR . $c['acp']['use'] . '.php';
	        unset($c['acp']);
	    }
	/*
	    if (isset($c['check']['use'])) {
	        foreach ($c['check']['use'] as $value) {
	            require 'include' . DIRECTORY_SEPARATOR . 'check' . DIRECTORY_SEPARATOR . $value . '.php';
	        }
	        unset($c['check']);
	    }
	    */
	    spl_autoload_register('autoload');
	} catch (\Exception $exc) {
		$response = [
			'status' => 2,
			'data' => $exc->getMessage(),
			'user' => $user['name']
		];
		$code = $exc->getCode();
		if ($code === 3) {
			$response['status'] = 3;
		}
		send($response);
		return;
	}
    run();
}

function autoload($class) {
    global$basePath;
    $p = $basePath . DIRECTORY_SEPARATOR . 'include' . DIRECTORY_SEPARATOR . 'util' . DIRECTORY_SEPARATOR . str_replace('\\', '/', $class) . '.php';
    if (file_exists($p)) {
        require $p;
    } else {
        throw new \Exception('no class');
    }
}

function run() {
    global $sock, $user;
    try {
        $raw_request = file_get_contents("php://input");
        if ($raw_request !== false) {
            if ($raw_request === '') {
                throw new \Exception('no request');
            } else {
                $request = json_decode($raw_request, true, 10);
                if (!is_null($request)) {
                    processRequest($request);
                } else {
                    throw new \Exception('failed to parse request');
                }
            }
        }
    } catch (\Exception $exc) {
        $response = [
            'status' => 2,
            'data' => $exc->getMessage(),
            'user' => $user['name']
        ];
        $code = $exc->getCode();
        if ($code === 3) {
            $response['status'] = 3;
        }
        send($response);
    }
    if ($sock) {
        \sock\suspend();
    }
}

function send($content) {
    header('Content-Type:application/json; charset=UTF-8');
    echo json_encode($content);
}

function checkParam(&$data) {
    $b = true;
    foreach ($data as $k => $v) {
        if (is_array($v)) {
            $b = $b && checkParam($v);
        } else {
            if (preg_match_all("/^[\w-,. ]+$/u", $v) === 1 or is_null($v)) {
                $b = $b && true;
            } else {
                $b = $b && false;
            }
        }
    }
    return $b;
}

function getClassPath(&$arr) {
    $output = '';
    foreach ($arr as $v) {
        if (!is_string($v)) {
            throw new \Exception('check param');
        }
        $output.='\\';
        $output.=$v;
    }
    return substr($output, 1);
}

function processRequest(&$r) {
	global $basePath, $user;
    $response = [
        'data' => [],
        'status' => 1,
        'user' => $user['name']
    ];
    if (!is_array($r)) {
        throw new \Exception('check param: array expected');
    }
    foreach ($r as $a) {
        if (!isset($a['action']) || !is_array($a['action'])) {
            throw new \Exception('check param: bad action');
        }
        try {
	        $c = getClassPath($a['action']);
		    $path = $basePath . DIRECTORY_SEPARATOR . 'include' . DIRECTORY_SEPARATOR . 'action' . DIRECTORY_SEPARATOR . str_replace('\\', '/', $c) . '.php';
		    if (!file_exists($path)) {
		        throw new \Exception("no action: $path");
		    }
		    include $path;
		    $u_ok = true;
		    if(isset($valid_user)){
			    $u_ok = \session\authorize($valid_user);
			}
			if(!$u_ok){
				throw new ExceptionS('restricted');
			}
            if (isset($a['param'])) {
                $out = $af($a['param']);
            } else {
                $out = $af();
            }
            $response['data'][] = ['data' => $out, 'status' => 1];
        } catch (\Exception $e) {
            $response['data'][] = ['data' => $e->getMessage(), 'status' => 0];
        }catch (ExceptionS $e) {
			$response['data'][] = ['data' => $e->errorMessage(), 'status' => 0];
		}
    }
    send($response);
}
