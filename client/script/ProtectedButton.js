function ProtectedButton(slave, func, style, enable) {
    this.slave = slave;
    this.func = func;
    this.style = style;
	this.enable = enable;
	this.delay_ms = 1000;
	this.container = cb("");
	this.blocked = false;
    if(this.enable){
		this.blocked = true;
	}
    this.updateStr = function (inner, title) {
		this.container.innerHTML = inner;
		if(typeof title === "string" ){
			this.container.title = title;
		}
    };
    this.block = function(){
		this.blocked = true;
		cla(this.container, [this.style]);
	};
    this.act = function () {
		if(this.enable && this.blocked){
			this.blocked = false;
			clr(this.container, [this.style]);
			this.tmr = window.setTimeout(() => {
                    this.block();
                }, this.delay_ms);
			return;
		}
		this.func(this.slave);
    };
	if(this.enable){
		cla(this.container, [this.style]);
	}
    this.container.onclick = ()=>{
		this.act();
	};
}
