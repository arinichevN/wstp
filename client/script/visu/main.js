function Main() {
    this.type = VISU_TYPE.MAIN;
    this.container = {};
    this.initialized = false;
    this.update = true; //editor will make it false
    this.visible = false;
    this.peers = [];
    this.ems = [];
    this.sensors = [];
    this.pids = [];
    this.pos2s = [];
    this.regs = [];
    this.steps = [];
    this.channels = [];
    this.rchannels = [];
    this.loggers = [];
    this.em_outs = [];
    this.param_arr = [];
    this.paramG = this.peerG = this.emG = this.sensorG = this.pidG = this.pos2G = this.regG = this.stepG = this.loggerG = this.emOutG = this.channelG = this.rchannelG = null;
	
    this.init = function () {
		this.container = cvis();
		this.paramG = new SimpleGroup(358);
		this.peerG = new RowSet(this.peers, Peer, PeerRow, "peer", 311);
		this.emG = new RowSet(this.ems, EM, EMRow, "em", 312);
		this.sensorG = new RowSet(this.sensors, Sensor, SensorRow, "sensor", 313);
		this.pidG = new RowSet(this.pids, PID, PIDRow, "pid", 315);
		this.pos2G = new RowSet(this.pos2s, Pos2, Pos2Row, "pos2", 316);
		this.regG = new RowSet(this.regs, Regulator, RegulatorRow, "reg", 314);
		this.stepG = new RowSet(this.steps, Step, StepRow, "step", 317);
		this.emOutG = new RowSet(this.em_outs, EMOut, EMOutRow, "em_out", 370);
		this.loggerG = new RowSet(this.loggers, Logger, LoggerRow, "logger", 371);
		this.channelG = new RowSet(this.channels, Channel, ChannelRow, "channel", 318);
		this.param_arr = [this.peerG, this.emG, this.sensorG, this.pidG, this.pos2G, this.regG, this.stepG, this.emOutG, this.loggerG, this.channelG];
		this.rchannelG = new RuntimeChannelRowSet(this.rchannels, this.peers, this.ems, this.sensors, this.pids, this.pos2s, this.regs, this.steps, this.loggers, this.em_outs, this.channels, "rchannel", 319);
		this.paramG.a(this.param_arr);
		a(this.container, [this.paramG, this.rchannelG]);
		for(let i=0;i<this.param_arr.length;i++){
			this.param_arr[i].getAll();
		}
		this.rchannelG.getAll();
		this.initialized = true;
    };
    this.getName = function () {
        return trans.get(401);
    };
    this.updateStr = function () {
		this.paramG.updateStr();
		this.rchannelG.updateStr();
		for(let i=0;i<this.param_arr.length;i++){
			this.param_arr[i].updateStr();
		}
    };
    this.show = function () {
		document.title = trans.get(401);
		clr(this.container, "hdn");
		this.visible = true;
    };
    this.hide = function () {
		cla(this.container, "hdn");
        this.disableMainB();
		this.visible = false;
    };
}
let vmain = new Main();
visu.push(vmain);
