import './css/styles.css';
import debounce from 'lodash.debounce';
import fetchCountries from './fetchCountries';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

const input = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

input.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(event) {
  event.preventDefault();
  let inputCountry = input.value.trim();
  emptyCountryList();
  emptyCountryInfo();
  fetchCountries(inputCountry)
    .then(countries => {
      console.log(countries);
      let l = countries.length;
      if (l > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      } else if (l >= 2 && l <= 10) {
        renderCountries(countries);
      } else {
        renderCountriesOne(countries);
      }
    })
    .catch(error => {
      console.log(error);
      Notiflix.Notify.failure('Oops, there is no country with that name');
      emptyCountryInfo();
    });
}

function emptyCountryList() {
  countryList.innerHTML = '';
}
function emptyCountryInfo() {
  countryInfo.innerHTML = '';
}

function renderCountries(countries) {
  const markup = countries
    .map(({ flags, name }) => {
      return `<li>
        <p>
        <img 
     src="${flags.svg}"
     alt="Flag" width=30px >
        ${name.official}</p>
          
        </li>`;
    })
    .join('');
  countryList.insertAdjacentHTML('beforeend', markup);
}

function renderCountriesOne(countries) {
  const markup = countries
    .map(({ flags, name, population, capital, languages }) => {
      const valuesLanguages = Object.values(languages);
      return `
          <p class = "string">
          <img src="${flags.svg}" alt="Flag" width=30px >
          ${name.official}</p>
          <p>Population: ${population}</p> 
          <p>Capital: ${capital}</p>
          <p>Languages: ${valuesLanguages}</p> `;
    })
    .join('');
  countryInfo.insertAdjacentHTML('beforeend', markup);
}
