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


        let trainInfo = {
            name: $("#train-name").val().trim(),
            destination: $("#destination").val().trim(),
            firstTrain: $("#first-time").val().trim(),
            frequency: $("#frequency").val().trim(),
            
        };

        $("#train-name").val("");
        $("#destination").val("");
        $("#first-time").val("");
        $("#frequency").val("");

        trains.push(trainInfo);
        createSchedule(trains);
        sessionStorage.setItem("trainSchedule", JSON.stringify(trains));
        console.log(trains);
    });

    function createSchedule(arr) {

        $("tbody").empty();

        arr.forEach(function (obj) {
            const tRow = $("<tr>");
            const tName = $("<td>");
            tName.text(obj.name);
            const tDest = $("<td>");
            tDest.text(obj.destination);
            const tFirst = $("<td>");
            tFirst.text(obj.firstTrain);
            const tFreq = $("<td>");
            tFreq.text(obj.frequency);
            tRow.append(tName, tDest, tFirst, tFreq);
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