import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { api } from '../lib/axios';

export default function Sidebar() {
  const { setUser } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
      setUser(null);
      navigate('/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: 'dashboard' },
    { name: 'AI Ideas', path: '/ideas', icon: 'lightbulb' },
    { name: 'Schedule', path: '#', icon: 'calendar_today' },
    { name: 'Content Library', path: '#', icon: 'folder_special' },
    { name: 'Audience', path: '#', icon: 'groups' },
    { name: 'Reports', path: '#', icon: 'bar_chart' },
  ];

  return (
    <nav className="hidden md:flex flex-col h-full py-[32px] bg-[#151b2d]/90 backdrop-blur-2xl fixed left-0 top-0 w-64 z-40 border-r border-white/5">
      <div className="px-[24px] mb-[32px] flex items-center gap-[16px]">
        <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-white/10 bg-[#4f46e5] flex items-center justify-center">
          <span className="text-white font-bold text-xl">A</span>
        </div>
        <div>
          <h1 className="font-['Inter'] text-[18px] leading-[28px] font-black text-[#c3c0ff]">AetherSocial</h1>
          <p className="font-['Inter'] text-[14px] leading-[20px] text-[#c7c4d8]">Premium Plan</p>
        </div>
      </div>

      <ul className="flex-1 px-[16px] space-y-[4px] overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <li key={item.name}>
              <Link 
                to={item.path}
                className={`flex items-center gap-[12px] rounded-lg px-[24px] py-[12px] transition-all duration-300 ease-in-out group ${
                  isActive 
                    ? 'bg-[#4f46e5] text-[#dad7ff]' 
                    : 'text-[#c7c4d8] hover:bg-white/5 hover:text-[#dce1fb]'
                }`}
              >
                <span className={`material-symbols-outlined text-[20px] ${!isActive && 'group-hover:text-[#c3c0ff] transition-colors'}`}>
                  {item.icon}
                </span>
                <span className={`font-['Inter'] text-[14px] leading-[20px] ${isActive ? 'font-medium' : ''}`}>
                  {item.name}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="px-[16px] mt-auto pt-[16px] border-t border-white/5">
        <ul className="space-y-[4px]">
          <li>
            <Link to="/business-profile" className={`flex items-center gap-[12px] rounded-lg px-[24px] py-[12px] transition-all duration-300 ease-in-out group ${
              location.pathname === '/business-profile'
                ? 'bg-white/10 text-[#dce1fb]' 
                : 'text-[#c7c4d8] hover:bg-white/5 hover:text-[#dce1fb]'
            }`}>
              <span className="material-symbols-outlined text-[20px] group-hover:text-[#c3c0ff] transition-colors">settings</span>
              <span className="font-['Inter'] text-[14px] leading-[20px]">Settings</span>
            </Link>
          </li>
          <li>
            <button onClick={handleLogout} className="w-full flex items-center gap-[12px] text-[#c7c4d8] px-[24px] py-[12px] hover:bg-[#ffb4ab] hover:text-[#690005] transition-all duration-300 ease-in-out rounded-lg group">
              <span className="material-symbols-outlined text-[20px] transition-colors">logout</span>
              <span className="font-['Inter'] text-[14px] leading-[20px]">Logout</span>
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}
