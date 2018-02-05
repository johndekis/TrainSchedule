// set up firebase
var config = {
    apiKey: "AIzaSyA10kA-jjuAcBSzcE9cBDX4YicHJmOxy5Q",
    authDomain: "cool-train-schedule.firebaseapp.com",
    databaseURL: "https://cool-train-schedule.firebaseio.com",
    projectId: "cool-train-schedule",
    storageBucket: "cool-train-schedule.appspot.com",
    messagingSenderId: "167200157376"
  };
  
firebase.initializeApp(config);
  
var database = firebase.database();



//click function
$("#submitBtn").on("click", function(event) {
    event.preventDefault();
    var name        = $("#name").val().trim();
    var destination = $("#destination").val().trim();
    var frequency   = $("#frequency").val().trim();
    var firstTT     = $("#firstTT").val().trim();  

    console.log(name);
    console.log(destination);
    console.log(frequency);
    console.log(firstTT);

    var addTrain = {
        name: name,
        destination: destination,
        frequency: frequency,
        firstTT: firstTT
    }

    //pushing addTrain Object to firebase 
    database.ref().push(addTrain);
   
    //set values to blank string to clear inputs
    $("#name").val("");
    $("#destination").val("");
    $("#frequency").val("");
    $("#firstTT").val("");


});


//function to calculate times when child is added to database
database.ref().on("child_added", function(childSnapshot, prevChildKey) {
    //alternate variables for handling info after it is in firebase
    var nameRef = childSnapshot.val().name;
    var destinationRef = childSnapshot.val().destination;
    var frequencyRef = childSnapshot.val().frequency;
    var firstRef = childSnapshot.val().firstTT;
    

    
    // First Time (pushed back 1 year to make sure it comes before current time) 
    var startTimeConverted = moment(firstRef, "hh:mm").subtract(1, "years");
       
    //var now = moment();
   // console.log("CURRENT TIME: " + moment(now).format("hh:mm"));
    
    //difference between times
    var diffTime = moment().diff(moment(startTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);
  
    // Time apart (remainder)
    var tRemainder = diffTime % frequencyRef;
    console.log("T REMAINDER:" + tRemainder);
  
    // Minute Until Train
    var tMinutesTillTrain = frequencyRef - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);
  
    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));


    $("#display").append("<tr><td> " + nameRef +  
        " </td><td> " + destinationRef + 
        " </td><td> " + frequencyRef + 
        " </td><td> " + moment(nextTrain).format("hh:mm") + 
        " </td><td> " + tMinutesTillTrain + 
        " </td></tr>");
   
      // Handle the errors
  }, function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
  });


