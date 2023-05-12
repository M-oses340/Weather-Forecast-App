import Head from "next/head";
import SearchBox from "../components/searchbox";
import { magic } from "../lib/magic-client";

export default function Home() {
  return (
    <div>
      <Head>
        <title>Weather Forecast App</title>
      </Head>
      <div className="home">


      <div className="container">
        <h1><center>Weather Forecast App</center></h1>
        <SearchBox placeholder= "search for a city" />      
      </div>
    </div>
    </div>

    
  )
}