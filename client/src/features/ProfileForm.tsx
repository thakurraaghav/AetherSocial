import { useState, useEffect } from 'react';
import { api } from '../lib/axios';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ProfileForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const navigate = useNavigate();

  // We use standard React state to hold the form data
  const [formData, setFormData] = useState({
    brandName: '',
    category: '',
    coreOffering: '',
    targetAudience: '',
    brandPersonality: ''
  });

  // Fetch existing profile if they already have one
  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await api.get('/business-profile');
        if (response.data) {
          // Populate the form with existing data
          setFormData(response.data);
        }
      } catch (error) {
        console.log('No existing profile found. They must be a new user!');
      } finally {
        setIsFetching(false);
      }
    }
    fetchProfile();
  }, []);

  // When a user types in a box, this updates the state instantly
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // What happens when they click "Save Profile"
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Send the data to our Express backend
      await api.post('/business-profile', formData);
      toast.success('Business profile saved successfully! 🎉');
      navigate('/dashboard'); // added redirect so the flow works
    } catch (error: any) {
      // If our Zod schema rejects the data, show the exact error from the backend!
      const errorMessage = error.response?.data?.error?.[0]?.message || 'Failed to save profile';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex justify-center items-center p-[64px]">
        <Loader2 className="w-8 h-8 animate-spin text-[#c3c0ff]" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-[#191f31]/80 backdrop-blur-xl p-[32px] md:p-[48px] rounded-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] relative overflow-hidden group">
      {/* Subtle top border gradient */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#4f46e5] via-[#4edea3] to-[#191f31] opacity-70"></div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px]">
        
        <div className="space-y-[24px]">
          <div>
            <label className="font-['JetBrains_Mono'] text-[12px] font-semibold tracking-wider text-[#c7c4d8] uppercase mb-[12px] flex items-center gap-[8px]">
              <span className="material-symbols-outlined text-[16px] text-[#4edea3]">badge</span>
              Brand Name
            </label>
            <input
              type="text"
              name="brandName"
              value={formData.brandName}
              onChange={handleChange}
              required
              className="w-full bg-[#0c1324] text-[#dce1fb] border border-[#464555]/30 rounded-lg p-[16px] font-['Inter'] text-[14px] focus:border-[#c3c0ff] focus:ring-1 focus:ring-[#c3c0ff] focus:outline-none transition-all placeholder:text-[#c7c4d8]/40"
              placeholder="e.g. Aether Dynamics"
            />
          </div>

          <div>
            <label className="font-['JetBrains_Mono'] text-[12px] font-semibold tracking-wider text-[#c7c4d8] uppercase mb-[12px] flex items-center gap-[8px]">
              <span className="material-symbols-outlined text-[16px] text-[#4f46e5]">category</span>
              Industry / Category
            </label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full bg-[#0c1324] text-[#dce1fb] border border-[#464555]/30 rounded-lg p-[16px] font-['Inter'] text-[14px] focus:border-[#c3c0ff] focus:ring-1 focus:ring-[#c3c0ff] focus:outline-none transition-all placeholder:text-[#c7c4d8]/40"
              placeholder="e.g. SaaS, E-commerce, Fitness"
            />
          </div>

          <div>
            <label className="font-['JetBrains_Mono'] text-[12px] font-semibold tracking-wider text-[#c7c4d8] uppercase mb-[12px] flex items-center gap-[8px]">
              <span className="material-symbols-outlined text-[16px] text-[#ffb4ab]">psychology</span>
              Brand Personality
            </label>
            <input
              type="text"
              name="brandPersonality"
              value={formData.brandPersonality}
              onChange={handleChange}
              required
              className="w-full bg-[#0c1324] text-[#dce1fb] border border-[#464555]/30 rounded-lg p-[16px] font-['Inter'] text-[14px] focus:border-[#c3c0ff] focus:ring-1 focus:ring-[#c3c0ff] focus:outline-none transition-all placeholder:text-[#c7c4d8]/40"
              placeholder="e.g. Professional, authoritative, yet approachable"
            />
          </div>
        </div>

        <div className="space-y-[24px] h-full flex flex-col">
          <div>
            <label className="font-['JetBrains_Mono'] text-[12px] font-semibold tracking-wider text-[#c7c4d8] uppercase mb-[12px] flex items-center gap-[8px]">
              <span className="material-symbols-outlined text-[16px] text-[#00a572]">star</span>
              Core Offering
            </label>
            <textarea
              name="coreOffering"
              value={formData.coreOffering}
              onChange={handleChange}
              required
              rows={4}
              className="w-full bg-[#0c1324] text-[#dce1fb] border border-[#464555]/30 rounded-lg p-[16px] font-['Inter'] text-[14px] focus:border-[#c3c0ff] focus:ring-1 focus:ring-[#c3c0ff] focus:outline-none transition-all resize-none placeholder:text-[#c7c4d8]/40 min-h-[130px]"
              placeholder="Describe your main products or services. e.g. We provide an AI-driven workspace for creative agencies..."
            />
          </div>

          <div>
            <label className="font-['JetBrains_Mono'] text-[12px] font-semibold tracking-wider text-[#c7c4d8] uppercase mb-[12px] flex items-center gap-[8px]">
              <span className="material-symbols-outlined text-[16px] text-[#c3c0ff]">groups</span>
              Target Audience
            </label>
            <textarea
              name="targetAudience"
              value={formData.targetAudience}
              onChange={handleChange}
              required
              rows={4}
              className="w-full bg-[#0c1324] text-[#dce1fb] border border-[#464555]/30 rounded-lg p-[16px] font-['Inter'] text-[14px] focus:border-[#c3c0ff] focus:ring-1 focus:ring-[#c3c0ff] focus:outline-none transition-all resize-none placeholder:text-[#c7c4d8]/40 min-h-[130px]"
              placeholder="Who are you selling to? e.g. High-growth tech startups and digital marketing managers."
            />
          </div>
        </div>

      </div>

      <div className="mt-[40px] pt-[32px] border-t border-white/5 flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full md:w-auto bg-[#4f46e5] text-white rounded-lg px-[32px] py-[16px] font-['Inter'] text-[16px] font-medium shadow-[0_0_15px_rgba(79,70,229,0.2)] hover:shadow-[0_0_25px_rgba(79,70,229,0.4)] transition-all duration-300 active:scale-95 flex justify-center items-center gap-[12px] disabled:opacity-50 relative overflow-hidden group/btn"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700"></div>
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>save</span>
          )}
          Lock in Context
        </button>
      </div>
    </form>
  );
}
