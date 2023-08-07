//variables for elements with specific ids.
var searchForm = $("#search-form");
var searchHistory = $("#history");
var searchResult = $("#result");

//variable array for search history.
var previousResults = [];

//store the url and api key in a variable.
var requestUrl = "https://api.openweathermap.org/data/2.5/forecast?";
var key = "&appid=fdd1b1aa6ab52d23edf2439289749e1e";

function renderSearchHistory() {
    //create a button in a div element for each result in the array called previousResults.
    for(var i = 0; i < previousResults.length; i++) {
        var divEl = $("<div>");
        divEl.addClass("mb-3");

        var buttonEl = $("<button>");
        buttonEl.addClass("btn custom-secondary-btn full-width fs-5");
        buttonEl.text(previousResults[i]);

        //append the div and the button to the history div.
        divEl.append(buttonEl);
        searchHistory.append(divEl);
    }
}

function getWeather(requestUrl) {
    console.log(requestUrl);

    fetch(requestUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        console.log(data);
      });
}

function getCoords(value) {
    //create variable to get the longitude and latitude of the inputted city.
    var fullRequestUrl = requestUrl + "q=" + value + key;
    console.log(fullRequestUrl);

    //create variables for the next call that will be made.
    var lat;
    var lon;
    
    fetch(fullRequestUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        if(data.cod != 200) {
            alert("Location not found");
            actualCity = false;
            return;
        }
        lat = data.city.coord.lat;
        lon = data.city.coord.lon;
        console.log(data);
        console.log(lat);
        console.log(lon);
        var locationRequestUrl = requestUrl + "lat=" + lat + "&lon=" + lon + key;
        getWeather(locationRequestUrl);
      });
  }

function updateResultsForm(event) {
    event.preventDefault();

    var searchTarget = $('input[name="form-city-name"]').val();

    console.log(searchTarget);

    if (!searchTarget) {
        alert("No city entered in the text box!");
        return;
    }

    //call a function to display the results.


    //add the input to the array and save it to local storage.
    //limit the results to only 10 at most.
    if(previousResults.length < 10) {
        previousResults.unshift(searchTarget);
    }
    else {
        previousResults.pop();
        previousResults.unshift(searchTarget);
    }
    console.log(previousResults);

    localStorage.setItem("searched-Towns-and-Cities", JSON.stringify(previousResults));

    //call function to refresh search history buttons.
    searchHistory.empty();
    renderSearchHistory();

}

//create a function for on click event for search history buttons.
function updateResultsHistory (event) {
    var buttonText = $(event.target).text();

    //update the array and localstorage.
    //went to https://stackoverflow.com/questions/9792927/javascript-array-search-and-remove-string to figure out how to remove a
    //specific element in an array.  Also credited in the README file.
    previousResults.splice(previousResults.indexOf(buttonText), 1);

    previousResults.unshift(buttonText);

    localStorage.setItem("searched-Towns-and-Cities", JSON.stringify(previousResults));

    //call function to display the results.

    searchHistory.empty();
    renderSearchHistory();
}

function initalizeFromLocalStorage() {
    var storedData = JSON.parse(localStorage.getItem("searched-Towns-and-Cities"));
    if (!storedData) {
        return;
    }
    previousResults = storedData;
    console.log(previousResults);

    //call function to refresh search history buttons.
    renderSearchHistory();
}

initalizeFromLocalStorage();

searchForm.on("submit", updateResultsForm);
searchHistory.on("click", ".custom-secondary-btn", updateResultsHistory);

getCoords("boston");