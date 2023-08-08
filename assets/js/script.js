
$(function() {
    //variables for elements with specific ids.
    var searchForm = $("#search-form");
    var searchHistory = $("#history");
    var searchResult = $("#result");
    var formTextField = $("#form-city-name")

    //variable array for search history.
    var previousResults = [];

    //store the url and api key in a variable.
    var requestUrl = "https://api.openweathermap.org/data/2.5/forecast?";
    var key = "&appid=fdd1b1aa6ab52d23edf2439289749e1e";

    //render the search history.
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

    //determine the weather symbol to display.
    function getWeatherSymbol(forecast) {
        if (forecast.main == "Clear") {
            return "☀️";
        }
        else if (forecast.id == 801 || forecast.id == 802) {
            return "⛅️";
        }
        else if (forecast.id == 803 || forecast.id == 804) {
            return "☁";
        }
        else if (forecast.main == "Thunderstorm") {
            return "🌩";
        }
        else if (forecast.main == "Snow" || forecast.id == 511) {
            return "🌨";
        }
        else if (forecast.main == "Drizzle" || forecast.main == "Rain") {
            return "🌧";
        }
        else {
            return "🌫";
        }
    }

    //generate the cards that appear under the 5 day forecast text based off the provided info.
    function generateCustomCard(divRowEl, listInfo) {
        //create the elemnets for the card.
        var cardDivEl = $("<div>");
        cardDivEl.addClass("custom-card full-width");

        var cardBodyEL = $("<div>");
        cardBodyEL.addClass("card-body custom-background")

        var date = dayjs(listInfo.dt_txt).format("M/D/YYYY");

        var firstP = $("<p>");
        firstP.addClass("bold");
        firstP.text(date);

        var secondP = $("<p>");
        secondP.text(getWeatherSymbol(listInfo.weather[0]));

        var thirdP = $("<p>");
        thirdP.addClass("card-text");
        thirdP.text("Temp: " + listInfo.main.temp + "°F");

        var fourthP = $("<p>");
        fourthP.addClass("card-text");
        fourthP.text("Wind: " + listInfo.wind.speed);

        var fifthP = $("<p>");
        fifthP.addClass("card-text");
        fifthP.text("Humidity: " + listInfo.main.humidity + "%");

        //append it all to the row div.
        cardBodyEL.append(firstP);
        cardBodyEL.append(secondP);
        cardBodyEL.append(thirdP);
        cardBodyEL.append(fourthP);
        cardBodyEL.append(fifthP);

        cardDivEl.append(cardBodyEL);

        divRowEl.append(cardDivEl);
    }

    //populate the result section.
    function getWeather(requestUrl) {

        fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {

            //do the first card (current day)
            var firstResult = data.list[0];

            var firstCardDivEl = $("<div>");
            firstCardDivEl.addClass("card full-width border-dark");

            var firstCardBody = $("<div>");
            firstCardBody.addClass("card-body");

            var firstCardTitle = $("<h2>");
            firstCardTitle.addClass("display-6 card-title bold mb-3");
            
            var firstWeatherSymbol = getWeatherSymbol(firstResult.weather[0]);
            
            var firstDate = dayjs(firstResult.dt_txt).format("M/D/YYYY");
            firstCardTitle.text(data.city.name + " (" + firstDate + ") " + firstWeatherSymbol);
            
            //create the 3 paragraph elements inside the card body.
            var firstCardFirstP = $("<p>");
            firstCardFirstP.addClass("card-text");
            firstCardFirstP.text("Temp: " + firstResult.main.temp + "°F");

            var firstCardSecondP = $("<p>");
            firstCardSecondP.addClass("card-text");
            firstCardSecondP.text("Wind: " + firstResult.wind.speed);

            var firstCardThirdP = $("<p>")
            firstCardThirdP.addClass("card-text");
            firstCardThirdP.text("Humidity: " + firstResult.main.humidity + "%");

            //create the text above the next sections.
            var cardDivider = $("<p>");
            cardDivider.addClass("fs-4 bold");
            cardDivider.text("5-Day Forecast:");

            //append the new elements to the result section.
            firstCardBody.append(firstCardTitle);
            firstCardBody.append(firstCardFirstP);
            firstCardBody.append(firstCardSecondP);
            firstCardBody.append(firstCardThirdP);

            firstCardDivEl.append(firstCardBody);

            searchResult.append(firstCardDivEl);
            searchResult.append(cardDivider);

            //create a row div that the next cards will be appended to.
            var divRowEl = $("<div>");
            divRowEl.addClass("row");

            //do the next 4 cards.
            for (var i = 8; i < data.list.length; i+=8) {
                var result = data.list[i];
                
                generateCustomCard(divRowEl, result);
            }
            //do a final card for the final day.
            var finalResult = data.list[data.list.length - 1];
            
            generateCustomCard(divRowEl, finalResult);

            searchResult.append(divRowEl);
        });
        
    }

    //get the cordinates from the location name then update the search history and then call a function
    //to update the reulst section.
    function getCoords(value) {
        //create variable to get the longitude and latitude of the inputted city.
        var fullRequestUrl = requestUrl + "q=" + value + key;

        //create variables for the next call that will be made.
        var lat;
        var lon;
        
        fetch(fullRequestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            //check if actual location that was found.
            if(data.cod != 200) {
                alert("Location not found");
                actualCity = false;
                return;
            }
            //update the array and local storage.
            var indexOfLocation = previousResults.indexOf(value);

            if (indexOfLocation === -1) {
                //limit the results to only 10 at most.
                if(!(previousResults.length < 10)) {
                    previousResults.pop();
                }
            }
            else {
                //Went to https://stackoverflow.com/questions/9792927/javascript-array-search-and-remove-string to figure out how to remove a
                //specific element in an array.  Also credited in the README file.
                /*Rolando, Tyrannas, Rob W, enesn, qwertymk, Matt, siva gopi, Ali Soltani, Eliav Louski, hvgotcodes, Ben Clayton, Pawan  
                    Dhangar, chepe263, &amp; dpmemcry. (2012, March 20). Javascript array search and remove string?. Stack Overflow. 
                    https://stackoverflow.com/questions/9792927/javascript-array-search-and-remove-string */
                //remove it from the location from the array.
                previousResults.splice(indexOfLocation, 1);
            }
            
            //add the value to the start of the array then store it in local storage.
            previousResults.unshift(value);

            localStorage.setItem("searched-Towns-and-Cities", JSON.stringify(previousResults));

            searchHistory.empty();
            renderSearchHistory();

            
            //reset the search result section.
            searchResult.empty();

            //get the values for the new url and call the function to populate the result section.
            lat = data.city.coord.lat;
            lon = data.city.coord.lon;
            var locationRequestUrl = requestUrl + "units=imperial&lat=" + lat + "&lon=" + lon + key;
            getWeather(locationRequestUrl);
        });
    }

    //get the text in the input field then call the unction to populate the results and section a
    function getFormText(event) {
        event.preventDefault();

        var searchTarget = formTextField.val();


        if (!searchTarget) {
            alert("No city entered in the text box!");
            return;
        }

        //call a function to display the results.
        getCoords(searchTarget);

        //remove text from the form field
        formTextField.val("");
    }

    //create a function for on click event for search history buttons.
    function getButtonText (event) {
        var buttonText = $(event.target).text();

        //call function to display the results.
        getCoords(buttonText);
    }

    //this gets the values from local storage then populates the history section.
    function initalizeFromLocalStorage() {
        var storedData = JSON.parse(localStorage.getItem("searched-Towns-and-Cities"));
        if (!storedData) {
            return;
        }
        previousResults = storedData;

        //call function to refresh search history buttons.
        renderSearchHistory();
    }

    initalizeFromLocalStorage();

    searchForm.on("submit", getFormText);
    searchHistory.on("click", ".custom-secondary-btn", getButtonText);
});