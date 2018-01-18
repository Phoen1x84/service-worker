function getBeers() {
    fetch('https://api.punkapi.com/v2/beers/1')
        .then((response) => response.json())
        .then((data) => {
            console.log(data)
        })
        .catch((error) => console.log(error))
}

const showBeer = getBeers();