import { useState, useEffect, useCallback } from 'react';
import { 
  Plus, Calendar, MapPin, Users, CheckCircle2, 
  Search, QrCode, Filter, Eye,
  Library, Loader2, Trash2, Edit3, ChevronLeft, ChevronRight
} from 'lucide-react';
import api from '../services/api';
import { useSnackbar } from 'notistack';
import EventModal from '../components/EventModal';
import EventDetailModal from '../components/EventDetailModal';
import ConfirmModal from '../components/ConfirmModal';
import type { Event } from '../types/event';



const Events = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedDetailEvent, setSelectedDetailEvent] = useState<Event | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{isOpen: boolean, id: string}>({isOpen: false, id: ''});
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
      enqueueSnackbar('Tải dữ liệu sự kiện thất bại', { variant: 'error' });
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

  const handleDeleteConfirm = (id: string) => {
    setDeleteConfirm({ isOpen: true, id });
  };

  const executeDelete = async () => {
    const { id } = deleteConfirm;
    setDeleteConfirm({ isOpen: false, id: '' });
    try {
      const res = await api.delete(`/events/${id}`);
      if (res.data.ok) {
        enqueueSnackbar('Đã xoá sự kiện', { variant: 'success' });
        fetchEvents(pagination.current_page, search);
      }
    } catch (err: any) {
      enqueueSnackbar(err.response?.data?.message || 'Xoá sự kiện thất bại', { variant: 'error' });
    }
  };

  const calculateStatus = (dateStr: string) => {
    const eventDate = new Date(dateStr);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const evDay = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());

    if (evDay.getTime() === today.getTime()) return 'Đang diễn ra';
    if (evDay > today) return 'Sắp diễn ra';
    return 'Đã kết thúc';
  };

  return (
    <div className="p-10 space-y-10 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex justify-between items-end border-b border-oxford-blue/10 pb-8">
        <div>
          <h1 className="text-4xl font-serif font-black text-oxford-blue mb-2 tracking-tight">Quản lý Sự kiện</h1>
          <p className="text-charcoal/70 font-sans font-medium italic">Quản lý sự kiện thư viện, hội thảo và theo dõi người tham dự.</p>
        </div>
        <button 
          onClick={() => {
            setSelectedEvent(null);
            setShowModal(true);
          }}
          className="btn-academic flex items-center gap-2 shadow-lg shadow-oxford-blue/10 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Tạo sự kiện mới
        </button>
      </div>



      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Event Registry */}
        <div className="lg:col-span-3 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-serif font-bold text-oxford-blue flex items-center gap-2">
              <Library className="h-5 w-5 text-brass" />
              Danh sách Sự kiện
            </h2>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-oxford-blue/30" />
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-white border border-oxford-blue/10 rounded-academic pl-9 pr-4 py-3 text-[10px] text-oxford-blue focus:outline-none focus:border-brass/30 font-mono font-black uppercase tracking-widest bg-white/50 cursor-pointer appearance-none min-w-[160px]"
                >
                  <option value="">Tất cả trạng thái</option>
                  <option value="upcoming">Sắp diễn ra</option>
                  <option value="ongoing">Đang diễn ra</option>
                  <option value="completed">Đã kết thúc</option>
                </select>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-oxford-blue/30" />
                <input 
                  type="text" 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Tìm kiếm sự kiện..." 
                  className="bg-white border border-oxford-blue/10 rounded-academic pl-10 pr-4 py-3 text-sm text-oxford-blue focus:outline-none focus:border-brass/30 w-72 italic font-serif font-bold uppercase tracking-widest bg-white/50"
                />
              </div>
            </div>
          </div>

          <div className="space-y-6 flex flex-col min-h-[500px]">
            {loading ? (
                <div className="flex-1 flex flex-col items-center justify-center gap-4 py-20">
                    <Loader2 className="h-10 w-10 text-oxford-blue animate-spin" />
                    <span className="text-xs font-mono font-black text-oxford-blue/40 uppercase tracking-[0.3em]">Đang truy xuất dữ liệu sự kiện...</span>
                </div>
            ) : events.length === 0 ? (
                <div className="flex-1 flex items-center justify-center py-20 border-2 border-dashed border-oxford-blue/10 rounded-academic font-serif font-black italic text-charcoal/30">
                    Không tìm thấy sự kiện nào phù hợp với bộ lọc.
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
                                    status === 'Đang diễn ra' ? 'bg-parchment text-brass border-brass animate-pulse' :
                                    status === 'Sắp diễn ra' ? 'bg-oxford-blue text-parchment border-oxford-blue' :
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
                                        title="Xem chi tiết"
                                    >
                                        <Eye className="h-4 w-4" />
                                    </button>
                                    <button 
                                        onClick={() => {
                                            setSelectedEvent(event);
                                            setShowModal(true);
                                        }}
                                        className="p-2 text-oxford-blue/40 hover:text-brass transition-colors cursor-pointer"
                                        title="Chỉnh sửa"
                                    >
                                        <Edit3 className="h-4 w-4" />
                                    </button>
                                    <button 
                                        onClick={() => handleDeleteConfirm(eventIdStr)}
                                        className="p-2 text-red-200 hover:text-red-500 transition-colors cursor-pointer"
                                        title="Xoá sự kiện"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                                </div>
                            </div>

                            <div className="mt-8 flex items-center gap-8 border-t border-oxford-blue/5 pt-6">
                                <div className="flex items-center gap-3">
                                    <Users className="h-4 w-4 text-oxford-blue/40" />
                                    <span className="text-sm font-serif font-black text-oxford-blue">{registrants} <span className="text-charcoal/60 font-sans font-medium italic ml-1"> Người đăng ký</span></span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <CheckCircle2 className="h-4 w-4 text-brass" />
                                    <span className="text-sm font-serif font-black text-oxford-blue">{checkins} <span className="text-charcoal/60 font-sans font-medium italic ml-1"> Đã điểm danh</span></span>
                                </div>
                                <div className="flex-1 bg-oxford-blue/5 h-2 rounded-full overflow-hidden shadow-inner">
                                    <div 
                                        className={`h-full bg-brass transition-all duration-1000 ${status === 'Đang diễn ra' ? 'animate-pulse' : ''}`} 
                                        style={{ width: `${registrants > 0 ? (checkins/registrants) * 100 : 0}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    );
                })}
                {/* Pagination */}
                <div className="p-6 bg-parchment/10 border-t border-oxford-blue/5 flex justify-between items-center text-[10px] font-mono font-black text-charcoal/60 uppercase tracking-[0.3em]">
                    <span>Trang {pagination.current_page} / {pagination.total_pages}</span>
                    <div className="flex gap-4">
                        <button 
                            onClick={() => fetchEvents(pagination.current_page - 1, search, statusFilter)}
                            disabled={pagination.current_page === 1 || loading}
                            className="p-2 hover:text-oxford-blue disabled:opacity-20 font-black cursor-pointer border border-transparent hover:border-oxford-blue/10 rounded-academic transition-colors"
                            title="Trang trước"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button 
                            onClick={() => fetchEvents(pagination.current_page + 1, search, statusFilter)}
                            disabled={pagination.current_page === pagination.total_pages || loading}
                            className="p-2 hover:text-oxford-blue disabled:opacity-20 font-black cursor-pointer border border-transparent hover:border-oxford-blue/10 rounded-academic transition-colors"
                            title="Trang sau"
                        >
                            <ChevronRight className="h-5 w-5" />
                        </button>
                    </div>
                </div>
                </>
            )}
          </div>
        </div>


      </div>

      <EventModal 
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={() => fetchEvents(pagination.current_page, search, statusFilter)}
        event={selectedEvent}
      />

      <ConfirmModal
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, id: '' })}
        onConfirm={executeDelete}
        title="Xác nhận xóa"
        message="Bạn có chắc chắn muốn xoá sự kiện này không? Các dữ liệu liên quan cũng sẽ bị xóa."
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
