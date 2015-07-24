function getRates(callback)
{
    var xmlhttp = new XMLHttpRequest();
    var url = "https://api.fixer.io/latest";
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var myArr = JSON.parse(xmlhttp.responseText);
            retrieveData(myArr);
        }
    }
    xmlhttp.open("GET", url, true);
    xmlhttp.send();

    function retrieveData(data) {
        fx.base = "EUR";
        fx.rates = data.rates;
        callback();
    }
}
