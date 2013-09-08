var db;
var dbCreated = false;

document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
    db = window.openDatabase("Masema", "1.0", "PhoneGap Demo", 200000);
}

function CreateDB(tx, serverData) {

    metaData = serverData;
    //********************************* Delete and Recreate Participants Table ****************************** 
    tx.executeSql('DROP TABLE IF EXISTS Participants');
    var sqlDeleteParticipants =
						"CREATE TABLE IF NOT EXISTS Participants ( " +
						"ID INTEGER PRIMARY KEY AUTOINCREMENT, " +
						"FirstName VARCHAR(50), " +
						"LastName VARCHAR(50), " +
						"UniqueID VARCHAR(50), " +
						"Image VARCHAR(100), " +
						"Category INTEGER, " +
						"Influencer INTEGER, " +
						"InfluencerID INTEGER, " +
						"Payout INTEGER, " +
						"Level INTEGER, " +
						"Points INTEGER, " +
						"LocationID VARCHAR(10), " +
						"GroupID VARCHAR(10), " +
						"IsNew INTEGER, " +
						"IsUpdate INTEGER, " +
						"TodayPoints INTEGER, " +
						"IsLevelCompleted INTEGER)";

    tx.executeSql(sqlDeleteParticipants);
    //*************************************************************************************************

    //********************************* Delete and Recreate Event Table  ******************************
    tx.executeSql('DROP TABLE IF EXISTS Events');
    var sqlDeleteEvents =
						"CREATE TABLE IF NOT EXISTS Events ( " +
						"ID INTEGER PRIMARY KEY, " +
						"Name VARCHAR(50), " +
						"AmountPerParticipant INTEGER, " +
						"BaseAmount INTEGER, " +
						"StartDate VARCHAR(50), " +
						"EndDate VARCHAR(50))";

    tx.executeSql(sqlDeleteEvents);
    //******************************************************************************************************

    //********************************* Delete and Recreate Performance Table ******************************

    tx.executeSql('DROP TABLE IF EXISTS Performance');
    var sqlDeleteGranteePerformance =
						"CREATE TABLE IF NOT EXISTS Performance ( " +
						"ID INTEGER PRIMARY KEY AUTOINCREMENT, " +
						"UniqueID VARCHAR(50), " +
						"ObjectiveID  VARCHAR(10), " +
						"Completed INTEGER)";
    tx.executeSql(sqlDeleteGranteePerformance);
    //***********************************************************************************************

    //********************************* Delete and Recreate game Table ******************************
    tx.executeSql('DROP TABLE IF EXISTS Game');
    var sqlDeleteGame =
						"CREATE TABLE IF NOT EXISTS Game ( " +
						"ID VARCHAR(10), " +
						"Name VARCHAR(100), " +
						"InfluencerRegAmount INTEGER, " +
						"InfluencerPerformanceAmount INTEGER, " +
						"PregnancyLevelID INTEGER, " +
						"NewMomLevelID INTEGER)";
    tx.executeSql(sqlDeleteGame);
    //*************************************************************************************************

    //********************************* Delete and Recreate Levels Table ******************************
    tx.executeSql('DROP TABLE IF EXISTS Levels');
    var sqlDeleteLevels =
						"CREATE TABLE IF NOT EXISTS Levels ( " +
						"ID VARCHAR(10), " +
						"LevelNo INTEGER, " +
						"Name VARCHAR(100))";

    tx.executeSql(sqlDeleteLevels);
    //**********************************************************************************************

    //********************************* Delete and Recreate Objectives Table ******************************

    tx.executeSql('DROP TABLE IF EXISTS Objectives');
    var sqlDeleteObjectives =
						"CREATE TABLE IF NOT EXISTS Objectives ( " +
						"ID VARCHAR(10), " +
						"Name VARCHAR(100), " +
						"PlusPoints INTEGER, " +
						"MinusPoints INTEGER, " +
						"Mandatory INTEGER, " +
						"Sequence INTEGER, " +
						"LevelId VARCHAR(10))";

    tx.executeSql(sqlDeleteObjectives);
    //**********************************************************************************************    

    //********************************* Delete and Recreate Locations Table ******************************
    tx.executeSql('DROP TABLE IF EXISTS Locations');
    var sqlDeleteLocations =
						"CREATE TABLE IF NOT EXISTS Locations ( " +
						"ID VARCHAR(10), " +
						"Name VARCHAR(100), " +
						"WinnerID VARCHAR(50), " +
						"WinningAmount INTEGER, " +
						"City VARCHAR(100), " +
						"State VARCHAR(100))";
    tx.executeSql(sqlDeleteLocations);
    //**********************************************************************************************    

    //********************************* Delete and Recreate Groups Table ******************************
    tx.executeSql('DROP TABLE IF EXISTS Groups');
    var sqlDeleteGroups =
						"CREATE TABLE IF NOT EXISTS Groups ( " +
						"ID VARCHAR(10), " +
						"Name VARCHAR(100), " +
						"Size INTEGER, " +
						"LocationId VARCHAR(10))";
    tx.executeSql(sqlDeleteGroups);
    //**********************************************************************************************  

    //********************************* Delete and Recreate LoginStatus Table ******************************
    tx.executeSql('DROP TABLE IF EXISTS LoginStatus');
    var sqlDeleteLoginStatus =
						"CREATE TABLE IF NOT EXISTS LoginStatus ( " +
						"Status INTEGER)";
    tx.executeSql(sqlDeleteLoginStatus);
    //**********************************************************************************************  
}


