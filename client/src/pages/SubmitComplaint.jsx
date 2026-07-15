import { useState } from "react";
import axios from "axios";

export default function SubmitComplaint() {
  const [form, setForm] = useState({
    title: "", description: "", category: "pothole",
    ward: "", phone: ""
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post("https://neighbourhood-truth-board-production.up.railway.app/api/complaints", {
        ...form,
        latitude: 20.2961,
        longitude: 85.8245
      });
      setSubmitted(true);
    } catch (err) {
      alert("Error submitting complaint");
    }
  };

  if (submitted) return (
    <div style={{ textAlign: "center", marginTop: "4rem" }}>
      <h2>✅ Complaint Filed!</h2>
      <p>Your complaint has been submitted successfully.</p>
      <button onClick={() => setSubmitted(false)}>Submit another</button>
    </div>
  );

  return (
    <div style={{ maxWidth: 500, margin: "1rem auto", padding: "0 1rem" }}>
      <h2>🏘️ Report a Problem</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <input name="title" placeholder="Short title (e.g. Pothole on MG Road)"
          value={form.title} onChange={handleChange} required />
        <textarea name="description" placeholder="Describe the problem..."
          value={form.description} onChange={handleChange} rows={4} />
        <select name="category" value={form.category} onChange={handleChange}>
          <option value="pothole">🕳️ Pothole</option>
          <option value="power">⚡ Power Cut</option>
          <option value="water">💧 Water Issue</option>
          <option value="noise">🔊 Noise</option>
          <option value="garbage">🗑️ Garbage</option>
        </select>
        <input name="ward" placeholder="Your ward / area name"
          value={form.ward} onChange={handleChange} />
        <input name="phone" placeholder="Your phone number (for updates)"
          value={form.phone} onChange={handleChange} />
        <button type="submit" style={{ padding: "10px", background: "#2563eb",
          color: "white", border: "none", borderRadius: 6, cursor: "pointer" }}>
          Submit Complaint
        </button>
      </form>
    </div>
  );
}