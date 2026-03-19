import { Link } from 'react-router-dom';
import { Library, Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-parchment flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Subtle Archival Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
      
      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 opacity-10 rotate-12">
        <Library className="h-64 w-64 text-oxford-blue" />
      </div>
      <div className="absolute bottom-10 right-10 opacity-10 -rotate-12">
        <Library className="h-64 w-64 text-oxford-blue" />
      </div>

      <div className="max-w-md w-full text-center space-y-8 relative z-10 transition-all duration-500 animate-in fade-in zoom-in slide-in-from-bottom-10">
        <div className="space-y-2">
          <div className="text-oxford-blue/10 font-serif font-black text-[180px] leading-none select-none tracking-tighter">
            404
          </div>
          <h1 className="text-4xl font-serif font-black text-oxford-blue tracking-tight uppercase">Trang này không tồn tại</h1>
          <p className="text-charcoal/70 font-sans font-medium italic">"Dường như bạn đã lạc lối trong kho lưu trữ bí mật của thư viện."</p>
        </div>

        <div className="h-px w-24 bg-brass/30 mx-auto"></div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link 
            to="/" 
            className="btn-academic flex items-center justify-center gap-2 group"
          >
            <Home className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
            Về Bảng điều khiển
          </Link>
          
          <button 
            onClick={() => window.history.back()}
            className="flex items-center justify-center gap-2 px-6 py-3 text-oxford-blue font-mono text-xs font-black uppercase tracking-widest border border-oxford-blue/10 rounded-academic hover:bg-oxford-blue/5 hover:border-oxford-blue/20 transition-all cursor-pointer group"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Quay lại trang trước
          </button>
        </div>

        <div className="pt-12">
          <div className="flex items-center justify-center gap-3">
             <div className="bg-brass p-2 rounded-academic rotate-3">
                <Library className="h-5 w-5 text-oxford-blue" />
             </div>
             <div className="flex flex-col text-left">
                <span className="text-lg font-serif font-black text-oxford-blue tracking-tight leading-none uppercase">BookHub</span>
                <span className="text-[9px] text-brass font-mono font-black tracking-[0.2em] mt-0.5">HỆ THỐNG QUẢN TRỊ THƯ VIỆN</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
