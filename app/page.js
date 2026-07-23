"use client";

import { useState } from "react";

const gujaratColleges = [
  { id: 1, name: "Indian Institute of Management (IIMA)", city: "Ahmedabad", type: "Management", fees: "₹25–30 Lakh", rating: "⭐⭐⭐⭐⭐" },
  { id: 2, name: "Indian Institute of Technology (IIT)", city: "Gandhinagar", type: "Engineering", fees: "₹8–10 Lakh", rating: "⭐⭐⭐⭐⭐" },
  { id: 3, name: "Nirma University", city: "Ahmedabad", type: "Multi-disciplinary", fees: "₹2–4 Lakh/yr", rating: "⭐⭐⭐⭐" },
  { id: 4, name: "Maharaja Sayajirao University (MSU)", city: "Vadodara", type: "Multi-disciplinary", fees: "₹15k–80k/yr", rating: "⭐⭐⭐⭐" },
  { id: 5, name: "Parul University", city: "Vadodara", type: "Multi-disciplinary", fees: "₹1–2.5 Lakh/yr", rating: "⭐⭐⭐" },
  { id: 6, name: "National Institute of Design (NID)", city: "Ahmedabad", type: "Design", fees: "₹3–4 Lakh/yr", rating: "⭐⭐⭐⭐⭐" },
  { id: 7, name: "SVNIT (NIT Surat)", city: "Surat", type: "Engineering", fees: "₹1.5–2 Lakh/yr", rating: "⭐⭐⭐⭐" },
  { id: 8, name: "Pandit Deendayal Energy University (PDEU)", city: "Gandhinagar", type: "Engineering", fees: "₹2–4 Lakh/yr", rating: "⭐⭐⭐⭐" },
  { id: 9, name: "Gujarat University", city: "Ahmedabad", type: "Multi-disciplinary", fees: "₹10k–50k/yr", rating: "⭐⭐⭐" },
  { id: 10, name: "Dhirubhai Ambani Institute (DA-IICT)", city: "Gandhinagar", type: "Engineering/IT", fees: "₹2–3 Lakh/yr", rating: "⭐⭐⭐⭐⭐" }
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("All");

  const cities = ["All", ...new Set(gujaratColleges.map(c => c.city))];

  const filteredColleges = gujaratColleges.filter((college) => {
    const matchesSearch = college.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          college.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCity = selectedCity === "All" || college.city === selectedCity;
    return matchesSearch && matchesCity;
  });

  return (
    <main style={{ padding: "20px", fontFamily: "system-ui, sans-serif", maxWidth: "900px", margin: "0 auto", backgroundColor: "#f9fafb", minHeight: "100vh" }}>
      <div style={{ textAlign: "center", marginBottom: "30px", padding: "40px 20px", backgroundColor: "#2563eb", color: "white", borderRadius: "12px" }}>
        <h1 style={{ fontSize: "2.5rem", margin: "0 0 10px 0", fontWeight: "bold" }}>🎓 Gujarat College Finder</h1>
        <p style={{ fontSize: "1.1rem", margin: 0, opacity: 0.9 }}>Find the best universities and institutes in Gujarat</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "15px", marginBottom: "30px", backgroundColor: "white", padding: "20px", borderRadius: "12px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}>
        <input
          type="text"
          placeholder="Search by college name or course type (e.g., Engineering)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ width: "100%", padding: "15px", fontSize: "16px", borderRadius: "8px", border: "1px solid #d1d5db", boxSizing: "border-box" }}
        />

        <select 
          value={selectedCity} 
          onChange={(e) => setSelectedCity(e.target.value)}
          style={{ width: "100%", padding: "15px", fontSize: "16px", borderRadius: "8px", border: "1px solid #d1d5db", backgroundColor: "white", boxSizing: "border-box" }}
        >
          {cities.map(city => (
            <option key={city} value={city}>{city === "All" ? "📍 All Cities" : `📍 ${city}`}</option>
          ))}
        </select>
      </div>

      <div style={{ display: "grid", gap: "20px", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}>
        {filteredColleges.length > 0 ? (
          filteredColleges.map((college) => (
            <div key={college.id} style={{ backgroundColor: "white", padding: "25px", borderRadius: "12px", border: "1px solid #e5e7eb", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
              <h2 style={{ margin: "0 0 15px 0", fontSize: "1.3rem", color: "#1f2937" }}>{college.name}</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", color: "#4b5563", fontSize: "0.95rem" }}>
                <span>📍 <strong>Cityzz:</strong> {college.city}</span>
                <span>📚 <strong>Type:</strong> {college.type}</span>
                <span>💰 <strong>Fees:</strong> {college.fees}</span>
                <span>⭐ <strong>Rating:</strong> {college.rating}</span>
              </div>
            </div>
          ))
        ) : (
          <div style={{ textAlign: "center", padding: "40px", color: "#6b7280", gridColumn: "1 / -1" }}>
            <p style={{ fontSize: "1.2rem" }}>No colleges found matching your search.</p>
          </div>
        )}
      </div>
    </main>
  );
}
