import cities from "../../lib/city.list.json";
import moment from "moment-timezone";
import Link from "next/link";
import Head from "next/head";
import TodaysWeather from "../../components/TodaysWeather";
import HourlyWeather from "../../components/HourlyWeather";

export async function getServerSideProps(context) {
    const city = getCityId(context.params.city);
  
    if (!city) {
        return {
          notFound: true,
        };
    }
    const res = await fetch(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${city.coord.lat}&lon=${city.coord.lon}&appid=${process.env.API_KEY}&exclude=minutely&units=metric`
    );
      
    const data = await res.json();
      
    if (!data) {
        return {
          notFound: true,
        };
    }
      
    const hourlyWeather = getHourlyWeather(data.hourly, data.timezone);
    const weeklyWeather = data.daily;
      
    return {
        props: {
          city: city,
          timezone: data.timezone,
          currentWeather: data.current,
          hourlyWeather: hourlyWeather,
          weeklyWeather: weeklyWeather,
    
        }   
    }; // will be passed to the page component as props

    const getCityId = (param) => {
        const cityParam = param.trim();
        // get the id of the city
        const splitCity = cityParam.split("-");
        const id = splitCity[splitCity.length - 1];
        if (!id) {
          return null;
        }
      
        const city = cities.find((city) => city.id.toString() == id);
        if (city) {
          return city;
        } else {
          return null;
        }
    };
    const getHourlyWeather = (hourlyData, timezone) => {
        const endOfDay = moment().tz(timezone).endOf("day").valueOf();
        const eodTimeStamp = Math.floor(endOfDay / 1000);
        const todaysData = hourlyData.filter((data) => data.dt < eodTimeStamp);
      
        return todaysData;
    };

}