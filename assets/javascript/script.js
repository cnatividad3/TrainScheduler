// Initialize Firebase
var config = {
	apiKey: "AIzaSyBnBbXuz6bOkicmx4R3T4qWfpImXR1nYkk",
	authDomain: "trainscheduler-972de.firebaseapp.com",
	databaseURL: "https://trainscheduler-972de.firebaseio.com",
	projectId: "trainscheduler-972de",
	storageBucket: "trainscheduler-972de.appspot.com",
	messagingSenderId: "356968180985"
};
firebase.initializeApp(config);

var database = firebase.database();


// variables
var trainName = "";
var destination = "";
var firstTrain = "";
var frequency = 0;
var firstTrainConverted = 0;
var timeDifference = 0;
var remainder = 0;
var minutesAway = 0;
var nextTrain = "";


// nextArrival Function
function nextArrival() {


	firstTrainConverted = moment(firstTrain, "hh:mm").subtract(1, "years");


	timeDifference = moment().diff(moment(firstTrainConverted), "minutes");
	console.log(timeDifference);

	remainder = timeDifference % frequency;
	console.log(remainder);

	minutesAway = frequency - remainder;
	console.log("minutes away: " + minutesAway);

	nextTrain = moment().add(minutesAway, "minutes");
	nextTrain = moment(nextTrain).format("hh:mm");
	console.log("arrival time " + nextTrain);



}


// Submit on click event
$("#add-train").on("click", function (event) {
	event.preventDefault();

	trainName = $("#train-input").val().trim();
	destination = $("#destination-input").val().trim();
	firstTrain = $("#time-input").val().trim();
	frequency = $("#frequency-input").val();
	console.log(trainName);
	console.log(destination);
	console.log(firstTrain);
	console.log(frequency);

	nextArrival();

	database.ref().push({
		name: trainName,
		destination: destination,
		frequency: frequency,
		first: firstTrain

	});

});


//Initial Load 
database.ref().on("child_added", function (snap) {

	firstTrain = snap.val().first;
	frequency = snap.val().frequency;
	nextArrival();

	$("#train-schedule").append("<tr><td>" + snap.val().name +
		"</td><td>" + snap.val().destination +
		"</td><td>" + snap.val().frequency +
		"</td><td>" + nextTrain +
		"</td><td>" + minutesAway + "</td></tr>");

	// Handle the errors
}, function (errorObject) {
	console.log("Errors handled: " + errorObject.code);
});