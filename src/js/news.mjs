import { polyfillCountryFlagEmojis } from "https://cdn.skypack.dev/country-flag-emoji-polyfill";
polyfillCountryFlagEmojis();

// Parse country code
function getFlagEmoji(countryCode) {
    const codePoints = countryCode.toUpperCase().split('').map(char =>  127397 + char.charCodeAt());

    return String.fromCodePoint(...codePoints);
}

// Create Select Options
export async function displayCountries(data, countrySelect) {
    const res = await fetch(data);
    
    if (!res.ok) {
        throw new Error('Failed to fetch currencies: ' + res.statusText)
    }

    const countries = await res.json();

    countries.forEach(country => {
        const flag = getFlagEmoji(country.cc);
        const displayText = `${flag} - ${country.name}`;

        const countryOption = document.createElement('option');
        countryOption.textContent = displayText;
        countryOption.value = country.cc;

        if (country.name.includes('USA')) {
            countryOption.selected = true;
        }

        countrySelect.appendChild(countryOption);
    });
}