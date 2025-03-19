/**
 * @function fetchData - Hämtar in data från nominatim API för en plats
 * @param {value} searchInput - Tar in värdet för det som skrivs in i sökrutan
 * @param response - Hämtar API för nominatim
 * @param data - Svar från inhämtat API
 * Sedan körs funktionen takeData med @param data som input
 */

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

/**
 * @function fetchAirData
 */

"use strict";
window.onload = drawDiagramP;

//Skapa en tom array för att lagra inläst data i
let data = [];
let airData = [];

//När man klickar på sökknappen körs funktionen fetchData för att hämta in data för sökningen
document.getElementById('search-button').onclick = fetchData;

//Funktion för att hämta in data från API
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

    const symbolPM10 = document.getElementById("symbol10");
    const symbolPM25 = document.getElementById("symbol25");

    if (airDataPM10 > 45) {
        symbolPM10.innerHTML = "sentiment_dissatisfied";
        symbolPM10.style.color = "red";
        symbolPM10.style.animation = "spinSymbol 1s infinite alternate";
    } else if (airDataPM10 > 23) {
        symbolPM10.innerHTML = "sentiment_neutral";
        symbolPM10.style.color = "orange";
        symbolPM10.style.animation = "spinSymbol 1s infinite alternate";
    } else {
        symbolPM10.innerHTML = "sentiment_satisfied";
        symbolPM10.style.color = "green";
        symbolPM10.style.animation = "spinSymbol 1s infinite alternate";
    }

    if (airDataPM2_5 > 15) {
        symbolPM25.innerHTML = "sentiment_dissatisfied";
        symbolPM25.style.color = "red";
        symbolPM25.style.animation = "spinSymbol 1s infinite alternate";
    } else if (airDataPM2_5 > 8) {
        symbolPM25.innerHTML = "sentiment_neutral";
        symbolPM25.style.color = "orange";
        symbolPM25.style.animation = "spinSymbol 1s infinite alternate";
    } else {
        symbolPM25.innerHTML = "sentiment_satisfied";
        symbolPM25.style.color = "green";
        symbolPM25.style.animation = "spinSymbol 1s infinite alternate";
    }

}

const neutral = document.getElementById("neutral25");
const neutral2 = document.getElementById("neutral10");
const dissatisfied = document.getElementById("dissatisfied25");
const dissatisfied2 = document.getElementById("dissatisfied10");
const satisfied = document.getElementById("satisfied25");
const satisfied2 = document.getElementById("satisfied10");

neutral.addEventListener("mouseover",spinNeutral25);
neutral2.addEventListener("mouseover",spinNeutral10);
dissatisfied.addEventListener("mouseover",spinDissatisfied25);
dissatisfied2.addEventListener("mouseover",spinDissatisfied10);
satisfied.addEventListener("mouseover",spinSatisfied25);
satisfied2.addEventListener("mouseover",spinSatisfied10);


function spinNeutral25() {
    neutral.style.animation = 'none';
    void neutral.offsetWidth; 
    neutral.style.animation = "spinAround 3s";
}

function spinNeutral10() {
    neutral2.style.animation = 'none';
    void neutral2.offsetWidth; 
    neutral2.style.animation = "spinAround 3s";
}

function spinDissatisfied25() {
    dissatisfied.style.animation = 'none';
    void dissatisfied.offsetWidth; 
    dissatisfied.style.animation = "spinAround 3s";
}

function spinDissatisfied10() {
    dissatisfied2.style.animation = 'none';
    void dissatisfied2.offsetWidth; 
    dissatisfied2.style.animation = "spinAround 3s";
}
function spinSatisfied25() {
    satisfied.style.animation = 'none';
    void satisfied.offsetWidth; 
    satisfied.style.animation = "spinAround 3s";
}

function spinSatisfied10() {
    satisfied2.style.animation = 'none';
  void satisfied2.offsetWidth; 
    satisfied2.style.animation = "spinAround 3s";
}

const medelPM10 = [0.59, 0.86, 5.18, 1.13, 13.3, 14.84, 3.31, 0.21];
const bidrag = ['Arbetsmaskiner', 'Avfall', 'Uppvärmning av bostad och lokaler', 'El och fjärrvärme', 'Industri', 'Inrikes transporter', 'Jordbruk', 'Lösningsmedel och produktanvändning'];
const medelPM25 = [0.56, 0.85, 4.92, 0.77, 4.26, 2.29, 0.5, 0.14];



function drawDiagramP() {
    console.log('hejsan');
    const medelPM10 = [0.59, 0.86, 5.18, 1.13, 13.3, 14.84, 3.31, 0.21];
const bidrag = ['Arbetsmaskiner', 'Avfall', 'Uppvärmning av bostad och lokaler', 'El och fjärrvärme', 'Industri', 'Inrikes transporter', 'Jordbruk', 'Lösningsmedel och produktanvändning'];


    const ctx = document.getElementById("myChart10");
    new Chart(ctx, {
        type: 'pie',
        data: {
          labels: bidrag,
          datasets: [{
            label: 'Totalt antal sökande',
            data: medelPM10,
            borderWidth: 2,
            backgroundColor: ['#861f0d', '#56423D', '#BEA6A0', '#541308', '#110402']
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
    
        }
      })
    };