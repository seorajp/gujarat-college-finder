'use client';
import { useState } from 'react';

export default function HomePage() {
  // Search and Filter State Management
  const [searchQuery, setSearchQuery] = useState('');
  const [course, setCourse] = useState('');
  const [district, setDistrict] = useState('Gujarat'); // Default state focus
  const [category, setCategory] = useState('General');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Redirects to our high-speed search console page with url params
    window.location.href = `/search?query=${searchQuery}&course=${course}&district=${district}&category=${category}`;
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      
      {/* INTERNAL ADVERTISING MATRIX: TOP HEADER BANNER ZONE */}
      <div className="w-full bg-slate-200 p-2 text-center text-xs text-slate-500 tracking-wider font-semibold border-b">
        SPONSORED ADVERTISEMENT BANNER (HOME_HEADER_ZONE)
        <div className="max-w-4xl mx-auto h-16 bg-white border mt-1 rounded flex items-center justify-center text-slate-400 text-sm italic">
          Premium University Banner Space Available — Contact Sales
        </div>
      </div>

      {/* HERO SEARCH SECTION */}
      <section className="max-w-5xl mx-auto px-4 pt-12 pb-6 text-center">
        <span className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-blue-200">
          Gujarat's First Integrated Admission Console
        </span>
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mt-4 max-w-3xl mx-auto leading-tight">
          Find Your Perfect College & Predict Your Admission Cut-Off
        </h1>
        <p className="text-slate-600 mt-3 text-lg max-w-xl mx-auto">
          Simplifying GCAS, ACPC, and Private University searches for 12th pass students and parents.
        </p>

        {/* HIGH-SPEED SEARCH CONSOLE BOARD */}
        <form onSubmit={handleSearchSubmit} className="mt-8 bg-white p-4 rounded-2xl shadow-xl border border-slate-200/80 max-w-4xl mx-auto text-left space-y-4">
          
          {/* Main Keyword Input Box */}
          <div className="relative">
            <input 
              type="text"
              placeholder="Search by college name or keyword (e.g. Nirma, L.D. Engineering)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900 text-base"
            />
          </div>

          {/* Core Dynamic Filters Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            
            {/* Course Selector Dropdown */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Select Course</label>
              <select value={course} onChange={(e) => setCourse(e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 font-medium">
                <option value="">All Courses</option>
                <option value="BCA">BCA (Computer Applications)</option>
                <option value="BTech">B.Tech / B.E. (Engineering)</option>
                <option value="Pharmacy">B.Pharm (Pharmacy)</option>
                <option value="BSc">B.Sc (Sciences)</option>
                <option value="BCom">B.Com (Commerce)</option>
                <option value="Medical">MBBS / Paramedical</option>
              </select>
            </div>

            {/* District Selector Dropdown */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">District Location</label>
              <select value={district} onChange={(e) => setDistrict(e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 font-medium">
                <option value="Gujarat">All Gujarat Districts</option>
                <option value="Ahmedabad">Ahmedabad</option>
                <option value="Rajkot">Rajkot</option>
                <option value="Surat">Surat</option>
                <option value="Vadodara">Vadodara</option>
                <option value="Gandhinagar">Gandhinagar</option>
                <option value="Mehsana">Mehsana</option>
                <option value="Anand">Anand</option>
                <option value="Dang">Dang</option>
              </select>
            </div>

            {/* Category Seat Allocation Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Reservation Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 font-medium">
                <option value="General">General / Open Merit</option>
                <option value="EWS">EWS (Economically Weaker)</option>
                <option value="OBC">SEBC / OBC / NT-DNT</option>
                <option value="SC">SC (Scheduled Caste)</option>
                <option value="ST">ST (Scheduled Tribe)</option>
              </select>
            </div>

          </div>

          {/* Action Call Execution Control Button */}
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition duration-150 shadow-md flex items-center justify-center space-x-2 text-base">
            <span>Find Verified Colleges & Check Cut-offs</span>
          </button>
        </form>
      </section>

      {/* QUICK BROWSE LINKS FOR PROGRAMMATIC SEO COMPLIANCE */}
      <section className="max-w-4xl mx-auto px-4 py-8 border-t border-slate-200">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest text-center mb-4">Popular Local Resource Queries</h3>
        <div className="flex flex-wrap gap-2 justify-center text-xs">
          <a href="/browse/top-bca-colleges-in-rajkot" className="px-3 py-1.5 bg-white border border-slate-200 rounded-full hover:border-blue-500 text-slate-600 hover:text-blue-600 transition">Top BCA Colleges in Rajkot</a>
          <a href="/browse/engineering-colleges-in-gujarat-with-lowest-fees" className="px-3 py-1.5 bg-white border border-slate-200 rounded-full hover:border-blue-500 text-slate-600 hover:text-blue-600 transition">Engineering with Lowest Fees</a>
          <a href="/browse/ews-cutoff-for-pharmacy-in-ahmedabad" className="px-3 py-1.5 bg-white border border-slate-200 rounded-full hover:border-blue-500 text-slate-600 hover:text-blue-600 transition">EWS Cut-off Pharmacy Ahmedabad</a>
        </div>
      </section>
    </main>
  );
}
