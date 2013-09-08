document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {

    db = window.openDatabase("Masema", "1.0", "PhoneGap Demo", 200000);
DownloadData('','');
    db.transaction(LoadLocations, transaction_error);
}

function LoadLocations(tx) {

    var sql = "Select ID, Name from Locations";
    tx.executeSql(sql, [], function (tx,result) {
    
	var len = result.rows.length;
	
	for (var i=0; i<len; i++) {
	var location = result.rows.item(i);	 	
	$('#locations').append('<li style="height:100px;"><a href="groups.html?locationid=' + location.ID + '" data-transition="slide" style="vertical-align: middle; font-size: xx-large">' + location.Name + '</a></li>');
		}
		
			 $('#locations').listview('refresh'); 
	
     });

}



