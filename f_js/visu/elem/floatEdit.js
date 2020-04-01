//requires Inc()
function FloatEdit(slave){
	this.slave = slave;
	this.valB = c("input");
    s(this.valB, "size", 50);
    this.setB = cb("V");
	this.upB = cb("+");
	this.downB = cb("-");
	this.wholeB = cb("");
	this.fractB = cb("");
	this.fractV = 0.0;
	this.wholeV = 0.0;
	this.kind = null;
	this.upB.disabled = true;
	this.downB.disabled = true;
	this.fractB.innerHTML = this.fractV.toFixed(3);
	this.wholeB.innerHTML = this.wholeV;
	this.setKind = function(kind){
		this.upB.disabled = false;
		this.downB.disabled = false;
		this.kind = kind;
	};
	this.incCB = function(sign, kind, inc){
		var out = (this.wholeV + this.fractV) * sign;
		this.slave.incCB(this.kind, out);
	};
	this.changeFract = function(){
		switch (this.fractV) {
            case 0.001:
                this.fractV = 0.01;
                break;
            case 0.01:
                this.fractV = 0.1;
                break;
            case 0.1:
                this.fractV = 0.0;
                break;
            case 0.0:
                this.fractV = 0.001;
                break;
            default:
                this.fractV = 0.0;
                break;
            
        }
        this.fractB.innerHTML = this.fractV.toFixed(3);
	};
	this.changeWhole = function(){
		switch (this.wholeV) {
            case 0:
                this.wholeV = 1;
                break;
            case 1:
                this.wholeV = 10;
                break;
            case 10:
                this.wholeV = 100;
                break;
            case 100:
                this.wholeV = 1000;
                break;
            default:
                this.wholeV = 0;
                break;
            
        }
        this.wholeB.innerHTML = this.wholeV;
	};
	var self = this;
    this.upB.onmousedown = function(){
		inc.down(self, 1, null, null);
	};
    this.downB.onmousedown = function(){
		inc.down(self, -1, null, null);
	};
	this.wholeB.onclick = function(){
		self.changeWhole();
	};
	this.fractB.onclick = function(){
		self.changeFract();
	};
	this.setB.onclick = function(){
		self.slave.setCB(self.valB.value);
	};
}
