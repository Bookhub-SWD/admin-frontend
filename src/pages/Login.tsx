import React, { useState } from 'react';
import { Library, Mail, Lock, Loader2, ShieldCheck } from 'lucide-react';

const Login = () => {
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      window.location.href = '/';
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-parchment flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Background Scholarly Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <span className="text-[25vw] font-serif font-black text-oxford-blue opacity-[0.02] rotate-[-15deg] whitespace-nowrap select-none">
          BOOKHUB ADMIN
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
          <h1 className="text-3xl font-serif font-black text-oxford-blue tracking-tight uppercase">Admin Login</h1>
          <p className="text-charcoal/70 text-xs font-mono font-black uppercase tracking-[0.2em] mt-3">Sign in to your account</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-mono font-black text-brass uppercase tracking-[0.2em] px-1">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-oxford-blue/20 group-focus-within:text-brass transition-colors" />
              <input 
                type="email" 
                defaultValue="admin@bookhub.com"
                className="input-academic pl-12 py-4 font-serif italic"
                placeholder="admin@bookhub.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono font-black text-brass uppercase tracking-[0.2em] px-1">Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-oxford-blue/20 group-focus-within:text-brass transition-colors" />
              <input 
                type="password" 
                defaultValue="••••••••"
                className="input-academic pl-12 py-4 font-mono tracking-widest text-xs"
                placeholder="Enter passphrase"
              />
            </div>
          </div>

          <div className="pt-4">
            <button 
              type="submit"
              disabled={loading}
              className="w-full btn-academic py-5 shadow-xl shadow-oxford-blue/10 flex items-center justify-center gap-3 disabled:opacity-70 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-0 transition-transform skew-x-12"></div>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-xs uppercase font-mono font-black tracking-widest">Signing In...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="h-4 w-4" />
                  <span className="text-xs uppercase font-mono font-black tracking-widest">Sign In</span>
                </>
              )}
            </button>
          </div>
        </form>

        <div className="mt-12 text-center border-t border-oxford-blue/5 pt-8">
            <p className="text-charcoal/60 text-xs font-mono font-black uppercase tracking-[0.3em] leading-relaxed">
              Unauthorized access is prohibited. This system is for authorized personnel only. 
              All activities are monitored and logged.
            </p>
        </div>
      </div>
      
      {/* Footer Decoration */}
      <div className="absolute bottom-8 text-xs font-mono font-black text-oxford-blue/50 tracking-[0.5em] uppercase">
        © 2026 Admin Division - BookHub Management
      </div>
    </div>
  );
};

export default Login;
