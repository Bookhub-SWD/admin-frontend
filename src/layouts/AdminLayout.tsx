import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, BookOpen, Users, FileBarChart, 
  Settings, LogOut, Bell, Search, Library, Calendar,
  ChevronLeft, Menu, Archive, Award
} from 'lucide-react';
import { useState } from 'react';
import { signOut, type UserProfile } from '../services/auth';
import { useSnackbar } from 'notistack';

const SidebarItem = ({ icon: Icon, label, path, active, isExpanded }: { icon: any, label: string, path: string, active: boolean, isExpanded: boolean }) => (
  <Link 
    to={path}
    className={`flex items-center gap-3 px-6 py-4 transition-all duration-300 border-l-2 ${
      active 
        ? 'bg-ink text-brass border-brass shadow-[inset_4px_0_0_0_var(--color-brass)]' 
        : 'text-parchment/70 border-transparent hover:bg-ink/50 hover:text-parchment'
    } shadow-sm group whitespace-nowrap overflow-hidden`}
  >
    <Icon className={`h-5 w-5 shrink-0 ${active ? 'text-brass' : 'text-parchment/50'}`} />
    <span className={`text-sm tracking-wide transition-opacity duration-300 ${active ? 'font-bold' : 'font-semibold'} ${isExpanded ? 'opacity-100' : 'opacity-0 w-0'}`}>{label}</span>
    {!isExpanded && (
      <div className="absolute left-16 bg-oxford-blue text-parchment text-[10px] font-mono py-1 px-2 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap border border-parchment/10">
        {label}
      </div>
    )}
  </Link>
);

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(true);
  
  // Read profile synchronously from localStorage
  const [profile] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('bookhub_profile');
    return saved ? JSON.parse(saved) : null;
  });
  
  const { enqueueSnackbar } = useSnackbar();

  const handleLogout = async () => {
    console.log('AdminLayout: Logout initiated');
    try {
      await signOut();
    } catch (error: any) {
      console.error('Logout error caught:', error.message || error);
    } finally {
      console.log('AdminLayout: Finalizing logout, navigating to login');
      enqueueSnackbar('Session terminated. Logged out successfully.', { variant: 'default' });
      navigate('/login', { replace: true });
    }
  };

  const getInitials = (name: string | null) => {
    if (!name) return '??';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'DASHBOARD', path: '/' },
    { icon: Calendar, label: 'EVENTS HUB', path: '/events' },
    { icon: BookOpen, label: 'LIBRARY MANAGEMENT', path: '/books' },
    { icon: Archive, label: 'BORROW RECORDS', path: '/borrows' },
    { icon: Award, label: 'FINES & PAYMENTS', path: '/fines' },
    { icon: Users, label: 'USER MANAGEMENT', path: '/users' },
    { icon: FileBarChart, label: 'REPORTS & ANALYTICS', path: '/reports' },
    { icon: Settings, label: 'SYSTEM SETTINGS', path: '/settings' },
  ];

  return (
    <div className="flex h-screen bg-parchment overflow-hidden font-sans">
      {/* Sidebar - The Vertical Spine */}
      <aside className={`bg-oxford-blue flex flex-col shadow-2xl z-30 transition-all duration-300 ease-in-out ${isExpanded ? 'w-72' : 'w-20'}`}>
        <div className={`p-6 mb-4 flex items-center justify-between ${isExpanded ? '' : 'flex-col gap-4'}`}>
          <Link to="/" className={`flex items-center gap-3 group transition-all duration-300 ${isExpanded ? 'opacity-100' : 'scale-75'}`}>
            <div className="bg-brass p-2 rounded-academic rotate-3 group-hover:rotate-0 transition-transform shrink-0">
              <Library className="h-6 w-6 text-oxford-blue" />
            </div>
            {isExpanded && (
              <div className="flex flex-col animate-in fade-in duration-300">
                <span className="text-xl font-serif font-black text-parchment tracking-tight leading-none">BOOKHUB</span>
                <span className="text-[11px] text-brass font-mono font-black tracking-[0.2em] mt-1">ADMIN PANEL</span>
              </div>
            )}
          </Link>
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 transition-colors text-brass/40 hover:text-brass bg-parchment/5 rounded-academic"
          >
            {isExpanded ? <ChevronLeft className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>

        <nav className="flex-1 flex flex-col overflow-y-auto no-scrollbar">
          {isExpanded && <p className="px-8 text-xs font-black text-parchment/40 tracking-[0.3em] mb-4 uppercase animate-in fade-in duration-300">Main Navigation</p>}
          <div className="space-y-1">
            {menuItems.map((item) => (
              <SidebarItem 
                key={item.path} 
                {...item} 
                active={location.pathname === item.path} 
                isExpanded={isExpanded}
              />
            ))}
          </div>
        </nav>

        <div className={`p-4 border-t border-parchment/5 transition-all duration-300 relative z-40 ${isExpanded ? 'p-8' : 'p-4 flex justify-center'}`}>
          <button 
            onClick={handleLogout}
            className={`flex items-center gap-3 px-4 py-3 text-parchment/60 hover:text-red-400 hover:bg-white/5 rounded-md transition-all duration-300 font-mono text-xs font-black uppercase tracking-widest overflow-hidden group/logout ${isExpanded ? 'w-full' : 'w-auto p-2 justify-center'}`}
            title="Log out from system"
          >
            <LogOut className="h-4 w-4 shrink-0 transition-transform group-hover/logout:-translate-x-1" />
            {isExpanded && <span className="animate-in fade-in duration-300">Terminate Session</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Subtle Archival Texture Overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
        
        {/* Header */}
        <header className="h-20 border-b border-oxford-blue/10 flex items-center justify-between px-10 bg-white/80 backdrop-blur-md z-10">
          <div className="flex items-center bg-parchment border border-oxford-blue/10 rounded-academic px-4 py-2 w-96 group focus-within:border-brass/30 transition-all">
            <Search className="h-4 w-4 text-oxford-blue/30 group-focus-within:text-brass" />
            <input 
              type="text" 
              placeholder="Search library..." 
              className="bg-transparent border-none focus:outline-none text-base text-charcoal px-3 w-full font-serif italic"
            />
          </div>

          <div className="flex items-center gap-8">
            <button className="relative text-oxford-blue/40 hover:text-oxford-blue transition-colors p-2">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 h-1.5 w-1.5 bg-brass rounded-full"></span>
            </button>
            <div className="flex items-center gap-4 border-l border-oxford-blue/10 pl-8">
              <div className="text-right">
                <div className="text-sm font-serif font-black text-oxford-blue leading-none">{profile?.full_name || 'Archivist'}</div>
                <div className="text-xs text-brass uppercase font-mono font-black tracking-widest mt-1">{profile?.roles?.name || 'Staff'}</div>
              </div>
              <div className="h-12 w-12 rounded-academic bg-parchment flex items-center justify-center border-2 border-brass/50 shadow-md relative group overflow-hidden">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="User Avatar" className="h-full w-full object-cover" />
                ) : (
                  <span className="text-oxford-blue font-serif font-black text-lg relative z-10">{getInitials(profile?.full_name || 'Archivist')}</span>
                )}
                <div className="absolute inset-0 bg-brass/20 translate-y-full group-hover:translate-y-0 transition-transform"></div>
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto bg-parchment/50 p-2">
          <div className="min-h-full">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
