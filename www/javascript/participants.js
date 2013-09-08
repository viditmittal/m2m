document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
    db = window.openDatabase("Masema", "1.0", "PhoneGap Demo", 200000);
    db.transaction(LoadGroupParticipants, transaction_error);
}
function LoadGroupParticipants(tx) {
	   
	var locationid = getUrlValue('locationid');
	var groupid = getUrlValue('groupid');
    var sql = "Select ID, FirstName, LastName  from Participants where LocationId = " + locationid + " and GroupId=" + groupid;
    tx.executeSql(sql, [], function (tx,result) {
    
	var len = result.rows.length;
		
	for (var i=0; i<len; i++) {
	var participant = result.rows.item(i);	 	
	$('#participants').append('<li style="height:100px;"><a href="editparticipant.html?id="' + participant.ID + ' data-transition="slide" style="vertical-align: middle; font-size: xx-large">' + participant.FirstName + ' ' + participant.LastName + '</a></li>');
		}
			 $('#participants').listview('refresh'); 
     });

}



