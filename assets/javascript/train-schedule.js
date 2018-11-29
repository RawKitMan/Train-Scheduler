$(document).ready(function () {

    
    /*var timeA = moment();
    var timeB = moment().add(500, "minutes")
    console.log(timeA);
    console.log(timeB);
    console.log(moment.duration(timeB.diff(timeA, "m"), "m")._milliseconds/60000);*/
    
    $("#submit-button").on("click", function () {

        event.preventDefault();
        const firstTrain = $("#first-time").val().trim();

        const firstHour = parseInt(firstTrain.substr(0,2));
        const firstMinutes = parseInt(firstTrain.substr(3,2));
        console.log(firstHour);
        console.log(firstMinutes);
        const firstT= moment();
        const frequency = $("#frequency").val().trim()
        firstT.hours(firstHour);
        firstT.minutes(firstMinutes);

        let nextT = moment(firstT).add(frequency, "m");
        
        let mAway = minutesAway();

        let trainInfo = {
            name: $("#train-name").val().trim(),
            destination: $("#destination").val().trim(),
            firstTrain: firstT.format("HH:mm"),
            frequency: frequency,
            nextTrain: nextT.format("HH:mm"),
            minutesAway: mAway
        };

        function minutesAway(){
            let currentTime = moment();
            let minutesAway = moment.duration(nextT.diff(currentTime, "m"), "m")._milliseconds/60000;
            console.log(minutesAway);
            while(minutesAway <= 0){
                nextT.add(frequency, "m");
                minutesAway = moment.duration(nextT.diff(currentTime, "m"), "m")._milliseconds/60000;
            };
            console.log(nextT);
            //trainInfo.nextTrain = nextT.format("HH:mm");
            return minutesAway;
        }        

        $("#train-name").val("");
        $("#destination").val("");
        $("#first-time").val("");
        $("#frequency").val("");

        trains.push(trainInfo);
        trains.forEach(function(obj){
            obj.minutesAway = minutesAway();
        });
        createSchedule(trains);
        sessionStorage.setItem("trainSchedule", JSON.stringify(trains));
        
    });

    function createSchedule(arr) {

        $("tbody").empty();

        arr.forEach(function (obj) {
            let tRow = $("<tr>");
            let tName = $("<td>");
            tName.text(obj.name);
            let tDest = $("<td>");
            tDest.text(obj.destination);
            let tFirst = $("<td>");
            tFirst.text(obj.firstTrain);
            let tFreq = $("<td>");
            tFreq.text(obj.frequency);
            let tNext = $("<td>");
            tNext.text(obj.nextTrain);
            let tAway = $("<td>");
            tAway.text(obj.minutesAway);


            tRow.append(tName, tDest, tFirst, tFreq, tNext, tAway);
            $("tbody").append(tRow);
        });

    }

    

    //An array of objects that wiore train information. We want to pull it from local storage and parse it so it becomes an array again.
    let trains = JSON.parse(sessionStorage.getItem("trainSchedule"));

    //If there's nothing in the local storage to begin with, we create an empty array
    if (!Array.isArray(trains)) {
        trains = [];
    }

    


    //We want the table to show everything with current or no storage.
    createSchedule(trains);
});