import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, useMap, Polyline, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const trip = {
  1: {
    city: "Tokyo",
    coords: [[35.6762, 139.6503], [35.6595, 139.7005]],
    text: `
Arrival Day – Shibuya Introduction

• Airport → Hotel (Narita ~60–75 min, Haneda ~30–45 min).
• Check-in, shower, short rest.
• Head to Shibuya before sunset.

What to do:
– Walk Shibuya Crossing (best from Starbucks 2F view).
– Visit Shibuya Sky (book sunset slot in advance).
– Explore Center-gai street.
– Dinner suggestion: ramen or conveyor sushi nearby.

Tips:
✔ Don’t overplan — jet lag day.
✔ Get Suica/PASMO immediately.
✔ Convenience stores are your friend tonight.
`
  },
  2: {
    city: "Tokyo",
    coords: [[35.6984, 139.7730], [35.7138, 139.7774]],
    text: `
Akihabara + Ueno

Morning (less crowded):
– Start in Akihabara.
– Anime shops (Mandarake, Super Potato).
– Gachapon machines.
– Arcades (Taito Station).

Afternoon:
– Walk to Ueno Park.
– Relax near Shinobazu Pond.
– Optional: Tokyo National Museum.

Food tip:
Try gyudon or tonkatsu nearby.

Transport:
Use Yamanote Line (~10 min between areas).

✔ Bring passport for tax-free shopping.
✔ Keep luggage light – lots of browsing.
`
  },
  3: {
    city: "Tokyo",
    coords: [[35.7148, 139.7967], [35.7100, 139.8107]],
    text: `
Asakusa + Skytree

Morning:
– Senso-ji Temple (arrive before 9am).
– Nakamise shopping street.
– Try fresh melon pan or taiyaki.

Afternoon:
– Walk or short train to Tokyo Skytree.
– Reserve tower ticket in advance.
– Solamachi mall for shopping.

Photo tip:
Temple is best early morning.
Skytree best near sunset.

✔ Respect temple etiquette (no loud talking).
`
  },
  4: {
    city: "Tokyo",
    coords: [[35.6762, 139.6503], [35.6329, 139.8804]],
    text: `
Tokyo Disneyland

Full Day (8–10h)

Strategy:
– Arrive 30–45 min before opening.
– Use Premier Access for top rides.
– Ride popular attractions early.

Must-try:
– Beauty and the Beast
– Pooh’s Hunny Hunt

Food:
Grab popcorn buckets early (they sell out).

✔ Comfortable shoes.
✔ Bring portable charger.
`
  },
  5: {
    city: "Hakone",
    coords: [[35.6762, 139.6503], [35.2323, 139.1069]],
    text: `
Hakone + Onsen Night

Morning:
– Romancecar to Hakone.
– Purchase Hakone Free Pass.

Hakone Loop:
– Ropeway
– Pirate Ship Lake Ashi
– Owakudani black eggs

If weather clear:
Great Mt. Fuji views.

Evening:
– Ryokan check-in.
– Onsen before dinner.
– Kaiseki dinner experience.

✔ Tattoo policy check for onsen.
✔ Relax day — not rush day.
`
  },
  6: {
    city: "Kyoto",
    coords: [[35.0116, 135.7681], [34.9671, 135.7727]],
    text: `
Travel to Kyoto + Fushimi Inari

Morning:
– Shinkansen to Kyoto (~2h).
– Drop luggage at hotel.

Afternoon:
– Fushimi Inari hike (2–3h).
– Go up halfway for best balance.

Best time:
Late afternoon for softer light.

✔ Wear good shoes (many stairs).
✔ Bring water.
`
  },
  7: {
    city: "Kyoto",
    coords: [[35.0116, 135.7681], [35.0094, 135.6668]],
    text: `
Arashiyama Day

Morning:
– Bamboo Forest (before 8:30am).
– Tenryu-ji Garden.
– River walk.

Optional:
Monkey Park (30–45 min hike).

Lunch:
Try tofu specialty (Kyoto famous).

✔ Go early – extremely crowded after 10am.
`
  },
  8: {
    city: "Kyoto",
    coords: [[35.0116, 135.7681], [35.0394, 135.7292], [35.0037, 135.7788]],
    text: `
Golden Pavilion + Gion

Morning:
– Kinkaku-ji (arrive early).
– Short visit (~1h).

Afternoon:
– Nishiki Market snacks.
– Walk Gion district.
– Yasaka Shrine at sunset.

Evening:
Possible geisha sighting in Gion.

✔ Keep quiet in traditional streets.
`
  },
  9: {
    city: "Osaka",
    coords: [[34.6937, 135.5023], [34.6654, 135.4323]],
    text: `
Universal Studios Japan

Arrive before opening.
Express Pass highly recommended.

Must areas:
– Super Nintendo World
– Harry Potter

Plan:
Ride high demand attractions first.

✔ Check entry times for Nintendo area.
✔ Bring snacks (allowed small items).
`
  },
  10: {
    city: "Osaka",
    coords: [[34.6937, 135.5023], [34.6687, 135.5030]],
    text: `
Osaka City + Dotonbori

Morning:
– Optional Osaka Castle.
– Kuromon Market.

Evening:
– Dotonbori neon lights.
– Try takoyaki + okonomiyaki.
– Glico running man photo.

✔ Best atmosphere after dark.
`
  },
  11: {
    city: "Tokyo",
    coords: [[35.6762, 139.6503], [35.6702, 139.7026]],
    text: `
Harajuku + Meiji Shrine

Morning:
– Meiji Shrine (peaceful forest walk).
– Then Takeshita Street.

Afternoon:
– Omotesando shopping.
– Cat street cafes.

✔ Sunday best for street fashion.
`
  },
  12: {
    city: "Tokyo",
    coords: [[35.6762, 139.6503], [35.6272, 139.7768]],
    text: `
Odaiba Waterfront

– TeamLab (book in advance if included).
– Rainbow Bridge views.
– DiverCity shopping.

Great sunset location.

✔ Good half-relaxed day.
`
  },
  13: {
    city: "Tokyo",
    coords: [[35.6762, 139.6503]],
    text: `
Free Exploration Day

Ideas:
– Return to favorite area.
– Ginza luxury shopping.
– Shimokitazawa vintage stores.
– Last tax-free shopping.

✔ Pack luggage in evening.
`
  },
  14: {
    city: "Tokyo",
    coords: [[35.6762, 139.6503], [35.5494, 139.7798]],
    text: `
Departure Day

– Leave 3h before international flight.
– Train to Haneda ~30–45 min.

Last tip:
Buy airport snacks + KitKat flavors.

✔ Check passport & documents night before.
`
  }
};

