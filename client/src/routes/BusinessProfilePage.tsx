import { Link } from 'react-router-dom';
import ProfileForm from '../features/ProfileForm';

export default function BusinessProfilePage() {
  return (
    <div className="bg-[#0c1324] text-[#dce1fb] font-['Inter'] min-h-screen flex flex-col items-center py-[64px] px-[24px] relative overflow-hidden selection:bg-[#4f46e5] selection:text-[#dad7ff]">
      
      {/* Ambient Background Glow */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#c3c0ff]/10 rounded-full blur-[100px] pointer-events-none z-0"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-[#4edea3]/5 rounded-full blur-[80px] pointer-events-none z-0"></div>

      {/* Back Button */}
      <div className="absolute top-[32px] left-[32px] z-20">
        <Link 
          to="/dashboard"
          className="flex items-center gap-[8px] px-[16px] py-[12px] text-[14px] font-medium text-[#c7c4d8] hover:text-[#dce1fb] bg-[#0c1324]/50 backdrop-blur-sm rounded-lg transition-colors border border-[#464555]/30 hover:border-[#464555]/60 group"
        >
          <span className="material-symbols-outlined text-[18px] group-hover:-translate-x-1 transition-transform">arrow_back</span>
          Back to Dashboard
        </Link>
      </div>

      {/* Header Section */}
      <div className="max-w-[700px] w-full text-center mb-[40px] mt-[24px] relative z-10">
        <div className="inline-flex items-center gap-[8px] bg-[#4f46e5]/10 border border-[#4f46e5]/20 rounded-full px-[16px] py-[6px] mb-[24px]">
          <span className="material-symbols-outlined text-[#c3c0ff] text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>memory</span>
          <span className="font-['JetBrains_Mono'] text-[12px] font-semibold text-[#c3c0ff] uppercase tracking-wider">Business Memory</span>
        </div>
        <h1 className="text-[40px] leading-[48px] md:text-[56px] md:leading-[64px] font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-[#c3c0ff] tracking-tight mb-[16px]">
          Define Your Core Identity
        </h1>
        <p className="text-[16px] md:text-[18px] text-[#c7c4d8] leading-relaxed">
          Tell AetherSocial about your brand. The dual-engine AI will lock this context into memory to ensure every generated post aligns perfectly with your tone and goals.
        </p>
      </div>

      {/* Form Section */}
      <div className="max-w-[900px] w-full relative z-10">
        <ProfileForm />
      </div>
      
    </div>
  );
}
