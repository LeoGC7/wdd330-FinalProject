import { loadHeaderandFooter } from "./utils.mjs";
import { displaySelectOptions, displayFavoriteExchanges, initFavoriteClick } from "./currency.mjs";
import { displayCountries } from "./news.mjs";

const currencies = '/json/currency.json';
const countries = '/json/country.json'
const inputSelectElement = document.getElementById('currencyInput');
const targetSelectElement = document.getElementById('currencyTarget');
const countrySelectElement = document.getElementById('countrySelect')

displaySelectOptions(currencies, inputSelectElement, targetSelectElement)
displayCountries(countries, countrySelectElement);
loadHeaderandFooter();
displayFavoriteExchanges();
initFavoriteClick();