const MapComponent = ({ selectedDay }) => {
  const map = useMap();

  useEffect(() => {
    if (selectedDay && trip[selectedDay]) {
      const data = trip[selectedDay];
      const polyline = L.polyline(data.coords, { weight: 4 });
      const markers = data.coords.map(coord => L.marker(coord));

      // Clear previous layers
      map.eachLayer((layer) => {
        if (layer instanceof L.Polyline || layer instanceof L.Marker) {
          map.removeLayer(layer);
        }
      });

      // Add new layers
      polyline.addTo(map);
      markers.forEach(marker => marker.addTo(map));

      // Fit bounds
      if (data.coords.length > 1) {
        map.fitBounds(polyline.getBounds());
      } else {
        map.setView(data.coords[0], 13);
      }
    }
  }, [selectedDay, map]);

  return null;
};

const Japan = () => {
  const [selectedDay, setSelectedDay] = useState(null);

  useEffect(() => {
    const lastDay = localStorage.getItem('lastDay');
    if (lastDay) {
      setSelectedDay(parseInt(lastDay));
    }
  }, []);

  const showDay = (day) => {
    setSelectedDay(day);
    localStorage.setItem('lastDay', day);
  };

  const downloadItinerary = () => {
    let csv = 'Day,City,Details\n';
    Object.keys(trip).forEach(d => {
      const entry = trip[d];
      csv += d + ',' + entry.city + ',' + entry.text.replace(/,/g, '') + '\n';
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'itinerary.csv';
    a.click();
  };

  const data = selectedDay ? trip[selectedDay] : null;

  return (
    <div style={{ fontFamily: "'Roboto', Arial, sans-serif", background: '#f0f2f5', color: '#333', margin: 0, padding: 0, minHeight: '100vh' }}>
      <header style={{ background: '#34495e', color: '#ecf0f1', textAlign: 'center', padding: '20px 0', fontSize: '1.5rem', fontWeight: 500, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        Japan 14 Day Trip <button onClick={downloadItinerary} style={{ fontSize: '0.8em', padding: '4px 8px', marginLeft: '20px', cursor: 'pointer', border: 'none', borderRadius: '4px', background: '#e67e22', color: 'white' }}>Download Itinerary</button>
      </header>

      <div id="controls" style={{ padding: '15px', background: '#2c3e50', color: '#ecf0f1', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px', borderRadius: '8px', maxWidth: '1000px', margin: '20px auto 0' }}>
        <div className="cityTitle" style={{ flexBasis: '100%', marginTop: '10px', fontWeight: 700, fontSize: '1.1em', letterSpacing: '1px', textTransform: 'uppercase' }}>Tokyo (arrival)</div>
        {[1,2,3,4].map(day => (
          <button key={day} onClick={() => showDay(day)} className={selectedDay === day ? 'active' : ''} style={{ margin: '4px', padding: '8px 14px', cursor: 'pointer', border: 'none', borderRadius: '4px', background: selectedDay === day ? '#c0392b' : '#e67e22', color: 'white', transition: 'background 0.3s' }}>
            Day {day}
          </button>
        ))}

        <div className="cityTitle" style={{ flexBasis: '100%', marginTop: '10px', fontWeight: 700, fontSize: '1.1em', letterSpacing: '1px', textTransform: 'uppercase' }}>Hakone</div>
        <button onClick={() => showDay(5)} className={selectedDay === 5 ? 'active' : ''} style={{ margin: '4px', padding: '8px 14px', cursor: 'pointer', border: 'none', borderRadius: '4px', background: selectedDay === 5 ? '#c0392b' : '#e67e22', color: 'white', transition: 'background 0.3s' }}>
          Day 5
        </button>

        <div className="cityTitle" style={{ flexBasis: '100%', marginTop: '10px', fontWeight: 700, fontSize: '1.1em', letterSpacing: '1px', textTransform: 'uppercase' }}>Kyoto</div>
        {[6,7,8].map(day => (
          <button key={day} onClick={() => showDay(day)} className={selectedDay === day ? 'active' : ''} style={{ margin: '4px', padding: '8px 14px', cursor: 'pointer', border: 'none', borderRadius: '4px', background: selectedDay === day ? '#c0392b' : '#e67e22', color: 'white', transition: 'background 0.3s' }}>
            Day {day}
          </button>
        ))}

        <div className="cityTitle" style={{ flexBasis: '100%', marginTop: '10px', fontWeight: 700, fontSize: '1.1em', letterSpacing: '1px', textTransform: 'uppercase' }}>Osaka</div>
        {[9,10].map(day => (
          <button key={day} onClick={() => showDay(day)} className={selectedDay === day ? 'active' : ''} style={{ margin: '4px', padding: '8px 14px', cursor: 'pointer', border: 'none', borderRadius: '4px', background: selectedDay === day ? '#c0392b' : '#e67e22', color: 'white', transition: 'background 0.3s' }}>
            Day {day}
          </button>
        ))}

        <div className="cityTitle" style={{ flexBasis: '100%', marginTop: '10px', fontWeight: 700, fontSize: '1.1em', letterSpacing: '1px', textTransform: 'uppercase' }}>Tokyo (return)</div>
        {[11,12,13,14].map(day => (
          <button key={day} onClick={() => showDay(day)} className={selectedDay === day ? 'active' : ''} style={{ margin: '4px', padding: '8px 14px', cursor: 'pointer', border: 'none', borderRadius: '4px', background: selectedDay === day ? '#c0392b' : '#e67e22', color: 'white', transition: 'background 0.3s' }}>
            Day {day}
          </button>
        ))}
      </div>

      <MapContainer center={[35.5, 137]} zoom={6} style={{ height: '75vh', boxShadow: '0 2px 8px rgba(0,0,0,0.15)', borderRadius: '8px', margin: '20px auto', maxWidth: '1000px' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='© OpenStreetMap'
        />
        <MapComponent selectedDay={selectedDay} />
      </MapContainer>

      <div id="infoBox" style={{ padding: '25px', background: 'white', maxWidth: '1000px', margin: '20px auto 40px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', minHeight: '120px', lineHeight: '1.8', fontSize: '0.95em' }}>
        {data ? (
          <>
            <b>Day {selectedDay} - {data.city}</b>
            <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', fontFamily: "'Roboto', Arial, sans-serif", lineHeight: '1.7', color: '#444', margin: '0' }}>{data.text}</pre>
          </>
        ) : (
          <b>Select a day to see details.</b>
        )}
      </div>
    </div>
  );
};

export default Japan;