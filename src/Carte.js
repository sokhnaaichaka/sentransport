import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './Carte.css';

// Corriger les icones Leaflet (bug webpack)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// EXERCICE 1 : icone orange pour l'arret le plus proche
const iconeProche = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const iconeDefaut = new L.Icon.Default();

// Calculer la distance entre 2 points GPS (km)
function calculerDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// EXERCICE 2 : composant interne pour centrer la carte
function BoutonCentrer({ position }) {
  const map = useMap();
  if (!position) return null;
  return (
    <button
      className="btn-centrer"
      onClick={() => map.setView(position, 15)}
    >
      Centrer sur ma position
    </button>
  );
}

function Carte() {
  const [arrets, setArrets] = useState([]);
  const [positionUtilisateur, setPositionUtilisateur] = useState(null);
  const [arretProche, setArretProche] = useState(null);
  // EXERCICE 3 : les 3 arrets les plus proches
  const [arretsProches, setArretsProches] = useState([]);

  const DAKAR = [14.6928, -17.4467];

  // Charger les arrets depuis Flask
  useEffect(() => {
    fetch("http://localhost:5000/arrets")
      .then(r => r.json())
      .then(data => setArrets(data))
      .catch(err => console.error("Erreur arrets :", err));
  }, []);

  // Geolocalisation
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          setPositionUtilisateur([
            pos.coords.latitude,
            pos.coords.longitude
          ]);
        },
        () => console.log("Geolocation refusee")
      );
    }
  }, []);

  // Trouver l'arret le plus proche + les 3 plus proches
  useEffect(() => {
    if (positionUtilisateur && arrets.length > 0) {
      // Calculer la distance pour chaque arret et l'ajouter a l'objet
      const arretsAvecDistance = arrets.map(a => ({
        ...a,
        distance: calculerDistance(
          positionUtilisateur[0],
          positionUtilisateur[1],
          a.lat,
          a.lon
        )
      }));

      // Trier par distance croissante
      const trie = [...arretsAvecDistance].sort(
        (a, b) => a.distance - b.distance
      );

      // Le plus proche = le premier du tableau trie
      setArretProche(trie[0]);

      // EXERCICE 3 : garder les 3 premiers
      setArretsProches(trie.slice(0, 3));
    }
  }, [positionUtilisateur, arrets]);

  return (
    <div className="carte-container">
      <h2 className="carte-titre">Carte des arrêts</h2>

      {arretsProches.length > 0 && (
        <div className="arrets-proches-liste">
          <p className="arrets-proches-titre">3 arrêts les plus proches :</p>
          {arretsProches.map((a, index) => (
            <p key={a.id} className={`arret-proche ${index === 0 ? 'arret-proche--premier' : ''}`}>
              {index + 1}. <strong>{a.nom}</strong> — {a.distance.toFixed(1)} km
            </p>
          ))}
        </div>
      )}

      <MapContainer center={DAKAR} zoom={13} className="carte">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap"
        />
        {arrets.map(a => (
          <Marker
            key={a.id}
            position={[a.lat, a.lon]}
            icon={arretProche && a.id === arretProche.id ? iconeProche : iconeDefaut}
          >
            <Popup>
              <strong>{a.nom}</strong><br />
              Lignes : {a.lignes.join(", ")}
            </Popup>
          </Marker>
        ))}
        {positionUtilisateur && (
          <Marker position={positionUtilisateur}>
            <Popup>Vous êtes ici</Popup>
          </Marker>
        )}
        <BoutonCentrer position={positionUtilisateur} />
      </MapContainer>
    </div>
  );
}

export default Carte;