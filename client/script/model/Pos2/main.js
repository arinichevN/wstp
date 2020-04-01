function Pos2(){
	this.id = 0;
	this.mode = regmode_list[0].value;
    this.hys = 0.0;
    this.out_min = 0.0;
    this.out_max = 0.0;
    this.copyParam = function(data){
		this.id = data.id;
		this.mode = data.mode;
		this.hys = data.hys;
		this.out_min = data.out_min;
		this.out_max = data.out_max;
	};
	this.setParamFromDBRow = function(db_row){
		this.id = parseInt(db_row.id);
		this.mode = parseInt(db_row.mode);
		this.hys = parseFloat(db_row.hys);
		this.out_min = parseFloat(db_row.out_min);
		this.out_max = parseFloat(db_row.out_max);
		if(isNaN(this.id) || isNaN(this.mode)){
			return false;
		}
		if(!(checkFloat(this.hys) && checkFloat(this.out_min) && checkFloat(this.out_max))){
			return false;
		}
		return true;
	};
	this.getRowForDB = function(){
		return {id:this.id, mode: this.mode, hys:this.hys, out_min:this.out_min, out_max:this.out_max };
	};
}
