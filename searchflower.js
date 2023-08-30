import { seeingFlowers, flowers } from "./database.js";
import { startSite } from "./aplikacja.js";

// guziki szukajace rosliny
document.querySelector('.js-button-search')
    .addEventListener('click', () => {
    searchFlower();
    document.querySelector('.js-search-input')
        .value = '';
});

document.querySelector('.js-search-input')
    .addEventListener('keydown', (Event) => {
        if (Event.key === 'Enter') {
            searchFlower();
            document.querySelector('.js-search-input')
                .value = '';
        }
    });
//

// funkcja szukajaca rosliny
function searchFlower() {
    let flowerName = document.querySelector(`.js-search-input`).value;
    let t = 1;

    flowers.forEach(flower => {
        if (flower.name === flowerName) {
            seeingFlowers.length = 0;
            seeingFlowers.push(flower.id);
            t = 0;
        } 
    })

    if (t) {
        seeingFlowers.length = 0;
        flowers.forEach(flower => {
            seeingFlowers.push(flower.id);
        })
    }
    startSite();
}
//