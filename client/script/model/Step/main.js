function Step(){
	this.id = 0;
	this.goal = 0.0;
    this.reach_time = 0;
    this.hold_time = 0;
    this.next_id = 0;
    this.copyParam = function(data){
		this.id = data.id;
		this.goal = data.goal;
		this.reach_time = data.reach_time;
		this.hold_time = data.hold_time;
		this.next_id = data.next_id;
	};
	this.setParamFromDBRow = function(db_row){
		this.id = parseInt(db_row.id);
		this.goal = parseFloat(db_row.goal);
		this.reach_time = parseInt(db_row.reach_time);
		this.hold_time = parseInt(db_row.hold_time);
		this.next_id = parseInt(db_row.next_id);
		if(isNaN(this.id) || isNaN(this.reach_time) || isNaN(this.hold_time) || isNaN(this.next_id)){
			return false;
		}
		if(!checkFloat(this.goal)){
			return false;
		}
		return true;
	};
	this.getRowForDB = function(){
		return {id:this.id, goal: this.goal, reach_time:this.reach_time, hold_time:this.hold_time, next_id:this.next_id };
	};
}
