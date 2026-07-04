import { useState, useEffect } from 'react';
import { X, Save, Sparkles, Image as ImageIcon } from 'lucide-react';
import type { Post } from './CalendarGrid';
interface PostPreviewModalProps {
  post: Post | null;
  onClose: () => void;
  onSave: (updatedPost: Post) => void;
  isOpen: boolean;
}

export default function PostPreviewModal({ post, onClose, onSave, isOpen }: PostPreviewModalProps) {
  const [textContent, setTextContent] = useState('');

  useEffect(() => {
    if (post) {
      setTextContent(post.textContent);
    }
  }, [post]);

  if (!isOpen || !post) return null;

  const platformColors: Record<string, string> = {
    'LINKEDIN': 'text-[#0077b5]',
    'X': 'text-[#1da1f2]',
    'INSTAGRAM': 'text-[#e1306c]',
  };

  const platformIcons: Record<string, string> = {
    'LINKEDIN': 'work',
    'X': 'flutter_dash',
    'INSTAGRAM': 'photo_camera',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-[24px]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#070d1f]/80 backdrop-blur-md"
        onClick={onClose}
      ></div>

      {/* Modal Container */}
      <div className="relative w-full max-w-[800px] bg-[#151b2d] border border-white/10 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col md:flex-row transform transition-all animate-in fade-in zoom-in duration-200">

        {/* Left Side: Image Preview */}
        <div className="w-full md:w-[40%] bg-[#0c1324] border-r border-white/5 relative flex flex-col justify-center items-center overflow-hidden min-h-[250px]">
          {post.imageUrl && !post.imageUrl.includes(' ') ? (
            <img
              src={post.imageUrl}
              alt="Generated visual"
              className="absolute inset-0 w-full h-full object-cover opacity-90"
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-[24px] text-center z-10">
              <div className="w-16 h-16 rounded-full bg-[#191f31] border border-white/5 flex items-center justify-center mb-[16px]">
                <ImageIcon className="w-8 h-8 text-[#464555]" />
              </div>
              <p className="font-['Inter'] text-[14px] text-[#c7c4d8] mb-[8px]">No Image Generated</p>
              {post.imageUrl && (
                <p className="font-['JetBrains_Mono'] text-[10px] text-[#464555] bg-[#070d1f] p-2 rounded-lg max-h-[100px] overflow-y-auto">
                  Prompt: {post.imageUrl}
                </p>
              )}
            </div>
          )}
          {/* Platform Badge Overlay */}
          <div className="absolute top-[16px] left-[16px] bg-[#151b2d]/90 backdrop-blur-md rounded-full px-[12px] py-[6px] border border-white/10 flex items-center gap-[6px]">
            <span className={`material-symbols-outlined text-[16px] ${platformColors[post.targetPlatform] || 'text-[#c3c0ff]'}`}>
              {platformIcons[post.targetPlatform] || 'article'}
            </span>
            <span className="font-['JetBrains_Mono'] text-[10px] font-bold text-[#dce1fb] uppercase tracking-wider">
              {post.targetPlatform}
            </span>
          </div>
        </div>

        {/* Right Side: Text Editor */}
        <div className="flex-1 flex flex-col p-[32px]">
          <div className="flex justify-between items-center mb-[24px]">
            <h2 className="font-['Inter'] text-[20px] font-bold text-[#c3c0ff] flex items-center gap-[8px]">
              <Sparkles className="w-5 h-5 text-[#4edea3]" />
              Edit Post Copy
            </h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#0c1324] border border-[#464555]/30 flex items-center justify-center text-[#c7c4d8] hover:text-white hover:bg-[#ffb4ab]/20 hover:border-[#ffb4ab]/50 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 flex flex-col">
            <textarea
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              className="w-full flex-1 min-h-[250px] bg-[#0c1324] text-[#dce1fb] border border-[#464555]/30 rounded-xl p-[20px] font-['Inter'] text-[15px] leading-relaxed focus:border-[#c3c0ff] focus:ring-1 focus:ring-[#c3c0ff] focus:outline-none transition-all resize-none placeholder:text-[#c7c4d8]/40"
              placeholder="Write your amazing post..."
            />
          </div>

          <div className="mt-[24px] pt-[24px] border-t border-white/5 flex justify-end gap-[12px]">
            <button
              onClick={onClose}
              className="px-[20px] py-[10px] rounded-lg font-['Inter'] text-[14px] font-medium text-[#c7c4d8] hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => onSave({ ...post, textContent })}
              className="bg-[#4f46e5] text-white rounded-lg px-[24px] py-[10px] font-['Inter'] text-[14px] font-medium shadow-[0_0_15px_rgba(79,70,229,0.2)] hover:shadow-[0_0_25px_rgba(79,70,229,0.4)] transition-all duration-300 active:scale-95 flex items-center gap-[8px]"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
