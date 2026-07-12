import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix default marker icon issue in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"
});

const statusColors = {
  filed: "🔴",
  acknowledged: "🟡",
  resolved: "🟢"
};

const categoryIcons = {
  pothole: "🕳️",
  power: "⚡",
  water: "💧",
  noise: "🔊",
  garbage: "🗑️"
};

export default function ComplaintsMap() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("http://localhost:5000/api/complaints")
      .then(res => setComplaints(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ textAlign: "center", marginTop: "4rem" }}>
      Loading map...
    </div>
  );

  return (
    <div style={{ padding: "1rem" }}>
      <h2>🗺️ Complaint Map</h2>
      <div style={{ display: "flex", gap: 16, marginBottom: 12, flexWrap: "wrap" }}>
        <span>🔴 Filed</span>
        <span>🟡 Acknowledged</span>
        <span>🟢 Resolved</span>
      </div>

      <MapContainer
        center={[20.2961, 85.8245]}
        zoom={13}
        style={{ height: "500px", width: "100%", borderRadius: 12 }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {complaints.map(c => (
          <Marker
            key={c.id}
            position={[
              parseFloat(c.latitude) || 20.2961,
              parseFloat(c.longitude) || 85.8245
            ]}
          >
            <Popup>
              <div style={{ minWidth: 180 }}>
                <strong>{categoryIcons[c.category]} {c.title}</strong>
                <br />
                <span style={{ fontSize: 12, color: "#666" }}>
                  📍 {c.ward}
                </span>
                <br />
                <span style={{ fontSize: 12, color: "#666" }}>
                  🏢 {c.assigned_dept}
                </span>
                <br />
                <span style={{ fontSize: 12 }}>
                  {statusColors[c.status]} {c.status.charAt(0).toUpperCase() + c.status.slice(1)}
                </span>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <p style={{ color: "#6b7280", fontSize: 13, marginTop: 8 }}>
        {complaints.length} complaint{complaints.length !== 1 ? "s" : ""} on map
        • Click any marker to see details
      </p>
    </div>
  );
}