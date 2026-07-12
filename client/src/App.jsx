import { useState } from "react";
import SubmitComplaint from "./pages/SubmitComplaint";
import ComplaintsList from "./pages/ComplaintsList";
import AdminPanel from "./pages/AdminPanel";
import ComplaintsMap from "./pages/ComplaintsMap";
import Leaderboard from "./pages/Leaderboard";

function App() {
  const [page, setPage] = useState("submit");

  return (
    <div>
      <nav style={{
  background: "#2563eb", padding: "0.75rem 1rem",
  display: "flex", gap: 8, alignItems: "center",
  flexWrap: "wrap"
}}>
        <span style={{ color: "white", fontWeight: 600, fontSize: 16, marginRight: "auto" }}>
          🏘️ Neighbourhood Truth Board
        </span>
        {[
          { key: "submit", label: "Report" },
          { key: "list", label: "View All" },
          { key: "map", label: "Map" },
          { key: "leaderboard", label: "Leaderboard" },
          { key: "admin", label: "Admin" }
        ].map(nav => (
          <button key={nav.key} onClick={() => setPage(nav.key)} style={{
            background: page === nav.key ? "white" : "transparent",
            color: page === nav.key ? "#2563eb" : "white",
            border: "1px solid white", borderRadius: 6,
            padding: "5px 14px", cursor: "pointer"
          }}>{nav.label}</button>
        ))}
      </nav>

      {page === "submit" && <SubmitComplaint />}
      {page === "list" && <ComplaintsList />}
      {page === "map" && <ComplaintsMap />}
      {page === "leaderboard" && <Leaderboard />}
      {page === "admin" && <AdminPanel />}
    </div>
  );
}

export default App;