import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { api } from '../lib/axios';
import { Sparkles, ArrowRight, Lightbulb, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AiIdeasPage() {
  const [ideas, setIdeas] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        const response = await api.get('/ideas/suggest');
        setIdeas(response.data);
      } catch (error) {
        console.error('Failed to fetch ideas:', error);
        toast.error('Could not generate ideas. Make sure your business profile is complete!');
      } finally {
        setIsLoading(false);
      }
    };

    fetchIdeas();
  }, []);

  const handleUseIdea = (idea: string) => {
    navigate('/dashboard', { state: { selectedIdea: idea } });
  };

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

      {/* SideNavBar */}
      <Sidebar />

      {/* Main Content Canvas */}
      <main className="flex-1 md:ml-64 pt-20 md:pt-0 h-screen overflow-y-auto bg-[#0c1324] relative">
        {/* Ambient Background Glow */}
        <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#4f46e5]/10 rounded-full blur-[100px] pointer-events-none z-0"></div>
        <div className="fixed bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-[#c3c0ff]/5 rounded-full blur-[80px] pointer-events-none z-0"></div>
        
        <div className="p-[24px] md:p-[64px] max-w-[1000px] mx-auto relative z-10 min-h-full flex flex-col">
          
          <div className="mb-[48px]">
            <div className="inline-flex items-center gap-[8px] px-[12px] py-[6px] rounded-full bg-[#c3c0ff]/10 border border-[#c3c0ff]/20 text-[#c3c0ff] font-['JetBrains_Mono'] text-[12px] uppercase tracking-wider mb-[16px]">
              <Sparkles className="w-3 h-3" />
              Strategy Hub
            </div>
            <h1 className="font-['Inter'] text-[32px] leading-[40px] md:text-[48px] md:leading-[56px] font-black text-white tracking-tight mb-[16px]">
              AI Content Ideas
            </h1>
            <p className="text-[16px] leading-[24px] text-[#c7c4d8] max-w-[600px]">
              We've analyzed your business profile and live industry trends to bring you highly engaging, unique content pillars for this week.
            </p>
          </div>

          <div className="flex-1 flex flex-col gap-[24px] pb-[64px]">
            {isLoading ? (
              // Skeleton Loader
              <>
                <div className="bg-[#151b2d]/50 border border-white/5 rounded-2xl p-[32px] flex flex-col items-center justify-center py-[64px] animate-pulse">
                  <div className="relative mb-[24px]">
                    <div className="w-16 h-16 rounded-full bg-[#4f46e5]/20 flex items-center justify-center">
                      <TrendingUp className="w-8 h-8 text-[#4f46e5]" />
                    </div>
                    <div className="absolute -inset-4 border-2 border-[#4f46e5]/30 rounded-full animate-[spin_3s_linear_infinite] border-t-transparent"></div>
                  </div>
                  <h3 className="text-[18px] font-bold text-white mb-[8px]">Analyzing Live Trends...</h3>
                  <p className="text-[#c7c4d8] text-[14px]">Generating tailored ideas based on your niche</p>
                </div>
                {[1, 2].map((i) => (
                  <div key={i} className="bg-[#151b2d] border border-white/5 rounded-2xl p-[24px] animate-pulse flex flex-col md:flex-row gap-[24px] items-start md:items-center">
                    <div className="flex-1 space-y-[12px] w-full">
                      <div className="h-6 bg-white/5 rounded-md w-3/4"></div>
                      <div className="h-4 bg-white/5 rounded-md w-1/2"></div>
                    </div>
                    <div className="w-full md:w-[150px] h-10 bg-white/5 rounded-lg shrink-0"></div>
                  </div>
                ))}
              </>
            ) : ideas.length > 0 ? (
              // Ideas List
              ideas.map((idea, index) => (
                <div 
                  key={index} 
                  className="bg-[#151b2d]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-[24px] hover:border-[#c3c0ff]/30 transition-all duration-300 group flex flex-col md:flex-row gap-[24px] items-start md:items-center relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#4f46e5] to-[#4edea3] opacity-50 group-hover:opacity-100 transition-opacity"></div>
                  
                  <div className="shrink-0 w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center group-hover:scale-110 group-hover:bg-[#c3c0ff]/10 transition-all duration-300">
                    <Lightbulb className="w-6 h-6 text-[#c3c0ff]" />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-['Inter'] text-[16px] leading-[24px] font-medium text-white group-hover:text-[#c3c0ff] transition-colors">
                      {idea}
                    </h3>
                  </div>

                  <button 
                    onClick={() => handleUseIdea(idea)}
                    className="shrink-0 w-full md:w-auto bg-white/5 hover:bg-[#4f46e5] text-[#dce1fb] hover:text-white rounded-lg px-[24px] py-[12px] font-['Inter'] text-[14px] font-medium transition-all duration-300 flex items-center justify-center gap-[8px] group/btn"
                  >
                    Draft Post
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              ))
            ) : (
              // Empty State (Failed to generate)
              <div className="bg-[#151b2d]/80 backdrop-blur-xl border border-[#ffb4ab]/20 rounded-2xl p-[48px] text-center flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-[#ffb4ab]/10 flex items-center justify-center mb-[16px]">
                  <Lightbulb className="w-8 h-8 text-[#ffb4ab]" />
                </div>
                <h3 className="text-[20px] font-bold text-white mb-[8px]">No ideas generated</h3>
                <p className="text-[#c7c4d8] text-[14px] max-w-[400px]">
                  We couldn't generate ideas right now. Make sure your business profile has enough detail for the AI to analyze!
                </p>
                <button onClick={() => navigate('/business-profile')} className="mt-[24px] bg-white/10 hover:bg-white/20 text-white rounded-lg px-[24px] py-[12px] font-['Inter'] text-[14px] font-medium transition-all">
                  Edit Business Profile
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
