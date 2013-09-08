document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
    db = window.openDatabase("Masema", "1.0", "PhoneGap Demo", 200000);
    db.transaction(LoadGroups, transaction_error);
}
function LoadGroups(tx) {
	   
	var locationid = getUrlValue('locationid');
    var sql = "Select ID, Name from Groups where LocationId = " + locationid;
    tx.executeSql(sql, [], function (tx,result) {
    
	var len = result.rows.length;
		
	for (var i=0; i<len; i++) {
	var group = result.rows.item(i);	 	
	$('#groups').append('<li style="height:100px;"><a href="participants.html?locationid=' + locationid + '&groupid=' + group.ID + '"  data-transition="slide" style="vertical-align: middle;' + 
                    'font-size: xx-large">' + group.Name + '</a></li>');
		}
		
			 $('#groups').listview('refresh'); 
	
     });

}



