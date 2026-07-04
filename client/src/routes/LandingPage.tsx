import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';
import { motion } from 'framer-motion';

export default function LandingPage() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="bg-[#0c1324] text-[#dce1fb] antialiased overflow-x-hidden min-h-screen flex flex-col font-['Inter'] text-[16px] leading-[24px]"
    >
      {/* TopAppBar */}
      <nav className="fixed top-0 w-full z-50 bg-[#0c1324]/80 backdrop-blur-xl border-b border-[#464555]/10 shadow-sm transition-all duration-300">
        <div className="flex justify-between items-center px-[24px] py-[8px] max-w-[1440px] mx-auto">
          <div className="flex items-center gap-[24px]">
            <Link to="/" className="font-['Inter'] text-[24px] leading-[32px] md:text-[28px] md:leading-[36px] tracking-[-0.02em] font-bold text-[#c3c0ff] flex items-center gap-2">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1", fontSize: '28px' }}>hub</span>
              AetherSocial
            </Link>
          </div>
          <div className="hidden md:flex items-center gap-[40px]">
            <Link to="#" className="text-[#c7c4d8] font-medium hover:text-[#c3c0ff] transition-colors duration-200">Analytics</Link>
            <Link to="#" className="text-[#c7c4d8] font-medium hover:text-[#c3c0ff] transition-colors duration-200">Planner</Link>
            <Link to="#" className="text-[#c7c4d8] font-medium hover:text-[#c3c0ff] transition-colors duration-200">Inbox</Link>
            <Link to="#" className="text-[#c7c4d8] font-medium hover:text-[#c3c0ff] transition-colors duration-200">Settings</Link>
          </div>
          <div className="flex items-center gap-[16px]">
            <Link to="/register" className="bg-[#4f46e5] text-white px-[24px] py-[8px] rounded-lg font-['Inter'] text-[14px] leading-[20px] font-medium hover:bg-[#4f46e5]/90 transition-colors shadow-[0_0_15px_rgba(79,70,229,0.3)] active:scale-95 duration-100 flex items-center gap-2">
              Create Post
              <span className="material-symbols-outlined text-[18px]">add</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content Canvas */}
      <main className="flex-grow pt-[80px]">
        {/* Hero Section */}
        <section className="relative min-h-[100vh] lg:min-h-[921px] flex items-center justify-center overflow-hidden px-[16px] md:px-[24px] py-[48px] md:py-[64px]">
          {/* Background Elements */}
          <div className="absolute inset-0 z-0 opacity-40">
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#4f46e5]/20 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#4edea3]/10 rounded-full blur-[100px]"></div>
          </div>

          <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center gap-[40px]">
            <div className="inline-flex items-center gap-2 bg-[#23293c]/50 border border-white/10 rounded-full px-[16px] py-[8px] backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-[#4edea3] shadow-[0_0_8px_#4edea3]"></span>
              <span className="font-['JetBrains_Mono'] text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-[#c7c4d8] uppercase">Introducing Business Memory v2.0</span>
            </div>

            <h1 className="font-['Inter'] text-[36px] leading-[44px] md:text-[48px] md:leading-[56px] lg:text-[64px] lg:leading-[72px] tracking-[-0.02em] font-bold text-[#dce1fb]">
              Social Media, <br />
              <span className="ai-gradient-text">Grounded in Your Business DNA</span>
            </h1>

            <p className="font-['Inter'] text-[16px] leading-[24px] md:text-[18px] md:leading-[28px] font-medium text-[#c7c4d8] max-w-2xl mx-auto px-[16px]">
              Stop rewriting the same prompts. AetherSocial learns your brand voice, product details, and strategic goals—turning raw ideas into platform-perfect posts instantly.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-[24px] mt-[16px]">
              <Link to="/register" className="bg-[#4f46e5] text-white px-[64px] py-[16px] rounded-lg font-['Inter'] text-[18px] leading-[28px] font-medium hover:bg-[#4f46e5]/90 transition-all shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:shadow-[0_0_30px_rgba(79,70,229,0.6)] w-full sm:w-auto flex items-center justify-center gap-2">
                Get Started Free
                <span className="material-symbols-outlined">arrow_forward</span>
              </Link>
              <Link to="/login" className="bg-transparent border border-white/20 text-[#dce1fb] px-[64px] py-[16px] rounded-lg font-['Inter'] text-[18px] leading-[28px] font-medium hover:bg-white/5 transition-all w-full sm:w-auto flex items-center justify-center gap-2">
                Log In
                <span className="material-symbols-outlined">play_circle</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Dashboard Preview Section */}
        <section className="px-[24px] pb-[64px] relative z-20 -mt-10">
          <div className="max-w-[1440px] mx-auto relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#4f46e5] to-[#4edea3] opacity-30 blur-2xl group-hover:opacity-50 transition-opacity duration-500 rounded-2xl"></div>
            {/* Mock Dashboard Interface */}
            <div className="relative glass-card overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
              <div className="flex border-b border-white/10 bg-[#151b2d]/50 px-[24px] py-[16px] items-center justify-between">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#ffb4ab]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#00a572]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#4edea3]"></div>
                </div>
                <div className="font-['Inter'] text-[14px] leading-[20px] font-normal text-[#c7c4d8] bg-[#070d1f] px-[24px] py-1 rounded-full border border-white/5 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[14px]">lock</span>
                  aethersocial.ai/workspace
                </div>
                <div className="w-16"></div> {/* Spacer for balance */}
              </div>

              <div className="p-[24px] md:p-[64px] grid grid-cols-1 md:grid-cols-3 gap-[24px]">
                {/* Left Sidebar Mock */}
                <div className="col-span-1 space-y-[16px] hidden md:block">
                  <div className="h-8 w-3/4 bg-[#2e3447] rounded animate-pulse"></div>
                  <div className="space-y-2 mt-[24px]">
                    <div className="h-6 w-full bg-[#23293c] rounded animate-pulse"></div>
                    <div className="h-6 w-5/6 bg-[#23293c] rounded animate-pulse"></div>
                    <div className="h-6 w-4/6 bg-[#23293c] rounded animate-pulse"></div>
                  </div>
                </div>

                {/* Main Content Mock */}
                <div className="col-span-1 md:col-span-2 space-y-[24px]">
                  <div className="ai-border bg-[#151b2d] p-[24px] rounded-lg">
                    <div className="flex items-center gap-2 mb-[16px] text-[#c3c0ff]">
                      <span className="material-symbols-outlined">auto_awesome</span>
                      <span className="font-['Inter'] text-[18px] leading-[28px] font-medium">AI Draft Generator</span>
                    </div>
                    <div className="h-24 w-full bg-[#2e3447] rounded border border-[#464555]/30"></div>
                  </div>
                  <div className="grid grid-cols-2 gap-[16px]">
                    <div className="h-32 bg-[#23293c] rounded-lg border border-white/5"></div>
                    <div className="h-32 bg-[#23293c] rounded-lg border border-white/5"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Bento Grid */}
        <section className="px-[16px] md:px-[24px] py-[48px] md:py-[80px] bg-[#070d1f] relative">
          <div className="max-w-[1440px] mx-auto">
            <div className="text-center mb-[40px] md:mb-[64px]">
              <h2 className="font-['Inter'] text-[28px] md:text-[36px] leading-[36px] md:leading-[44px] tracking-[-0.01em] font-semibold text-[#dce1fb] mb-[16px]">Intelligent infrastructure for modern social teams</h2>
              <p className="font-['Inter'] text-[16px] leading-[24px] font-normal text-[#c7c4d8] max-w-2xl mx-auto">Everything you need to scale content creation without losing your authentic brand voice.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-[16px] md:gap-[24px] auto-rows-auto md:auto-rows-[300px]">
              {/* Feature 1: Business Memory (Large) */}
              <div className="md:col-span-8 glass-card ai-border p-[24px] md:p-[40px] flex flex-col justify-between group overflow-hidden relative transition-all duration-300 hover:shadow-[0_0_30px_rgba(79,70,229,0.2)]">
                <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-1/4 translate-y-1/4 group-hover:scale-110 group-hover:opacity-20 transition-all duration-700">
                  <span className="material-symbols-outlined" style={{ fontSize: '200px' }}>memory</span>
                </div>
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-[#4f46e5]/20 rounded-lg flex items-center justify-center mb-[16px] md:mb-[24px] border border-[#c3c0ff]/30 group-hover:bg-[#4f46e5]/30 transition-colors duration-300">
                    <span className="material-symbols-outlined text-[#c3c0ff]" style={{ fontVariationSettings: "'FILL' 1", fontSize: '28px' }}>database</span>
                  </div>
                  <h3 className="font-['Inter'] text-[24px] md:text-[32px] leading-[32px] md:leading-[40px] tracking-[-0.01em] font-semibold text-[#dce1fb] mb-[8px]">Business Memory</h3>
                  <p className="font-['Inter'] text-[14px] md:text-[16px] leading-[20px] md:leading-[24px] font-normal text-[#c7c4d8] max-w-md">
                    Inject your brand guidelines, product catalogs, and past top-performing posts into the AI's permanent context window. It never forgets who you are.
                  </p>
                </div>
              </div>

              {/* Feature 2: Dual-Engine AI (Small) */}
              <div className="md:col-span-4 glass-card p-[24px] md:p-[40px] flex flex-col justify-between group relative overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(78,222,163,0.1)]">
                <div className="absolute top-0 right-0 p-[24px] opacity-10 group-hover:scale-110 group-hover:opacity-30 transition-all duration-700 transform origin-top-right">
                  <span className="material-symbols-outlined" style={{ fontSize: '120px' }}>imagesmode</span>
                </div>
                <div className="relative z-10">
                  <div className="w-10 h-10 bg-[#2e3447] rounded-lg flex items-center justify-center mb-[24px] border border-white/10 group-hover:bg-[#33394c] transition-colors duration-300">
                    <span className="material-symbols-outlined text-[#dce1fb]" style={{ fontSize: '24px' }}>model_training</span>
                  </div>
                  <h3 className="font-['Inter'] text-[18px] leading-[28px] font-medium text-[#dce1fb] mb-[8px]">Dual-Engine AI</h3>
                  <p className="font-['Inter'] text-[14px] leading-[20px] font-normal text-[#c7c4d8]">
                    Dedicated LLMs for persuasive text and specialized diffusion models for on-brand imagery, working in tandem.
                  </p>
                </div>
              </div>

              {/* Feature 3: Platform-Aware (Small) */}
              <div className="md:col-span-4 glass-card p-[24px] md:p-[40px] flex flex-col justify-between group relative overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(78,222,163,0.1)]">
                <div className="absolute bottom-0 right-0 p-[24px] opacity-10 group-hover:scale-110 group-hover:opacity-30 transition-all duration-700 transform origin-bottom-right">
                  <span className="material-symbols-outlined" style={{ fontSize: '120px' }}>share</span>
                </div>
                <div className="relative z-10">
                  <div className="w-10 h-10 bg-[#2e3447] rounded-lg flex items-center justify-center mb-[24px] border border-white/10 group-hover:bg-[#33394c] transition-colors duration-300">
                    <span className="material-symbols-outlined text-[#dce1fb]" style={{ fontSize: '24px' }}>devices</span>
                  </div>
                  <h3 className="font-['Inter'] text-[18px] leading-[28px] font-medium text-[#dce1fb] mb-[8px]">Platform-Aware</h3>
                  <p className="font-['Inter'] text-[14px] leading-[20px] font-normal text-[#c7c4d8]">
                    Automatically adapt a core message for LinkedIn professionalism, IG visual focus, or X brevity.
                  </p>
                </div>
              </div>

              {/* Feature 4: Smart Calendar (Large) */}
              <div className="md:col-span-8 glass-card p-[24px] md:p-[40px] flex flex-col justify-between relative overflow-hidden group transition-all duration-300 hover:shadow-[0_0_30px_rgba(79,70,229,0.2)]">
                <div className="absolute left-0 bottom-0 opacity-10 transform -translate-x-1/4 translate-y-1/4 group-hover:scale-110 group-hover:opacity-20 transition-all duration-700">
                  <span className="material-symbols-outlined" style={{ fontSize: '200px' }}>calendar_month</span>
                </div>
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-[#2e3447] rounded-lg flex items-center justify-center mb-[16px] md:mb-[24px] border border-white/10 group-hover:bg-[#33394c] transition-colors duration-300">
                    <span className="material-symbols-outlined text-[#dce1fb]" style={{ fontVariationSettings: "'FILL' 1", fontSize: '28px' }}>event_available</span>
                  </div>
                  <h3 className="font-['Inter'] text-[24px] md:text-[32px] leading-[32px] md:leading-[40px] tracking-[-0.01em] font-semibold text-[#dce1fb] mb-[8px]">Smart Calendar</h3>
                  <p className="font-['Inter'] text-[14px] md:text-[16px] leading-[20px] md:leading-[24px] font-normal text-[#c7c4d8] max-w-md">
                    Visually plan your entire month. Drag-and-drop scheduling with AI-predicted optimal posting times based on your audience data.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#070d1f] border-t border-[#464555]/10 py-[48px] md:py-[64px] px-[16px] md:px-[24px] relative z-10">
        <div className="max-w-[1440px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-[32px] md:gap-[40px]">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="font-['Inter'] text-[18px] leading-[28px] font-bold text-[#c3c0ff] flex items-center gap-2 mb-[16px]">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>hub</span>
              AetherSocial
            </Link>
            <p className="font-['Inter'] text-[14px] leading-[20px] font-normal text-[#c7c4d8] mb-[24px]">
              The intelligent workspace for high-growth social media teams.
            </p>
          </div>

          <div className="col-span-1">
            <h4 className="font-['JetBrains_Mono'] text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-[#dce1fb] mb-[16px] tracking-wider uppercase">Platform</h4>
            <ul className="space-y-2 font-['Inter'] text-[14px] leading-[20px] font-normal text-[#c7c4d8]">
              <li><Link to="#" className="hover:text-[#c3c0ff] transition-colors">Business Memory</Link></li>
              <li><Link to="#" className="hover:text-[#c3c0ff] transition-colors">AI Generator</Link></li>
              <li><Link to="#" className="hover:text-[#c3c0ff] transition-colors">Analytics</Link></li>
              <li><Link to="#" className="hover:text-[#c3c0ff] transition-colors">Pricing</Link></li>
            </ul>
          </div>

          <div className="col-span-1">
            <h4 className="font-['JetBrains_Mono'] text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-[#dce1fb] mb-[16px] tracking-wider uppercase">Resources</h4>
            <ul className="space-y-2 font-['Inter'] text-[14px] leading-[20px] font-normal text-[#c7c4d8]">
              <li><Link to="#" className="hover:text-[#c3c0ff] transition-colors">Documentation</Link></li>
              <li><Link to="#" className="hover:text-[#c3c0ff] transition-colors">Blog</Link></li>
              <li><Link to="#" className="hover:text-[#c3c0ff] transition-colors">Case Studies</Link></li>
              <li><Link to="#" className="hover:text-[#c3c0ff] transition-colors">Help Center</Link></li>
            </ul>
          </div>

          <div className="col-span-2 md:col-span-1 mt-[16px] md:mt-0">
            <h4 className="font-['JetBrains_Mono'] text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-[#dce1fb] mb-[16px] tracking-wider uppercase">Connect</h4>
            <div className="flex gap-4">
              <Link to="#" className="text-[#c7c4d8] hover:text-[#c3c0ff] transition-colors">
                <svg className="w-6 h-6 transform duration-300 ease-in-out hover:scale-120 transition-all" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.71v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
              </Link>
              <Link to="#" className="text-[#c7c4d8] hover:text-[#c3c0ff] transition-colors">
                <svg className="w-6 h-6 transform duration-300 ease-in-out hover:scale-120 transition-all" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fill-rule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clip-rule="evenodd" /></svg>
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-[1440px] mx-auto mt-[48px] md:mt-[64px] pt-[24px] border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-[16px] font-['Inter'] text-[14px] leading-[20px] font-normal text-[#c7c4d8]">
          <p>© {new Date().getFullYear()} AetherSocial Workspace. All rights reserved.</p>
          <div className="flex gap-[24px]">
            <Link to="#" className="hover:text-[#dce1fb] transition-colors">Privacy</Link>
            <Link to="#" className="hover:text-[#dce1fb] transition-colors">Terms</Link>
          </div>
        </div>
      </footer>
    </motion.div>
  );
}
