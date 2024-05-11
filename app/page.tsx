"use client";

import { useState } from 'react';
import axios from 'axios';
import styles from './HomePage.module.css'; // Import the CSS module

// Define types for weather and forecast data
interface WeatherData {
  name: string;
  weather: { description: string }[];
  main: { temp: number };
}

interface ForecastData {
  city: { name: string };
  list: {
    dt: number;
    weather: { description: string }[];
    main: { temp: number };
  }[];
}

const HomePage = () => {
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [option, setOption] = useState('current');

  const apiKey = 'ec1bc95ba05cbda3bea5933409393b24'; 

  const fetchWeather = async () => {
    const trimmedCity = city.trim();
    const trimmedState = state.trim();
    if (!trimmedCity || !trimmedState) {
      setWeather(null);
      setForecast(null);
      return;
    }

    const location = `${encodeURIComponent(trimmedCity)},${encodeURIComponent(trimmedState)}`;
    let apiUrl;

    if (option === 'current') {
      apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`;
    } else {
      apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}&units=metric`;
    }

    console.log('API URL:', apiUrl); // Log the API URL to ensure it's correct

    const response = await axios.get(apiUrl);
    console.log('API response:', response.data); // Log the API response

    if (option === 'current') {
      setWeather(response.data);
      setForecast(null);
    } else {
      setForecast(response.data);
      setWeather(null);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Welcome to the Weather App!</h1>
      <p className={styles.subHeader}>Please enter the city and state(NO Abbreviations) you wish to search for:</p>
      <div className={styles.inputContainer}>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city"
          className={styles.input}
        />
        <input
          type="text"
          value={state}
          onChange={(e) => setState(e.target.value)}
          placeholder="Enter state"
          className={styles.input}
        />
        <div className={styles.optionContainer}>
          <label>
            <input
              type="radio"
              value="current"
              checked={option === 'current'}
              onChange={() => setOption('current')}
            />
            Current Weather
          </label>
          <label>
            <input
              type="radio"
              value="forecast"
              checked={option === 'forecast'}
              onChange={() => setOption('forecast')}
            />
            Weather Forecast
          </label>
        </div>
        <button onClick={fetchWeather} className={styles.button}>Get Weather</button>
      </div>
      {weather && (
        <div className={styles.weatherContainer}>
          <h2 className={styles.weatherHeader}>{weather.name}</h2>
          <p className={styles.weatherInfo}>{weather.weather[0].description}</p>
          <p className={styles.weatherInfo}>{weather.main.temp} °C</p>
        </div>
      )}
      {forecast && (
        <div className={styles.weatherContainer}>
          <h2 className={styles.weatherHeader}>{forecast.city.name}</h2>
          {forecast.list.slice(0, 5).map((item, index) => (
            <div key={index} className={styles.forecastItem}>
              <p className={styles.weatherInfo}>{new Date(item.dt * 1000).toLocaleString()}</p>
              <p className={styles.weatherInfo}>{item.weather[0].description}</p>
              <p className={styles.weatherInfo}>{item.main.temp} °C</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;

