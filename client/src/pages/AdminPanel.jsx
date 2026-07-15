import { useState, useEffect } from "react";
import axios from "axios";

const statusOptions = ["filed", "acknowledged", "resolved"];

const statusColors = {
  filed: { bg: "#fef3c7", color: "#92400e" },
  acknowledged: { bg: "#dbeafe", color: "#1e40af" },
  resolved: { bg: "#d1fae5", color: "#065f46" }
};

export default function AdminPanel() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const res = await axios.get("https://neighbourhood-truth-board-production.up.railway.app/api/complaints");
      setComplaints(res.data);
    } catch (err) {
      console.error("Error fetching complaints");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    setUpdating(id);
    try {
      await axios.patch(`https://neighbourhood-truth-board-production.up.railway.app/api/complaints/${id}/status`, { status });
      setComplaints(prev =>
        prev.map(c => c.id === id ? { ...c, status } : c)
      );
    } catch (err) {
      alert("Error updating status");
    } finally {
      setUpdating(null);
    }
  };

  if (loading) return <div style={{ textAlign: "center", marginTop: "4rem" }}>Loading...</div>;

  const stats = {
    total: complaints.length,
    filed: complaints.filter(c => c.status === "filed").length,
    acknowledged: complaints.filter(c => c.status === "acknowledged").length,
    resolved: complaints.filter(c => c.status === "resolved").length
  };

  return (
    <div style={{ maxWidth: 800, margin: "2rem auto", padding: "0 1rem" }}>
      <h2>🛠️ Admin Panel</h2>

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 24 }}>
        {[
          { label: "Total", value: stats.total, bg: "#f3f4f6", color: "#111" },
          { label: "Filed", value: stats.filed, bg: "#fef3c7", color: "#92400e" },
          { label: "Acknowledged", value: stats.acknowledged, bg: "#dbeafe", color: "#1e40af" },
          { label: "Resolved", value: stats.resolved, bg: "#d1fae5", color: "#065f46" }
        ].map(s => (
          <div key={s.label} style={{
            background: s.bg, borderRadius: 10, padding: "1rem",
            textAlign: "center"
          }}>
            <div style={{ fontSize: 28, fontWeight: 600, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 12, color: s.color, marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Complaints table */}
      {complaints.map(c => (
        <div key={c.id} style={{
          border: "1px solid #e5e7eb", borderRadius: 10,
          padding: "1rem 1.25rem", marginBottom: 10,
          background: "white", boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
            <div>
              <strong style={{ fontSize: 14 }}>{c.title}</strong>
              <div style={{ fontSize: 12, color: "#6b7280", marginTop: 3 }}>
                {c.ward} • {c.assigned_dept} • #{c.id}
              </div>
            </div>
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              {statusOptions.map(s => (
                <button key={s} onClick={() => updateStatus(c.id, s)}
                  disabled={updating === c.id}
                  style={{
                    padding: "4px 12px", borderRadius: 20, fontSize: 12,
                    border: `1px solid ${c.status === s ? "transparent" : "#e5e7eb"}`,
                    background: c.status === s ? statusColors[s].bg : "white",
                    color: c.status === s ? statusColors[s].color : "#6b7280",
                    cursor: "pointer", fontWeight: c.status === s ? 600 : 400,
                    opacity: updating === c.id ? 0.6 : 1
                  }}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}