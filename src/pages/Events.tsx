import { useState } from 'react';
import { 
  Plus, Calendar, MapPin, Users, CheckCircle2, 
  Search, MoreVertical, QrCode, TrendingUp,
  BarChart3, UserCheck, Timer, Library
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const mockEvents = [
  { id: 1, title: 'Symposium: AI Ethics in Research', date: '2026-03-15', location: 'Oxford Wing, Hall 4', registrants: 120, checkins: 45, status: 'Upcoming', code: 'ETH-2026-01' },
  { id: 2, title: 'Literature Review: The Great Gatsby', date: '2026-03-08', location: 'Media Archive Room', registrants: 250, checkins: 242, status: 'Ongoing', code: 'LIT-REF-09' },
  { id: 3, title: 'Classical Music Appreciation', date: '2026-03-01', location: 'Acoustics Lab', registrants: 30, checkins: 28, status: 'Completed', code: 'MUS-CL-04' },
];

const checkinData = [
  { time: '08:00', count: 12 },
  { time: '08:15', count: 45 },
  { time: '08:30', count: 89 },
  { time: '08:45', count: 156 },
  { time: '09:00', count: 210 },
  { time: '09:15', count: 242 },
];

const Events = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="p-10 space-y-10 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex justify-between items-end border-b border-oxford-blue/10 pb-8">
        <div>
          <h1 className="text-4xl font-serif font-black text-oxford-blue mb-2 tracking-tight">Events Hub</h1>
          <p className="text-charcoal/70 font-sans font-medium italic">Manage library events, orientations, and attendance tracking.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="btn-academic flex items-center gap-2 shadow-lg shadow-oxford-blue/10"
        >
          <Plus className="h-4 w-4" />
          Create New Event
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: 'Total Registered', value: '1,240', icon: UserCheck, color: 'text-oxford-blue' },
          { label: 'Peak Attendance Time', value: '09:15 AM', icon: Timer, color: 'text-brass' },
          { label: 'Completion Rate', value: '94.2%', icon: TrendingUp, color: 'text-oxford-blue' },
        ].map((stat, i) => (
          <div key={i} className="card-academic p-5 flex items-center gap-5">
            <div className="bg-parchment p-3 border border-oxford-blue/5 rounded-academic">
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-xs font-mono font-black text-charcoal/60 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
              <h3 className="text-2xl font-serif font-black text-oxford-blue leading-none">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Event Registry */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-serif font-bold text-oxford-blue flex items-center gap-2">
              <Library className="h-5 w-5 text-brass" />
              Event Catalog
            </h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-oxford-blue/30" />
              <input 
                type="text" 
                placeholder="Search events..." 
                className="bg-white border border-oxford-blue/10 rounded-academic pl-10 pr-4 py-2 text-sm text-charcoal focus:outline-none focus:border-brass/30 w-64 italic font-serif"
              />
            </div>
          </div>

          <div className="space-y-6">
            {mockEvents.map((event) => (
              <div key={event.id} className="card-academic p-6 hover:shadow-xl transition-all group relative overflow-hidden">
                <div className="absolute top-0 right-0 h-10 w-32 bg-oxford-blue/5 skew-x-12 translate-x-16 -translate-y-4"></div>
                <div className="flex justify-between items-start relative z-10">
                  <div className="flex gap-5">
                    <div className="h-16 w-16 bg-oxford-blue rounded-academic flex items-center justify-center border-t-2 border-brass/50 shadow-inner">
                      <QrCode className="h-8 w-8 text-parchment" />
                    </div>
                    <div>
                      <div className="text-xs font-mono font-black text-brass tracking-[0.2em] mb-1">{event.code}</div>
                      <h3 className="text-2xl font-serif font-black text-oxford-blue group-hover:text-brass transition-colors leading-tight mb-2 tracking-tight">{event.title}</h3>
                      <div className="flex items-center gap-6 text-xs text-charcoal/70 font-black uppercase tracking-widest">
                        <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> {event.date}</span>
                        <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /> {event.location}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-3">
                    <span className={`px-4 py-1.5 rounded-academic text-xs font-black uppercase tracking-[0.2em] border ${
                      event.status === 'Ongoing' ? 'bg-parchment text-brass border-brass' :
                      event.status === 'Upcoming' ? 'bg-oxford-blue text-parchment border-oxford-blue' :
                      'bg-white text-charcoal/60 border-oxford-blue/10'
                    }`}>
                      {event.status}
                    </span>
                    <button className="text-oxford-blue/10 hover:text-oxford-blue transition-colors">
                      <MoreVertical className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className="mt-8 flex items-center gap-8 border-t border-oxford-blue/5 pt-6">
                   <div className="flex items-center gap-3">
                     <Users className="h-4 w-4 text-oxford-blue/40" />
                     <span className="text-sm font-serif font-black text-oxford-blue">{event.registrants} <span className="text-charcoal/60 font-sans font-medium italic ml-1"> Members</span></span>
                   </div>
                   <div className="flex items-center gap-3">
                     <CheckCircle2 className="h-4 w-4 text-brass" />
                     <span className="text-sm font-serif font-black text-oxford-blue">{event.checkins} <span className="text-charcoal/60 font-sans font-medium italic ml-1"> Attended</span></span>
                   </div>
                   <div className="flex-1 bg-oxford-blue/5 h-1 rounded-academic overflow-hidden">
                      <div 
                        className="h-full bg-brass transition-all duration-1000" 
                        style={{ width: `${(event.checkins/event.registrants) * 100}%` }}
                      ></div>
                   </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action & Velocity Sidebar */}
        <div className="space-y-10">
          <div className="bg-oxford-blue p-8 rounded-academic shadow-2xl relative overflow-hidden group border-t-4 border-brass">
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-8">
                <div className="bg-brass/20 p-3 rounded-academic">
                  <Library className="h-8 w-8 text-brass" />
                </div>
                <div className="text-right">
                  <div className="text-xs font-mono font-black text-brass uppercase tracking-widest">Live Terminal</div>
                  <div className="text-xs text-parchment/60 font-black">Session ID: ORI-2026</div>
                </div>
              </div>
              
              <h3 className="text-parchment font-serif font-black text-2xl mb-2">Live Attendance Hub</h3>
              <p className="text-parchment/70 text-sm italic font-serif mb-8 text-balance">Track event attendance in real-time for library ceremonies.</p>
              
              <div className="bg-ink/50 p-6 rounded-academic border border-parchment/10 mb-8">
                <div className="flex justify-between text-xs font-mono font-black text-parchment/60 uppercase tracking-widest mb-3">
                  <span>Current Attendance</span>
                  <span>96% Goal</span>
                </div>
                <div className="text-4xl font-serif font-black text-parchment tracking-tighter">242 / 250</div>
              </div>

              <button className="w-full bg-brass text-oxford-blue font-black py-4 rounded-academic text-xs uppercase tracking-widest shadow-xl hover:bg-white hover:scale-[1.02] transition-all duration-300">
                Launch Attendance Board
              </button>
            </div>
          </div>

          <div className="card-academic p-8">
            <h3 className="text-sm font-serif font-bold text-oxford-blue mb-8 flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-brass" />
              Check-in Velocity
            </h3>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={checkinData}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#B5A642" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#B5A642" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#00000005" vertical={false} />
                  <XAxis dataKey="time" hide />
                  <YAxis hide domain={['dataMin - 10', 'dataMax + 10']} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#FCFBF7', border: '1px solid #00214710', borderRadius: '2px' }}
                    labelStyle={{ fontFamily: 'serif', color: '#002147', fontWeight: 'bold' }}
                  />
                  <Area type="monotone" dataKey="count" stroke="#B5A642" fillOpacity={1} fill="url(#colorCount)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-8 flex justify-between items-end border-t border-oxford-blue/5 pt-4">
              <div>
                <p className="text-charcoal/60 text-xs font-mono font-black uppercase tracking-widest">Latest Entry</p>
                <p className="text-oxford-blue text-xs font-black font-serif italic">9:16:42 AM - User: Wick, J.</p>
              </div>
              <div className="text-brass flex items-center gap-1.5 text-xs font-black tracking-widest animate-pulse font-mono">
                <div className="h-2 w-2 bg-brass rounded-full shadow-[0_0_8px_var(--color-brass)]"></div>
                LIVE FEED
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scholarly Modal */}
      {showModal && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-oxford-blue/40 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
          <div className="bg-parchment border-t-8 border-oxford-blue w-full max-w-xl rounded-academic p-10 relative z-10 shadow-2xl scale-in-center overflow-hidden">
             <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
             <h2 className="text-3xl font-serif font-black text-oxford-blue mb-2 tracking-tight uppercase">Create New Event</h2>
             <p className="text-charcoal/70 text-sm font-sans font-medium italic mb-8 border-b border-oxford-blue/10 pb-4">Define a new event for the library system.</p>
             
             <div className="space-y-6">
               <div className="space-y-2">
                 <label className="text-xs font-mono font-black text-brass uppercase tracking-[0.2em] px-1">Event Title</label>
                 <input type="text" placeholder="e.g. Annual Reader Workshop" className="input-academic font-serif font-black italic" />
               </div>
               <div className="grid grid-cols-2 gap-6">
                 <div className="space-y-2">
                   <label className="text-xs font-mono font-black text-brass uppercase tracking-[0.2em] px-1">Event Date</label>
                   <input type="date" className="input-academic font-bold" />
                 </div>
                 <div className="space-y-2">
                   <label className="text-xs font-mono font-black text-brass uppercase tracking-[0.2em] px-1">Location</label>
                   <input type="text" placeholder="Room/Hall" className="input-academic font-bold" />
                 </div>
               </div>
               <div className="space-y-2 pt-6 flex gap-6">
                 <button className="flex-1 px-8 py-4 text-oxford-blue font-mono text-xs font-black uppercase tracking-widest hover:text-charcoal transition-colors underline decoration-brass underline-offset-8" onClick={() => setShowModal(false)}>Cancel</button>
                 <button className="flex-1 btn-academic text-xs uppercase tracking-widest py-4">Create Event</button>
               </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;

