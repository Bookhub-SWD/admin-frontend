import { 
  X, MapPin, QrCode, AlignLeft, Users, CheckCircle2, Clock, Library
} from 'lucide-react';
import type { Event } from '../types/event';

interface EventDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event | null;
}

const EventDetailModal: React.FC<EventDetailModalProps> = ({ isOpen, onClose, event }) => {
  if (!isOpen || !event) return null;

  const registrants = event.registered_count || event._count?.registrations || 0;
  const checkins = event.attended_count || event._count?.check_ins || 0;
  const attendanceRate = registrants > 0 ? (checkins / registrants) * 100 : 0;

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-oxford-blue/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-parchment w-full max-w-3xl max-h-[90vh] rounded-academic shadow-2xl flex flex-col overflow-hidden border border-oxford-blue/10">
        
        {/* Banner / Image Header */}
        <div className="relative h-48 bg-oxford-blue overflow-hidden">
          {event.banner_url || event.image_url ? (
            <img 
              src={event.banner_url || event.image_url} 
              alt={event.title} 
              className="w-full h-full object-cover opacity-60"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]">
              <Library className="h-24 w-24 text-parchment" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-oxford-blue to-transparent"></div>
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 rounded-full text-parchment transition-colors cursor-pointer"
          >
            <X className="h-6 w-6" />
          </button>
          <div className="absolute bottom-6 left-8 right-8">
            <div className="text-[10px] font-mono font-black text-brass tracking-[0.3em] mb-2 uppercase">Chi tiết Sự kiện</div>
            <h2 className="text-3xl font-serif font-black text-parchment tracking-tight leading-none uppercase">{event.title}</h2>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-8 space-y-10">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Primary Details */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h3 className="text-[10px] font-mono font-black text-oxford-blue/40 uppercase tracking-widest border-b border-oxford-blue/5 pb-2">Thời gian & Địa điểm</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-4 text-oxford-blue">
                    <Clock className="h-4 w-4 text-brass" />
                    <div>
                      <div className="text-[10px] font-mono font-black uppercase text-charcoal/50">Bắt đầu</div>
                      <div className="text-sm font-serif font-bold">{formatDate(event.start_time)}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-oxford-blue">
                    <Clock className="h-4 w-4 text-brass" />
                    <div>
                      <div className="text-[10px] font-mono font-black uppercase text-charcoal/50">Kết thúc</div>
                      <div className="text-sm font-serif font-bold">{formatDate(event.end_time)}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-oxford-blue">
                    <MapPin className="h-4 w-4 text-brass" />
                    <div>
                      <div className="text-[10px] font-mono font-black uppercase text-charcoal/50">Địa điểm</div>
                      <div className="text-sm font-serif font-bold">{event.location}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-[10px] font-mono font-black text-oxford-blue/40 uppercase tracking-widest border-b border-oxford-blue/5 pb-2">Thông tin Hệ thống</h3>
                <div className="flex items-center gap-4 text-oxford-blue">
                  <QrCode className="h-4 w-4 text-brass" />
                  <div>
                    <div className="text-[10px] font-mono font-black uppercase text-charcoal/50">Mã Sự kiện</div>
                    <div className="text-sm font-mono font-black text-brass uppercase">{event.code || `EVT-${String(event.id).substring(0,6)}`}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Attendance & Volume Metrics */}
            <div className="space-y-8">
               <div className="space-y-4">
                 <h3 className="text-[10px] font-mono font-black text-oxford-blue/40 uppercase tracking-widest border-b border-oxford-blue/5 pb-2">Thông tin Người tham gia</h3>
                 <div className="card-academic p-5 bg-white shadow-sm space-y-6">
                    <div className="flex justify-between items-end">
                       <div>
                         <div className="text-[10px] font-mono font-black text-charcoal/40 uppercase tracking-widest mb-1">Tỷ lệ tham gia</div>
                         <div className="text-3xl font-serif font-black text-oxford-blue tracking-tighter">{checkins} / {registrants}</div>
                       </div>
                       <div className="text-right">
                         <div className="text-[32px] font-serif font-black text-brass leading-none">{attendanceRate.toFixed(1)}%</div>
                         <div className="text-[8px] font-mono font-black text-brass/60 uppercase tracking-widest mt-1">Ghi nhận</div>
                       </div>
                    </div>
                    <div className="h-2.5 bg-oxford-blue/5 rounded-full overflow-hidden shadow-inner">
                       <div 
                         className="h-full bg-brass shadow-[0_0_10px_rgba(181,166,66,0.5)] transition-all duration-1000 ease-out"
                         style={{ width: `${attendanceRate}%` }}
                       ></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <div className="flex items-center gap-2">
                         <Users className="h-3.5 w-3.5 text-oxford-blue/40" />
                         <span className="text-[10px] font-mono font-black text-oxford-blue/60 uppercase tracking-widest">{registrants} Người đăng ký</span>
                       </div>
                       <div className="flex items-center gap-2">
                         <CheckCircle2 className="h-3.5 w-3.5 text-brass" />
                         <span className="text-[10px] font-mono font-black text-oxford-blue/60 uppercase tracking-widest">{checkins} Đã điểm danh</span>
                       </div>
                    </div>
                 </div>
               </div>
            </div>
          </div>

          {/* Extended Dossier */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-mono font-black text-oxford-blue/40 uppercase tracking-widest border-b border-oxford-blue/5 pb-2">Mô tả chi tiết</h3>
            <div className="bg-white/50 p-6 rounded-academic border border-oxford-blue/5 min-h-[120px]">
              <div className="flex gap-4">
                <AlignLeft className="h-5 w-5 text-brass shrink-0 mt-1" />
                <p className="text-sm font-serif leading-relaxed text-oxford-blue/80 italic">
                  {event.description || "Không có mô tả chi tiết cho sự kiện này."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-oxford-blue/10 flex justify-end items-center bg-white/50 gap-4">
           <div className="text-[10px] font-mono font-black text-charcoal/40 uppercase tracking-widest mr-auto">Dữ liệu hệ thống đã xác thực</div>
           <button
             onClick={onClose}
             className="px-8 py-3 bg-oxford-blue text-parchment text-[10px] font-mono font-black uppercase tracking-[0.2em] rounded-academic shadow-lg shadow-oxford-blue/20 hover:bg-brass hover:text-oxford-blue transition-all duration-300 cursor-pointer"
           >
             Đóng
           </button>
        </div>
      </div>
    </div>
  );
};

export default EventDetailModal;
