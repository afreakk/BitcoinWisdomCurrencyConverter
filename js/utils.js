function removeAdBar()
{
    var leftBar = document.getElementById("leftbar_outer");
    leftBar.parentNode.removeChild(leftBar);
}

function getChartCurrency()
{
    var slashIdx = document.title.indexOf('/');
    return document.title.substring(slashIdx+1,slashIdx+4);
}
