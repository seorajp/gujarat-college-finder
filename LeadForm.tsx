'use client';
import { useState } from 'react';

export default function LeadForm({ collegeId }: { collegeId: number }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [score, setScore] = useState('');
  const [course, setCourse] = useState('BCA');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: name,
          phone,
          score,
          courseRequested: course,
          collegeId
        }),
      });

      if (response.ok) {
        setStatus('success');
        setName('');
        setPhone('');
        setScore('');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 bg-white p-5 rounded-xl border shadow-sm max-w-md">
      <div>
        <label className="block text-xs font-bold text-slate-600 mb-1">Student / Parent Full Name</label>
        <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 border rounded-lg text-sm bg-slate-50 focus:outline-blue-600 text-slate-900" placeholder="e.g., Amit Patel" />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1">WhatsApp Number</label>
          <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full p-2 border rounded-lg text-sm bg-slate-50 focus:outline-blue-600 text-slate-900" placeholder="9898XXXXXX" />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1">12th Board Result (%)</label>
          <input type="number" required value={score} onChange={(e) => setScore(e.target.value)} className="w-full p-2 border rounded-lg text-sm bg-slate-50 focus:outline-blue-600 text-slate-900" placeholder="e.g., 78" />
        </div>
      </div>
      <div>
        <label className="block text-xs font-bold text-slate-600 mb-1">Interested Stream</label>
        <select value={course} onChange={(e) => setCourse(e.target.value)} className="w-full p-2 border rounded-lg text-sm bg-slate-50 text-slate-800 font-medium">
          <option value="BCA">BCA</option>
          <option value="BTech">B.Tech Engineering</option>
          <option value="Pharmacy">B.Pharm Pharmacy</option>
        </select>
      </div>
      <button type="submit" disabled={status === 'loading'} className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-lg transition shadow">
        {status === 'loading' ? 'Processing Counseling Details...' : 'Submit Inquiry Form'}
      </button>
      {status === 'success' && <p className="text-green-600 text-xs font-semibold text-center mt-2">✓ Query successfully generated! Our team will contact you shortly.</p>}
      {status === 'error' && <p className="text-red-600 text-xs font-semibold text-center mt-2">❌ Submission failure. Please check your data connection.</p>}
    </form>
  );
}
