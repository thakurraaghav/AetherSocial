import { useAuthStore } from '../store/useAuthStore';
import Sidebar from '../components/Sidebar';
import GeneratePost from '../features/GeneratePost';
import CalendarGrid from '../features/CalendarGrid';
import DashboardMetrics from '../features/DashboardMetrics';

export default function DashboardPage() {
  const { user } = useAuthStore();
  if (!user) return null;

  return (
    <div className="bg-[#0c1324] text-[#dce1fb] font-['Inter'] min-h-screen flex flex-col md:flex-row overflow-hidden relative selection:bg-[#4f46e5] selection:text-[#dad7ff]">
      
      {/* TopAppBar (Mobile Only) */}
      <header className="md:hidden bg-[#0c1324]/80 backdrop-blur-xl fixed top-0 w-full z-50 border-b border-[#464555]/10 shadow-sm flex justify-between items-center px-[24px] py-[8px] max-w-[1440px] mx-auto">
        <div className="font-['Inter'] text-[24px] leading-[32px] font-bold text-[#c3c0ff]">
          AetherSocial
        </div>
        <button className="p-2 rounded-lg hover:bg-white/5 text-[#c7c4d8] hover:text-[#c3c0ff] transition-colors duration-200">
          <span className="material-symbols-outlined">menu</span>
        </button>
      </header>

      {/* SideNavBar (Desktop Only) */}
      <Sidebar />

      {/* Main Content Canvas */}
      <main className="flex-1 md:ml-64 pt-20 md:pt-0 h-screen overflow-y-auto bg-[#0c1324] relative">
        {/* Ambient Background Glow */}
        <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#c3c0ff]/10 rounded-full blur-[100px] pointer-events-none z-0"></div>
        <div className="fixed bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-[#4edea3]/5 rounded-full blur-[80px] pointer-events-none z-0"></div>
        
        <div className="p-[24px] md:p-[64px] max-w-[1440px] mx-auto relative z-10">
          
          <DashboardMetrics />

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-[24px]">
            <GeneratePost />
          </div>
          
          <div className="xl:col-span-12 mt-8">
            <CalendarGrid />
          </div>

        </div>
      </main>

      {/* BottomNavBar (Mobile Only) */}
      <nav className="md:hidden fixed bottom-0 w-full bg-[#070d1f]/90 backdrop-blur-xl border-t border-white/5 z-50 flex justify-around items-center py-[8px] pb-4">
        <a className="flex flex-col items-center gap-1 text-[#c3c0ff] p-2" href="#">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>dashboard</span>
          <span className="font-['JetBrains_Mono'] text-[10px] font-semibold tracking-wider uppercase">Dashboard</span>
        </a>
        <a className="flex flex-col items-center gap-1 text-[#c7c4d8] p-2" href="#">
          <span className="material-symbols-outlined">edit_square</span>
          <span className="font-['JetBrains_Mono'] text-[10px] font-semibold tracking-wider uppercase">Create</span>
        </a>
        <a className="flex flex-col items-center gap-1 text-[#c7c4d8] p-2" href="#">
          <span className="material-symbols-outlined">calendar_today</span>
          <span className="font-['JetBrains_Mono'] text-[10px] font-semibold tracking-wider uppercase">Plan</span>
        </a>
      </nav>
    </div>
  );
}
