var searchForm = $('#search-form');
var previousResults = [];

function updateResults(event) {
    event.preventDefault();

    var searchTarget = $('input[name="form-city-name"]').val();

    console.log(searchTarget);

    if (!searchTarget) {
        alert('No city entered in the text box!');
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
}

function initalizeFromLocalStorage() {
    var storedData = JSON.parse(localStorage.getItem("searched-Towns-and-Cities"));
    if (!storedData) {
        return;
    }
    previousResults = storedData;
    console.log(previousResults);

    //call function to refresh search history buttons.
}

initalizeFromLocalStorage();

searchForm.on('submit', updateResults);