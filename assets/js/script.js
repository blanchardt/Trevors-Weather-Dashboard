var searchForm = $("#search-form");
var searchHistory = $("#history");
var previousResults = [];

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

function updateResults(event) {
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

searchForm.on('submit', updateResults);