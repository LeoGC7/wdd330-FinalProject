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

// Display Select Options
export async function displaySelectOptions(data, inputSelect, targetSelect) {
    const res = await fetch(data);
    
    if (!res.ok) {
        throw new Error('Failed to fetch currencies: ' + res.statusText)
    }

    const currencies = await res.json();

    currencies.forEach(currency => {
        const flag = getFlagEmoji(currency.cc);
        const displayText = `${flag} - ${currency.name}`;
        const currencyCode = currency.name.substring(0, 3);

        const currencyInputOption = document.createElement('option');
        currencyInputOption.textContent = displayText;
        currencyInputOption.value = currency.cc;
        currencyInputOption.dataset.currency = currencyCode;

        if (currency.name.includes('US Dollar')) {
            currencyInputOption.selected = true;
        }

        inputSelect.appendChild(currencyInputOption);

        const currencyTargetOption = document.createElement('option');
        currencyTargetOption.textContent = displayText;
        currencyTargetOption.value = currency.cc;
        currencyTargetOption.dataset.currency = currencyCode;

        if (currency.name.includes('Euro')) {
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
    location.reload()
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
    card.setAttribute('data-input', inputCurrency);
    card.setAttribute('data-target', targetCurrency)
    card.innerHTML = `${inputFlagIcon} &#8594 ${targetFlagIcon}`

    favoriteExchangesContainer.appendChild(card)
}

// Select favorite exchange
function selectFavoriteExchange(inputCode, targetCode) {
    const currencyInput = document.getElementById('currencyInput')
    const currencyTarget = document.getElementById('currencyTarget')

    currencyInput.value = inputCode;
    currencyTarget.value = targetCode;
}

// Select favorite exchange click event
export function initFavoriteClick() {
    const favoriteExchangeContainer = document.querySelector('.favorite-exchanges-container');

    favoriteExchangeContainer.addEventListener('click', (e) => {
        const favoriteCard = e.target.closest('.exchange-button');

        if (favoriteCard) {
            const input = favoriteCard.dataset.input;
            const target = favoriteCard.dataset.target;

            selectFavoriteExchange(input, target);
        }
    })
}

// Switch currencies
function switchCurrencies() {
    const currencyInput = document.getElementById('currencyInput');
    const currencyTarget = document.getElementById('currencyTarget');
    const userInput = document.getElementById('userInput');
    const exchangeResult = document.getElementById('exchangeResult');

    const tempSelect = currencyInput.value;
    currencyInput.value = currencyTarget.value;
    currencyTarget.value = tempSelect;

    const tempAmount = userInput.value;
    userInput.value = exchangeResult.value;
    exchangeResult.value = tempAmount;
}
const switchButton = document.getElementById('switchButton');
switchButton.addEventListener('click', switchCurrencies)

// Get exchange rate from Frankfurter
const BASE_URL = "https://api.frankfurter.app/latest";

export async function getExchangeRate(inputCurrency, targetCurrency, amount) {

    const input = inputCurrency.toUpperCase();
    const target = targetCurrency.toUpperCase();

    if (input === target) return amount;

    try {
        const res = await fetch(`${BASE_URL}?amount=${amount}&from=${input}&to=${target}`)

        if (!res.ok) {
            throw new Error("Currency pair not supported")
        }

        const data = await res.json();

        return data.rates[target].toFixed(2);
    } catch (error) {
        console.error('Fetch Error:', error)
        return "Error"
    }
}