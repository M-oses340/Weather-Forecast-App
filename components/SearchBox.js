import React, { useEffect, useState } from "react";
import cities from "../lib/city.list.json";
import Link from "next/link";
import Router from "next/router";

export default function SearchBox() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    const clearQuery = () => setQuery("");

    Router.events.on("routeChangeComplete", clearQuery);

    return () => {
      Router.events.off("routeChangeComplete", clearQuery);
    };
  }, []);

  const onChange = (e) => {
    const { value } = e.target;

    setQuery(value);

    let matchingCities = [];

    if (value.length > 3) {
      for (let city of cities) {
        if (matchingCities.length >= 5) {
          break;
        }

        const match = city.name.toLowerCase().startsWith(value.toLowerCase());

        if (match) {
          const cityData = {
            ...city,
            slug: `${city.name.toLowerCase().replace(/ /g, "-")}-${city.id}`,
          };
          matchingCities.push(cityData);
        }
      }
    }

    setResults(matchingCities);
  };

  const getCityID = (cityName) => {
    const city = cities.find((c) => c.name.toLowerCase() === cityName.toLowerCase());
    return city ? city.id.toString() : "";
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "//openweathermap.org/themes/openweathermap/assets/vendor/owm/js/weather-widget-generator.js";
    script.async = true;
    script.charset = "utf-8";

    const container = document.getElementById("openweathermap-widget-15");
    container.innerHTML = ""; // Clear the container before appending the script

    container.appendChild(script);

    return () => {
      container.innerHTML = ""; // Clean up the container when the component unmounts
    };
  }, []);

  return (
    <>
      <div id="openweathermap-widget-15"></div>
      <script
        dangerouslySetInnerHTML={{
          __html: `
          window.myWidgetParam ? window.myWidgetParam : (window.myWidgetParam = []);
          window.myWidgetParam.push({
            id: 15,
            cityid: '${getCityID(query)}',
            appid: '1a46e2afd2ed1b876bdb85d0486ede65',
            units: 'metric',
            containerid: 'openweathermap-widget-15',});
        `,
        }}
      ></script>
      <input type="text" value={query} onChange={onChange} placeholder="Search for a city" />
      {results.length > 0 && (
        <ul>
          {results.map((city) => (
            <li key={city.slug}>
              <Link href={`/location/${city.slug}`}>
                <a>
                  {city.name}
                  {city.state ? `, ${city.state}` : ""} <span>({city.country})</span>
                </a>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
