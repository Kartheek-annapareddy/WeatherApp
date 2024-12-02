import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './weather.css';
import bokenclouds from '../assets/pictures/brokenclouds.jpg'
import clearsky from '../assets/pictures/clearsky.jpg'
import default1 from '../assets/pictures/default1.avif'
import drizzle from '../assets/pictures/drizzle.avif'
import dust from '../assets/pictures/dust.jpg'
import fog from '../assets/pictures/fog.avif'
import haze from '../assets/pictures/haze.jpg'
import mist from '../assets/pictures/mist.jpg'
import rain from '../assets/pictures/rain.jpg'
import scatterdclouds from '../assets/pictures/scatteredclouds.jpg'
import snow from '../assets/pictures/snow.jpg'
import thunderstrom from '../assets/pictures/thunderstrom.avif'
import smoke from '../assets/pictures/smoke.avif'

export default function WeatherApp() {
  const [city, setCity] = useState('Delhi'); // Default city is Delhi
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [localTime, setLocalTime] = useState('');
  const [inputValue, setInputValue] = useState(''); // To track user input
  const [imagechange, setimagechange] = useState(
    'https://img.freepik.com/free-photo/overcast-clouds-mountain-cityscape_23-2148182920.jpg?ga=GA1.1.200709813.1732007863&semt=ais_hybrid'
  );

  const API_KEY = '2cf2677b837431c48086978bf6824812'; // Replace with your OpenWeatherMap API key

  // Fetch weather data when the city changes
  useEffect(() => {
    const fetchWeatherData = async () => {
      if (!city) return;

      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`
        );
        setWeatherData(response.data);
        updateLocalTime(response.data.timezone);
      } catch (err) {
        setError('Failed to fetch weather data. Please try again.');
        console.error('Error fetching weather data:', err);
      }
      setLoading(false);
    };

    fetchWeatherData();
  }, [city]);

  // Update local time based on timezone offset
  const updateLocalTime = (timezoneOffset) => {
    const interval = setInterval(() => {
      const utcTime = new Date();
      const localTime = new Date(utcTime.getTime() + timezoneOffset * 1000);
      setLocalTime(localTime.toLocaleString());
    }, 1000);

    return () => clearInterval(interval);
  };

  // Change background image based on weather description
  const weatherdes = (description) => {
    switch (description) {
      case 'smoke':
        setimagechange(smoke);
        break;
      case 'thunderstorm':
        setimagechange(thunderstrom);
        break;
      case 'drizzle':
        setimagechange(drizzle);
        break;
      case 'rain':
        setimagechange(rain);
        break;
      case 'snow':
        setimagechange(snow);
        break;
      case 'mist':
        setimagechange(mist);
        break;
      case 'clear sky':
        setimagechange(clearsky);
        break;
      case 'few clouds':
        setimagechange(scatterdclouds);
        break;
      case 'scattered clouds':
        setimagechange(scatterdclouds);
        break;
      case 'broken clouds':
        setimagechange(bokenclouds);
        break;
      case 'haze':
        setimagechange(haze);
        break;
      case 'dust':
        setimagechange(dust);
        break;
      case 'fog':
        setimagechange(fog);
        break;
      default:
        setimagechange(default1);
    }
  };

  // Update background image when weather data changes
  useEffect(() => {
    if (weatherData && weatherData.weather[0]?.description) {
      weatherdes(weatherData.weather[0].description);
    }
  }, [weatherData]);

  // Handle user input
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (inputValue.trim()) {
      setCity(inputValue);
      setInputValue('');
    }
  };

  const clearCity = () => {
    setInputValue('');
    setCity('');
    setWeatherData(null);
    setLocalTime('');
    setimagechange(
      'https://img.freepik.com/free-photo/overcast-clouds-mountain-cityscape_23-2148182920.jpg?ga=GA1.1.200709813.1732007863&semt=ais_hybrid'
    );
  };

  return (
    <div
      className="nefn"
      style={{
        backgroundImage: `url(${imagechange})`,
        backgroundSize: 'cover',
        height: '100vh',
      }}
    >
      <h1 className="text-center fst-italic">Weather Report</h1>
      <div className="container mt-5">
        <div className="row mt-5">
          <div className="col-md-6 offset-md-3">
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                className="form-control mb-3"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="Enter city"
              />
              <button type="submit" className="btn btn-primary me-5 mb-3">
                Get Weather
              </button>
              <button
                type="button"
                className="btn btn-secondary ms-5 mb-3"
                onClick={clearCity}
              >
                Clear
              </button>
            </form>

            {loading && <p>Loading...</p>}
            {error && <p className="text-danger">{error}</p>}

            {weatherData && (
              <div className="card bg-white text-dark p-5 mt-5 rounded shadow">
                <div className="card-body row">
                  <h5 className="card-title">{weatherData.name}</h5>
                  <hr />
                  <p className="card-text">Time: {localTime}</p>
                  <p className="card-text">
                    Temperature: {(weatherData.main.temp - 273.15).toFixed(2)}°C
                  </p>
                  <p className="card-text">
                    Description: {weatherData.weather[0].description}
                  </p>
                  <p className="card-text">Humidity Level: {weatherData.main.humidity}%</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
