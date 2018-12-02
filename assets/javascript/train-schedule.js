$(document).ready(function () {

    let firstT = moment();
    let nextT = moment(firstT);

    $("#submit-button").on("click", function () {

        event.preventDefault();
        const firstTrain = $("#first-time").val().trim();

        const firstHour = parseInt(firstTrain.substr(0, 2));
        const firstMinutes = parseInt(firstTrain.substr(3, 2));
        const frequency = $("#frequency").val().trim()
        firstT.hours(firstHour);
        firstT.minutes(firstMinutes);

        nextT = moment(firstT).add(frequency, "m");

        var trainInfo = {
            name: $("#train-name").val().trim(),
            destination: $("#destination").val().trim(),
            firstTrain: firstT.format("HH:mm"),
            frequency: frequency,
            nextMoment: nextT,
            nextTrain: nextT.format("HH:mm")
        };

        /*function minutesAway(){
            let currentTime = moment();
            let minutesAway = moment.duration(nextT.diff(currentTime, "m"), "m")._milliseconds/60000;
            console.log(minutesAway);
            while(minutesAway <= 0){
                nextT.add(frequency, "m");
                minutesAway = moment.duration(nextT.diff(currentTime, "m"), "m")._milliseconds/60000;
            };
            return minutesAway;
        }*/

        $("#train-name").val("");
        $("#destination").val("");
        $("#first-time").val("");
        $("#frequency").val("");

        trainInfo.minutesAway = minutesAway(trainInfo);
        console.log(trainInfo);

        trains.push(trainInfo);

        createSchedule(trains);
        sessionStorage.setItem("trainSchedule", JSON.stringify(trains));

    });

    function createSchedule(arr) {

        $("tbody").empty();

        arr.forEach(function (obj) {
            console.log(obj.minutesAway);
            console.log(obj.nextMoment);
            let tRow = $("<tr>");
            let tName = $("<td>");
            tName.text(obj.name);
            let tDest = $("<td>");
            tDest.text(obj.destination);
            let tFirst = $("<td>");
            tFirst.text(obj.firstTrain);
            let tFreq = $("<td>");
            tFreq.text(obj.frequency);

            let newMoment = moment(obj.nextMoment);
            obj.nextMoment = newMoment;
            obj.minutesAway = minutesAway(obj);

            
            let tNext = $("<td>");
            tNext.text(obj.nextTrain);
            let tAway = $("<td>");
            tAway.text(obj.minutesAway);



            tRow.append(tName, tDest, tFirst, tFreq, tNext, tAway);
            $("tbody").append(tRow);
        });

    }

    function minutesAway(obj) {
        let currentTime = moment();
        let minutesAway = moment.duration(obj.nextMoment.diff(currentTime, "m"), "m")._milliseconds / 60000;

        while (minutesAway <= 0) {
            obj.nextMoment = obj.nextMoment.add(obj.frequency, "m");
            console.log(obj.nextMoment);
            minutesAway = moment.duration(obj.nextMoment.diff(currentTime, "m"), "m")._milliseconds / 60000;
            console.log(minutesAway);
            obj.nextTrain = obj.nextMoment.format("HH:mm");
        };


        return minutesAway;
    }

    //An array of objects that wiore train information. We want to pull it from local storage and parse it so it becomes an array again.
    let trains = JSON.parse(sessionStorage.getItem("trainSchedule"));


    //If there's nothing in the local storage to begin with, we create an empty array
    if (!Array.isArray(trains)) {
        trains = [];
    }



    if (trains.length > 0) {

        trains.forEach(function (obj) {//add function here to reassign the moment

            let newMoment = moment(obj.nextMoment);
            obj.nextMoment = newMoment;
            console.log(newMoment);
        });
    }
    //We want the table to show everything with current or no storage.
    createSchedule(trains);
});