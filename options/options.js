// Saves options to chrome.storage
function save_options() {
    var currency = document.getElementById("currency").value;
    var decimals = document.getElementById("decimals").value;
    chrome.storage.sync.set({
        "currency": currency,
        "decimals": decimals
    }, function() {
        // Update status to let user know options were saved.
        var status = document.getElementById("status");
        status.textContent = "Options saved.";
        setTimeout(function() {
            status.textContent = '';
        }, 750);
    });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
    getRates(function(data)
    {
        var selector = document.getElementById("currency");

        var option = document.createElement("option");
        option.text = data.base; //adding basecurrency
        selector.add(option);

        for(var rate in data.rates)
        {
            var option = document.createElement("option");
            option.text = rate;
            selector.add(option);
        }
        chrome.storage.sync.get({
            "currency": "EUR",  //defaultvalues
            "decimals": '2'
        }, function(items) {
            selector.value = items.currency;
            document.getElementById("decimals").value = items.decimals;
        });
    });
}
document.addEventListener("DOMContentLoaded", restore_options);
document.getElementById("save").addEventListener("click", save_options);
