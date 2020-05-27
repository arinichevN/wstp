function Channel(){
	this.id = 0;
	this.em_id = 0;
    this.sensor_id = 0;
    this.step_id = 0;
    this.reg_id = 0;
    this.logger_id = 0;
    this.bem_id = 0;
    this.eem_id = 0;
    this.bem_out_id = 0;
    this.eem_out_id = 0;
    this.copyParam = function(data){
		this.id = data.id;
		this.em_id = data.em_id;
		this.sensor_id = data.sensor_id;
		this.step_id = data.step_id;
		this.reg_id = data.reg_id;
		this.logger_id = data.logger_id;
		this.bem_id = data.bem_id;
		this.eem_id = data.eem_id;
		this.bem_out_id = data.bem_out_id;
	    this.eem_out_id = data.eem_out_id;
	};
	this.setParamFromDBRow = function(db_row){
		this.id = parseInt(db_row.id);
		this.em_id = parseFloat(db_row.em_id);
		this.sensor_id = parseInt(db_row.sensor_id);
		this.step_id = parseInt(db_row.step_id);
		this.reg_id = parseInt(db_row.reg_id);
		this.logger_id = parseInt(db_row.logger_id);
		this.bem_id = parseInt(db_row.bem_id);
		this.eem_id = parseInt(db_row.eem_id);
		this.bem_out_id = parseInt(db_row.bem_out_id);
		this.eem_out_id = parseInt(db_row.eem_out_id);
		if(isNaN(this.id) || isNaN(this.em_id) || isNaN(this.sensor_id) || isNaN(this.step_id) || isNaN(this.reg_id) || isNaN(this.logger_id) || isNaN(this.bem_id) || isNaN(this.eem_id) || isNaN(this.bem_out_id) || isNaN(this.eem_out_id)){
			return false;
		}
		return true;
	};
	this.getRowForDB = function(){
		return {id:this.id, em_id: this.em_id, sensor_id:this.sensor_id, step_id:this.step_id, reg_id:this.reg_id, logger_id:this.logger_id, bem_id:this.bem_id, eem_id:this.eem_id, bem_out_id:this.bem_out_id, eem_out_id:this.eem_out_id };
	};
}
