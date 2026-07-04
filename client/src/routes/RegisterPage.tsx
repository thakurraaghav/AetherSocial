import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { api } from '../lib/axios';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 1. Hit our backend register endpoint
      const response = await api.post('/auth/register', { email, password });
      
      // 2. If successful, update our global state
      setUser(response.data);
      toast.success('Registration successful!');
      
      // 3. Redirect to the business profile setup (which we will build soon)
      navigate('/business-profile');
    } catch (error: any) {
      // If the backend sends an error, show it to the user
      const message = error.response?.data?.error || 'Registration failed';
      toast.error(typeof message === 'string' ? message : 'Invalid input');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-[#0c1324] text-[#dce1fb] font-['Inter'] min-h-screen flex flex-col items-center justify-center p-[24px] md:p-[64px] relative"
    >
      {/* Abstract Background Pattern */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20">
        <svg className="w-full h-full" height="100%" width="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern height="40" id="grid" patternUnits="userSpaceOnUse" width="40">
              <path className="text-[#464555]" d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5"></path>
            </pattern>
          </defs>
          <rect fill="url(#grid)" height="100%" width="100%"></rect>
        </svg>
      </div>

      {/* Back Button Area */}
      <div className="w-full max-w-[1200px] mb-[16px] z-10 relative">
        <Link 
          to="/"
          className="inline-flex items-center gap-[8px] text-[#c7c4d8] hover:text-[#dce1fb] transition-colors group font-medium"
        >
          <div className="w-8 h-8 rounded-full bg-white/5 group-hover:bg-white/10 flex items-center justify-center border border-white/5 transition-all">
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          </div>
          <span className="font-['Inter'] text-[14px]">Back to Website</span>
        </Link>
      </div>

      {/* Main Container - Split Layout on Desktop */}
      <div className="relative z-10 w-full max-w-[1200px] flex flex-col md:flex-row glass-card rounded-[24px] overflow-hidden shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]">
        {/* Left Side: Branding / Visual (Hidden on mobile) */}
        <div className="hidden md:flex md:w-1/2 bg-[#151b2d] flex-col justify-between p-[64px] relative overflow-hidden border-r border-white/5">
          {/* Decorative gradient orb */}
          <div className="absolute top-[-20%] left-[-20%] w-[150%] h-[150%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#c3c0ff]/10 to-transparent opacity-50 blur-[100px]"></div>
          
          <div className="relative z-10">
            <div className="font-['Inter'] text-[48px] leading-[56px] tracking-[-0.02em] font-bold text-[#c3c0ff] mb-[24px]">AetherSocial</div>
            <p className="font-['Inter'] text-[18px] leading-[28px] font-medium text-[#c7c4d8] max-w-[80%]">Secure Entry to your AI Workspace. Analyze, plan, and automate with precision.</p>
          </div>
          
          <div className="relative z-10">
            <div className="flex gap-[16px] mb-[24px]">
              <span className="material-symbols-outlined text-[#4edea3]" style={{ fontVariationSettings: "'FILL' 1" }}>shield_person</span>
              <span className="font-['JetBrains_Mono'] text-[12px] leading-[16px] font-semibold text-[#4edea3] uppercase tracking-widest">Enterprise Grade Security</span>
            </div>
            <p className="font-['Inter'] text-[14px] leading-[20px] font-normal text-[#918fa1]">By authenticating, you establish a secure tunnel to your dedicated workspace.</p>
          </div>
          
          {/* Abstract Data Visual Representation */}
          <div className="absolute bottom-10 right-10 opacity-30">
            <svg fill="none" height="150" viewBox="0 0 200 150" width="200" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 140 Q 50 100 100 120 T 190 20" fill="none" stroke="#4F46E5" strokeLinecap="round" strokeWidth="2"></path>
              <path d="M10 120 Q 60 80 120 100 T 190 40" fill="none" stroke="#c3c0ff" strokeDasharray="4 4" strokeWidth="1.5"></path>
              <circle cx="190" cy="20" fill="#4F46E5" r="4"></circle>
              <circle cx="190" cy="40" fill="#c3c0ff" r="3"></circle>
            </svg>
          </div>
        </div>

        {/* Right Side: Auth Form */}
        <div className="w-full md:w-1/2 p-[40px] md:p-[64px] flex flex-col justify-center relative bg-[#0c1324]/50 backdrop-blur-xl">
          {/* Mobile Brand Header */}
          <div className="md:hidden text-center mb-[64px]">
            <div className="font-['Inter'] text-[24px] leading-[32px] font-bold text-[#c3c0ff]">AetherSocial</div>
            <p className="font-['Inter'] text-[14px] leading-[20px] font-normal text-[#c7c4d8] mt-[4px]">Secure Entry to your AI Workspace</p>
          </div>

          <div className="max-w-[400px] mx-auto w-full">
            <div className="mb-[40px]">
              <h1 className="font-['Inter'] text-[32px] leading-[40px] tracking-[-0.01em] font-semibold text-[#dce1fb] mb-[8px] hidden md:block">Create Account</h1>
              <p className="font-['Inter'] text-[14px] leading-[20px] font-normal text-[#c7c4d8]">Join to start generating AetherSocial posts.</p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-[24px]">
              {/* Email Input */}
              <div className="flex flex-col gap-[8px]">
                <label className="font-['JetBrains_Mono'] text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-[#c7c4d8] uppercase" htmlFor="email">Work Email</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-[16px] top-1/2 -translate-y-1/2 text-[#464555] text-[20px]">mail</span>
                  <input 
                    id="email" 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="name@company.com" 
                    className="w-full bg-[#070d1f] border border-[#2e3447] rounded-lg pl-[44px] pr-[16px] py-[16px] text-[#dce1fb] font-['Inter'] text-[16px] placeholder:text-[#464555] focus:outline-none focus:border-[#4f46e5] focus:shadow-[0_0_0_2px_rgba(79,70,229,0.2)] transition-all duration-200" 
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="flex flex-col gap-[8px]">
                <div className="flex justify-between items-center">
                  <label className="font-['JetBrains_Mono'] text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-[#c7c4d8] uppercase" htmlFor="password">Password</label>
                </div>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-[16px] top-1/2 -translate-y-1/2 text-[#464555] text-[20px]">lock</span>
                  <input 
                    id="password" 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    placeholder="••••••••" 
                    className="w-full bg-[#070d1f] border border-[#2e3447] rounded-lg pl-[44px] pr-[16px] py-[16px] text-[#dce1fb] font-['Inter'] text-[16px] placeholder:text-[#464555] focus:outline-none focus:border-[#4f46e5] focus:shadow-[0_0_0_2px_rgba(79,70,229,0.2)] transition-all duration-200" 
                  />
                </div>
              </div>

              {/* Action Button */}
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-[#4f46e5] text-white font-['Inter'] text-[18px] leading-[28px] font-medium py-[16px] rounded-lg mt-[16px] hover:shadow-[0_0_15px_rgba(79,70,229,0.5)] transition-all duration-200 flex justify-center items-center gap-[8px] disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                  <>
                    Sign Up
                    <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-[16px] my-[40px]">
              <div className="h-px bg-[#2e3447] flex-1"></div>
              <span className="font-['JetBrains_Mono'] text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-[#464555] uppercase">Or continue with</span>
              <div className="h-px bg-[#2e3447] flex-1"></div>
            </div>

            {/* Social Logins */}
            <div className="flex flex-col gap-[16px]">
              <button className="w-full bg-transparent border border-white/20 hover:bg-white/5 text-[#dce1fb] font-['Inter'] text-[16px] leading-[24px] font-normal py-[16px] rounded-lg transition-colors duration-200 flex items-center justify-center gap-[16px]" type="button">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                </svg>
                Google
              </button>
              <button className="w-full bg-transparent border border-white/20 hover:bg-white/5 text-[#dce1fb] font-['Inter'] text-[16px] leading-[24px] font-normal py-[16px] rounded-lg transition-colors duration-200 flex items-center justify-center gap-[16px]" type="button">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57C20.565 21.795 24 17.31 24 12c0-6.63-5.37-12-12-12z"></path>
                </svg>
                GitHub
              </button>
            </div>

            <div className="mt-[40px] text-center">
              <p className="font-['Inter'] text-[14px] leading-[20px] font-normal text-[#464555]">
                Already have an account? <Link className="text-[#c3c0ff] hover:text-[#e2dfff] transition-colors font-medium" to="/login">Log in here</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
