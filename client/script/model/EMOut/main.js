function EMOut(){
	this.id = 0;
    this.out = 0.0;
    this.copyParam = function(data){
		this.id = data.id;
		this.out = data.out;
	};
	this.setParamFromDBRow = function(db_row){
		this.id = parseInt(db_row.id);
		this.out = parseFloat(db_row.out);
		if(!checkFloat(this.out)){
			return false;
		}
		return true;
	};
	this.getRowForDB = function(){
		return {id:this.id, out:this.out };
	};
}
