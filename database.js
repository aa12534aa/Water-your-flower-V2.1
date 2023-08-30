// pobieranie danych
import { startSite } from "./aplikacja.js";
//

export let seeingFlowers = [];
export let flowers = [];

// Otwieranie bazy danych IndexedDB
let request = indexedDB.open("flowerDatabase", 1);

request.onupgradeneeded = function(event) {
    let db = event.target.result;
    let objectStore = db.createObjectStore("flowers", { keyPath: "id" });
    objectStore.createIndex("name", "name", { unique: false });
};

request.onsuccess = function(event) {
    let db = event.target.result;
    let transaction = db.transaction("flowers", "readwrite");
    let objectStore = transaction.objectStore("flowers");

    objectStore.openCursor().onsuccess = function(event) {
        let cursor = event.target.result;
        if (cursor) {
            flowers.push(cursor.value);
            cursor.continue();
            seeingFlowers.push(cursor.value.id);
            startSite();
        }
    };
};
//

// dodawanie zdj, dni, nazwy rosliny oraz aktualizowanie strony
document.querySelector('.js-add-flower-button').addEventListener('click', () => {
    let uploadedImage;
    let fileInput = document.querySelector('.js-photo-flower');
    let file = fileInput.files[0];
    let flowerName = document.querySelector('.js-name-flower').value;
    let flowerDays = Number(document.querySelector('.js-days-flower').value);

    if (file && flowerName && flowerDays) {
        let reader = new FileReader();

        reader.onload = function(e) {
            uploadedImage = e.target.result;

            let id = flowers.length + 1;
            let waterDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());

            let flowerData = {
                id: id,
                waterDate: waterDate,
                name: flowerName,
                time: flowerDays,
                waterTxt: 'When the background color will turn red water your flower!',
                img: uploadedImage
            };

            let request = indexedDB.open("flowerDatabase", 1);
            request.onsuccess = function(event) {
                let db = event.target.result;
                let transaction = db.transaction("flowers", "readwrite");
                let objectStore = transaction.objectStore("flowers");
                objectStore.add(flowerData);
                flowers.push(flowerData);
                seeingFlowers.push(flowerData.id);
                startSite();
            };
        };
        reader.readAsDataURL(file);
    }
});
//

// funkcja aktualizujaca baze danych
export function updateDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("flowerDatabase", 1);

        request.onerror = function(event) {
            console.error("Database update error:", event.target.error);
            reject(event.target.error);
        };

        request.onsuccess = function(event) {
            const db = event.target.result;
            const transaction = db.transaction("flowers", "readwrite");
            const objectStore = transaction.objectStore("flowers");

            // Usunięcie wszystkich rekordów z obiektu flowers
            const clearRequest = objectStore.clear();
            
            clearRequest.onsuccess = function() {
                // Dodanie zaktualizowanych rekordów
                flowers.forEach(flower => {
                    objectStore.put(flower);
                });

                transaction.oncomplete = function() {
                    resolve();
                };
            };
            
            clearRequest.onerror = function(event) {
                console.error("Clear request error:", event.target.error);
                reject(event.target.error);
            };
        };
    });
}
//
