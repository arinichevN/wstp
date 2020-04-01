function Regulator(){
	this.id = 0;
	this.method = regmethod_list[0].value;
    this.pid_id = 0;
    this.pos2_id = 0;
    this.copyParam = function(data){
		this.id = data.id;
		this.method = data.method;
		this.pid_id = data.pid_id;
		this.pos2_id = data.pos2_id;
	};
	this.setParamFromDBRow = function(db_row){
		this.id = parseInt(db_row.id);
		this.method = parseInt(db_row.method);
		this.pid_id = parseInt(db_row.pid_id);
		this.pos2_id = parseInt(db_row.pos2_id);
		if(isNaN(this.id) || isNaN(this.method) || isNaN(this.pid_id) || isNaN(this.pos2_id)){
			return false;
		}
		return true;
	};
	this.getRowForDB = function(){
		return {id:this.id, method: this.method, pid_id:this.pid_id, pos2_id:this.pos2_id};
	};
}
