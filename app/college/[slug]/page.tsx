import { supabase } from '@/lib/supabase';
import LeadForm from '@/components/LeadForm';
import AdBanner from '@/components/AdBanner';

export const revalidate = 0;

export default async function CollegePage({ params }: { params: { slug: string } }) {
  const { data: college } = await supabase
    .from('colleges')
    .select('*, courses(*)')
    .eq('slug', params.slug)
    .single();

  if (!college) {
    return <div className="p-10 text-center font-bold">College Profile Not Found.</div>;
  }

  return (
    <main className="max-w-4xl mx-auto p-4 space-y-6">
      <AdBanner zone="category_header" />

      <div className="bg-white border rounded-2xl p-6 shadow-sm">
        <h1 className="text-3xl font-black text-slate-900">{college.name}</h1>
        <p className="text-slate-500 mt-1">📍 {college.address}, {college.taluka}, {college.district}</p>

        {/* Conditional Hiding Table */}
        <table className="w-full mt-6 text-sm border-collapse">
          <tbody>
            {college.est_year && (
              <tr className="border-b">
                <td className="py-2 text-slate-500 font-medium">Established</td>
                <td className="py-2 font-bold text-slate-900">{college.est_year}</td>
              </tr>
            )}
            <tr className="border-b">
              <td className="py-2 text-slate-500 font-medium">Official Portal</td>
              <td className="py-2">
                {college.website_url ? (
                  <a href={college.website_url} target="_blank" rel="noreferrer" className="text-blue-600 font-bold underline">
                    {college.website_url}
                  </a>
                ) : (
                  <span className="text-slate-400 italic">Information Not Available</span>
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <section className="bg-white border rounded-2xl p-6 shadow-sm space-y-4">
        <h2 className="text-xl font-bold">Academic Programs Offered</h2>
        <div className="grid md:grid-cols-2 gap-3">
          {college.courses?.map((course: any) => (
            <div key={course.id} className="border p-4 rounded-xl bg-slate-50">
              <h3 className="font-bold text-blue-900">{course.course_name}</h3>
              <p className="text-xs text-slate-600 mt-1">Admission Portal: {course.portal_type || 'Direct'}</p>
              <p className="text-xs text-slate-600">Estimated Annual Fees: {course.total_fees ? `₹${course.total_fees}` : 'N/A'}</p>
            </div>
          ))}
        </div>
      </section>

      <LeadForm collegeId={college.id} />
    </main>
  );
}
