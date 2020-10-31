const inputs = document.querySelectorAll(".input");
function addcl() {
	let parent = this.parentNode.parentNode;
	parent.classList.add("focus");
}
function remcl() {
	let parent = this.parentNode.parentNode;
	if (this.value == "") {
		parent.classList.remove("focus");
	}
}
inputs.forEach(input => {
	input.addEventListener("focus", addcl);
	input.addEventListener("blur", remcl);
});

/* Global Variables */
const  baseURL = 'http://api.openweathermap.org/data/2.5/weather?zip='
const  apiKey = '&appid=955dc70a311402292b232a508b99db7f';
const  unitView = '&units=metric';

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getDate() + '-' + d.getMonth() + '-' + d.getFullYear();

// create event for btn
document.getElementById('generate').addEventListener('click', performAction);
function performAction(e) {
	e.preventDefault();
	// input values
	const newZip = document.getElementById('zip').value;
	const content = document.getElementById('feelings').value;

	getWeather(baseURL, newZip, apiKey)
		.then(function (userData) {
			// add data to POST request
			postData('/add', { temp: userData, date: newDate, content: content })
		}).then(function (newData) {
			// call updateUI to update browser content
			updateUI()
		})
}

/* Function to GET Web API Data*/
const getWeather = async (baseURL, newZip, apiKey) => {
	// respond the fatching data from the url with api
	const res = await fetch(baseURL + newZip  + apiKey + unitView);
	try {
		// return farching data
		const userData = await res.json();
		return userData;
	} catch (error) {
		// appropriately handle the error
		console.log("error", error);
	}
}

/* Function to POST data */
const postData = async (url = '', data = {}) => {
	const response = await fetch(url, {
		method: 'POST', // *GET, POST, PUT, DELETE, etc.
		credentials: 'same-origin', // include, *same-origin, omit
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data), // body data type must match "Content-Type" header
	});
	try {
		const newData = await response.json();
		return newData
	} catch (error) {
		// appropriately handle the error
		console.log("error", error);
	}
};

// get data
const updateUI = async () => {
	const request = await fetch('/all');
	try {
		const allData = await request.json()
		// update new entry values
		console.log(allData);
		document.getElementById('country').innerHTML = 'Country: ' + allData.temp.sys.country;
		document.getElementById('weather').innerHTML = 'Weather: ' + allData.temp.weather[0].description;
		document.getElementById('city').innerHTML = 'City: ' + allData.temp.name;
		document.getElementById('temp').innerHTML = 'Temperature: ' + allData.temp.main.temp;
		document.getElementById('date').innerHTML = 'Date: ' + allData.date;
		document.getElementById('content').innerHTML = 'Feelings: ' + allData.content;
	}
	catch (error) {
		// appropriately handle the error
		console.log("error", error);
		document.getElementById('date').innerHTML = 'Zip Code Not Found';
		document.getElementById('content').innerHTML = '';
		document.getElementById('city').innerHTML = '';
		document.getElementById('temp').innerHTML = '';
		document.getElementById('country').innerHTML ='';
		document.getElementById('weather').innerHTML ='';
	}
};
