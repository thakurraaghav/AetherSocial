import { useState, useEffect } from 'react';
import { api } from '../lib/axios';
import { Activity, LayoutGrid, CalendarCheck, TrendingUp } from 'lucide-react';

export default function DashboardMetrics() {
  const [stats, setStats] = useState({
    totalPosts: 0,
    scheduledPosts: 0,
    drafts: 0,
    activePlatforms: 3
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/calendar/posts');
        const posts = response.data;
        setStats({
          totalPosts: posts.length,
          scheduledPosts: posts.filter((p: any) => p.status === 'SCHEDULED' || p.scheduledAt).length,
          drafts: posts.filter((p: any) => p.status === 'DRAFT' || !p.scheduledAt).length,
          activePlatforms: 3
        });
      } catch (error) {
        console.error('Failed to fetch stats', error);
      }
    };
    fetchStats();
    
    // Poll to keep metrics updated
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[24px] mb-[24px]">
      
      {/* Metric 1 */}
      <div className="bg-[#151b2d]/80 backdrop-blur-md border border-white/5 rounded-xl p-[24px] flex items-center justify-between group hover:bg-[#151b2d] transition-colors relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#4f46e5]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div className="relative z-10">
          <p className="font-['JetBrains_Mono'] text-[12px] font-semibold tracking-wider text-[#c7c4d8] uppercase mb-[8px]">Drafts Library</p>
          <h3 className="font-['Inter'] text-[32px] font-bold text-[#dce1fb] tracking-tight">{stats.drafts}</h3>
        </div>
        <div className="w-12 h-12 rounded-full bg-[#0c1324] border border-[#464555]/30 flex items-center justify-center relative z-10 text-[#c3c0ff]">
          <LayoutGrid className="w-6 h-6" />
        </div>
      </div>

      {/* Metric 2 */}
      <div className="bg-[#151b2d]/80 backdrop-blur-md border border-white/5 rounded-xl p-[24px] flex items-center justify-between group hover:bg-[#151b2d] transition-colors relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#4edea3]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div className="relative z-10">
          <p className="font-['JetBrains_Mono'] text-[12px] font-semibold tracking-wider text-[#c7c4d8] uppercase mb-[8px]">Scheduled Posts</p>
          <h3 className="font-['Inter'] text-[32px] font-bold text-[#dce1fb] tracking-tight">{stats.scheduledPosts}</h3>
        </div>
        <div className="w-12 h-12 rounded-full bg-[#0c1324] border border-[#464555]/30 flex items-center justify-center relative z-10 text-[#4edea3]">
          <CalendarCheck className="w-6 h-6" />
        </div>
      </div>

      {/* Metric 3 */}
      <div className="bg-[#151b2d]/80 backdrop-blur-md border border-white/5 rounded-xl p-[24px] flex items-center justify-between group hover:bg-[#151b2d] transition-colors relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#ffb4ab]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div className="relative z-10">
          <p className="font-['JetBrains_Mono'] text-[12px] font-semibold tracking-wider text-[#c7c4d8] uppercase mb-[8px]">Active Platforms</p>
          <h3 className="font-['Inter'] text-[32px] font-bold text-[#dce1fb] tracking-tight">{stats.activePlatforms}</h3>
        </div>
        <div className="w-12 h-12 rounded-full bg-[#0c1324] border border-[#464555]/30 flex items-center justify-center relative z-10 text-[#ffb4ab]">
          <Activity className="w-6 h-6" />
        </div>
      </div>

      {/* Metric 4 */}
      <div className="bg-[#151b2d]/80 backdrop-blur-md border border-white/5 rounded-xl p-[24px] flex items-center justify-between group hover:bg-[#151b2d] transition-colors relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#c3c0ff]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div className="relative z-10">
          <p className="font-['JetBrains_Mono'] text-[12px] font-semibold tracking-wider text-[#c7c4d8] uppercase mb-[8px]">Engagement Trend</p>
          <h3 className="font-['Inter'] text-[32px] font-bold text-[#dce1fb] tracking-tight flex items-center gap-[4px]">
            +12% <TrendingUp className="w-5 h-5 text-[#4edea3] ml-1" />
          </h3>
        </div>
        <div className="w-12 h-12 rounded-full bg-[#0c1324] border border-[#464555]/30 flex items-center justify-center relative z-10 text-[#c3c0ff]">
          <span className="material-symbols-outlined text-[24px]">insights</span>
        </div>
      </div>

    </div>
  );
}
