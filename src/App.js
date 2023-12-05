import React, { useEffect, useState } from 'react';
import './App.css'; // Ensure the CSS is updated accordingly
import axios from 'axios';
import { WiDaySunny, WiThermometer, WiRaindrop, WiStrongWind } from 'react-icons/wi';
import { AiOutlineHome, AiOutlineSetting, AiOutlineHistory } from 'react-icons/ai';
import logo from './logo/taenlogony.png'; // Adjust the path to your logo

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [uvIndex, setUvIndex] = useState(null);
  const [temperature, setTemperature] = useState(null);
  const [rain, setRain] = useState(null);
  const [wind, setWind] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;

      try {
        // Fetching general weather data
        const weatherResponse = await axios.get(`https://api.met.no/weatherapi/locationforecast/2.0/complete?lat=${latitude}&lon=${longitude}`);

        const uvIndexValue = weatherResponse.data.properties.timeseries[0].data.instant.details.ultraviolet_index_clear_sky;
        const temperatureValue = weatherResponse.data.properties.timeseries[0].data.instant.details.air_temperature;
        const windValue = weatherResponse.data.properties.timeseries[0].data.instant.details.wind_speed;

        setUvIndex(uvIndexValue);
        setTemperature(temperatureValue);
        setWind(windValue);

        // Fetching precipitation data from Nowcast API
        const rainResponse = await axios.get(`https://api.met.no/weatherapi/nowcast/2.0/?lat=${latitude}&lon=${longitude}`);
        const rainValue = rainResponse.data.properties.timeseries[0].data.instant.details.precipitation_rate;

        setRain(rainValue);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching weather data:', error);
        setIsLoading(false);
      }
    }, (error) => {
      console.error('Error fetching location:', error);
      setIsLoading(false);
    });
  }, []);

  const getSunbathingAdvice = (uvIndex, temperature) => {
    // Example logic for sunbathing advice based on UV index
    if (uvIndex < 3) {
      return 'Low UV. Safe to go outside. No sunscreen required.';
    } else if (uvIndex >= 3 && uvIndex < 6) {
      return 'Moderate UV. Sunscreen with SPF 30 recommended.';
    } else if (uvIndex >= 6) {
      return 'High UV. Avoid prolonged exposure. Use sunscreen with SPF 50+.';
    } else {
      return 'UV Index not available.';
    }
  };

  const sunbathingAdvice = getSunbathingAdvice(uvIndex, temperature);

  return (
    <div className="app-container">
      {isLoading ? (
        <div className="loading-screen">
          <div className="spinner"></div>
          <p className="loading-text">Loading...</p>
        </div>
      ) : (
        <div className="main-content">
          <div className="uv-index">
            <WiDaySunny className="uv-icon" />
            <div className="uv-text">
              <span className="label">UV Index</span>
              <span className="value">{uvIndex}</span>
            </div>
          </div>
          <div className="temperature">
            <WiThermometer className="temp-icon" />
            <span className="temp-value">{temperature}°C</span>
          </div>
          <hr className="divider" />
          <div className="sub-info">
            <div className="sub-item">
              <WiRaindrop className="sub-icon" />
              <span className="sub-value">{rain}mm</span>
            </div>
            <div className="sub-item">
              <WiStrongWind className="sub-icon" />
              <span className="sub-value">{wind} m/s</span>
            </div>
          </div>
          <div className="sunbathing-advice">
            {sunbathingAdvice}
          </div>
        </div>
      )}
      <div className="disclaimer">
        <img src={logo} alt="Logo" className="logo" />
        <p>We do not take responsibility for the dangers of sun exposure. Always consult a professional.</p>
        <p>Tæn is made by Espen Halsen</p>
      </div>
      <footer className="navigation-bar">
        <button className="nav-button"><AiOutlineHome /></button>
        <button className="nav-button"><AiOutlineSetting /></button>
        <button className="nav-button"><AiOutlineHistory /></button>
      </footer>
    </div>
  );
}

export default App;
