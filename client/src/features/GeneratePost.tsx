import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { api } from '../lib/axios';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

export default function GeneratePost() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingIdeas, setIsGeneratingIdeas] = useState(false);
  const [suggestedIdeas, setSuggestedIdeas] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    targetPlatform: 'LINKEDIN',
    topic: ''
  });

  useEffect(() => {
    if (location.state?.selectedIdea) {
      setFormData(prev => ({ ...prev, topic: location.state.selectedIdea }));
      // Clear the state so it doesn't re-trigger on refresh
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleGenerateIdeas = async () => {
    setIsGeneratingIdeas(true);
    try {
      const response = await api.get('/ideas/suggest');
      setSuggestedIdeas(response.data);
      toast.success('Generated 5 fresh ideas!');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to generate ideas');
    } finally {
      setIsGeneratingIdeas(false);
    }
  };

  const handleSelectIdea = (idea: string) => {
    setFormData({ ...formData, topic: idea });
    setSuggestedIdeas([]); // clear suggestions once selected
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await api.post('/content/generate', formData);
      toast.success('Generation started! Check the AI Drafts in a few seconds.', {
        duration: 5000,
      });
      setFormData({ ...formData, topic: '' });
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to start generation');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Center Stage: Content Studio (Span 8) */}
      <div className="xl:col-span-8 flex flex-col gap-[24px]">
        <section className="bg-[#191f31]/90 backdrop-blur-md rounded-xl border border-white/10 p-[24px] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] relative overflow-hidden group">
          {/* Subtle AI gradient border top */}
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#4f46e5] via-[#00a572] to-[#191f31] opacity-50"></div>

          <header className="flex justify-between items-center mb-[24px]">
            <div>
              <h2 className="font-['Inter'] text-[32px] leading-[40px] font-semibold text-[#dce1fb] flex items-center gap-[16px]">
                <span className="material-symbols-outlined text-[#c3c0ff]" style={{ fontVariationSettings: "'FILL' 1" }}>edit_square</span>
                Content Studio
              </h2>
              <p className="font-['Inter'] text-[14px] text-[#c7c4d8] mt-1">AI-powered multi-platform generation</p>
            </div>
          </header>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-[24px]">
            {/* Input Column */}
            <div className="space-y-[24px]">
              {/* Platform Selectors */}
              <div>
                <label className="font-['JetBrains_Mono'] text-[12px] font-semibold tracking-wider text-[#c7c4d8] uppercase block mb-[16px]">Select Platforms</label>
                <div className="flex gap-[16px]">
                  {/* We map the buttons to set the targetPlatform state */}
                  <button type="button" onClick={() => handleChange({ target: { name: 'targetPlatform', value: 'LINKEDIN' } } as any)} className={`flex-1 h-12 rounded-lg bg-[#0c1324] border ${formData.targetPlatform === 'LINKEDIN' ? 'border-[#c3c0ff]/50 text-[#c3c0ff]' : 'border-[#464555]/30 text-[#c7c4d8]'} flex items-center justify-center gap-[8px] hover:bg-[#33394c] transition-colors relative font-['Inter'] text-[14px] font-medium`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-label="LinkedIn">
                      <path d="M4.98 3.5C4.98 4.88 3.86 6 2.48 6S0 4.88 0 3.5 1.12 1 2.48 1s2.5 1.12 2.5 2.5zM.5 8h4V24h-4V8zm7 0h3.83v2.16h.05C11.91 8.99 13.84 8 16.06 8 20.68 8 21.5 11.04 21.5 15v9h-4v-7.98c0-1.9-.03-4.35-2.65-4.35-2.65 0-3.05 2.07-3.05 4.21V24h-4V8z" />
                    </svg>
                    LinkedIn
                    {formData.targetPlatform === 'LINKEDIN' && <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#4edea3] rounded-full border-2 border-[#191f31]"></span>}
                  </button>
                  <button type="button" onClick={() => handleChange({ target: { name: 'targetPlatform', value: 'INSTAGRAM' } } as any)} className={`flex-1 h-12 rounded-lg bg-[#0c1324] border ${formData.targetPlatform === 'INSTAGRAM' ? 'border-[#c3c0ff]/50 text-[#c3c0ff]' : 'border-[#464555]/30 text-[#c7c4d8]'} flex items-center justify-center gap-[8px] hover:bg-[#33394c] hover:border-[#464555]/50 transition-colors relative font-['Inter'] text-[14px] font-medium`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-label="Instagram">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                      <circle cx="12" cy="12" r="4" />
                      <circle cx="17.5" cy="6.5" r="1" />
                    </svg>
                    Instagram
                    {formData.targetPlatform === 'INSTAGRAM' && <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#4edea3] rounded-full border-2 border-[#191f31]"></span>}
                  </button>
                  <button type="button" onClick={() => handleChange({ target: { name: 'targetPlatform', value: 'X' } } as any)} className={`flex-1 h-12 rounded-lg bg-[#0c1324] border ${formData.targetPlatform === 'X' ? 'border-[#c3c0ff]/50 text-[#c3c0ff]' : 'border-[#464555]/30 text-[#c7c4d8]'} flex items-center justify-center gap-[8px] hover:bg-[#33394c] hover:border-[#464555]/50 transition-colors relative font-['Inter'] text-[14px] font-medium`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 1200 1227" fill="currentColor" aria-label="X">
                      <path d="M714.2 519.3 1160.9 0H1055L667.1 450.9 357.2 0H0l468.5 681.8L0 1226.4h105.9l409.6-476.2 327.3 476.2H1200L714.2 519.3ZM569.2 687.8l-47.5-67.9L144.2 79.7h162.5l304.7 435.7 47.5 67.9 395.8 566.1H892.2L569.2 687.8Z" />
                    </svg>
                    X (Twitter)
                    {formData.targetPlatform === 'X' && <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#4edea3] rounded-full border-2 border-[#191f31]"></span>}
                  </button>
                </div>
              </div>

              {/* Topic Input */}
              <div>
                <label className="font-['JetBrains_Mono'] text-[12px] font-semibold tracking-wider text-[#c7c4d8] uppercase block mb-[16px]">Prompt or Topic</label>
                <div className="relative group">
                  <textarea
                    name="topic"
                    value={formData.topic}
                    onChange={handleChange}
                    className="w-full bg-[#070d1f] text-[#dce1fb] border border-[#464555]/30 rounded-lg p-[16px] font-['Inter'] text-[14px] focus:border-[#c3c0ff] focus:ring-1 focus:ring-[#c3c0ff] focus:outline-none transition-all resize-none placeholder:text-[#c7c4d8]/50"
                    placeholder="e.g., Announce our new AI dashboard integration emphasizing time-saving features..."
                    rows={4}
                  />
                  <div className="absolute bottom-[16px] right-[16px] flex gap-[8px]">
                    <button type="button" className="p-1 rounded bg-[#2e3447] text-[#c7c4d8] hover:text-[#c3c0ff] transition-colors">
                      <span className="material-symbols-outlined text-[18px]">mic</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Tone & Assets */}
              <div className="flex gap-[16px]">
                <div className="flex-1">
                  <select className="w-full bg-[#0c1324] border border-[#464555]/30 rounded-lg p-[16px] font-['Inter'] text-[14px] text-[#dce1fb] focus:border-[#c3c0ff] focus:outline-none appearance-none cursor-pointer">
                    <option>Professional</option>
                    <option>Casual</option>
                    <option>Excited</option>
                  </select>
                </div>
                <button type="button" className="flex-1 bg-[#0c1324] border border-[#464555]/30 rounded-lg p-[16px] font-['Inter'] text-[14px] text-[#c7c4d8] hover:text-[#dce1fb] hover:border-[#464555]/50 flex items-center justify-center gap-[8px] transition-colors">
                  <span className="material-symbols-outlined text-[18px]">add_photo_alternate</span>
                  Add Asset
                </button>
              </div>

              {/* Action Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#4f46e5] text-white rounded-lg py-[24px] font-['Inter'] text-[18px] font-medium shadow-[0_0_15px_rgba(79,70,229,0.2)] hover:shadow-[0_0_25px_rgba(79,70,229,0.4)] transition-all duration-300 active:scale-[0.98] flex justify-center items-center gap-[16px] group relative overflow-hidden disabled:opacity-50"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span className="material-symbols-outlined">smart_toy</span>}
                Generate Ideas
              </button>
            </div>

            {/* Preview Column (Glass Panel) */}
            <div className="bg-[#0c1324]/50 rounded-lg border border-white/5 p-[16px] relative flex flex-col h-full">
              <div className="flex items-center justify-between mb-[16px] pb-[16px] border-b border-white/5 shrink-0">
                <span className="font-['JetBrains_Mono'] text-[12px] font-semibold text-[#c3c0ff] uppercase flex items-center gap-[8px]">
                  <span className="material-symbols-outlined text-[16px]">visibility</span> Live Preview
                </span>
                <div className="flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#464555]/30"></span>
                  <span className="w-2 h-2 rounded-full bg-[#c3c0ff]/50"></span>
                  <span className="w-2 h-2 rounded-full bg-[#464555]/30"></span>
                </div>
              </div>

              <div className="flex-1 flex border border-[#464555]/30 rounded-lg bg-[#0c1324]/20 p-4 overflow-hidden relative">
                {formData.topic ? (
                  <div className="w-full flex flex-col h-full animate-fade-in">
                    {/* Mock Author Header */}
                    <div className="flex items-center gap-[12px] mb-[16px]">
                      <div className="w-10 h-10 rounded-full bg-[#4f46e5]/20 flex items-center justify-center shrink-0 border border-[#4f46e5]/30">
                        <span className="text-[#c3c0ff] font-bold text-sm">A</span>
                      </div>
                      <div>
                        <div className="h-3 w-24 bg-white/10 rounded-full mb-[6px]"></div>
                        <div className="h-2 w-16 bg-white/5 rounded-full"></div>
                      </div>
                      {formData.targetPlatform === 'X' && (
                        <div className="ml-auto text-[#c7c4d8]/50">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 1200 1227" fill="currentColor">
                            <path d="M714.2 519.3 1160.9 0H1055L667.1 450.9 357.2 0H0l468.5 681.8L0 1226.4h105.9l409.6-476.2 327.3 476.2H1200L714.2 519.3ZM569.2 687.8l-47.5-67.9L144.2 79.7h162.5l304.7 435.7 47.5 67.9 395.8 566.1H892.2L569.2 687.8Z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    {/* Mock Text Content */}
                    <p className="text-[14px] text-[#dce1fb] font-['Inter'] leading-relaxed whitespace-pre-wrap flex-1 opacity-80 break-words">
                      {formData.topic}
                    </p>
                    {/* Mock Image Box for Instagram */}
                    {formData.targetPlatform === 'INSTAGRAM' && (
                      <div className="w-full h-[150px] bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888] rounded-md mt-[16px] opacity-20 flex items-center justify-center">
                        <span className="material-symbols-outlined text-white/50 text-4xl">image</span>
                      </div>
                    )}
                    {/* Mock Footer Actions */}
                    <div className="flex gap-[16px] mt-[16px] pt-[16px] border-t border-white/5 text-white/20">
                      <div className="h-2 w-8 bg-white/10 rounded-full"></div>
                      <div className="h-2 w-8 bg-white/10 rounded-full"></div>
                      <div className="h-2 w-8 bg-white/10 rounded-full"></div>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center border border-dashed border-[#464555]/30 rounded-lg text-center">
                    <span className="material-symbols-outlined text-[32px] text-[#464555] mb-2">auto_awesome</span>
                    <p className="font-['Inter'] text-[14px] text-[#c7c4d8]">Start typing to preview layout</p>
                  </div>
                )}
              </div>
            </div>
          </form>
        </section>
      </div>

      {/* Right Sidebar: AI Idea Generator (Span 4) */}
      <div className="xl:col-span-4 flex flex-col gap-[24px]">
        <section className="bg-[#191f31]/80 backdrop-blur-md rounded-xl border border-white/5 p-[24px] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] h-full flex flex-col">
          <header className="flex justify-between items-center mb-[24px] pb-[16px] border-b border-white/5 shrink-0">
            <h3 className="font-['Inter'] text-[18px] font-medium text-[#dce1fb] flex items-center gap-[8px]">
              <span className="material-symbols-outlined text-[#4edea3]" style={{ fontVariationSettings: "'FILL' 1" }}>trending_up</span>
              Trending Ideas
            </h3>
            <button
              type="button"
              onClick={handleGenerateIdeas}
              disabled={isGeneratingIdeas}
              className="text-[#c7c4d8] hover:text-[#c3c0ff] transition-colors disabled:opacity-50"
            >
              <span className={`material-symbols-outlined ${isGeneratingIdeas ? 'animate-spin' : ''}`}>refresh</span>
            </button>
          </header>

          <div className="space-y-[16px] flex-1 overflow-y-auto pr-1">
            {suggestedIdeas.length > 0 ? (
              suggestedIdeas.map((idea, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSelectIdea(idea)}
                  className="group bg-[#0c1324]/50 border border-[#464555]/10 hover:border-[#c3c0ff]/30 rounded-lg p-[16px] transition-all duration-300 cursor-pointer hover:bg-[#33394c]/50"
                >
                  <div className="flex justify-between items-start mb-[8px]">
                    <span className="bg-[#c3c0ff]/10 text-[#c3c0ff] font-['JetBrains_Mono'] text-[10px] px-2 py-0.5 rounded border border-[#c3c0ff]/20 uppercase font-semibold tracking-wider">AI Suggestion</span>
                  </div>
                  <h4 className="font-['Inter'] text-[16px] font-medium text-[#dce1fb] mb-1 group-hover:text-[#c3c0ff] transition-colors line-clamp-1">New Opportunity</h4>
                  <p className="font-['Inter'] text-[13px] text-[#c7c4d8] line-clamp-2">{idea}</p>
                  <div className="mt-[16px] flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="text-[#c3c0ff] font-['Inter'] text-[14px] flex items-center gap-[8px]">
                      Use Idea <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="font-['Inter'] text-[14px] text-[#c7c4d8] mb-4">No ideas generated yet.</p>
                <button
                  onClick={handleGenerateIdeas}
                  className="text-sm font-medium text-[#c3c0ff] hover:underline"
                >
                  Generate Trending Ideas
                </button>
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
