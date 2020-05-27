function Logger(){
	this.id = 0;
    this.interval = 0;
    this.max_rows = 0;
    this.copyParam = function(data){
		this.id = data.id;
		this.interval = data.interval;
		this.max_rows = data.max_rows;
	};
	this.setParamFromDBRow = function(db_row){
		this.id = parseInt(db_row.id);
		this.interval = parseInt(db_row.interval);
		this.max_rows = parseInt(db_row.max_rows);
		if(isNaN(this.id) || isNaN(this.interval) || isNaN(this.max_rows)){
			return false;
		}
		return true;
	};
	this.getRowForDB = function(){
		return {id:this.id, interval:this.interval, max_rows:this.max_rows};
	};
}
