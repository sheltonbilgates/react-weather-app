import axios from "axios";
import React, { useEffect, useState } from "react";

const Banner = () => {
  const [weather, setWeather] = useState([]);
  const [position, setPosition] = useState({ latitude: null, longitude: null });
  const [city, setCity] = useState("chennai");
  const apikey = "e0ed026973c74c8b8af60748232811";

  // get cureent location
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(function (position) {
        setPosition({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      });
    } else {
      console.log("Geolocation is not available in your browser");
    }
  }, []);

  // weather list
  // const lati = position.latitude
  // const longi = position.longitude

    
 
  useEffect(() => {

    try {
        const apiurl = `http://api.weatherapi.com/v1/current.json?key=${apikey}&q=${city}`;
  
        axios.get(apiurl).then((res) => {
          setWeather(res.data);
        });
        console.log(apiurl);
      } catch (e) {
        console.log(e);
      }
    
  },[city]);

  // console.log(position.latitude, position.longitude);
  // console.log(apiurl);
  // console.log(longi, lati);
  console.log(weather);

  return (
    <div>
      <hr className="h-[2px]" />
      <div className="w-full h-56 ">
        <div></div>
      </div>
    </div>
  );
};

export default Banner;
