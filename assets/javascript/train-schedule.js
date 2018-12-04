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

        $("#train-name").val("");
        $("#destination").val("");
        $("#first-time").val("");
        $("#frequency").val("");

        trainInfo.minutesAway = minutesAway(trainInfo);
        trains.push(trainInfo);

        createSchedule(trains);
        localStorage.setItem("trainSchedule", JSON.stringify(trains));

    });

    $(document).on("click","#remove-button", function(){
        let indexRemove = $(this).attr("button-index");

        trains.splice(indexRemove,1);
        createSchedule(trains);
        localStorage.setItem("trainSchedule", JSON.stringify(trains));
    });

    function createSchedule(arr) {

        $("tbody").empty();

        let index = 0;

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

            let newMoment = moment(obj.nextMoment);
            obj.nextMoment = newMoment;
            obj.minutesAway = minutesAway(obj);

            
            let tNext = $("<td>");
            tNext.text(obj.nextTrain);
            let tAway = $("<td>");
            tAway.text(obj.minutesAway);

            let tRemove = $("<td>");
            tRemove.append(`<button type='remove' id='remove-button' button-index=${index}>Remove</button>`);

            tRow.append(tName, tDest, tFirst, tFreq, tNext, tAway, tRemove);
            $("tbody").append(tRow);
            index++;
        });

    }

    function minutesAway(obj) {
        let currentTime = moment();
        let minutesAway = moment.duration(obj.nextMoment.diff(currentTime, "m"), "m")._milliseconds / 60000;

        while (minutesAway <= 0) {
            obj.nextMoment = obj.nextMoment.add(obj.frequency, "m");
            minutesAway = moment.duration(obj.nextMoment.diff(currentTime, "m"), "m")._milliseconds / 60000;
            obj.nextTrain = obj.nextMoment.format("HH:mm");
        };


        return minutesAway;
    }

    

    //An array of objects that wiore train information. We want to pull it from local storage and parse it so it becomes an array again.
    let trains = JSON.parse(localStorage.getItem("trainSchedule"));


    //If there's nothing in the local storage to begin with, we create an empty array
    if (!Array.isArray(trains)) {
        trains = [];
    }


    //Because of the parsing of local storage, the Moment object stored in each trains array element comes out as a 
    //string showing Zulu time. So we need to reassign each object's nextMoment property as a new Moment object so it can
    //be utilized in the createSchedule function
    if (trains.length > 0) {

        trains.forEach(function (obj) {

            let newMoment = moment(obj.nextMoment);
            obj.nextMoment = newMoment;
        });
    }
    //We want the table to show everything with current or no storage.
    createSchedule(trains);

  
    
});