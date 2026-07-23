import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import AdBanner from '@/components/AdBanner';

export const revalidate = 0; // Ensures fresh data from Supabase on every request[cite: 2]

export default async function HomePage() {
  const { data: colleges } = await supabase
    .from('colleges')
    .select('*, courses(*)')
    .eq('is_active', true)
    .limit(6);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <div className="max-w-5xl mx-auto px-4 pt-4">
        <AdBanner zone="home_header" />
      </div>

      <section className="max-w-5xl mx-auto px-4 pt-8 pb-6 text-center">
        <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          Gujarat Integrated Admission Portal
        </span>
        <h1 className="text-3xl md:text-5xl font-black text-slate-900 mt-3 tracking-tight">
          Find Your College & Predict Admission Cut-Off
        </h1>
        <p className="text-slate-600 mt-2 text-base md:text-lg max-w-xl mx-auto">
          Simplifying GCAS, ACPC, and Private University searches for 12th pass students across Gujarat.
        </p>

        <form action="/search" method="GET" className="mt-6 bg-white p-4 rounded-2xl shadow-md border border-slate-200 max-w-3xl mx-auto space-y-3">
          <input
            type="text"
            name="query"
            placeholder="Search by college name or city (e.g., L.D., Nirma, Rajkot)..."
            className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-left">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">COURSE</label>
              <select name="course" className="w-full p-2.5 bg-slate-50 border rounded-lg text-sm">
                <option value="">All Courses</option>
                <option value="BCA">BCA</option>
                <option value="BTech">B.Tech / B.E.</option>
                <option value="Pharmacy">B.Pharm</option>
                <option value="BSc">B.Sc</option>
                <option value="BCom">B.Com</option>
                <option value="Medical">MBBS / Paramedical</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">DISTRICT</label>
              <select name="district" className="w-full p-2.5 bg-slate-50 border rounded-lg text-sm">
                <option value="Gujarat">All Gujarat</option>
                <option value="Ahmedabad">Ahmedabad</option>
                <option value="Rajkot">Rajkot</option>
                <option value="Surat">Surat</option>
                <option value="Vadodara">Vadodara</option>
                <option value="Gandhinagar">Gandhinagar</option>
                <option value="Mehsana">Mehsana</option>
                <option value="Dang">Dang</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">CATEGORY</label>
              <select name="category" className="w-full p-2.5 bg-slate-50 border rounded-lg text-sm">
                <option value="General">General / Open</option>
                <option value="EWS">EWS</option>
                <option value="OBC">SEBC / OBC</option>
                <option value="SC">SC</option>
                <option value="ST">ST</option>
              </select>
            </div>
          </div>

          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition">
            Find Colleges & Check Cut-offs
          </button>
        </form>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-slate-900">Featured Institutions ({colleges?.length || 0})</h2>
          <Link href="/search" className="text-sm text-blue-600 font-bold hover:underline">
            View All →
          </Link>
        </div>

        {!colleges || colleges.length === 0 ? (
          <div className="text-center py-12 bg-white border border-slate-200 rounded-xl">
            <p className="text-slate-500 font-medium">No active colleges found in Supabase.</p>
            <p className="text-xs text-slate-400 mt-1">Import your CSV file into Supabase to display colleges here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {colleges.map((college) => (
              <div key={college.id} className="bg-white border p-5 rounded-2xl shadow-sm hover:shadow-md transition">
                <h3 className="text-lg font-bold text-slate-900">{college.name}</h3>
                <p className="text-xs text-slate-500 mt-1">📍 {college.address}, {college.taluka}, {college.district}</p>
                <div className="mt-4 flex justify-between items-center border-t pt-3">
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded">Verified Listing</span>
                  <Link href={`/college/${college.slug}`} className="text-xs bg-slate-900 text-white font-bold px-3 py-1.5 rounded-lg">
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
