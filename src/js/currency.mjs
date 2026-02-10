import { polyfillCountryFlagEmojis } from "https://cdn.skypack.dev/country-flag-emoji-polyfill";
import { getLocalStorage, setLocalStorage } from "./utils.mjs";
polyfillCountryFlagEmojis();

// LocalStorage item
const key = 'fav'
let favoriteExchanges = getLocalStorage(key) || []

if(!getLocalStorage(key)) {
    setLocalStorage(key, [])
}

// Parse country code
function getFlagEmoji(countryCode) {
    const codePoints = countryCode.toUpperCase().split('').map(char =>  127397 + char.charCodeAt());

    return String.fromCodePoint(...codePoints);
}

// Create Select Options
export async function displaySelectOptions(data, inputSelect, targetSelect) {
    const res = await fetch(data);
    
    if (!res.ok) {
        throw new Error('Failed to fetch currencies: ' + res.statusText)
    }

    const currencies = await res.json();

    currencies.forEach(currency => {
        const flag = getFlagEmoji(currency.cc);
        const displayText = `${flag} - ${currency.name}`;

        const currencyInputOption = document.createElement('option');
        currencyInputOption.textContent = displayText;
        currencyInputOption.value = currency.cc;

        if (currency.name.includes('USA Dollar')) {
            currencyInputOption.selected = true;
        }

        inputSelect.appendChild(currencyInputOption);

        const currencyTargetOption = document.createElement('option');
        currencyTargetOption.textContent = displayText;
        currencyTargetOption.value = currency.cc;

        if (currency.name.includes('Eurozone Euro')) {
            currencyTargetOption.selected = true;
        }

        targetSelect.appendChild(currencyTargetOption);
    });
}

// Change Auto Convert button style
const autoConvertButton = document.getElementById('autoConvert');
const convertButton = document.getElementById('convert')
autoConvertButton.textContent = 'Disabled';

autoConvertButton.addEventListener('click', () => {
    if(autoConvertButton.classList.contains('disabled')) {
        autoConvertButton.classList.remove('disabled');
        autoConvertButton.classList.add('enabled');
        autoConvertButton.textContent = 'Enabled';
        convertButton.classList.toggle('hidden');
    } else {
        autoConvertButton.classList.remove('enabled');
        autoConvertButton.classList.add('disabled');
        autoConvertButton.textContent = 'Disabled'
        convertButton.classList.toggle('hidden');
    }
})

// Save favorite Exchanges
function saveFavoriteExchange(currencyInput, currencyTarget) {
    const input = currencyInput.value;
    const target = currencyTarget.value;
    const exchange = {input, target};

    const favoriteExchanges = getLocalStorage(key) || []

    favoriteExchanges.push(exchange)

    setLocalStorage(key, favoriteExchanges)
}

const currencyInput = document.getElementById('currencyInput')
const currencyTarget = document.getElementById('currencyTarget')
const saveExchangeButton = document.getElementById('saveExchange')
saveExchangeButton.addEventListener('click', () => {
    saveFavoriteExchange(currencyInput, currencyTarget);
});

// Display favorite Exchanges
const favoriteExchangesContainer = document.querySelector('.favorite-exchanges-container')
export function displayFavoriteExchanges() {
    const favoriteExchanges = getLocalStorage(key)
    
    favoriteExchangesContainer.innerHTML = '';

    if (favoriteExchanges.length === 0) {
        const noFavorites = document.createElement('p');
        noFavorites.innerText = 'No favorite exchanges added';
        noFavorites.classList.add('no-favorites');
        favoriteExchangesContainer.appendChild(noFavorites);
        return;
    }

    favoriteExchanges.forEach(exchange => {
        const inputCurrency = exchange.input;
        const targetCurrency = exchange.target;

        createFavoriteCard(inputCurrency, targetCurrency)
    });
}

// Create Favorite Exchange Card
function createFavoriteCard(inputCurrency, targetCurrency) {
    const inputFlagIcon = getFlagEmoji(inputCurrency);
    const targetFlagIcon = getFlagEmoji(targetCurrency);

    const card = document.createElement('button');
    card.classList.add('exchange-button')
    card.innerHTML = `
        ${inputFlagIcon} &#8594 ${targetFlagIcon}
    `

    favoriteExchangesContainer.appendChild(card)
}