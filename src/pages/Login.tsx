import { useState, useEffect } from 'react';
import { Library, Loader2, School, GraduationCap, BookOpen, ShieldCheck } from 'lucide-react';
import { supabase } from '../services/supabase';
import { useSnackbar } from 'notistack';
import { getUserProfile } from '../services/auth';
import { useNavigate } from 'react-router-dom';

const universities = [
  'FPT University Ha Noi',
  'FPT University HCM',
  'FPT University Can Tho',
  'FPT University Da Nang',
  'FPT University Quy Nhon',
];

// Module-level lock to survive React Strict Mode double-mounts
let isProcessingSession = false;
let lastSuccessTime = 0;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedUni, setSelectedUni] = useState(universities[1]); // Default to HCM
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  useEffect(() => {
    const processSession = async (session: any) => {
      if (!session) return;
      
      // If we are already processing or it's just a dupe trigger
      if (isProcessingSession || localStorage.getItem('bookhub_is_admin') === 'true') {
         navigate('/', { replace: true });
         return;
      }

      setLoading(true);
      isProcessingSession = true;
      try {
        const profile = await getUserProfile(session.user.id);
        const isAdmin = !!(profile && (profile.roles?.name?.toUpperCase() === 'ADMIN' || profile.roles?.name?.toUpperCase() === 'LIBRARIAN'));
        
        if (profile) {
          localStorage.setItem('bookhub_profile', JSON.stringify(profile));
        }
        localStorage.setItem('bookhub_is_admin', isAdmin ? 'true' : 'false');
        
        if (isAdmin) {
          const now = Date.now();
          if (now - lastSuccessTime > 5000) {
            enqueueSnackbar(`Login successful. Welcome, ${profile?.full_name || 'Admin'}!`, { variant: 'success' });
            lastSuccessTime = now;
          }
          navigate('/', { replace: true });
          // Release lock after navigation is complete and dupe events have passed
          setTimeout(() => { isProcessingSession = false; }, 2000);
        } else {
          const now = Date.now();
          if (now - lastSuccessTime > 5000) {
            enqueueSnackbar('Access denied. Administrator privileges required.', { variant: 'error' });
            lastSuccessTime = now;
          }
          await supabase.auth.signOut();
          localStorage.removeItem('bookhub_is_admin');
          localStorage.removeItem('bookhub_profile');
          setLoading(false);
          isProcessingSession = false;
        }
      } catch (err: any) {
        console.error('Login role check error:', err);
        setError('Failed to query user role.');
        setLoading(false);
        isProcessingSession = false;
      }
    };

    // Subscribes to auth changes (especially useful when OAuth redirects back)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      processSession(session);
    });

    // Fallback: check session directly on load
    supabase.auth.getSession().then(({ data: { session } }) => {
      processSession(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, enqueueSnackbar]);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      enqueueSnackbar('Initiating secure login sequence...', { variant: 'info' });
      const { error: authError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      if (authError) throw authError;
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with Google');
      enqueueSnackbar(err.message || 'Verification failed', { variant: 'error' });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-parchment flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Background Scholarly Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <span className="text-[25vw] font-serif font-black text-oxford-blue opacity-[0.02] rotate-[-15deg] whitespace-nowrap select-none">
          ARCHIVAL ACCESS
        </span>
      </div>
      
      {/* Subtle Archival Texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>

      <div className="w-full max-w-md card-academic p-10 border-t-8 border-t-oxford-blue relative z-10 bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-700">
        <div className="flex flex-col items-center mb-10">
          <div className="bg-oxford-blue p-4 rounded-academic shadow-xl mb-6 relative group">
            <Library className="h-10 w-10 text-parchment group-hover:scale-110 transition-transform" />
            <div className="absolute -top-1 -right-1 h-4 w-4 bg-brass rounded-full border-2 border-white"></div>
          </div>
          <h1 className="text-3xl font-serif font-black text-oxford-blue tracking-tight uppercase">Librarian Portal</h1>
          <p className="text-charcoal/70 text-xs font-mono font-black uppercase tracking-[0.2em] mt-3">Archival Credential Verification</p>
        </div>

        <div className="space-y-8">
          <div className="space-y-3">
            <label className="text-xs font-mono font-black text-brass uppercase tracking-[0.2em] px-1 flex items-center gap-2">
              <School className="h-3 w-3" />
              Assigned Campus
            </label>
            <div className="relative group">
              <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-oxford-blue/20 group-focus-within:text-brass transition-colors" />
              <select 
                value={selectedUni}
                onChange={(e) => setSelectedUni(e.target.value)}
                className="input-academic pl-12 py-4 font-serif italic appearance-none cursor-pointer hover:border-brass/20 transition-all text-sm"
              >
                {universities.map(uni => (
                  <option key={uni} value={uni}>{uni}</option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-oxford-blue/20 text-xs">▼</div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="relative flex items-center py-2">
              <div className="grow border-t border-oxford-blue/10"></div>
              <span className="shrink mx-4 text-[10px] font-mono font-black text-charcoal/30 uppercase tracking-widest flex items-center gap-2">
                <BookOpen className="h-3 w-3" />
                Staff Authentication
              </span>
              <div className="grow border-t border-oxford-blue/10"></div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs font-mono font-bold rounded-academic animate-in fade-in slide-in-from-top-1">
                {error}
              </div>
            )}

            <button 
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full btn-academic py-5 shadow-xl shadow-oxford-blue/10 flex items-center justify-center gap-4 disabled:opacity-70 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-0 transition-transform skew-x-12"></div>
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span className="text-xs uppercase font-mono font-black tracking-widest">Verifying Seals...</span>
                </>
              ) : (
                <>
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  <span className="text-xs uppercase font-mono font-black tracking-widest">Verify with Google</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="mt-12 text-center border-t border-oxford-blue/5 pt-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <ShieldCheck className="h-4 w-4 text-brass" />
              <span className="text-[10px] font-mono font-black text-oxford-blue/40 uppercase tracking-widest">Secure Library Node 0x7F</span>
            </div>
            <p className="text-charcoal/60 text-[10px] font-mono font-black uppercase tracking-[0.3em] leading-relaxed">
              Administrative credentials required. Access is monitored by the Archival Governance Board.
            </p>
        </div>
      </div>
      
      {/* Footer Decoration */}
      <div className="absolute bottom-8 text-xs font-mono font-black text-oxford-blue/50 tracking-[0.5em] uppercase">
        © 2026 Archive Oversight - BookHub Management
      </div>
    </div>
  );
};

export default Login;

