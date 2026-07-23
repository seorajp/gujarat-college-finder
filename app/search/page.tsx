'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

function calculateDistanceInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

const DISTRICT_COORDINATES: Record<string, { lat: number; lng: number }> = {
  Ahmedabad: { lat: 23.0225, lng: 72.5714 },
  Rajkot: { lat: 22.3039, lng: 70.8022 },
  Surat: { lat: 21.1702, lng: 72.8311 },
  Dang: { lat: 20.8398, lng: 73.6883 },
  Gandhinagar: { lat: 23.2156, lng: 72.6369 },
  Mehsana: { lat: 23.6019, lng: 72.3997 },
};

function SearchResultsConsole() {
  const searchParams = useSearchParams();
  const [colleges, setColleges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRadiusFallback, setIsRadiusFallback] = useState(false);
  const [visibleCount, setVisibleCount] = useState(10);

  const query = searchParams.get('query') || '';
  const course = searchParams.get('course') || '';
  const district = searchParams.get('district') || 'Gujarat';
  const category = searchParams.get('category') || 'General';

  useEffect(() => {
    async function executeSearch() {
      setLoading(true);
      setIsRadiusFallback(false);

      let dbQuery = supabase.from('colleges').select('*, courses(*)').eq('is_active', true);

      if (query) dbQuery = dbQuery.ilike('name', `%${query}%`);
      if (district !== 'Gujarat') dbQuery = dbQuery.eq('district', district);

      const { data, error } = await dbQuery;

      if (error) {
        console.error(error);
        setLoading(false);
        return;
      }

      // 100km Radius Fallback Mechanism[cite: 2]
      if ((!data || data.length === 0) && district !== 'Gujarat') {
        setIsRadiusFallback(true);
        const center = DISTRICT_COORDINATES[district];

        if (center) {
          const { data: allColleges } = await supabase.from('colleges').select('*, courses(*)').eq('is_active', true);
          if (allColleges) {
            const mapped = allColleges
              .map((c: any) => ({
                ...c,
                distance: calculateDistanceInKm(center.lat, center.lng, c.latitude, c.longitude),
              }))
              .filter((c: any) => c.distance <= 100)
              .sort((a: any, b: any) => a.distance - b.distance);

            setColleges(mapped);
          }
        }
      } else {
        setColleges(data || []);
      }
      setLoading(false);
    }
    executeSearch();
  }, [query, course, district, category]);

  if (loading) return <div className="text-center py-20 font-bold">Analyzing Cut-offs & Distance...</div>;

  return (
    <div className="space-y-4">
      {isRadiusFallback && (
        <div className="bg-amber-50 border border-amber-200 text-amber-900 p-3 rounded-lg text-sm">
          ⚠️ No colleges found directly in <strong>{district}</strong>. Showing options within a 100km radius.
        </div>
      )}

      <p className="text-xs font-bold text-slate-400 uppercase">Found {colleges.length} Verified Institutions</p>

      {colleges.slice(0, visibleCount).map((college) => (
        <article key={college.id} className="bg-white border p-5 rounded-2xl shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start">
            <div>
              <h3 className="text-xl font-bold text-slate-900">{college.name}</h3>
              <p className="text-sm text-slate-500">
                📍 {college.address}, {college.taluka}, {college.district}
                {college.distance !== undefined && ` (${college.distance.toFixed(1)} km away)`}
              </p>
            </div>
            <a href={`/college/${college.slug}`} className="mt-3 sm:mt-0 bg-blue-600 text-white font-bold px-4 py-2 rounded-xl text-xs">
              View Profile
            </a>
          </div>
        </article>
      ))}

      {visibleCount < colleges.length && (
        <div className="text-center pt-4">
          <button onClick={() => setVisibleCount((prev) => prev + 10)} className="bg-slate-900 text-white font-bold px-6 py-2.5 rounded-xl text-xs">
            Load More Options
          </button>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <a href="/" className="text-sm font-bold text-blue-600">← Back to Admission Console</a>
        <h1 className="text-3xl font-black text-slate-900">Institutional Search Console</h1>
        <Suspense fallback={<div>Loading Search Console...</div>}>
          <SearchResultsConsole />
        </Suspense>
      </div>
    </main>
  );
}
