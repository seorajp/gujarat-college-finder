"use client";

import { useState } from "react";

// Complete Database of Gujarat Colleges with expanded details
const gujaratColleges = [
  { 
    id: 1, 
    name: "Indian Institute of Management (IIMA)", 
    city: "Ahmedabad", 
    type: "Management", 
    fees: "₹25–30 Lakh (Total Course)", 
    rating: "⭐⭐⭐⭐⭐",
    established: "1961",
    campusSize: "106 Acres",
    popularCourses: "MBA, PGPX, FPM",
    description: "Ranked #1 for Management in India. Famous for its iconic red-brick architecture (Louis Kahn Plaza) and case-study based learning methodology.",
    website: "https://www.iima.ac.in"
  },
  { 
    id: 2, 
    name: "Indian Institute of Technology (IIT)", 
    city: "Gandhinagar", 
    type: "Engineering", 
    fees: "₹8–10 Lakh (Total Course)", 
    rating: "⭐⭐⭐⭐⭐",
    established: "2008",
    campusSize: "400 Acres",
    popularCourses: "B.Tech (CSE, EE, ME), M.Tech, PhD",
    description: "Located beautifully on the banks of the Sabarmati River. Known for its project-based learning curriculum and massive global research collaborations.",
    website: "https://iitgn.ac.in"
  },
  { 
    id: 3, 
    name: "Nirma University", 
    city: "Ahmedabad", 
    type: "Multi-disciplinary", 
    fees: "₹2–4 Lakh/yr", 
    rating: "⭐⭐⭐⭐",
    established: "2003",
    campusSize: "115 Acres",
    popularCourses: "B.Tech, MBA, B.Pharm, LAW",
    description: "A premier private university offering top-tier campus placements, modern infrastructure, and highly corporate-aligned academic structures.",
    website: "https://nirmauni.ac.in"
  },
  { 
    id: 4, 
    name: "Maharaja Sayajirao University (MSU)", 
    city: "Vadodara", 
    type: "Multi-disciplinary", 
    fees: "₹15k–80k/yr", 
    rating: "⭐⭐⭐⭐",
    established: "1949",
    campusSize: "275 Acres",
    popularCourses: "B.Com, B.A, Fine Arts, Engineering",
    description: "One of Gujarat's oldest and most heritage-rich public universities. World-renowned for its Faculty of Fine Arts and vibrant cultural campus life.",
    website: "https://www.msubaroda.ac.in"
  },
  { 
    id: 5, 
    name: "Parul University", 
    city: "Vadodara", 
    type: "Multi-disciplinary", 
    fees: "₹1–2.5 Lakh/yr", 
    rating: "⭐⭐⭐",
    established: "2015",
    campusSize: "150+ Acres",
    popularCourses: "B.Tech, MBA, MBBS, Aviation",
    description: "Known for an incredibly diverse international student community, highly vibrant regular tech-fests, and extensive global exchange programs.",
    website: "https://www.paruluniversity.ac.in"
  },
  { 
    id: 6, 
    name: "National Institute of Design (NID)", 
    city: "Ahmedabad", 
    type: "Design", 
    fees: "₹3–4 Lakh/yr", 
    rating: "⭐⭐⭐⭐⭐",
    established: "1961",
    campusSize: "20 Acres",
    popularCourses: "B.Des (Product, Graphic, Animation)",
    description: "An Institute of National Importance. Globally recognized as India's premier design school driving industrial, communication, and textile design education.",
    website: "https://www.nid.edu"
  },
  { 
    id: 7, 
    name: "SVNIT (NIT Surat)", 
    city: "Surat", 
    type: "Engineering", 
    fees: "₹1.5–2 Lakh/yr", 
    rating: "⭐⭐⭐⭐",
    established: "1961",
    campusSize: "250 Acres",
    popularCourses: "B.Tech (Computer, Mechanical, Civil)",
    description: "A prestigious central-government funded engineering institute with an outstanding legacy of producing top-tier tech industry leaders and startup founders.",
    website: "https://www.svnit.ac.in"
  },
  { 
    id: 8, 
    name: "Pandit Deendayal Energy University (PDEU)", 
    city: "Gandhinagar", 
    type: "Engineering", 
    fees: "₹2–4 Lakh/yr", 
    rating: "⭐⭐⭐⭐",
    established: "2007",
    campusSize: "100 Acres",
    popularCourses: "B.Tech (Petroleum, Solar, CSE), MBA",
    description: "Excellent infrastructure supported by industry giants. Special emphasis on energy domain studies, conventional research, and modern tech branches.",
    website: "https://www.pdeu.ac.in"
  },
  { 
    id: 9, 
    name: "Gujarat University", 
    city: "Ahmedabad", 
    type: "Multi-disciplinary", 
    fees: "₹10k–50k/yr", 
    rating: "⭐⭐⭐",
    established: "1949",
    campusSize: "260 Acres",
    popularCourses: "M.Sc, B.Com, MCA, BCA",
    description: "The largest affiliating university in the state, offering affordable high-quality state-board education options across hundreds of streams.",
    website: "https://www.gujaratuniversity.ac.in"
  },
  { 
    id: 10, 
    name: "Dhirubhai Ambani Institute (DA-IICT)", 
    city: "Gandhinagar", 
    type: "Engineering/IT", 
    fees: "₹2–3 Lakh/yr", 
    rating: "⭐⭐⭐⭐⭐",
    established: "2001",
    campusSize: "50 Acres",
    popularCourses: "B.Tech (ICT), M.Tech, M.Sc (IT)",
    description: "A wave-making wave-front specialized institute for Information and Communication Technology, providing exceptional direct placements in big-tech firms.",
    website: "https://www.daiict.ac.in"
  }
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("All");
  
  // State to track if we are on the Home Page or Details Page
  const [selectedCollege, setSelectedCollege] = useState(null);

  // Get unique cities for the dropdown menu
  const cities = ["All", ...new Set(gujaratColleges.map(c => c.city))];

  // Search filter math logic
  const filteredColleges = gujaratColleges.filter((college) => {
    const matchesSearch = college.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          college.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCity = selectedCity === "All" || college.city === selectedCity;
    return matchesSearch && matchesCity;
  });

  // --- PAGE VIEW 2: COLLEGE DETAILS PAGE ---
  if (selectedCollege) {
    return (
      <main style={{ padding: "20px", fontFamily: "system-ui, sans-serif", maxWidth: "800px", margin: "0 auto", backgroundColor: "#f9fafb", minHeight: "100vh" }}>
        {/* Back Button */}
        <button 
          onClick={() => setSelectedCollege(null)}
          style={{ padding: "10px 20px", fontSize: "16px", backgroundColor: "#e5e7eb", border: "none", borderRadius: "8px", color: "#374151", fontWeight: "bold", cursor: "pointer", marginBottom: "20px" }}
        >
          ⬅️ Back to Directory
        </button>

        {/* Profile Card Header */}
        <div style={{ backgroundColor: "white", padding: "30px", borderRadius: "12px", border: "1px solid #e5e7eb", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}>
          <span style={{ backgroundColor: "#dbeafe", color: "#2563eb", padding: "5px 12px", borderRadius: "20px", fontSize: "0.85rem", fontWeight: "bold" }}>
            {selectedCollege.type}
          </span>
          <h1 style={{ fontSize: "2rem", margin: "15px 0 10px 0", color: "#1f2937" }}>{selectedCollege.name}</h1>
          <p style={{ fontSize: "1.2rem", color: "#4b5563", margin: "0 0 15px 0" }}>📍 {selectedCollege.city}, Gujarat</p>
          <div style={{ fontSize: "1.2rem" }}>Rating: {selectedCollege.rating}</div>
        </div>

        {/* Detailed Statistics Block */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "15px", margin: "25px 0" }}>
          <div style={{ backgroundColor: "white", padding: "20px", borderRadius: "10px", border: "1px solid #e5e7eb", textAlign: "center" }}>
            <div style={{ color: "#6b7280", fontSize: "0.9rem", marginBottom: "5px" }}>💰 Estimated Fees</div>
            <strong style={{ fontSize: "1.1rem", color: "#111827" }}>{selectedCollege.fees}</strong>
          </div>
          <div style={{ backgroundColor: "white", padding: "20px", borderRadius: "10px", border: "1px solid #e5e7eb", textAlign: "center" }}>
            <div style={{ color: "#6b7280", fontSize: "0.9rem", marginBottom: "5px" }}>📅 Established Year</div>
            <strong style={{ fontSize: "1.1rem", color: "#111827" }}>{selectedCollege.established}</strong>
          </div>
          <div style={{ backgroundColor: "white", padding: "20px", borderRadius: "10px", border: "1px solid #e5e7eb", textAlign: "center" }}>
            <div style={{ color: "#6b7280", fontSize: "0.9rem", marginBottom: "5px" }}>📐 Campus Area</div>
            <strong style={{ fontSize: "1.1rem", color: "#111827" }}>{selectedCollege.campusSize}</strong>
          </div>
        </div>

        {/* Overview & Courses info */}
        <div style={{ backgroundColor: "white", padding: "30px", borderRadius: "12px", border: "1px solid #e5e7eb", display: "grid", gap: "20px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}>
          <div>
            <h3 style={{ margin: "0 0 10px 0", color: "#1f2937" }}>Institute Overview</h3>
            <p style={{ color: "#4b5563", lineHeight: "1.6", margin: 0 }}>{selectedCollege.description}</p>
          </div>
          
          <hr style={{ border: "0", borderTop: "1px solid #e5e7eb", margin: "10px 0" }} />

          <div>
            <h3 style={{ margin: "0 0 10px 0", color: "#1f2937" }}>🔥 Popular Courses Offered</h3>
            <p style={{ color: "#2563eb", fontWeight: "bold", fontSize: "1.1rem", margin: 0 }}>{selectedCollege.popularCourses}</p>
          </div>

          <a 
            href={selectedCollege.website} 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ display: "block", textAlign: "center", backgroundColor: "#2563eb", color: "white", padding: "14px", borderRadius: "8px", textDecoration: "none", fontWeight: "bold", marginTop: "10px" }}
          >
            🌐 Visit Official Website
          </a>
        </div>
      </main>
    );
  }

  // --- PAGE VIEW 1: HOME PAGE DIRECTORY ---
  return (
    <main style={{ padding: "20px", fontFamily: "system-ui, sans-serif", maxWidth: "900px", margin: "0 auto", backgroundColor: "#f9fafb", minHeight: "100vh" }}>
      
      {/* Header Banner */}
      <div style={{ textAlign: "center", marginBottom: "30px", padding: "40px 20px", backgroundColor: "#2563eb", color: "white", borderRadius: "12px" }}>
        <h1 style={{ fontSize: "2.5rem", margin: "0 0 10px 0", fontWeight: "bold" }}>🎓 Gujarat College Finder</h1>
        <p style={{ fontSize: "1.1rem", margin: 0, opacity: 0.9 }}>Find and compare the best universities in Gujarat</p>
      </div>

      {/* Inputs Controller Card */}
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

      {/* Grid Results Block */}
      <div style={{ display: "grid", gap: "20px", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}>
        {filteredColleges.length > 0 ? (
          filteredColleges.map((college) => (
            <div key={college.id} style={{ backgroundColor: "white", padding: "25px", borderRadius: "12px", border: "1px solid #e5e7eb", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
              <h2 style={{ margin: "0 0 15px 0", fontSize: "1.3rem", color: "#1f2937" }}>{college.name}</h2>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", color: "#4b5563", fontSize: "0.95rem", marginBottom: "20px" }}>
                <span>📍 <strong>City:</strong> {college.city}</span>
                <span>📚 <strong>Type:</strong> {college.type}</span>
                <span>💰 <strong>Fees:</strong> {college.fees}</span>
                <span>⭐ <strong>Rating:</strong> {college.rating}</span>
              </div>
              
              <button 
                onClick={() => setSelectedCollege(college)}
                style={{ width: "100%", padding: "12px", backgroundColor: "#2563eb", border: "none", borderRadius: "8px", color: "white", fontWeight: "bold", cursor: "pointer" }}
              >
                View Details
              </button>
            </div>
          ))
        ) : (
          <div style={{ textAlign: "center", padding: "40px", color: "#6b7280", gridColumn: "1 / -1" }}>
            <p style={{ fontSize: "1.2rem" }}>No colleges match your filter query. Try searching something else!</p>
          </div>
        )}
      </div>
    </main>
  );
}
