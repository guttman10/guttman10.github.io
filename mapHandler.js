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

  // Remove previous layer
  if (currentLayer) map.removeLayer(currentLayer);

  const data = trip[day];
  if (!data) {
    console.error(`No data found for day: ${day}`);
    return;
  }

  currentHotel = data.hotel;

  currentLayer = L.featureGroup(); // Always a feature group

  // Add polyline for route if activity coords exist
  const activityCoords = data.activities
    .filter(a => a.loc)
    .map(a => a.loc);

  if (activityCoords.length > 1) {
    const route = L.polyline(activityCoords, { weight: 4, color: '#3388ff' });
    currentLayer.addLayer(route);
  }

  // Add markers for activities
  if (data.activities) {
    data.activities.forEach(act => {
      if (!act.loc) return;
      const marker = L.marker(act.loc)
        .bindPopup(`Day ${day} — ${act.name}`);
      currentLayer.addLayer(marker);
    });
  }

  // Add hotel marker
  if (data.hotel) {
    const hotelIcon = L.icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    const hotelMarker = L.marker(data.hotel, { icon: hotelIcon })
      .bindPopup("Hotel");
    currentLayer.addLayer(hotelMarker);
  }

  currentLayer.addTo(map);

  // Fit map bounds safely
  if (currentLayer.getLayers().length > 0) {
    const bounds = currentLayer.getBounds();
    if (bounds.isValid()) map.fitBounds(bounds, { padding: [60, 60] });
  }

  // Update info box
  let html = `<b>${data.date} — ${data.city}</b>`;
  if (data.text) html += `<pre>${data.text}</pre>`;

  if (data.activities && data.activities.length) {
    html += `<b>Activities</b><ul>`;
    data.activities.forEach(act => html += `<li>${act.name}</li>`);
    html += `</ul>`;
  } else {
    html += `<p>No activities listed for this day.</p>`;
  }

  document.getElementById("infoBox").innerHTML = html;

  // Highlight selected button
  document.querySelectorAll("#controls button").forEach(b => b.classList.remove("active"));
  const btn = document.querySelector(`#controls button[data-day="${day}"]`);
  if (btn) btn.classList.add("active");

  // Save last day
  localStorage.setItem("lastDay", day);

  // Scroll info
  document.getElementById("infoBox").scrollIntoView({ behavior: "smooth" });

  console.log(`Day ${day} loaded`);
}

// Jump to hotel
function returnToHotel() {
  if (currentHotel) map.setView(currentHotel, 15);
}

// Attach functions to global window
window.showDay = showDay;
window.returnToHotel = returnToHotel;