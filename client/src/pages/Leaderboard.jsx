import { useEffect, useState } from "react";
import axios from "axios";

const medals = ["🥇", "🥈", "🥉"];

export default function Leaderboard() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("https://neighbourhood-truth-board-production.up.railway.app/api/complaints")
      .then(res => {
        const complaints = res.data;

        // Group by ward
        const wardMap = {};
        complaints.forEach(c => {
          const ward = c.ward || "Unknown";
          if (!wardMap[ward]) {
            wardMap[ward] = { ward, total: 0, resolved: 0, filed: 0, acknowledged: 0 };
          }
          wardMap[ward].total++;
          wardMap[ward][c.status]++;
        });

        // Calculate resolution rate and rank
        const ranked = Object.values(wardMap)
          .map(w => ({
            ...w,
            rate: w.total > 0 ? Math.round((w.resolved / w.total) * 100) : 0
          }))
          .sort((a, b) => b.rate - a.rate);

        setStats(ranked);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ textAlign: "center", marginTop: "4rem" }}>Loading leaderboard...</div>
  );

  return (
    <div style={{ maxWidth: 700, margin: "2rem auto", padding: "0 1rem" }}>
      <h2>🏆 Ward Leaderboard</h2>
      <p style={{ color: "#6b7280", fontSize: 13, marginBottom: 20 }}>
        Ranked by complaint resolution rate — higher is better
      </p>

      {stats.length === 0 ? (
        <div style={{ textAlign: "center", color: "#666" }}>
          No data yet — submit some complaints first!
        </div>
      ) : (
        stats.map((w, i) => (
          <div key={w.ward} style={{
            border: "1px solid #e5e7eb", borderRadius: 10,
            padding: "1rem 1.25rem", marginBottom: 10,
            background: i === 0 ? "#fffbeb" : "white",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {/* Rank */}
              <span style={{ fontSize: 24, minWidth: 36 }}>
                {medals[i] || `#${i + 1}`}
              </span>

              {/* Ward info */}
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 500, fontSize: 15 }}>{w.ward}</div>
                <div style={{ fontSize: 12, color: "#6b7280", marginTop: 3 }}>
                  Total: {w.total} &nbsp;•&nbsp;
                  🔴 {w.filed} filed &nbsp;•&nbsp;
                  🟡 {w.acknowledged} acknowledged &nbsp;•&nbsp;
                  🟢 {w.resolved} resolved
                </div>
              </div>

              {/* Resolution rate */}
              <div style={{ textAlign: "center" }}>
                <div style={{
                  fontSize: 22, fontWeight: 600,
                  color: w.rate >= 70 ? "#065f46" : w.rate >= 40 ? "#1e40af" : "#92400e"
                }}>
                  {w.rate}%
                </div>
                <div style={{ fontSize: 11, color: "#9ca3af" }}>resolved</div>
              </div>
            </div>

            {/* Progress bar */}
            <div style={{
              marginTop: 10, height: 6, background: "#f3f4f6",
              borderRadius: 3, overflow: "hidden"
            }}>
              <div style={{
                height: "100%", borderRadius: 3,
                width: `${w.rate}%`,
                background: w.rate >= 70 ? "#10b981" : w.rate >= 40 ? "#3b82f6" : "#f59e0b",
                transition: "width 0.5s ease"
              }} />
            </div>
          </div>
        ))
      )}

      <div style={{
        marginTop: 20, padding: "1rem", background: "#f0fdf4",
        borderRadius: 10, fontSize: 13, color: "#065f46"
      }}>
        💡 Wards with low resolution rates are publicly visible here —
        creating accountability pressure on local departments.
      </div>
    </div>
  );
}