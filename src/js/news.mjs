import { polyfillCountryFlagEmojis } from "https://cdn.skypack.dev/country-flag-emoji-polyfill";
polyfillCountryFlagEmojis();

const API_KEY = import.meta.env.VITE_NEWS_API_KEY;
const BASE_URL = 'https://newsdata.io/api/1/latest'

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

// Get news
export async function getNews(countryCode) {
    const newsContainer = document.getElementById('newsContainer');

    newsContainer.innerHTML = '<p class="news-message">Loading latest news...</p>'

    try {
        const res = await fetch(`${BASE_URL}?apikey=${API_KEY}&country=${countryCode}&domain=theguardian`)

        if(!res.ok) {
            const errorBody = await res.json();
            console.error("API Error Details:", errorBody);
            throw new Error(`FAiled to fetch news: ${res.status}`)
        }

        const data = await res.json();

        displayNewsResult(data.results, newsContainer);
        
    } catch (error) {
        console.error('News Error:', error);
        newsContainer.innerHTML = '<p class="news-message">Error loading news</p>'
    }
}

// Display news
function displayNewsResult(articles, container) {
    container.innerHTML = '';

    if(!articles || articles.length === 0) {
        container.innerHTML = '<p class="news-message">No recent news found for this country</p>';
        return
    }

    articles.forEach(article => {
        const newsCard = document.createElement('div');
        newsCard.classList.add('news-card');

        const imageUrl = article.image_url || './images/image-placeholder.png';

        newsCard.innerHTML = `
            <div class="news-image-container">
                <img class="news-image" src="${imageUrl}" alt="${article.title}">
            </div>
            <div class="news-info">
                <h3 class="news-article-title">${article.title}</h3>
                <p class="news-description">${article.description ? article.description.substring(0, 120) + '...' : 'No description available.'}</p>
                <a href="${article.link}" target="_blank" class="read-more">Read Full Story</a>
            </div>
        `;
        container.appendChild(newsCard);
    })
}