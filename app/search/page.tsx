'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import AdBanner from '../../components/AdBanner';

// Mock database coordinates for absolute accuracy mapping
const DISTRICT_COORDINATES: { [key: string]: { lat: number; lng: number } } = {
  Ahmedabad: { lat: 23.0225, lng: 72.5714 },
  Rajkot: { lat: 22.3039, lng: 70.8022 },
  Surat: { lat: 21.1702, lng: 72.8311 },
  Dang: { lat: 20.8443, lng: 73.6881 },
  Mehsana: { lat: 23.6019, lng: 72.3999 }
};

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const [colleges, setColleges] = useState<any[]>([]);
  const [isRadiusFallback, setIsRadiusFallback] = useState(false);
  const [visibleCount, setVisibleCount] = useState(10); // Native fast loading constraint
  const [loading, setLoading] = useState(true);

  const query = searchParams.get('query') || '';
  const course = searchParams.get('course') || '';
  const district = searchParams.get('district') || 'Gujarat';
  const category = searchParams.get('category') || 'General';

  useEffect(() => {
    async function executeSearchPipeline() {
      setLoading(true);
      setIsRadiusFallback(false);

      let supabaseQuery = supabase.from('colleges').select('*, courses(*)');

      if (query) supabaseQuery = supabaseQuery.ilike('name', `%${query}%`);
      if (district !== 'Gujarat') supabaseQuery = supabaseQuery.eq('district', district);

      const { data, error } = await supabaseQuery;

      if (!error && data) {
        // Filter out items that do not provide the requested academic courses
        let filtered = data.filter((c: any) => 
          course === '' || c.courses.some((crs: any) => crs.course_name.toLowerCase().includes(course.toLowerCase()))
        );

        // 100km GEO-RADIUS BACKTRACK FALLBACK ENGINE
        if (filtered.length === 0 && district !== 'Gujarat' && DISTRICT_COORDINATES[district]) {
          setIsRadiusFallback(true);
          const targetCoords = DISTRICT_COORDINATES[district];

          const { data: allColleges } = await supabase.from('colleges').select('*, courses(*)');
          if (allColleges) {
            const calculatedDistanceList = allColleges.map((c: any) => {
              if (!c.latitude || !c.longitude) return { ...c, distanceKm: 9999 };
              
              // Standard Haversine formula mapping for distance vector matching
              const R = 6371; 
              const dLat = ((c.latitude - targetCoords.lat) * Math.PI) / 180;
              const dLon = ((c.longitude - targetCoords.lng) * Math.PI) / 180;
              const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                        Math.cos((targetCoords.lat * Math.PI) / 180) * Math.cos((c.latitude * Math.PI) / 180) *
                        Math.sin(dLon / 2) * Math.sin(dLon / 2);
              const distance = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
              return { ...c, distanceKm: distance };
            });

            // Filter for options located within 100 kilometers
            filtered = calculatedDistanceList
              .filter((c: any) => c.distanceKm <= 100 && (course === '' || c.courses.some((crs: any) => crs.course_name.toLowerCase().includes(course.toLowerCase()))))
              .sort((a: any, b: any) => a.distanceKm - b.distanceKm);
          }
        }

        setColleges(filtered);
      }
      setLoading(false);
    }

    executeSearchPipeline();
  }, [query, course, district, category]);

  if (loading) {
    return <div className="p-12 text-center text-slate-500 font-semibold animate-pulse">Running data queries against entry parameters...</div>;
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-6">
      <AdBanner zone="category_header" category={course || 'Global'} />

      <div className="my-4">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          {isRadiusFallback ? `Showing institutes within 100km radius of ${district}` : `Verified Institutes Match Result`}
        </h2>
        <p className="text-xs text-slate-500 mt-1">Allocation targeted for quota option: <span className="font-bold text-blue-600">{category} Category</span></p>
      </div>

      {colleges.length === 0 ? (
        <div className="bg-white border rounded-2xl p-10 text-center text-slate-500 shadow-sm">
          ❌ No matching college parameters located for current criteria inside target boundary grids.
        </div>
      ) : (
        <div className="space-y-4">
          {colleges.slice(0, visibleCount).map((college: any) => {
            const matchedCourse = college.courses.find((crs: any) => course === '' || crs.course_name.toLowerCase().includes(course.toLowerCase()));
            
            // Extract category-specific cutoff ranks dynamically
            let cutOffRank = 'N/A';
            if (matchedCourse) {
              if (category === 'EWS') cutOffRank = matchedCourse.ews_cutoff || 'Not Available';
              else if (category === 'OBC') cutOffRank = matchedCourse.obc_cutoff || 'Not Available';
              else cutOffRank = matchedCourse.general_cutoff || 'Not Available';
            }

            return (
              <div key={college.id} className="bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-lg text-slate-900">{college.name}</h3>
                    {college.paid_client && <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border border-amber-200">Featured</span>}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{college.address}, {college.district}</p>
                  
                  <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-600">
                    <div>📅 Est: <span className="font-semibold text-slate-900">{college.est_year || 'Not Set'}</span></div>
                    <div>💰 Fees: <span className="font-semibold text-slate-900">{matchedCourse?.total_fees ? `₹${matchedCourse.total_fees}` : 'Contact College'}</span></div>
                    <div>📊 {category} Cut-Off Merit Rank: <span className="font-semibold text-blue-600">{cutOffRank}</span></div>
                  </div>
                </div>

                <div className="flex sm:flex-row md:flex-col gap-2 min-w-[140px]">
                  <a href={`/college/${college.slug}`} className="text-center px-4 py-2 bg-slate-100 border hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg transition">
                    View Details
                  </a>
                  <a href={`/college/${college.slug}#inquiry`} className="text-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition shadow-sm">
                    Apply Now
                  </a>
                </div>
              </div>
            );
          })}

          {/* LIGHTWEIGHT PERFORMANCE CAP CONTROLS BUTTON */}
          {visibleCount < colleges.length && (
            <div className="text-center pt-4">
              <button onClick={() => setVisibleCount(visibleCount + 10)} className="px-6 py-2.5 bg-white border font-bold text-xs text-slate-700 hover:bg-slate-50 rounded-lg shadow-sm transition">
                Load More Results
              </button>
            </div>
          )}
        </div>
      )}
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-500 font-semibold animate-pulse">Initializing components map...</div>}>
      <SearchResultsContent />
    </Suspense>
  );
            }
