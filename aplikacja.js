// pobieranie danych
import { flowers } from "./database.js";
let seeingFlowers = [];
//

export function startSite() {
// ustawianie zooma na stronie
function setZoomTo90Percent() {
    const bodyElement = document.body;
    bodyElement.style.zoom = "90%";
}

window.onload = function () {
    setZoomTo90Percent();
};
//

// wyswitlanie HTML na stronie
let HTML = '';
flowers.forEach((flower) => {
    HTML += htmlReturn(flower);
    seeingFlowers.push(flower.id);
});
document.querySelector('.js-main-grid')
    .innerHTML = HTML;
//

// sprawdzanie czy rosliny potrzebuja wody (uploadowanie co 1s)
water();

setInterval(() => {
    water();
    localStorage.setItem('flowers', JSON.stringify(flowers));
}, 1000);
//

// guziki na stronie
    // guzik "podlewajacy" rosline
    document.querySelectorAll('.js-water-button')
        .forEach((button) => {
            button.addEventListener('click', () => {
                const { flowerId } = button.dataset;
            
                const removeBackgroundColor = document.querySelector(`.js-flowers-${flowerId}`);

                const removeBackgroundColorup = document.querySelector(`.js-flowers-name-${flowerId}`);

                removeBackgroundColor.classList.remove('waterless');

                removeBackgroundColorup.classList.remove('waterless');

                flowers.forEach(element => {
                    if (element.id === flowerId) {
                        element.waterDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());

                        element.waterTxt = 'When the background color will turn red water your flower!';
                        document.querySelector(`.js-water-text-${element.id}`)
                            .innerHTML = 'When the background color will turn red water your flower!';
                    }
                })
                localStorage.setItem('flowers', JSON.stringify(flowers));
                
            });
        });
    //
    
    // guzik zmieniajacy liczbe dni do podlania danej rosliny
    document.querySelectorAll('.js-button-update')
        .forEach((button) => {
            button.addEventListener('click', () => {
                const { flowerId } = button.dataset;
                var inputElement = document.querySelector(`.js-input-update-${flowerId}`);
                const newTiming = Number(inputElement.value);

                flowers.forEach(element => {
                    if (element.id === flowerId) {
                        element.time = newTiming;
                    }
                })
                localStorage.setItem('flowers', JSON.stringify(flowers));
            });
        });
    //
    
    // guzik do usuwania rosliny
    document.querySelectorAll('.js-delete-button')
        .forEach((button) => {
            button.addEventListener('click', () => {
                const { flowerId } = button.dataset;
                let indexNum = Number(flowerId.substring(2));
                flowers.splice(indexNum - 1, 1);

                let i = 1;
                flowers.forEach((flower) => {
                    flower.id = `id${i}`;
                    i++;
                });
                startSite();
            });
        });
    //
    
    // guzik oraz funkcja wywolanie enterem do znalezienia danej rosliny
    document.querySelector('.js-button-search')
        .addEventListener('click', () => {
            searchFlower();
            document.querySelector(`.js-search-input`)
                .value = '';
        })
    document.querySelector('.js-search-input')
        .addEventListener('keydown', (Event) => {
            if (Event.key === 'Enter') {
                searchFlower();
                document.querySelector(`.js-search-input`)
                .value = '';
            }
        })
    //
//

// funkcje
    // funkcja sprawdzajaca czy nalezy podlac rosline
    function water() {
        flowers.forEach(element => {
            if (seeingFlowers.includes(element.id)) {
                const backgroundColor = document.querySelector(`.js-flowers-${element.id}`);

                const backgroundColorup = document.querySelector(`.js-flowers-name-${element.id}`);

                const waterDate = new Date(element.waterDate);
                const todayDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
                
                const secondsdif = (todayDate - waterDate) / 1000;
                
                if (element.time * 60 * 60 *24 <= secondsdif) {
                    backgroundColor.classList.add('waterless');
                    backgroundColorup.classList.add('waterless');
                    element.waterTxt = 'Your flower needs water!!';
                    document.querySelector(`.js-water-text-${element.id}`)
                        .innerHTML = 'Your flower needs water!!';
                } else if (backgroundColor.classList && backgroundColorup.classList) {
                    backgroundColor.classList.remove('waterless');
                    backgroundColorup.classList.remove('waterless');
                    element.waterTxt = 'When the background color will turn red water your flower!';
                    document.querySelector(`.js-water-text-${element.id}`)
                        .innerHTML = 'When the background color will turn red water your flower!';
                }
            }
        })
    }
    //

    // funkcja szukajaca danej rosliny
    function searchFlower() {
        var inputElement = document.querySelector(`.js-search-input`);
        const flowerName = inputElement.value;

        if (!flowerName) {
            HTML = ''
            seeingFlowers = [];
            flowers.forEach((flower) => {
                HTML += htmlReturn(flower);
                seeingFlowers.push(flower.id);
            })
        }
        flowers.forEach(flower => {
            if (flower.name === flowerName) {
                HTML = htmlReturn(flower);
                seeingFlowers = [flower.id];
            } 
        })
        document.querySelector('.js-main-grid')
            .innerHTML = HTML;
        
        water();
    }
    //

    // funkcja tworzaca html na stronie
    function htmlReturn(flower) {
        var html =
        `
        <div class="flower-container">
            <div class="flower-name js-flowers-name-${flower.id}">
                <div class="flower-name-txt">
                    ${flower.name}
                </div>
                <button class="delete-button js-delete-button" data-flower-id="${flower.id}">
                    X
                </button>
                <div class="delete-txt">
                    Delete your flower
                </div>
            </div>
            <img class="img-flower" src="${flower.img}">
            <div class="flower-widgets js-flowers-${flower.id}">
                <div class="water-text js-water-text-${flower.id}">
                    ${flower.waterTxt}
                </div>
                <button class="water-button js-water-button" data-flower-id="${flower.id}">
                    Give water
                </button>
                <div class="update-txt">
                    Enter every how many days you want to water your flowers
                </div>
                <div>
                    <input class="input-update js-input-update-${flower.id}" placeholder="write">
                    <button class="button-update js-button-update" data-flower-id="${flower.id}">
                    Update
                    </button>
                </div>
            </div>
        </div>
        `
        return html;
    }
    //
//

// wyswietlanie danych o kwiatach
console.log(flowers);
//
}
startSite();