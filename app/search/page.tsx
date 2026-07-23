'use test';
'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

// High-speed mathematical calculator for geographic distances (Haversine Formula)
function calculateDistanceInKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}

// Approximate coordinate directory mapping centers of districts for 100km radius computations
const DISTRICT_COORDINATES: Record<string, { lat: number; lng: number }> = {
  Ahmedabad: { lat: 23.0225, lng: 72.5714 },
  Rajkot: { lat: 22.3039, lng: 70.8022 },
  Surat: { lat: 21.1702, lng: 72.8311 },
  Dang: { lat: 20.8398, lng: 73.6883 },
  Gandhinagar: { lat: 23.2156, lng: 72.6369 },
  Mehsana: { lat: 23.6019, lng: 72.3997 }
};

function SearchResultsConsole() {
  const searchParams = useSearchParams();
  const [colleges, setColleges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRadiusFallback, setIsRadiusFallback] = useState(false);
  const [visibleCount, setVisibleCount] = useState(10); // Data-saver pagination index

  const query = searchParams.get('query') || '';
  const course = searchParams.get('course') || '';
  const district = searchParams.get('district') || 'Gujarat';
  const category = searchParams.get('category') || 'General';

  useEffect(() => {
    async function executeSearchPipeline() {
      setLoading(true);
      setIsRadiusFallback(false);

      // Start building a multi-table database join query
      let dbQuery = supabase
        .from('colleges')
        .select(`
          *,
          courses!inner(*)
        `)
        .eq('is_active', true);

      // Filter 1: Check search bar keywords
      if (query) {
        dbQuery = dbQuery.ilike('name', `%${query}%`);
      }

      // Filter 2: Course specifications
      if (course) {
        dbQuery = dbQuery.ilike('courses.course_name', `%${course}%`);
      }

      // Filter 3: Direct district parameter verification
      if (district !== 'Gujarat') {
        dbQuery = dbQuery.eq('district', district);
      }

      const { data, error } = await dbQuery;

      if (error) {
        console.error('Database query failure:', error);
        setLoading(false);
        return;
      }

      // FALLBACK CONDITION: If no colleges match within the chosen area, look within a 100km radius
      if ((!data || data.length === 0) && district !== 'Gujarat') {
        setIsRadiusFallback(true);
        const targetCoords = DISTRICT_COORDINATES[district];

        if (targetCoords) {
          // Fetch all colleges offering that course regardless of district line to calculate radius bounds
          let fallbackQuery = supabase
            .from('colleges')
            .select('*, courses!inner(*)')
            .eq('is_active', true);

          if (course) {
            fallbackQuery = fallbackQuery.ilike('courses.course_name', `%${course}%`);
          }

          const { data: allRegionalColleges } = await fallbackQuery;

          if (allRegionalColleges) {
            // Filter and rank items within a 100km radius threshold
            const mappedWithDistance = allRegionalColleges
              .map((inst: any) => {
                const distance = calculateDistanceInKm(
                  targetCoords.lat,
                  targetCoords.lng,
                  inst.latitude,
                  inst.longitude
                );
                return { ...inst, computed_distance: distance };
              })
              .filter((inst: any) => inst.computed_distance <= 100) // 100km cutoff limit
              .sort((a: any, b: any) => a.computed_distance - b.computed_distance);

            setColleges(mappedWithDistance);
          }
        }
      } else {
        setColleges(data || []);
      }
      setLoading(false);
    }

    executeSearchPipeline();
  }, [query, course, district, category]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        <span className="ml-3 font-semibold text-slate-600">Analyzing cut-offs and coordinates...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Fallback Banner Alert Display Component */}
      {isRadiusFallback && (
        <div className="bg-amber-50 border border-amber-200 text-amber-900 px-4 py-3 rounded-xl text-sm font-medium">
          ⚠️ No immediate matches found within <strong>{district}</strong>. Displaying alternative institutional paths located within a 100km proximity radius.
        </div>
      )}

      <div className="text-sm font-bold text-slate-400 tracking-wide uppercase">
        Found {colleges.length} Verified Institutions Match Categories
      </div>

      {/* Structured Results Display View */}
      <div className="space-y-4">
        {colleges.slice(0, visibleCount).map((college) => (
          <article key={college.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm transition hover:shadow-md">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div>
                <h3 className="text-xl font-bold text-slate-900">{college.name}</h3>
                <p className="text-sm text-slate-500 font-medium">
                  {college.address}, {college.taluka}, {college.district} 
                  {college.computed_distance !== undefined && ` (${college.computed_distance.toFixed(1)} km away)`}
                </p>
              </div>
              <a href={`/college/${college.slug}`} className="mt-3 sm:mt-0 bg-blue-50 text-blue-700 hover:bg-blue-100 px-4 py-2 rounded-lg font-bold text-sm transition text-center">
                View Full Admission Profile
              </a>
            </div>

            {/* Structured Academic Summary Data Grid Table */}
            <div className="mt-4 border-t pt-4">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="text-slate-400 font-bold uppercase tracking-wider">
                    <th className="pb-2">Course Name</th>
                    <th className="pb-2">Portal Access</th>
                    <th className="pb-2">Estimated Fees</th>
                    <th className="pb-2">Target Cut-off ({category})</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-slate-700 font-medium">
                  {college.courses.map((c: any) => {
                    // Match category selection to output specific merit rankings
                    let cutoffScore = c.general_cutoff;
                    if (category === 'EWS') cutoffScore = c.ews_cutoff;
                    if (category === 'OBC') cutoffScore = c.obc_cutoff;
                    if (category === 'SC') cutoffScore = c.sc_cutoff;
                    if (category === 'ST') cutoffScore = c.st_cutoff;

                    return (
                      <tr key={c.id}>
                        <td className="py-2 text-blue-900 font-bold">{c.course_name}</td>
                        <td className="py-2">{c.portal_type || 'Direct Admission'}</td>
                        <td className="py-2">{c.total_fees ? `₹${c.total_fees.toLocaleString('en-IN')}` : 'Contact Institute'}</td>
                        <td className="py-2">
                          {cutoffScore ? (
                            <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-bold">{cutoffScore} Merit Rank</span>
                          ) : (
                            <span className="text-slate-400 italic">Not Available</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </article>
        ))}
      </div>

      {/* DATA-SAVER CURSOR PAGINATION ENGINE CONTROL BUTTON */}
      {visibleCount < colleges.length && (
        <div className="text-center pt-4">
          <button 
            onClick={() => setVisibleCount((prev) => prev + 10)}
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 px-8 rounded-xl transition text-sm shadow-md"
          >
            Load More Verified Options
          </button>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <a href="/" className="text-sm font-bold text-blue-600 hover:underline flex items-center space-x-1">
          ← Return to Admission Console Dashboard
        </a>
        <h1 className="text-3xl font-black tracking-tight text-slate-900">
          Institutional Search Match Console
        </h1>
        <Suspense fallback={<div className="text-center py-10">Initializing search query contexts...</div>}>
          <SearchResultsConsole />
        </Suspense>
      </div>
    </main>
  );
}
