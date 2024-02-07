import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Tab } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Usercentric from "./Usercentric";

const Banner = () => {
  const [weather, setWeather] = useState(null);
  const [position, setPosition] = useState({ latitude: "", longitude: "" });
  const [fetchPosition, setFetchPosition] = useState({ latitude: "", longitude: "" });
  const [city, setCity] = useState("");
  const [cityInput, setCityInput] = useState("");
  const [getPosition, setGetPosition] = useState(false);
  // const [forecast, setForecast] = useState([]);
  const [hourlyData, setHourlyData] = useState([]);
  const [dailyData, setDailyData] = useState([]);

  useEffect(() => {
    if (getPosition) {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(function (position) {
          setPosition({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        });
      } else {
        setGetPosition(false);
        alert("Geolocation is not available in your browser");
      }
    }
  }, [getPosition]);
  // let celcius = 0;
  // let faranheit = 0;

  

  useEffect(() => {
    const getWeatherData = () => {
      try {
        if (getPosition) {
          const apiPos = `http://api.openweathermap.org/data/2.5/weather?lat=${position.latitude}&lon=${position.longitude}&appid=69cca3f8467d482bb64b4336b16773b6`;
  
          axios.get(apiPos).then((ress) => {
            setCity(ress.data.name);
            console.log(ress.data.name);
          });
        }
  
        let api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=69cca3f8467d482bb64b4336b16773b6`;
  
        axios.get(api).then((res) => {
          let temp = Math.round(res.data.main.temp);
          // console.log(temp);
          let feelsLike = Math.round(res.data.main.feels_like);
  
          let faranheit = Math.round((temp - 273.15) * 1.8 + 32);
          let celcius = Math.round((faranheit - 32) / 1.8);
  
          const weatherdata = {
            location: `${res.data.name}`,
            temperature: `${temp}`,
            temperatureinC: `${celcius}`,
            temperatureinF: `${faranheit}`,
            feelsLiike: `${feelsLike}`,
            humidity: `${res.data.main.humidity}`,
            wind: `${Math.round(res.data.wind.speed * 3600) / 1000}`,
            condition: `${res.data.weather[0].description}`,
            pngID: `${res.data.weather[0].icon}`,
          };
  
          setFetchPosition({ latitude: res.data.coord.lat, longitude: res.data.coord.lon })
          setWeather(weatherdata);
        });
      } catch (e) {
        console.log("Error:", e);
        alert(e);
      }
    };
    if (city) {
      getWeatherData();
    }
  }, [city, getPosition, position.latitude, position.longitude]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCity(cityInput);
    setGetPosition(false);
  };

  const handleInput = (e) => {
    setCityInput(e.target.value);
  };

  // console.log("Current City:", city);
  // console.log("Weather response:", fetchPosition);
  // console.log("Hourly response:", hourlyData);
  // console.log("Daily response:", dailyData);

  const handleuseGPS = () => {
    setGetPosition(true);
  };

  useEffect(() => {
    if (weather) {
      try {
        const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&exclude=current,minutely,alerts&units=metric&appid=69cca3f8467d482bb64b4336b16773b6`;

        axios.get(url).then((response) => {
          const allData = response.data.list;

          // Extracting hourly data for today
          const today = new Date().toLocaleDateString();
          const todayHourly = allData.filter(
            (item) => new Date(item.dt * 1000).toLocaleDateString() === today
          );

          // Extracting one entry per day for the next 7 days
          const next7DaysData = [];
          const next7DaysSet = new Set();

          allData.forEach((item) => {
            const itemDate = new Date(item.dt * 1000).toLocaleDateString();
            if (!next7DaysSet.has(itemDate)) {
              next7DaysSet.add(itemDate);
              next7DaysData.push(item);
            }
          });

          setHourlyData(todayHourly);
          setDailyData(next7DaysData);
        });
      } catch (e) {
        console.log(e);
      }
    }
  }, [weather, city]);

  const [value, setValue] = React.useState("one");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className=" h-full  w-full text-white bg-[#E8E9F3">
      <div className=" h-64 rounded-2xl mt-2 mr-8 ml-8 shadow-2xl">
        <div className="absolute w-[95%]  rounded-2xl h-64 bg-gradient-to-l from-gray-700 "></div>
        <img
          className=" w-full h-64 object-cover rounded-2xl"
          src="https://i.pinimg.com/564x/bc/37/d3/bc37d3bf4601abe71137fc9beb46c708.jpg"
          alt=""
        />
        <div className="gap-4 flex  pt-2 absolute right-[30%] top-[11%]">
          <input
            type="text"
            id="searchInput"
            onChange={(e) => handleInput(e)}
            className="dark: text-black w-56 pt-1 pl-2 pb-1 rounded shadow-xl"
          />
          <button
            onClick={(e) => handleSearch(e)}
            className="bg-[#B4C5E4] dark: text-black rounded pl-2 pr-2"
          >
            Search
          </button>
          <button
            onClick={handleuseGPS}
            className="bg-[#B4C5E4] dark: text-black rounded pl-2 pr-2"
          >
            Use My Location
          </button>
        </div>
        <div className="w-full mt-2">
          {weather && (
            <div>
              <div className="flex flex-row absolute gap-4  top-[20%]">
                <div className="flex flex-col w-32 h-10 ">
                  <img
                    className="flex justify-center items-center"
                    src={`https://openweathermap.org/img/wn/${weather.pngID}@2x.png`}
                    alt={weather.condition}
                  />
                </div>
                <div>
                  <p className="font-semibold tracking-widest text-2xl mb-4">
                    {" "}
                    {weather.location}
                  </p>
                  <div className=" pr-4">
                    <p className="font-semibold tracking-wide pb-1">
                      Temperature:{" "}
                      <span className="tracking-widest ml-5">
                        {weather.temperatureinF}°F / {weather.temperatureinC}°C
                      </span>
                    </p>
                    <p className="font-semibold tracking-wide pb-1">
                      Condition:{" "}
                      <span className="tracking-widest ml-12">
                        {weather.condition}
                      </span>
                    </p>
                    <p className="font-semibold tracking-wide pb-1">
                      Humidity:{" "}
                      <span className="tracking-widest ml-14">
                        {weather.humidity} %
                      </span>
                    </p>
                    <p className="font-semibold tracking-wide pb-1">
                      Wind Speed:{" "}
                      <span className="tracking-widest ml-8">
                        {weather.wind} Km/h
                      </span>{" "}
                    </p>
                  </div>
                </div>
                <div>
                  <TabContext value={value}>
                    <TabList onChange={handleChange}>
                      <Tab label="Hourly" value="one" />
                      <Tab label="7-day" value="two" />
                    </TabList>
                    <TabPanel value="one">
                      {hourlyData.length > 0 && (
                        <div className="flex flex-row gap-4">
                          {hourlyData.map((item, idx) => (
                            <div
                              key={item.dt}
                              className=" w-28 h-24 rounded-xl justify-center text-center items-center content-center shadow-2xl backdrop-blur-lg"
                            >
                              <p>
                                {new Date(item.dt * 1000).toLocaleTimeString(
                                  [],
                                  {
                                    hour: "numeric",
                                    minute: "numeric",
                                    hour12: true,
                                  }
                                )}
                              </p>
                              <div className="flex flex-row justify-center text-center items-center">
                                <img
                                  className=""
                                  src={`https://openweathermap.org/img/wn/${item.weather[0].icon}.png`}
                                  alt=""
                                />
                                <p>{item.main.temp}°C</p>
                              </div>
                              <p className="text-center mt-[-5px]">
                                {" "}
                                {item.weather[0].description}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </TabPanel>

                    {/* 7 day data  */}

                    <TabPanel value="two">
                      {dailyData.length > 0 && (
                        <div className="flex flex-row gap-1">
                          {dailyData.map((item) => (
                            <div
                              key={item.dt}
                              className="w-28 h-32 rounded-xl justify-center text-center items-center content-center shadow-2xl backdrop-blur-lg"
                            >
                              <p>
                                {new Date(item.dt * 1000).toLocaleDateString(
                                  "en-GB",
                                  {
                                    weekday: "short",
                                  }
                                )}
                              </p>
                              <p className="text-[12px]">
                                {new Date(item.dt * 1000).toLocaleDateString(
                                  "en-GB"
                                )}
                              </p>
                              <div className="flex flex-row justify-center text-center items-center mt-[-5px]">
                                <img
                                  className=""
                                  src={`https://openweathermap.org/img/wn/${item.weather[0].icon}.png`}
                                  alt=""
                                />
                                <p>{item.main.temp}°C</p>
                              </div>
                              <p className="text-center mt-[-5px]">
                                {" "}
                                {item.weather[0].description}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </TabPanel>
                  </TabContext>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
  <Usercentric city={fetchPosition} position={position}/>

    </div>
    
  );
};

export default Banner;
