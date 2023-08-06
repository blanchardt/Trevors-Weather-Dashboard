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