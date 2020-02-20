const socket = io.connect('http://localhost:8080')

function getMaxBuyer(stock) {
    return stock.bids.reduce(function (a, b) {
        return Math.max(a.buy, b.buy);
    });
}

function filterAndSort(stock, action) {
    let processedBids
    // Filtrera ut köp- eller säljbud
    processedBids = stock.bids.filter((bid) => {
        return bid.action == action
    })

    // Sortera fallande om buy, stigande om sell.
    processedBids.sort((a, b) => {
        if (action == "buy")
            return a.buy > b.buy ? 1 : -1
        else
            return a.sell > b.sell ? -1 : 1
    })
    return processedBids
}

document.addEventListener('DOMContentLoaded', () => {
    // DOM
    let tabell = document.getElementById('lista')
    let select = document.getElementById('aktie')
    let antal = document.getElementById('antal')
    let kurs = document.getElementById('kurs')
    let buyBtn = document.getElementById('buy')
    let sellBtn = document.getElementById('sell')
    let messageArea = document.getElementById('messageArea')

    socket.on('aktuell lista', (stocks) => {
        // Nollställ lista/tabell
        tabell.innerHTML = ""
        select.innerHTML = ""

        stocks.forEach(stock => {
            let tabellrad = document.createElement('tr')

            let highestBuyer = filterAndSort(stock, "buy")
            let highestSeller = filterAndSort(stock, "sell")

            // Kolla om det finns värden i arrayerna
            /* USCH, vilken urdålig kod. Måste gå att skriva mycket bättre!!!!
            ...men den fungerar i alla fall. */

            if (highestBuyer.length == 0)
                highestBuyer = "-"
            else
                highestBuyer = highestBuyer[0].value

            // Kolla om det finns värden i arrayerna
            if (highestSeller.length == 0)
                highestSeller = "-"
            else
                highestSeller = highestSeller[0].value

            tabellrad.innerHTML =
                `<td>${stock.name}
                <td>${highestBuyer}
                <td>${highestSeller}</tr>`
            tabell.appendChild(tabellrad)

            // Populera selecten.
            let option = document.createElement('option')
            option.value = stock.id
            option.innerText = stock.name
            select.appendChild(option)
        });

        buyBtn.addEventListener('click', () => {
            // Hämta inlagda bud för rätt aktie.
            let matchingStock = stocks.find((stock) => {
                return stock.id == select.options[select.selectedIndex].value
            })

            console.log(matchingStock)
            // Kolla om det finns en matchning, sett till kurs.
            if (matchingStock.id != '') {
                let match = matchingStock.bids.find((bid) => {
                    return (bid.value == kurs.value && bid.action == 'sell')
                })
                // Fanns det en match?
                if (match != undefined) {
                    messageArea.innerText = "Köpet är genomfört."
                    // Ta bort det aktuella budet, eller minska det med så många aktier.
                    let removeIndex = matchingStock.bids.findIndex((bid) => {
                        return bid.id == match.id
                    })
                    let stockIndex = stocks.findIndex((stock) => {
                        return stock.id == matchingStock.id
                    })
                    console.log(match)
                    console.log(antal.value)
                    if (antal.value < match.antal) {
                        match.antal = match.antal - antal.value
                        console.log(stocks)
                        stocks[stockIndex].bids.splice(removeIndex, 1, match)
                    }
                    if (antal.value >= match.antal) {
                        // Ta bort sälj-ordern
                        stocks[stockIndex].bids.splice(removeIndex, 1);
                    }

                }
            }
            // Om inte, placera det nya budet i stocks-arrayen, i rätt aktie.
            else {
                socket.emit('new bid', {
                    action: "buy",
                    value: kurs.value,
                    antal: antal.value
                })
            }
            // Skriv över den gamla filen.
            socket.emit('write to file', stocks)
        })
    })
})