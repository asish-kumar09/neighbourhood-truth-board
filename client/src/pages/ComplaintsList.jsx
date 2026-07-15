import { useState, useEffect } from "react";
import axios from "axios";

const statusColors = {
  filed: { bg: "#fef3c7", color: "#92400e", label: "Filed" },
  acknowledged: { bg: "#dbeafe", color: "#1e40af", label: "Acknowledged" },
  resolved: { bg: "#d1fae5", color: "#065f46", label: "Resolved" }
};

const categoryIcons = {
  pothole: "🕳️", power: "⚡", water: "💧", noise: "🔊", garbage: "🗑️"
};

export default function ComplaintsList() {
  const [complaints, setComplaints] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("https://neighbourhood-truth-board-production.up.railway.app/api/complaints")
      .then(res => setComplaints(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = complaints.filter(c => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
      (c.ward || "").toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || c.status === statusFilter;
    const matchCategory = categoryFilter === "all" || c.category === categoryFilter;
    return matchSearch && matchStatus && matchCategory;
  });

  if (loading) return (
    <div style={{ textAlign: "center", marginTop: "4rem" }}>Loading complaints...</div>
  );

  return (
    <div style={{ maxWidth: 700, margin: "2rem auto", padding: "0 1rem" }}>
      <h2>📋 All Complaints</h2>

      {/* Search bar */}
      <input
        placeholder="🔍 Search by title or ward..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{
          width: "100%", padding: "10px 14px", borderRadius: 8,
          border: "1px solid #e5e7eb", fontSize: 14,
          marginBottom: 12, boxSizing: "border-box"
        }}
      />

      {/* Status filter */}
      <div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
        {["all", "filed", "acknowledged", "resolved"].map(s => (
          <button key={s} onClick={() => setStatusFilter(s)} style={{
            padding: "5px 14px", borderRadius: 20,
            border: "1px solid #ccc",
            background: statusFilter === s ? "#2563eb" : "white",
            color: statusFilter === s ? "white" : "#333",
            cursor: "pointer", fontSize: 13
          }}>
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {/* Category filter */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {["all", "pothole", "power", "water", "noise", "garbage"].map(c => (
          <button key={c} onClick={() => setCategoryFilter(c)} style={{
            padding: "5px 14px", borderRadius: 20,
            border: "1px solid #ccc",
            background: categoryFilter === c ? "#7c3aed" : "white",
            color: categoryFilter === c ? "white" : "#333",
            cursor: "pointer", fontSize: 13
          }}>
            {categoryIcons[c] || "📌"} {c.charAt(0).toUpperCase() + c.slice(1)}
          </button>
        ))}
      </div>

      {/* Results count */}
      <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 12 }}>
        Showing {filtered.length} of {complaints.length} complaints
      </div>

      {/* Complaints list */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", color: "#666", marginTop: "3rem" }}>
          No complaints match your search.
        </div>
      ) : (
        filtered.map(c => (
          <div key={c.id} style={{
            border: "1px solid #e5e7eb", borderRadius: 10,
            padding: "1rem 1.25rem", marginBottom: 12,
            background: "white", boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 18 }}>{categoryIcons[c.category] || "📌"}</span>
                  <strong style={{ fontSize: 15 }}>{c.title}</strong>
                </div>
                <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 4 }}>
                  📍 {c.ward} &nbsp;•&nbsp; 🏢 {c.assigned_dept}
                </div>
                <div style={{ fontSize: 12, color: "#9ca3af" }}>
                  {new Date(c.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric", month: "short", year: "numeric"
                  })}
                </div>
              </div>
              <span style={{
                padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 500,
                background: statusColors[c.status]?.bg || "#f3f4f6",
                color: statusColors[c.status]?.color || "#374151",
                whiteSpace: "nowrap"
              }}>
                {statusColors[c.status]?.label || c.status}
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  );
}