function DownloadData(username, password) {

    var xhr1 = new XMLHttpRequest();
	alert(1);
    xhr1.open('GET', "http://masema.org/data.txt", true);
    //http://localhost/masema/metadata/data.txt
    // Event Data Download :'http://masema.org/sync/sync.aspx?type=download&id=4&username=testgrantor@masema.com&password=abc123&bypass='
    if (xhr1.overrideMimeType) {
        xhr1.overrideMimeType('text/plain; charset=UTF-8');
    }

    xhr1.onreadystatechange = function (e) {

        if (this.readyState == 4 && this.status == 200) {
			alert(2);
            if (this.responseText.toLowerCase().indexOf("authentication failed") >= 0) {
                // Authentication Failed 
                return -1;
            }
            else {
                var responseData = this.responseText;
				alert(3);
				alert(responseData);
                db.transaction(CreateDB, transaction_error, function () { CreateDB_success(responseData); });
            }
        }
        else if (this.readyState == 4 && this.status != 200) {
            return -2;
        }
    };
    xhr1.send();
}
 
function getUrlValue(paramName) {

    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars[paramName];
}