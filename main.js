var FromCurrency, ToCurrency, MutationObserver;
var decimals = 2;
function init(chosenCurrency)
{
    var orderbook = document.getElementById("orderbook");
    if(!orderbook)
        return;
    FromCurrency = getChartCurrency();
    ToCurrency = chosenCurrency;
    if(FromCurrency == ToCurrency)
        return;

    // define what element should be observed by the observer
    // and what types of mutations trigger the callback
    MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
    var observer = new MutationObserver(observerFunction);
    observer.observe(orderbook, {
      subtree: true,
      attributes: true,
      childList: true
    });

    removeAdBar();
}

function observerFunction(mutations, observer) {
    mutations.forEach(function(mutation){
        if(mutation.target.className == "table"){
            var childs = mutation.target.querySelectorAll("div");
            for(var i=0; i<childs.length; i++){
                var price = childs[i].getElementsByClassName("price")[0];
                if( !~price.innerHTML.indexOf(ToCurrency) &&
                    ~price.innerHTML.indexOf("<g>"))
                {
                    price.innerHTML = parseOrderBookPrices(price);
                    price.innerHTML = price.innerHTML + ToCurrency;
                }
            }
        }
        else if(mutation.target.id=="price" &&
                mutation.target.innerHTML.indexOf(ToCurrency))
        {
            /*
            mutation.target.innerHTML = parseMainPrice(mutation.target);
            mutation.target.innerHTML = mutation.target.innerHTML + ToCurrency;
            Do not convert because of alarmZ wont work then
            */
        }
    });
}

function parseMainPrice(priceDiv)
{
    price = priceDiv.innerHTML;
    price = fx.convert(parseFloat(price), {from: FromCurrency, to: ToCurrency});
    return price.toFixed(decimals);
}
function parseOrderBookPrices(priceDiv)
{
    price = priceDiv.innerHTML;
    var wholePrice;
    if(~price.indexOf("<h>"))
    {
        var beforeDecimal = price.substring(price.indexOf("<h>")+3, price.indexOf("</h>"));
        var afterDecimal = price.substring(price.indexOf("</h>")+4, price.indexOf("<g>"));
        wholePrice = beforeDecimal+afterDecimal;
    }
    else {
        wholePrice = price.substring(0, price.indexOf("<g>"))
    }
    price = fx.convert(parseFloat(wholePrice), {from: FromCurrency, to: ToCurrency});
    return price.toFixed(decimals);
}

function main(chosenCurrency){
    getRates(function(){
        init(chosenCurrency);
    });
}
main("EUR");
