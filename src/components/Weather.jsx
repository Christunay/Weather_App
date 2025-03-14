import React,{useEffect, useState, useRef} from 'react'
import './Weather.css'
import magnifyingGlassIcon from '../assets/magnifyingGlass.png';
import sun_icon from '../assets/sun.png';
import rain_icon from '../assets/rain.png';
import windy_icon from '../assets/windy.png';
import drizzle_icon from '../assets/drizzle.png';
import humidity_icon from '../assets/humidity.png';
import snow_icon from '../assets/snow.png';
import cloudy_icon from '../assets/cloudy.png';



const weather = () => {

  const inputRef = useRef();
  const [weatherData, setWeatherData] = useState(null)
  const [loading, setLoading]= useState(false);
  const [unit, setUnit] = useState('imperial');
  const [isFahrenheit, setIsFahrenheit] = useState(true);
     
     const allIcons = {
      "01d":sun_icon,
      "01n":sun_icon,
      "02d":cloudy_icon,
      "02n":cloudy_icon,
      "03d":cloudy_icon,
      "03n":cloudy_icon,
      "04d":drizzle_icon,
      "04n":drizzle_icon,
      "09d":rain_icon,
      "09n":rain_icon,
      "10d":rain_icon,
      "10n":rain_icon,
      "13d":snow_icon,
      "13n":snow_icon,

     };
     
    const search = async (city)=>{
       if(city===""){
        alert("Enter City Name");
        return
       }
       setLoading(true);
       try {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${unit}&appid=${import.meta.env.VITE_APP_ID}`;

        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok){
          alert(data.message);
          setLoading(false);
          return;
        }

        console.log(data);

        const icon =allIcons[data.weather?.[0]?.icon] || sun_icon;

        setWeatherData({
          humidity: data.main.humidity,
          windSpeed: data.wind.speed,
          temperature: Math.floor(data.main.temp),
          location: data.name,
          icon: icon,
        })
       } catch (error){
        setWeatherData(null);
        console.error("Error in fetching weather data")
       } finally{
        setLoading(false);
       }
    };
      
      useEffect(()=>{
        search("London");
      },[unit]);

      //Toggle between Celsius and Fahrenheit
      const toggleUnit = () => {
        setIsFahrenheit(!isFahrenheit);
        setUnit(isFahrenheit ? 'metric' : 'imperial');
      };

  return (
    <div className='weather'>
      <div className="search-bar">
        <input ref={inputRef}  type="text" placeholder='Search'/>
        <img src={magnifyingGlassIcon} alt="" onClick={()=>search(inputRef.current.value)}   />
        
         </div>

         <button onClick={toggleUnit} className='toggle-button'>
          {isFahrenheit ? 'Switch to °C' : 'Switch to °F'}
         </button>
          {loading ? (//Loading State
          <p>Loading...</p>) : 
          
          weatherData ? (<>
          
            <img src={weatherData.icon} alt="" className='weather-icon'/>
          <p className='temperature'>
            {weatherData.temperature}°{isFahrenheit ? 'F': 'C'}

           </p>
          <p className='location'>{weatherData.location}</p>

          <div className="weather-data">
            <div className="col">
              <img src={humidity_icon} alt="" />
              <div>
                <p>{weatherData.humidity} %</p>
                <span>Humidity</span>
              </div>
            </div>

            <div className="col">
             <img src={windy_icon} alt=""/>
             <div>
              <p>{weatherData.windSpeed} {isFahrenheit ? 'mph' : 'm/s'}</p>
              <span>Wind Speed</span>
             </div>
              </div>
            </div>
          </>):<></>};

          </div>
            
    
    
  )
}

export default weather