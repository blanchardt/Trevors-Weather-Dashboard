
$(function() {
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

    function getWeather(requestUrl) {
        console.log(requestUrl);

        fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);

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
                var cardDivEl = $("<div>");
                cardDivEl.addClass("custom-card full-width");

                var cardBodyEL = $("<div>");
                cardBodyEL.addClass("card-body custom-background")

                var date = dayjs(result.dt_txt).format("M/D/YYYY");

                var firstP = $("<p>");
                firstP.addClass("bold");
                firstP.text(date);

                var secondP = $("<p>");
                secondP.text(getWeatherSymbol(result.weather[0]));

                var thirdP = $("<p>");
                thirdP.addClass("card-text");
                thirdP.text("Temp: " + result.main.temp + "°F");

                var fourthP = $("<p>");
                fourthP.addClass("card-text");
                fourthP.text("Wind: " + result.wind.speed);

                var fifthP = $("<p>");
                fifthP.addClass("card-text");
                fifthP.text("Humidity: " + result.main.humidity + "%");

                //append it all to the row div.
                cardBodyEL.append(firstP);
                cardBodyEL.append(secondP);
                cardBodyEL.append(thirdP);
                cardBodyEL.append(fourthP);
                cardBodyEL.append(fifthP);

                cardDivEl.append(cardBodyEL);

                divRowEl.append(cardDivEl);
            }
            //do a final card for the final day.
            var finalResult = data.list[data.list.length - 1];
            var finalCardDivEl = $("<div>");
            finalCardDivEl.addClass("custom-card full-width");

            var finalCardBodyEL = $("<div>");
            finalCardBodyEL.addClass("card-body custom-background")

            var finalDate = dayjs(finalResult.dt_txt).format("M/D/YYYY");

            var finalCardFirstP = $("<p>");
            finalCardFirstP.addClass("bold");
            finalCardFirstP.text(finalDate);

            var finalCardSecondP = $("<p>");
            finalCardSecondP.text(getWeatherSymbol(finalResult.weather[0]));

            var finalCardThirdP = $("<p>");
            finalCardThirdP.addClass("card-text");
            finalCardThirdP.text("Temp: " + finalResult.main.temp + "°F");

            var finalCardFourthP = $("<p>");
            finalCardFourthP.addClass("card-text");
            finalCardFourthP.text("Wind: " + finalResult.wind.speed);

            var finalCardFifthP = $("<p>");
            finalCardFifthP.addClass("card-text");
            finalCardFifthP.text("Humidity: " + finalResult.main.humidity + "%");

            //append it all to the row div.
            finalCardBodyEL.append(finalCardFirstP);
            finalCardBodyEL.append(finalCardSecondP);
            finalCardBodyEL.append(finalCardThirdP);
            finalCardBodyEL.append(finalCardFourthP);
            finalCardBodyEL.append(finalCardFifthP);

            finalCardDivEl.append(finalCardBodyEL);

            divRowEl.append(finalCardDivEl);

            searchResult.append(divRowEl);

            console.log(data.list[data.list.length - 1]);
            console.log(data.city.name);
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
            var locationRequestUrl = requestUrl + "units=imperial&lat=" + lat + "&lon=" + lon + key;
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

    getCoords("hooksett");
});