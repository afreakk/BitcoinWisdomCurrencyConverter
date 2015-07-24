function getRates(onComplete)
{
    var xmlhttp = new XMLHttpRequest();
    var url = "https://api.fixer.io/latest";
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var myArr = JSON.parse(xmlhttp.responseText);
            onComplete(myArr);
        }
    }
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}
