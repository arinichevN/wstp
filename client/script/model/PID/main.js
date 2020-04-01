function PID(){
	this.id = 0;
	this.mode = regmode_list[0].value;
    this.kp = 0.0;
    this.ki = 0.0;
    this.kd = 0.0;
    this.out_min = 0.0;
    this.out_max = 0.0;
    this.copyParam = function(data){
		this.id = data.id;
		this.mode = data.mode;
		this.kp = data.kp;
		this.ki = data.ki;
		this.kd = data.kd;
		this.out_min = data.out_min;
		this.out_max = data.out_max;
	};
	this.setParamFromDBRow = function(db_row){
		this.id = parseInt(db_row.id);
		this.mode = parseInt(db_row.mode);
		this.kp = parseFloat(db_row.kp);
		this.ki = parseFloat(db_row.ki);
		this.kd = parseFloat(db_row.kd);
		this.out_min = parseFloat(db_row.out_min);
		this.out_max = parseFloat(db_row.out_max);
		if(isNaN(this.id) || isNaN(this.mode)){
			return false;
		}
		if(!(checkFloat(this.kp) && checkFloat(this.ki) && checkFloat(this.kd) && checkFloat(this.out_min) && checkFloat(this.out_max))){
			return false;
		}
		return true;
	};
	this.getRowForDB = function(){
		return {id:this.id, mode: this.mode, kp:this.kp, ki:this.ki, kd:this.kd, out_min:this.out_min, out_max:this.out_max };
	};
}
