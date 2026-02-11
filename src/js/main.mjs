import { loadHeaderandFooter } from "./utils.mjs";
import { displaySelectOptions, displayFavoriteExchanges, initFavoriteClick, getExchangeRate } from "./currency.mjs";
import { displayCountries } from "./news.mjs";

const currencies = './json/currency.json';
const countries = './json/country.json'
const inputSelectElement = document.getElementById('currencyInput');
const targetSelectElement = document.getElementById('currencyTarget');
const countrySelectElement = document.getElementById('countrySelect');
const convertButton = document.getElementById('convert');
const userInput = document.getElementById('userInput');
const exchangeResult = document.getElementById('exchangeResult');
const autoConvert = document.getElementById('autoConvert');

// Convert
async function convert() {
    const amount = userInput.value;
    const input = inputSelectElement.selectedOptions[0].dataset.currency;
    const target = targetSelectElement.selectedOptions[0].dataset.currency;

    if (amount > 0) {
        exchangeResult.value = "Calculating...";
        const result = await getExchangeRate(input, target, amount);
        exchangeResult.value = result;
    }
}

convertButton.addEventListener('click', convert);

// Auto convert
userInput.addEventListener('input', () => {
    if (autoConvert.classList.contains('enabled')) {
        convert();
    }
})

// Trigger conversion when currencies switch if auto convert is enabled
const handleSelectChange = () => {
    if (autoConvert.classList.contains('enabled')) {
        convert();
    }
}
inputSelectElement.addEventListener('change', handleSelectChange);
targetSelectElement.addEventListener('change', handleSelectChange);

displaySelectOptions(currencies, inputSelectElement, targetSelectElement)
displayCountries(countries, countrySelectElement);
loadHeaderandFooter();
displayFavoriteExchanges();
initFavoriteClick();