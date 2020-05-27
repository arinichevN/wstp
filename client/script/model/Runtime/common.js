function RuntimeCommon() {
	this.UNKNOWN_STR = "&empty;";
    this.blink_tm = 270;
    this.precision = 2;
	this.blinkS = function(elem){
		blink(elem, "pr_success", this.blink_tm);
	};
	this.blinkF = function(elem){
		blink(elem, "pr_failed", this.blink_tm);
	};
	this.toStr = function(v){
		if(v===null){
			return this.UNKNOWN_STR;
		}
		return v;
	};
	this.elemSetBadVal = function(elem){
		elem.innerHTML = this.UNKNOWN_STR;
		cla(elem, "rcr_badval");
	};
	this.elemSetGoodVal = function(elem, v){
		elem.innerHTML = v;
		clr(elem, "rcr_badval");
	};
	this.updateElem = function(elem, v){
		if(v===null){
			this.elemSetBadVal(elem);
		}else{
			this.elemSetGoodVal(elem, v);
		}
	};
	this.updateElemBl =  function(elem, v){
		if(v !== null){
			this.elemSetGoodVal(elem, v);
			this.blinkS(elem);
		}else{
			this.elemSetBadVal(elem);
			this.blinkF(elem);
		}
	};
	this.updateElem2 = function(elem, v, state){
		if(v !== null){
			elem.innerHTML = v.toFixed(this.precision);
		}else{
			elem.innerHTML = this.UNKNOWN_STR;
		}
		if(state === SUCCESS){
			clr(elem, "prp_failed");
			if(v===null){
				cla(elem, "rcr_badval");
			}else{
				clr(elem, "rcr_badval");
			}
		}else{
			clr(elem, "rcr_badval");
			cla(elem, "prp_failed");
		}
	};
	this.updateTimeElem = function(elem, v){
		if(v===null){
			this.elemSetBadVal(elem);
		}else{
			var v1 = v/1000;//seconds
			this.elemSetGoodVal(elem, intToTimeStr(parseInt(v1.toFixed(0))));
		}
	};
	this.updateStateStrElem = function(elem, v){;
		if(v===null){
			this.elemSetBadVal(elem);
		}else{
			this.elemSetGoodVal(elem, getStateStr(v));
		}
	};
	this.updateFloatElem = function(elem, v){
		if(v===null){
			this.elemSetBadVal(elem);
		}else{
			this.elemSetGoodVal(elem, v.toFixed(this.precision));
		}
	};
	this.updateFloatElemBl = function(elem, v){
		if(v !== null){
			this.elemSetGoodVal(elem, v.toFixed(this.precision));
			this.blinkS(elem);
		}else{
			this.elemSetBadVal(elem);
			this.blinkF(elem);
		}
	};
};
