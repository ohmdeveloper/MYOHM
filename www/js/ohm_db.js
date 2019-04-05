var ohmdb;
var db_shortName = 'MYOHM';
var db_version = '1.0';
var db_displayName = 'MY OHM';
var db_maxSize = 65535;
var json_arr = '{"FUNCTION":[ {"action_id":"SO.APPROVAL","function_name":"MOB.SO.APPROVAL","direct_key":"MAIN","program_name":"SOP021","start_function":"Y"}]}'

function initDB(){
	if (!window.openDatabase) {
		myApp.alert('Databases are not supported in this device.');
		return;
	}
	ohmdb = openDatabase(db_shortName, db_version, db_displayName,db_maxSize);
	ohmdb.transaction(function(tx){
		var db_query
		db_query='CREATE TABLE IF NOT EXISTS MY_OHM(FUNCTION INTEGER PRIMARY KEY AUTOINCREMENT,'
		+'FUNCTION_ID TEST,FUNCTION_NAME TEXT,DIRECT_KEY TEXT,PROGRAM_NAME TEXT,START_FUNCTION TEXT'
		+')';
		tx.executeSql(db_query);
	},db_errorHandler,db_successCallBack);
}
			
function insert_functions(){
	var json_function = $.parseJSON(json_arr);
	ohmdb.transaction(function(tx){	
		var db_query;
		for(var i=0;i<json_function.FUNCTION.length;i++){
			var data_row=json_function.FUNCTION[i];	
			db_query="INSERT INTO MY_OHM values(NULL,'"+data_row.action_id+"','"+data_row.function_name+"','"+data_row.direct_key+"','"+data_row.program_name+"','"+data_row.start_function+"')";
			tx.executeSql(db_query);
		}		
	},db_errorHandler,db_successCallBack);
}
function clear_data(){
	ohmdb.transaction(function(tx){
		var db_query
			tx.executeSql('DELETE FROM MY_OHM');
		},db_errorHandler,db_successCallBack);
}
function db_errorHandler(transaction, error) {
	var msg = 'DB: ';
	if (error){
		msg= msg+ error.message;
	}else{
		msg= msg+ transaction.message;
	}
   
   myApp.alert(msg);
}
function db_successCallBack() {
   var msg = "DBDEBUGGING: success<br>";
}
function drop_table(){
	ohmdb = openDatabase(db_shortName, db_version, db_displayName,db_maxSize);
			ohmdb.transaction(function(tx){
				tx.executeSql('DROP TABLE IF EXISTS MY_OHM');
			},
		db_errorHandler,
		db_successCallBack
	);
}
