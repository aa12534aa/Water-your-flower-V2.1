// pobieranie danych
import { flowers, updateDatabase, seeingFlowers } from "./database.js";
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
    if (seeingFlowers.includes(flower.id)) {
        HTML += htmlReturn(flower);
    }
});
document.querySelector('.js-main-grid')
    .innerHTML = HTML;
//

// sprawdzanie czy rosliny potrzebuja wody (uploadowanie co 1s)
water();

setInterval(() => {
    water();
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
                    if (element.id === Number(flowerId)) {
                        element.waterDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());

                        element.waterTxt = 'When the background color will turn red water your flower!';
                        document.querySelector(`.js-water-text-${element.id}`)
                            .innerHTML = 'When the background color will turn red water your flower!';
                    }
                })
                updateDatabase().then(() => {
                    water();
                });
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
                    if (element.id === Number(flowerId)) {
                        element.time = newTiming;
                    }
                })
                updateDatabase().then(() => {
                    water();
                });
            });
        });
    //
    
    // guzik do usuwania rosliny
    document.querySelectorAll('.js-delete-button')
        .forEach((button) => {
            button.addEventListener('click', () => {
                const { flowerId } = button.dataset;

                flowers.splice(flowerId - 1, 1);
                seeingFlowers.splice(seeingFlowers.length - 1, 1);

                let i = 1;
                flowers.forEach((flower) => {
                    flower.id = i;
                    i++;
                });
                updateDatabase().then(() => {
                    startSite();
                });
            });
        });
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

    // funkcja tworzaca html na stronie
    function htmlReturn(flower) {
        let html =
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
