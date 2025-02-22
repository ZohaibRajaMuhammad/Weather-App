// import { useState, useEffect } from "react";
// import axios from "axios";
// import "./App.css";

// const API_KEY = "c16cce73bdfcb36bcdb034b8544bc947";
// const DEFAULT_CITY = "Karachi"; // Change this to your preferred city

// const WeatherApp = () => {
//   const [weather, setWeather] = useState(null);
//   const [city, setCity] = useState(DEFAULT_CITY);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     fetchWeather(city);
//   }, []);

//   const fetchWeather = async (cityName) => {
//     setLoading(true);
//     setError("");
//     try {
//       const response = await axios.get(
//         `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`
//       );
//       setWeather(response.data);
//     } catch (err) {
//       setError("City not found. Try again!");
//     }
//     setLoading(false);
//   };

//   const handleSearch = (e) => {
//     e.preventDefault();
//     fetchWeather(city);
//   };

//   return (
//     <div id="main-div" className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
//       <h1 className="text-3xl font-bold mb-4">Weather App</h1>
//       <br/>
//       <br/>
//       <form onSubmit={handleSearch} className="mb-4">
//         <input
//           type="text"
//           value={city}
//           onChange={(e) => setCity(e.target.value)}
//           className="p-2 rounded-md bg-gray-700 text-white focus:outline-none"
//           placeholder="Enter city..."
//         />
//         <button type="submit" className="ml-2 p-2 bg-blue-600 rounded-md">
//           Search
//         </button>
//       </form>

//       {loading && <p>Loading...</p>}
//       {error && <p className="text-red-500">{error}</p>}
//       <br/>
//       <br/>

//       {weather && (
//         <div id="update" className="bg-gray-800 p-6 rounded-lg items-center justify-center text-center shadow-lg">
//           <h2 className=" text-2xl font-bold">{weather.name}, {weather.sys.country}</h2>
//           <p className="text-lg">{weather.weather[0].description}</p>
//           <h3 className="text-5xl font-bold">{Math.round(weather.main.temp)}°C</h3>
//           <p>Humidity: {weather.main.humidity}%</p>
//           <p>Wind Speed: {weather.wind.speed} km/h</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default WeatherApp;
import { useState } from "react";
import axios from "axios";
import "./App.css";

const API_KEY = "c16cce73bdfcb36bcdb034b8544bc947";

const WeatherApp = () => {
  const [weather, setWeather] = useState(null);
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchWeather = async () => {
    if (!location.trim()) {
      setError("Please enter a location.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Step 1: Convert location to coordinates (latitude & longitude)
      const geoResponse = await axios.get(
        `https://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=${API_KEY}`
      );

      if (geoResponse.data.length === 0) {
        throw new Error("Location not found. Try another area.");
      }

      const { lat, lon, name, country } = geoResponse.data[0];

      // Step 2: Fetch weather data using coordinates
      const weatherResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );

      setWeather({ ...weatherResponse.data, name, country });
    } catch (err) {
      setError(err.message || "An error occurred. Try again.");
    }

    setLoading(false);
  };

  return (
    <div id="main-div" className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-4">Weather App</h1>
<br/>
<br/>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          fetchWeather();
        }}
        className="mb-4 flex flex-col items-center"
      >
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="p-2 rounded-md bg-gray-700 text-white focus:outline-none w-64 text-center"
          placeholder="Enter area (e.g., Bahadurabad, Kalapul)..."
        />
        <button type="submit" className="mt-2 p-2 bg-blue-600 rounded-md w-40">
          Search
        </button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
<br/>
<br/>
      {weather && (
        <div id="update" className="bg-gray-800 p-6 rounded-lg text-center shadow-lg mt-4 w-72">
          <h2 className="text-2xl font-bold">{weather.name}, {weather.country}</h2>
          <p className="text-lg capitalize">{weather.weather[0].description}</p>
          <h3 className="text-5xl font-bold my-2">{Math.round(weather.main.temp)}°C</h3>
          <p>Humidity: {weather.main.humidity}%</p>
          <p>Wind Speed: {weather.wind.speed} km/h</p>
        </div>
      )}
    </div>
  );
};

export default WeatherApp;
