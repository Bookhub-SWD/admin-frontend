import { Shield, Bell, Database, Globe, Lock, Save, RotateCcw, Library, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useSnackbar } from 'notistack';

const Settings = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('Library Profile');
  const [libraryName, setLibraryName] = useState('Bookhub Main Library');
  const [libraryCode, setLibraryCode] = useState('BKH-ALPHA-2026');

  const handleSave = async () => {
    setLoading(true);
    // Simulating API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
    enqueueSnackbar('System parameters updated successfully', { variant: 'success' });
  };

  return (
    <div className="p-10 space-y-10 animate-in fade-in duration-500 max-w-5xl">
      {/* Header */}
      <div className="flex justify-between items-end border-b border-oxford-blue/10 pb-8">
        <div>
          <h1 className="text-4xl font-serif font-black text-oxford-blue mb-2 tracking-tight uppercase">System Settings</h1>
          <p className="text-charcoal/70 font-sans font-medium italic">Configure library parameters and system-wide administrative presets.</p>
        </div>
        <div className="flex gap-4">
          <button className="px-6 py-2 flex items-center gap-2 text-charcoal/60 font-mono text-[10px] font-black uppercase tracking-widest hover:text-oxford-blue transition-colors cursor-pointer">
            <RotateCcw className="h-4 w-4" />
            Reset Defaults
          </button>
          <button 
            onClick={handleSave}
            disabled={loading}
            className="btn-academic flex items-center gap-2 text-xs cursor-pointer disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {loading ? 'Committing...' : 'Commit Changes'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Navigation Sidebar for Settings */}
        <div className="space-y-2">
           {[
             { label: 'Library Profile', icon: Library },
             { label: 'Circulation Rules', icon: Database },
             { label: 'Security Settings', icon: Lock },
             { label: 'Notifications', icon: Bell },
             { label: 'Language & Locale', icon: Globe },
           ].map((item, i) => (
             <button 
                key={i} 
                onClick={() => setActiveTab(item.label)}
                className={`w-full flex items-center gap-4 px-6 py-5 rounded-academic transition-all border-l-4 shadow-sm ${
                activeTab === item.label
                  ? 'bg-oxford-blue text-parchment border-brass' 
                  : 'bg-white text-oxford-blue/40 border-transparent hover:bg-oxford-blue/5 hover:text-oxford-blue'
              }`}
             >
               <item.icon className={`h-4 w-4 ${activeTab === item.label ? 'text-brass' : ''}`} />
               <span className="text-[10px] font-mono font-black uppercase tracking-widest text-left">{item.label}</span>
             </button>
           ))}
        </div>

        {/* Content Form */}
        <div className="md:col-span-2 space-y-10">
           {activeTab === 'Library Profile' && (
             <section className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                <h3 className="text-2xl font-serif font-black text-oxford-blue border-b border-oxford-blue/5 pb-4 uppercase tracking-tighter">Library Identity</h3>
                <div className="grid grid-cols-1 gap-8">
                  <div className="space-y-3">
                     <label className="text-[10px] font-mono font-black text-oxford-blue/60 uppercase tracking-[0.2em] px-1">Institutional Name</label>
                     <input 
                        type="text" 
                        value={libraryName} 
                        onChange={(e) => setLibraryName(e.target.value)}
                        className="w-full bg-white border border-oxford-blue/20 rounded-academic px-5 py-4 text-xl font-serif font-black italic text-oxford-blue focus:outline-none focus:border-brass/30 shadow-sm"
                     />
                  </div>
                  <div className="grid grid-cols-2 gap-8">
                     <div className="space-y-3">
                        <label className="text-[10px] font-mono font-black text-oxford-blue/60 uppercase tracking-[0.2em] px-1">Authority Code</label>
                        <input 
                            type="text" 
                            value={libraryCode} 
                            onChange={(e) => setLibraryCode(e.target.value)}
                            className="w-full bg-white border border-oxford-blue/20 rounded-academic px-5 py-3 text-sm font-mono font-black uppercase text-brass focus:outline-none focus:border-oxford-blue/30 shadow-sm"
                        />
                     </div>
                     <div className="space-y-3">
                        <label className="text-[10px] font-mono font-black text-oxford-blue/60 uppercase tracking-[0.2em] px-1">Temporal Zone</label>
                        <select className="w-full bg-white border border-oxford-blue/20 rounded-academic px-5 py-3 text-xs font-mono font-black uppercase text-oxford-blue focus:outline-none focus:border-oxford-blue/30 shadow-sm cursor-pointer">
                          <option>Indochina Time (GMT+7)</option>
                          <option>Greenwich Mean Time (GMT+0)</option>
                        </select>
                     </div>
                  </div>
                </div>
             </section>
           )}

           <section className="space-y-6">
              <h3 className="text-xl font-serif font-bold text-oxford-blue border-b border-oxford-blue/5 pb-2 uppercase tracking-tighter opacity-40">Management Policies</h3>
              <div className="space-y-4">
                 <div className="flex items-center justify-between p-6 card-academic bg-white border border-oxford-blue/5">
                    <div>
                       <div className="text-sm font-black text-oxford-blue font-serif uppercase tracking-tight">Strict Inventory Verification</div>
                       <div className="text-[10px] text-charcoal/60 font-bold font-sans mt-1 uppercase tracking-widest">Require admin approval for all new book entries.</div>
                    </div>
                    <div className="w-12 h-6 bg-oxford-blue rounded-full relative p-1 cursor-pointer">
                       <div className="h-4 w-4 bg-brass rounded-full absolute right-1 shadow-md"></div>
                    </div>
                 </div>
                 <div className="flex items-center justify-between p-6 card-academic bg-white border border-oxford-blue/5 opacity-50">
                    <div>
                       <div className="text-sm font-black text-oxford-blue font-serif uppercase tracking-tight">Automated Integrity Scan</div>
                       <div className="text-[10px] text-charcoal/60 font-bold font-sans mt-1 uppercase tracking-widest">Periodically check book database consistency.</div>
                    </div>
                    <div className="w-12 h-6 bg-charcoal/10 rounded-full relative p-1 cursor-not-allowed">
                       <div className="h-4 w-4 bg-white rounded-full absolute left-1"></div>
                    </div>
                 </div>
              </div>
           </section>

           <section className="space-y-6 p-8 bg-red-50/50 border border-red-100 rounded-academic">
              <h3 className="text-sm font-serif font-bold text-red-900 border-b border-red-200 pb-2 flex items-center gap-2 uppercase tracking-widest">
                <Shield className="h-4 w-4" />
                DANGER ZONE
              </h3>
              <p className="text-[10px] text-red-800/80 font-mono font-black uppercase tracking-[0.2em] mb-4">Immediate and permanent destructive operations.</p>
              <button className="px-6 py-4 border-2 border-red-200 text-red-700 font-mono text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white hover:border-red-600 transition-all cursor-pointer">
                Purge Archeological Data
              </button>
           </section>
        </div>
      </div>
    </div>
  );
};

export default Settings;
