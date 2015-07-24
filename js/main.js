var FromCurrency, ToCurrency, MutationObserver, decimals;
function init(chosenCurrency, decimalAmnt)
{
    var orderbook = document.getElementById("orderbook");
    if(!orderbook)
        return;
    decimals = decimalAmnt;
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
            Do not convert because alarmZ on bitcoinwisdom uses this value,
            and i think i like it this way better anywayz, so u can see a value
            in charts original currency
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

function main(){
    chrome.storage.sync.get({
        "currency": "EUR",  //defaultvalue
        "decimals": "2"
    }, function(items) {
        getRates(function(data){
            fx.base = data.base;
            fx.rates = data.rates;
            init(items.currency, items.decimals);
        });
    });
}

//begin app
main();