function CreateDB_success(serverData) {
    dbCreated = true;
    db.transaction(function (tx) { PopulateMetadata(tx, serverData); }, transaction_error);
}


function PopulateMetadata(tx, serverData) {

    metaData = JSON.parse(serverData);

    eventData = metaData.Event;

    //****************************** EVENT OBJECT *************************************
    $(eventData).each(function () {

        var eventObj = this;
        var sql = "INSERT INTO Events (ID,Name,AmountPerParticipant,BaseAmount,StartDate,EndDate) " +
                    "VALUES ('" + eventObj.ID + "','" + eventObj.Name + "','" + eventObj.AmountPerParticipant + "','" + eventObj.BaseAmount + "','" + eventObj.StartDate + "','" + eventObj.EndDate + "')";
        tx.executeSql(sql);
        //****************************** Locations OBJECT *************************************

        var locationObject = this.Locations;
        //------------------------ Traverse Locations : START----------------------------
        $(locationObject).each(function () {
            locationObj = this;
            sql = "INSERT INTO Locations (ID,Name,WinnerID,WinningAmount,City,State) " +
                        "VALUES ('" + locationObj.ID + "','" + locationObj.Name + "','" + locationObj.WinnerID + "','" + locationObj.WinningAmount + "','" + locationObj.City + "','" + locationObj.State + "')";
            tx.executeSql(sql);

            //****************************** Groups OBJECT *************************************
            var groupObject = locationObj.Groups;
            var locationId = locationObj.ID;
            //------------------------ Traverse Groups : START----------------------------
            $(groupObject).each(function () {
                groupObj = this;
                sql = "INSERT INTO Groups (ID,Name,Size,LocationId) " +
                            "VALUES ('" + groupObj.ID + "','" + groupObj.Name + "','" + groupObj.Size + "','" + locationId + "')";
                tx.executeSql(sql);
            }); // end of Groups	

            //------------------------ Traverse Groups : END---------------------------- 

        }); // end of Locations		

        //------------------------ Traverse Locations : END----------------------------   

        //****************************** Participants OBJECT *************************************

        var participantObject = this.Participants;

        //------------------------ Traverse Participant : START----------------------------
        $(participantObject).each(function () {

            // Add into the image collection to download..
            //arrImagesToDownload.push(this.Image);

            //************** Save grantee  ********************************
            participantObj = this;
            var userUniqueId = participantObj.UniqueID;
            sql = "INSERT INTO Participants (FirstName,LastName,UniqueID,Image,Category,Influencer,InfluencerID,Payout,Level,Points,LocationID,GroupID,IsNew,IsUpdate,TodayPoints,IsLevelCompleted) " +
                        "VALUES ('" + participantObj.FirstName + "','" + participantObj.LastName + "','" + participantObj.UniqueID + "','" + participantObj.Image + "','" + participantObj.Category + "','" + participantObj.Influencer + "','"
		                            + participantObj.InfluencerID + "','" + participantObj.Payout + "','" + participantObj.Level + "','" + participantObj.Points + "','" + participantObj.LocationID + "','" + participantObj.GroupID + "','" + participantObj.IsNew + "','" + participantObj.IsUpdate + "','0','0')";
            tx.executeSql(sql);
            //**************************************************************            

            //****************************** Performance OBJECT *************************************
            var performanceObject = this.Performance;
            //------------------------ Traverse Performance : START----------------------------
            $(performanceObject).each(function () {
                granteePerformanceObj = this;
                //********************* Save Performance  **************************
                sql = "INSERT INTO Performance (UniqueID,ObjectiveID,Completed) " +
                        "VALUES ('" + userUniqueId + "','" + granteePerformanceObj.ObjectiveID + "'," + "'" + granteePerformanceObj.Completed + "')";
                tx.executeSql(sql);
                //******************************************************************* 
            }); // end of performance		
            //------------------------ Traverse Performance : END----------------------------              		    
        }); // end of participants


        //------------------------ Traverse Participant : END----------------------------

        //****************************** Game OBJECT *************************************
        var gameObject = this.Game;

        //------------------------ Traverse Game : START----------------------------
        $(gameObject).each(function () {

            gameObj = this;
            //********************* Save Game  **************************
            var sql = "INSERT INTO Game (ID,Name,InfluencerRegAmount,InfluencerPerformanceAmount,PregnancyLevelID,NewMomLevelID) " +
                        "VALUES ('" + gameObj.ID + "','" + gameObj.Name + "','" + gameObj.InfluencerRegAmount + "','" + gameObj.InfluencerPerformanceAmount + "','" + gameObj.PregnancyLevelID + "','" + gameObj.NewMomLevelID + "')";
            tx.executeSql(sql);

            //****************************** Levels OBJECT *************************************
            var levelsObject = this.Levels;

            //------------------------ Traverse Levels : START----------------------------
            $(levelsObject).each(function () {

                levelObj = this;
                var levelId = levelObj.ID;
                //********************* Save Level  **************************
                var sql = "INSERT INTO Levels (ID,LevelNo,Name) " +
                            "VALUES ('" + levelObj.ID + "','" + levelObj.LevelNo + "','" + levelObj.Name + "')";
                tx.executeSql(sql);
                //************************************************************* 

                //****************************** Objectives OBJECT *************************************
                var objectivesObject = this.Objectives;

                //------------------------ Traverse Objectives : START-----------------------------------
                $(objectivesObject).each(function () {

                    objectiveObj = this;
                    //********************* Save Objective  **************************
                    var sql = "INSERT INTO Objectives (ID,Name,PlusPoints,MinusPoints,Mandatory,Sequence,LevelId) " +
                                "VALUES ('" + objectiveObj.ID + "','" + objectiveObj.Name + "','" + objectiveObj.PlusPoints + "','" + objectiveObj.MinusPoints + "','" + objectiveObj.Mandatory + "','" + objectiveObj.Sequence + "','" + levelId + "')";
                    tx.executeSql(sql);
                    //****************************************************************
                }); // end of Objectives

                //------------------------ Traverse Objectives : END-----------------------------------
            }); // end of Levels

            //------------------------ Traverse Levels : END----------------------------
        }); // end of Game
        //------------------------ Traverse Game : END----------------------------
    });           // end of Event


}

function transaction_error(tx, error) {
    alert("Database Error: " + error);
}
