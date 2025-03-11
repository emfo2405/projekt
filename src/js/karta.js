"use strict";

//Skapa en tom array för att lagra inläst data i
let data = [];
let airData = [];

//När man klickar på sökknappen körs funktionen fetchData för att hämta in data för sökningen
document.getElementById('search-button').onclick = fetchData;

//Funktion för att hämta in data från API
/**
 * Hämtar in data från nominatim API för en plats
 * @function fetchData
 * @param {value} searchInput - Tar in värdet för det som skrivs in i sökrutan
 * @param response - Hämtar API för nominatim
 * @param data - Svar från inhämtat API
 * Sedan körs funktionen takeData med @param data som input
 */
async function fetchData() {
    try {
        //Hämtar in data
        const searchInput = document.getElementById("search").value;



        const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${searchInput}&format=json`);
        //Felmeddelande om datan inte läses in korrekt
        if (!response.ok) {
            throw new Error("Fel vid anslutning till data...");
        }

        //sparar datan till den tomma arrayen
        data = await response.json();

        //Kör funktioner för att skriva ut data

        takeData(data);

        //Felmeddelande om något går fel
    } catch (error) {
        console.error(error);
    }
}

//Funktion för att ta ut longitud och latitud för sökt plats
/**
 * @function takeData
 * @param {*} data - Hämtat API från fetchData
 * @param {Array} latitudeSearch - Tar ut latituder för de platser som matchar det som skrivits in i sökrutan
 * @param {Number} latitudeSearchEl - Tar ut latitud för den första platsen i arrayen latitudeSearch
 * @param {Array} longitudeSearch - Tar ut longituder för de platser som matchar det som skrivits in i sökrutan
 * @param {Number} longitudeSearchEl - Tar ut longitud för den första platsen i arrayen i longitudeSearch
 * Värden för att skapa en boundingbox behövs för att zooma in på den plats på kartan man vill visa
 * Detta skapas här genom att ta värden för min latitud, min longitud, max longitud och max latitud
 * @param {Number} minLat - Latitud från latitudeSearchEl - 0,1 för att få min longitud
 * @param {Number} maxLat - Latitud från latitudeSearchEl + 0,1 för att få max latitud
 * @param {Number} minLong - Longitud från longitudeSearchEl - 0.1 för att få min longitud
 * @param {Number} maxLong - Longitud från longitudeSearchEl + 0.1 för att få max longitud
 * Till sist uppdateras länken för kartan med variabler för latitud och longitud för att visa kartan för vald plats
 */
function takeData(data) {

    const latitudeSearch = data.map(plats => plats.lat);
    const latitudeSearchEl = latitudeSearch[0];

    const longitudeSearch = data.map(plats => plats.lon);
    const longitudeSearchEl = longitudeSearch[0];

    const minLat = Number(latitudeSearchEl) - 0.1;
    const maxLat = Number(latitudeSearchEl) + 0.1;
    const minLong = Number(longitudeSearchEl) - 0.1;
    const maxLong = Number(longitudeSearchEl) + 0.1;


    fetchAirData(latitudeSearchEl,longitudeSearchEl);



    document.getElementById("karta").src = `https://www.openstreetmap.org/export/embed.html?bbox=${minLong},${minLat},${maxLong},${maxLat}&layer=mapnik&marker=${latitudeSearchEl},${longitudeSearchEl}`;


}

async function fetchAirData(latitudeSearchEl,longitudeSearchEl) {
    try {
        //Hämtar in data
        const airResponse = await fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitudeSearchEl}&longitude=${longitudeSearchEl}&current=pm10,pm2_5`);
        //Felmeddelande om datan inte läses in korrekt
        if (!airResponse.ok) {
            throw new Error("Fel vid anslutning till data...");
        }

        //sparar datan till den tomma arrayen
        airData = await airResponse.json();

        //Kör funktioner för att skriva ut data

        runAirData(airData);

        //Felmeddelande om något går fel
    } catch (error) {
        console.error(error);
    }
}

function runAirData(airData) {
    
    const airDataEl = airData.current;

    const airDataPM10 = airDataEl.pm10;
    const airDataPM2_5 = airDataEl.pm2_5;

    document.getElementById("pm10").innerHTML = airDataPM10 + " &#181g/m&#179";
    document.getElementById("pm25").innerHTML = airDataPM2_5 + " &#181g/m&#179";

    if (airDataPM10 > 50) {
        document.getElementById("symbol").innerHTML = "sentiment_dissatisfied";
        document.getElementById("symbol").style.color = "red";
    } else if (airDataPM10 > 20) {
        document.getElementById("symbol").innerHTML = "sentiment_neutral";
        document.getElementById("symbol").style.color = "orange";
    } else {
        document.getElementById("symbol").innerHTML = "sentiment_satisfied";
        document.getElementById("symbol").style.color = "green";
    }

}