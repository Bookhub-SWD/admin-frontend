import { useState, useEffect, useCallback } from 'react';
import { 
  Plus, Calendar, MapPin, Users, CheckCircle2, 
  Search, QrCode, TrendingUp, Filter, Eye,
  BarChart3, UserCheck, Timer, Library, Loader2, Trash2, Edit3, ChevronLeft, ChevronRight
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import api from '../services/api';
import { useSnackbar } from 'notistack';
import EventModal from '../components/EventModal';
import EventDetailModal from '../components/EventDetailModal';
import type { Event } from '../types/event';

const checkinData = [
  { time: '08:00', count: 12 },
  { time: '08:15', count: 45 },
  { time: '08:30', count: 89 },
  { time: '08:45', count: 156 },
  { time: '09:00', count: 210 },
  { time: '09:15', count: 242 },
];

const Events = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedDetailEvent, setSelectedDetailEvent] = useState<Event | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    total_items: 0,
    limit: 10
  });

  const fetchEvents = useCallback(async (page = 1, query = '', status = '') => {
    setLoading(true);
    try {
      const res = await api.get('/events', {
        params: {
          page,
          search: query,
          status,
          limit: pagination.limit
        }
      });
      if (res.data.ok) {
        setEvents(res.data.data);
        setPagination(res.data.pagination);
      }
    } catch (err) {
      console.error('Events: Error fetching data', err);
      enqueueSnackbar('Failed to retrieve event archives', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar, pagination.limit]);

  useEffect(() => {
    const timer = setTimeout(() => {
        fetchEvents(1, search, statusFilter);
    }, 500);
    return () => clearTimeout(timer);
  }, [search, statusFilter, fetchEvents]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you certain you wish to strike this event from the archives?')) return;
    try {
      const res = await api.delete(`/events/${id}`);
      if (res.data.ok) {
        enqueueSnackbar('Event excised from registry', { variant: 'success' });
        fetchEvents(pagination.current_page, search);
      }
    } catch (err: any) {
      enqueueSnackbar(err.response?.data?.message || 'Erasure failed', { variant: 'error' });
    }
  };

  const calculateStatus = (dateStr: string) => {
    const eventDate = new Date(dateStr);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const evDay = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());

    if (evDay.getTime() === today.getTime()) return 'Ongoing';
    if (evDay > today) return 'Upcoming';
    return 'Completed';
  };

  return (
    <div className="p-10 space-y-10 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex justify-between items-end border-b border-oxford-blue/10 pb-8">
        <div>
          <h1 className="text-4xl font-serif font-black text-oxford-blue mb-2 tracking-tight">Events Hub</h1>
          <p className="text-charcoal/70 font-sans font-medium italic">Manage library events, orientations, and attendance tracking.</p>
        </div>
        <button 
          onClick={() => {
            setSelectedEvent(null);
            setShowModal(true);
          }}
          className="btn-academic flex items-center gap-2 shadow-lg shadow-oxford-blue/10 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Create New Event
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: 'Total Registered', value: pagination.total_items * 42, icon: UserCheck, color: 'text-oxford-blue' }, // Mocking some multiplier for realism
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
            <div className="flex items-center gap-4">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-oxford-blue/30" />
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-white border border-oxford-blue/10 rounded-academic pl-9 pr-4 py-3 text-[10px] text-oxford-blue focus:outline-none focus:border-brass/30 font-mono font-black uppercase tracking-widest bg-white/50 cursor-pointer appearance-none min-w-[160px]"
                >
                  <option value="">All Statutes</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-oxford-blue/30" />
                <input 
                  type="text" 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search events..." 
                  className="bg-white border border-oxford-blue/10 rounded-academic pl-10 pr-4 py-3 text-sm text-oxford-blue focus:outline-none focus:border-brass/30 w-72 italic font-serif font-bold uppercase tracking-widest bg-white/50"
                />
              </div>
            </div>
          </div>

          <div className="space-y-6 flex flex-col min-h-[500px]">
            {loading ? (
                <div className="flex-1 flex flex-col items-center justify-center gap-4 py-20">
                    <Loader2 className="h-10 w-10 text-oxford-blue animate-spin" />
                    <span className="text-xs font-mono font-black text-oxford-blue/40 uppercase tracking-[0.3em]">Querying Ceremony Archives...</span>
                </div>
            ) : events.length === 0 ? (
                <div className="flex-1 flex items-center justify-center py-20 border-2 border-dashed border-oxford-blue/10 rounded-academic font-serif font-black italic text-charcoal/30">
                    No ceremony protocols matching the criteria were found.
                </div>
            ) : (
                <>
                {events.map((event) => {
                    const dateToUse = event.start_time || event.event_date || '';
                    const status = calculateStatus(dateToUse);
                    const registrants = event.registered_count || event._count?.registrations || 0;
                    const checkins = event.attended_count || event._count?.check_ins || 0;
                    const eventIdStr = String(event.id);
                    
                    return (
                        <div key={eventIdStr} className="card-academic p-6 hover:shadow-xl transition-all group relative overflow-hidden bg-white">
                            <div className="absolute top-0 right-0 h-10 w-32 bg-oxford-blue/5 skew-x-12 translate-x-16 -translate-y-4"></div>
                            <div className="flex justify-between items-start relative z-10">
                                <div className="flex gap-5">
                                <div className="h-16 w-16 bg-oxford-blue rounded-academic flex items-center justify-center border-t-2 border-brass/50 shadow-inner group-hover:bg-brass transition-colors">
                                    <QrCode className="h-8 w-8 text-parchment group-hover:text-oxford-blue" />
                                </div>
                                <div>
                                    <div className="text-[10px] font-mono font-black text-brass tracking-[0.2em] mb-1 uppercase bg-brass/10 px-2 py-0.5 rounded-sm inline-block">{event.code || `EVT-${eventIdStr.substring(0,4)}`}</div>
                                    <h3 className="text-2xl font-serif font-black text-oxford-blue group-hover:text-brass transition-colors leading-tight mb-2 tracking-tight">{event.title}</h3>
                                    <div className="flex items-center gap-6 text-[10px] text-charcoal/70 font-black uppercase tracking-widest">
                                    <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> {dateToUse ? new Date(dateToUse).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }) : 'TBD'}</span>
                                    <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> {event.location}</span>
                                    </div>
                                </div>
                                </div>
                                <div className="flex flex-col items-end gap-3">
                                <span className={`px-4 py-1.5 rounded-academic text-[10px] font-black uppercase tracking-[0.2em] border shadow-sm ${
                                    status === 'Ongoing' ? 'bg-parchment text-brass border-brass animate-pulse' :
                                    status === 'Upcoming' ? 'bg-oxford-blue text-parchment border-oxford-blue' :
                                    'bg-white text-charcoal/60 border-oxford-blue/10'
                                }`}>
                                    {status}
                                </span>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                        onClick={() => {
                                            setSelectedDetailEvent(event);
                                            setShowDetailModal(true);
                                        }}
                                        className="p-2 text-oxford-blue/40 hover:text-brass transition-colors cursor-pointer"
                                        title="Examine Details"
                                    >
                                        <Eye className="h-4 w-4" />
                                    </button>
                                    <button 
                                        onClick={() => {
                                            setSelectedEvent(event);
                                            setShowModal(true);
                                        }}
                                        className="p-2 text-oxford-blue/40 hover:text-brass transition-colors cursor-pointer"
                                        title="Modify Charter"
                                    >
                                        <Edit3 className="h-4 w-4" />
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(eventIdStr)}
                                        className="p-2 text-red-200 hover:text-red-500 transition-colors cursor-pointer"
                                        title="Strike Event"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                                </div>
                            </div>

                            <div className="mt-8 flex items-center gap-8 border-t border-oxford-blue/5 pt-6">
                                <div className="flex items-center gap-3">
                                    <Users className="h-4 w-4 text-oxford-blue/40" />
                                    <span className="text-sm font-serif font-black text-oxford-blue">{registrants} <span className="text-charcoal/60 font-sans font-medium italic ml-1"> Charter Signatories</span></span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <CheckCircle2 className="h-4 w-4 text-brass" />
                                    <span className="text-sm font-serif font-black text-oxford-blue">{checkins} <span className="text-charcoal/60 font-sans font-medium italic ml-1"> Present</span></span>
                                </div>
                                <div className="flex-1 bg-oxford-blue/5 h-2 rounded-full overflow-hidden shadow-inner">
                                    <div 
                                        className={`h-full bg-brass transition-all duration-1000 ${status === 'Ongoing' ? 'animate-pulse' : ''}`} 
                                        style={{ width: `${registrants > 0 ? (checkins/registrants) * 100 : 0}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    );
                })}
                {/* Pagination */}
                <div className="p-6 bg-parchment/10 border-t border-oxford-blue/5 flex justify-between items-center text-[10px] font-mono font-black text-charcoal/60 uppercase tracking-[0.3em]">
                    <span>Charter Page {pagination.current_page} of {pagination.total_pages}</span>
                    <div className="flex gap-4">
                        <button 
                            onClick={() => fetchEvents(pagination.current_page - 1, search, statusFilter)}
                            disabled={pagination.current_page === 1 || loading}
                            className="p-2 hover:text-oxford-blue disabled:opacity-20 font-black cursor-pointer border border-transparent hover:border-oxford-blue/10 rounded-academic transition-colors"
                            title="Previous Protocol"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button 
                            onClick={() => fetchEvents(pagination.current_page + 1, search, statusFilter)}
                            disabled={pagination.current_page === pagination.total_pages || loading}
                            className="p-2 hover:text-oxford-blue disabled:opacity-20 font-black cursor-pointer border border-transparent hover:border-oxford-blue/10 rounded-academic transition-colors"
                            title="Next Protocol"
                        >
                            <ChevronRight className="h-5 w-5" />
                        </button>
                    </div>
                </div>
                </>
            )}
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
                  <div className="text-xs text-parchment/60 font-black uppercase">Session ACTIVE</div>
                </div>
              </div>
              
              <h3 className="text-parchment font-serif font-black text-2xl mb-2">Live Attendance Hub</h3>
              <p className="text-parchment/70 text-sm italic font-serif mb-8 text-balance">Track event attendance in real-time for scholarly ceremonies.</p>
              
              <div className="bg-ink/50 p-6 rounded-academic border border-parchment/10 mb-8 shadow-inner">
                <div className="flex justify-between text-[10px] font-mono font-black text-parchment/60 uppercase tracking-widest mb-3">
                  <span>Current Attendance</span>
                  <span>96% Goal</span>
                </div>
                <div className="text-4xl font-serif font-black text-parchment tracking-tighter">242 / 250</div>
              </div>

              <button className="w-full bg-brass text-oxford-blue font-black py-4 rounded-academic text-xs uppercase tracking-widest shadow-xl hover:bg-white hover:scale-[1.02] transition-all duration-300 cursor-pointer">
                Launch Attendance Board
              </button>
            </div>
          </div>

          <div className="card-academic p-8 bg-white">
            <h3 className="text-sm font-serif font-bold text-oxford-blue mb-8 flex items-center gap-2 uppercase tracking-tighter">
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
                    contentStyle={{ backgroundColor: '#FCFBF7', border: '1px solid #00214710', borderRadius: '2px', boxShadow: 'none' }}
                    labelStyle={{ fontFamily: 'serif', color: '#002147', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '10px' }}
                    itemStyle={{ fontFamily: 'mono', fontWeight: '900', fontSize: '12px' }}
                  />
                  <Area type="monotone" dataKey="count" stroke="#B5A642" fillOpacity={1} fill="url(#colorCount)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-8 flex justify-between items-end border-t border-oxford-blue/5 pt-4">
              <div>
                <p className="text-charcoal/60 text-[10px] font-mono font-black uppercase tracking-widest">Latest Access</p>
                <p className="text-oxford-blue text-xs font-black font-serif italic">09:16:42 AM - Wick, Julian</p>
              </div>
              <div className="text-brass flex items-center gap-1.5 text-[10px] font-black tracking-widest animate-pulse font-mono bg-brass/5 px-2 py-1 rounded-sm">
                <div className="h-2 w-2 bg-brass rounded-full shadow-[0_0_8px_var(--color-brass)]"></div>
                LIVE FEED
              </div>
            </div>
          </div>
        </div>
      </div>

      <EventModal 
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={() => fetchEvents(pagination.current_page, search, statusFilter)}
        event={selectedEvent}
      />

      <EventDetailModal 
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        event={selectedDetailEvent}
      />
    </div>
  );
};

export default Events;
