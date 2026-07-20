'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface AdProps {
  zone: string;
  category: string;
}

export default function AdBanner({ zone, category }: AdProps) {
  const [ad, setAd] = useState<any>(null);

  useEffect(() => {
    async function fetchAd() {
      const { data } = await supabase
        .from('banners')
        .select('*')
        .eq('placement_zone', zone)
        .eq('is_active', true)
        .or(`target_category.eq.${category},target_category.eq.Global`)
        .limit(1);
      
      if (data && data.length > 0) {
        setAd(data[0]);
      }
    }
    fetchAd();
  }, [zone, category]);

  if (ad) {
    return (
      <a href={ad.click_url} target="_blank" rel="noopener noreferrer" className="block w-full my-4">
        <img src={ad.image_url} alt="Advertisement" className="w-full h-auto rounded-xl border object-cover max-h-24 shadow-sm" />
      </a>
    );
  }

  return (
    <div className="w-full bg-slate-100 border border-dashed border-slate-300 rounded-xl p-4 text-center text-xs text-slate-400 my-4">
      💡 <span className="font-semibold text-slate-500">Premium Ad Space Available</span> for Universities in Gujarat. Reach thousands of parents daily. Contact: ads@yourdomain.in
    </div>
  );
}
