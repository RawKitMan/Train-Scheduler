$(document).ready(function () {

    //We need to create two Moment.js variables to hold our train information. One for the first train and another
    //for when the next arrival is
    let firstT = moment();
    let nextT = moment(firstT);

    //When a user submits the train information...
    $("#submit-button").on("click", function () {

        //We don't want to....submit...anything
        event.preventDefault();

        //We want to grab the the time of the first train and frequency in minutes
        const firstTrain = $("#first-time").val().trim();
        const frequency = $("#frequency").val().trim()

        //Parse out the Hours and Minutes
        const firstHour = parseInt(firstTrain.substr(0, 2));
        const firstMinutes = parseInt(firstTrain.substr(3, 2));
        
        //Set the time for the firstT Moment.js object for the first train.
        firstT.hours(firstHour);
        firstT.minutes(firstMinutes);

        //Set the time of the next train based on the first train and it's frequency
        nextT = moment(firstT).add(frequency, "m");

        //We want to store all of this train information in an object
        var trainInfo = {
            name: $("#train-name").val().trim(),
            destination: $("#destination").val().trim(),
            firstTrain: firstT.format("HH:mm"),
            frequency: frequency,
            nextMoment: nextT,
            nextTrain: nextT.format("HH:mm")
        };

        //Clear the text boxes
        $("#train-name").val("");
        $("#destination").val("");
        $("#first-time").val("");
        $("#frequency").val("");


        //We need to know how much longer it is until the next train. We call the minutesAway function for that
        //and add it to the above object
        trainInfo.minutesAway = minutesAway(trainInfo);

        //push the object into an array for each train so it can be saved in local storage
        trains.push(trainInfo);
        localStorage.setItem("trainSchedule", JSON.stringify(trains));

        //Now we call the function to add all of the trains to the table on the page.
        createSchedule(trains);

    });

    //When the Remove button is clicked for a particular train, we remove it completely from the table.
    $(document).on("click","#remove-button", function(){

        let indexRemove = $(this).attr("button-index");

        trains.splice(indexRemove,1);
        createSchedule(trains);
        localStorage.setItem("trainSchedule", JSON.stringify(trains));
    });

    //Function to create the table on the webpage referencing an array of objects
    function createSchedule(arr) {

        //First we clear all of the table rows
        $("tbody").empty();

        //This variable will be used in an attribute to help with the remove function listed earlier
        let index = 0;

        //Appending a row of each object's information to the table body
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

            //We want to update the time until the next train whenever this function is called. We need to create a 
            //new Moment.js object since if we parse from local storage (done later), the Moment.js object becomes a string
            //showing the Zulu time. So we set up a new Moment.js object with the time set as the zulu time.
            let newMoment = moment(obj.nextMoment);
            obj.nextMoment = newMoment;
            obj.minutesAway = minutesAway(obj);

            
            let tNext = $("<td>");
            tNext.text(obj.nextTrain);
            let tAway = $("<td>");
            tAway.text(obj.minutesAway);

            //This button is given an attribute 'button-index' so we know which element in the trains array to splice when the
            //remove button is clicked
            let tRemove = $("<td>");
            tRemove.append(`<button type='remove' id='remove-button' button-index=${index}>Remove</button>`);

            tRow.append(tName, tDest, tFirst, tFreq, tNext, tAway, tRemove);
            $("tbody").append(tRow);

            //increment the index for each element in the array
            index++;
        });

    }

    //Function to compare the difference in time between the next train time and the current time
    function minutesAway(obj) {
        let currentTime = moment();
        let minutesAway = moment.duration(obj.nextMoment.diff(currentTime, "m"), "m")._milliseconds / 60000;

        //If the current time is past the point when the next train comes, then we want to update the next train time until we get
        //to a point where the current time is before the next train.
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