import { startSite } from "./aplikacja.js";
export let flowers = JSON.parse(localStorage.getItem('flowers')) || [];

// Funkcja obsługująca dodawanie zdjęć przez użytkownika
document.querySelector('.js-add-flower-button').addEventListener('click', () => {
    let uploadedImage;
    let fileInput = document.querySelector('.js-photo-flower');
    let file = fileInput.files[0];
    let flowerName = document.querySelector('.js-name-flower').value;
    let flowerDays = Number(document.querySelector('.js-days-flower').value);

    // Jeśli użytkownik wybrał plik
    if (file && flowerName && flowerDays) {
        let reader = new FileReader();

        reader.onload = function(e) {
            uploadedImage = e.target.result;

            flowers.push({
                id: `id${flowers.length + 1}`,
                waterDate: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()),
                name: flowerName,
                time: flowerDays,
                waterTxt: 'When the background color will turn red water your flower!',
                img: uploadedImage
            });
            localStorage.setItem('flowers', JSON.stringify(flowers));

            startSite();
        };

        reader.readAsDataURL(file); // Odczytaj plik jako URL (Base64)
    }
});
