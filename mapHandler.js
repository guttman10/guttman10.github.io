// mapHandler.js

// Initialize the map
const map = L.map('map', {
  scrollWheelZoom: false,
  doubleClickZoom: false,
  boxZoom: false,
  keyboard: false
}).setView([35.5, 137], 8);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap'
}).addTo(map);

let currentLayer = null;
let currentHotel = null;

function showDay(day, trip) {

console.log(`showDay called with day: ${day}`, trip);

if (currentLayer) {
map.removeLayer(currentLayer);
}

const data = trip[day];

if (!data) {
console.error(`No data found for day: ${day}`);
return;
}

currentHotel = data.hotel;

currentLayer = L.featureGroup();


// ACTIVITY MARKERS
if (data.activities) {

data.activities.forEach(act => {

if (!act.loc) return;

L.marker(act.loc)
.bindPopup(`Day ${day} — ${act.name}`)
.addTo(currentLayer);

});

}


// HOTEL MARKER
if (data.hotel) {

const hotelIcon = L.icon({
iconUrl:'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
shadowUrl:'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
iconSize:[25,41],
iconAnchor:[12,41],
popupAnchor:[1,-34],
shadowSize:[41,41]
});

L.marker(data.hotel,{icon:hotelIcon})
.bindPopup("Hotel")
.addTo(currentLayer);

}

currentLayer.addTo(map);


// MAP ZOOM
if (currentLayer.getLayers().length > 0) {

const bounds = currentLayer.getBounds();

if (bounds.isValid()) {
map.fitBounds(bounds,{padding:[60,60]});
}

}


// INFO BOX
let html = "";

html += `<b>${data.date} — ${data.city}</b>`;

if (data.text) {
html += `<pre>${data.text}</pre>`;
}

if (data.activities && data.activities.length) {

html += `<b>Activities</b>`;
html += `<ul>`;

data.activities.forEach(act=>{
html += `<li>${act.name}</li>`;
});

html += `</ul>`;

} else {

html += `<p>No activities listed for this day.</p>`;

}

document.getElementById("infoBox").innerHTML = html;


// BUTTON HIGHLIGHT
document
.querySelectorAll("#controls button")
.forEach(b=>b.classList.remove("active"));

const btn = document.querySelector(`#controls button[data-day="${day}"]`);

if (btn) btn.classList.add("active");


// SAVE LAST DAY
localStorage.setItem("lastDay", day);


// SCROLL INFO
document
.getElementById("infoBox")
.scrollIntoView({behavior:"smooth"});

console.log(`Day ${day} loaded`);

}


function returnToHotel() {
if (currentHotel) {
map.setView(currentHotel, 15);
}
}


// Attach functions to global window
window.showDay = showDay;
window.returnToHotel = returnToHotel;