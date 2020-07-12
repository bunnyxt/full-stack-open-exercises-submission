import React, {useState, useEffect} from 'react';
import axios from 'axios';

const Filter = ({ filter, filterChangeHandler}) => 
  <div>
  find countries <input value={filter} onChange={filterChangeHandler} />
  </div>

const CountryItem = ({ country, showButtonClickHandler }) => {
  return (
    <div>
      {country.name} <button onClick={showButtonClickHandler} name={country.name}>show</button>
    </div>
  )
}
  
const CountryDetail = ({ country }) => {
  const apiKey = process.env.REACT_APP_API_KEY;
  const [weather, setWeather] = useState();

  useEffect(() => {
    axios
      .get(`http://api.weatherstack.com/current?access_key=${apiKey}&query=${country.capital}`)
      .then(response => {
        setWeather(response.data);
      })
  }, []);

  return (
    <div>
      <h1>{country.name}</h1>
      <div>capital {country.capital}</div>
      <div>population {country.population}</div>
      <h2>languages</h2>
      <ul>
        {country.languages.map(language => <li key={language.name}>{language.name}</li>)}
      </ul>
      <img src={country.flag} alt={`${country.name} flag`} width="100" />
      <h2>Weather in {country.capital}</h2>
      <div>
        <b>temperature: </b>{weather ? weather.current.temperature : ''} Celcius
      </div>
      <img src={weather ? weather.current.weather_icons[0] : ''} />
      <div>
        <b>wind: </b>{weather ? weather.current.wind_speed : ''} mph direction {weather ? weather.current.wind_dir : ''}
      </div>
    </div>
  );
}

const Display = ({ countries, filter, showButtonClickHandler }) => {
  const countriesToShow = countries.filter(country => 
    country.name.toLowerCase().includes(filter.toLowerCase())
  );

  if (countriesToShow.length > 10) {
    return (<div>Too many matches, specify another filter</div>);
  } else if (countriesToShow.length === 0) {
    return (<div>not found</div>);
  } else {
    let idx = -1;
    // here, check whether input name filter exactly equals to country's name
    // for example, type 'sudan', show 'sudan', not 'sudan' and 'south sudan'
    for (let i = 0; i < countriesToShow.length; i++) {
      if (countriesToShow[i].name.toLowerCase() === filter.toLowerCase()) {
        idx = i;
        break;
      }
    }
    if (countriesToShow.length === 1) {
      idx = 0;
    }
    if (idx > -1) {
      return <CountryDetail country={countriesToShow[idx]} />
    } else {
      return (countriesToShow.map(country => 
        <CountryItem key={country.name} country={country} showButtonClickHandler={showButtonClickHandler} />
      ));
    }
  }
}

const App = () => {
  const [countries, setCountries] = useState([]);
  const [filter, setFilter] = useState('');

  const filterChangeHandler = (event) => {
    setFilter(event.target.value);
  };

  const showButtonClickHandler = (event) => {
    event.preventDefault();
    setFilter(event.target.name);
  }

  useEffect(() => {
    axios
      .get('https://restcountries.eu/rest/v2/all')
      .then(response => {
        setCountries(response.data);
      });
  }, []);
 
  return (
    <div>
      <Filter filter={filter} filterChangeHandler={filterChangeHandler} />
      <Display countries={countries} filter={filter} showButtonClickHandler={showButtonClickHandler} />
    </div>
  )
}

export default App
