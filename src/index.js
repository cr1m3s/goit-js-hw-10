import './css/styles.css';
import { fetchCountries } from './fetchCountries.js';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { debounce } from 'lodash';

const DEBOUNCE_DELAY = 300;
const MAX_COUNTRIES_RENDER = 10;
const MIN_COUNTRIES_RENDER = 1;

const fields = {
  search: document.querySelector('#search-box'),
  list: document.querySelector('.country-list'),
  info: document.querySelector('.country-info'),
};

fields.search.addEventListener('input', debounce(onInputChange, DEBOUNCE_DELAY));

function onInputChange(event) {
  fields.list.innerHTML = '';
  fields.info.innerHTML = '';

  const input = event.target.value.trim();
  fetchCountries(input)
    .then(response => {
      if (response.status === 404) {
        Notify.failure('Oops, there is no country with that name.');
      } else if (response.length > MAX_COUNTRIES_RENDER) {
        Notify.info('Too many matches found. Please enter a more specific name.');
      } else if (response.length > MIN_COUNTRIES_RENDER) {
        renderCountries(response);
      } else {
        renderCountry(response);
      }
    })
    .catch(error => console.log(error));
}

function renderCountry(response) {
  fields.info.innerHTML = response
    .map(country => {
      return `<div>
            <div>
                <img src="${country.flags.svg}" alt="${country.name.official}flag" 
                    width="90" height="60"/>
                <h1>${country.name.official}</h1>
            </div>
            <div>
                <p><b>Capital:</b>${country.capital}</p>
                <p><b>Population:</b>${country.population}</p>
                <p><b>Languages:</b>${Object.values(country.languages)}</p>
            </div>
        </div>`;
    })
    .join('');
}

function renderCountries(response) {
  fields.list.innerHTML = response
    .map(countries => {
      return `<li class='countries-list'>
            <img src="${countries.flags.svg}" alt="${countries.name.official}" width="45px" height="30px">
            <span class="country-name">${countries.name.official}</span>
        </ii>`;
    })
    .join('');
}
