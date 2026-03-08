import { Shield, Bell, Database, Globe, Lock, Save, RotateCcw, Library } from 'lucide-react';

const Settings = () => {
  return (
    <div className="p-10 space-y-10 animate-in fade-in duration-500 max-w-5xl">
      {/* Header */}
      <div className="flex justify-between items-end border-b border-oxford-blue/10 pb-8">
        <div>
          <h1 className="text-4xl font-serif font-black text-oxford-blue mb-2 tracking-tight uppercase">System Settings</h1>
          <p className="text-charcoal/70 font-sans font-medium italic">Configure library parameters and system-wide administrative presets.</p>
        </div>
        <div className="flex gap-4">
          <button className="px-6 py-2 flex items-center gap-2 text-charcoal/60 font-mono text-xs font-black uppercase tracking-widest hover:text-oxford-blue transition-colors">
            <RotateCcw className="h-4 w-4" />
            Reset All Settings
          </button>
          <button className="btn-academic flex items-center gap-2 text-xs">
            <Save className="h-4 w-4" />
            Save Settings
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Navigation Sidebar for Settings */}
        <div className="space-y-2">
           {[
             { label: 'Library Profile', icon: Library, active: true },
             { label: 'Circulation Rules', icon: Database, active: false },
             { label: 'Security Settings', icon: Lock, active: false },
             { label: 'Notifications', icon: Bell, active: false },
             { label: 'Language & Locale', icon: Globe, active: false },
           ].map((item, i) => (
             <button key={i} className={`w-full flex items-center gap-4 px-6 py-4 rounded-academic transition-all border-l-2 ${
               item.active 
                 ? 'bg-oxford-blue text-parchment border-brass' 
                 : 'text-oxford-blue/40 border-transparent hover:bg-oxford-blue/5 hover:text-oxford-blue'
             }`}>
               <item.icon className="h-4 w-4" />
               <span className="text-xs font-mono font-black uppercase tracking-widest text-left">{item.label}</span>
             </button>
           ))}
        </div>

        {/* Content Form */}
        <div className="md:col-span-2 space-y-10">
           <section className="space-y-6">
              <h3 className="text-xl font-serif font-bold text-oxford-blue border-b border-oxford-blue/5 pb-2">Library Profile</h3>
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                   <label className="text-xs font-mono font-black text-brass uppercase tracking-[0.2em] px-1">Library Name</label>
                   <input type="text" defaultValue="Bookhub Main Library" className="input-academic font-serif font-black italic" />
                </div>
                <div className="grid grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <label className="text-xs font-mono font-black text-brass uppercase tracking-[0.2em] px-1">Library Code</label>
                      <input type="text" defaultValue="BKH-ALPHA-2026" className="input-academic font-mono font-black" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-xs font-mono font-black text-brass uppercase tracking-[0.2em] px-1">Timezone Epoch</label>
                      <select className="input-academic font-black">
                        <option>Indochina Time (GMT+7)</option>
                        <option>Greenwich Mean Time (GMT+0)</option>
                      </select>
                   </div>
                </div>
              </div>
           </section>

           <section className="space-y-6">
              <h3 className="text-xl font-serif font-bold text-oxford-blue border-b border-oxford-blue/5 pb-2">Management Policies</h3>
              <div className="space-y-4">
                 <div className="flex items-center justify-between p-6 card-academic bg-parchment/30">
                    <div>
                       <div className="text-sm font-black text-oxford-blue font-serif">Strict Inventory Verification</div>
                       <div className="text-xs text-charcoal/60 font-medium font-sans mt-1">Require admin approval for all new book entries.</div>
                    </div>
                    <div className="w-12 h-6 bg-oxford-blue rounded-full relative p-1 cursor-pointer">
                       <div className="h-4 w-4 bg-brass rounded-full absolute right-1"></div>
                    </div>
                 </div>
                 <div className="flex items-center justify-between p-6 card-academic bg-parchment/30">
                    <div>
                       <div className="text-sm font-black text-oxford-blue font-serif">Automated Inventory Scan</div>
                       <div className="text-xs text-charcoal/60 font-medium font-sans mt-1">Periodically check book database integrity.</div>
                    </div>
                    <div className="w-12 h-6 bg-charcoal/10 rounded-full relative p-1 cursor-pointer">
                       <div className="h-4 w-4 bg-white rounded-full absolute left-1"></div>
                    </div>
                 </div>
              </div>
           </section>

           <section className="space-y-6 p-8 bg-red-50 border border-red-100 rounded-academic">
              <h3 className="text-sm font-serif font-bold text-red-900 border-b border-red-200 pb-2 flex items-center gap-2">
                <Shield className="h-4 w-4" />
                DANGER ZONE
              </h3>
              <p className="text-xs text-red-800/80 font-sans font-black uppercase tracking-widest mb-4">Permanent destructive actions.</p>
              <button className="px-6 py-4 border-2 border-red-200 text-red-700 font-mono text-xs font-black uppercase tracking-widest hover:bg-red-600 hover:text-white hover:border-red-600 transition-all">
                Clear System Data
              </button>
           </section>
        </div>
      </div>
    </div>
  );
};

export default Settings;
