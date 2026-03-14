import React, { useState, useEffect } from 'react';
import { X, Save, Loader2, Calendar, MapPin, AlignLeft, Globe, QrCode } from 'lucide-react';
import api from '../services/api';
import { useSnackbar } from 'notistack';
import type { Event } from '../types/event';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  event: Event | null;
}

const EventModal: React.FC<EventModalProps> = ({ isOpen, onClose, onSuccess, event }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<Event>({
    title: '',
    description: '',
    start_time: '',
    end_time: '',
    location: '',
    banner_url: '',
    code: ''
  });

  useEffect(() => {
    if (isOpen) {
      if (event) {
        setFormData({
            ...event,
            description: event.description || '',
            location: event.location || '',
            banner_url: event.banner_url || '',
            code: event.code || '',
            start_time: event.start_time ? new Date(event.start_time).toISOString().substring(0, 16) : '',
            end_time: event.end_time ? new Date(event.end_time).toISOString().substring(0, 16) : '',
        });
      } else {
        setFormData({
          title: '',
          description: '',
          start_time: '',
          end_time: '',
          location: '',
          banner_url: '',
          code: ''
        });
      }
    }
  }, [isOpen, event]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let res;
      const payload = {
        ...formData,
        start_time: new Date(formData.start_time).toISOString(),
        end_time: new Date(formData.end_time).toISOString()
      };

      if (event?.id) {
        res = await api.put(`/events/${event.id}`, payload);
      } else {
        res = await api.post('/events', payload);
      }

      if (res.data.ok) {
        enqueueSnackbar(`Sự kiện ${event?.id ? 'đã cập nhật' : 'đã tạo'} thành công!`, { variant: 'success' });
        onSuccess();
        onClose();
      }
    } catch (err: any) {
      console.error('EventModal: Error submitting form', err);
      enqueueSnackbar(err.response?.data?.message || 'Lưu sự kiện thất bại', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-oxford-blue/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-parchment w-full max-w-2xl max-h-[90vh] rounded-academic shadow-2xl flex flex-col overflow-hidden border border-oxford-blue/10">
        {/* Header */}
        <div className="p-6 border-b border-oxford-blue/10 flex justify-between items-center bg-white/50">
          <div>
            <h2 className="text-2xl font-serif font-black text-oxford-blue tracking-tight uppercase">
              {event?.id ? 'Chỉnh sửa Sự kiện' : 'Tạo Sự kiện mới'}
            </h2>
            <p className="text-xs font-mono font-black text-brass uppercase tracking-widest mt-1">Quản lý Lịch biểu Thư viện</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-oxford-blue/5 rounded-full transition-colors cursor-pointer">
            <X className="h-6 w-6 text-oxford-blue/40" />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-mono font-black text-oxford-blue/60 uppercase tracking-widest flex items-center gap-2">
              Tên Sự kiện
            </label>
            <input
              required
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="VD: Hội thảo Số hoá Thư viện Thường niên"
              className="w-full bg-white border border-oxford-blue/20 rounded-academic px-4 py-3 text-base text-oxford-blue focus:outline-none focus:border-brass/30 font-serif font-black shadow-sm"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="space-y-2">
                <label className="text-[10px] font-mono font-black text-oxford-blue/60 uppercase tracking-widest flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5 text-brass" /> Thời gian bắt đầu
                </label>
                <input
                  required
                  type="datetime-local"
                  name="start_time"
                  value={formData.start_time}
                  onChange={handleChange}
                  className="w-full bg-white border border-oxford-blue/20 rounded-academic px-4 py-2.5 text-sm text-oxford-blue focus:outline-none focus:border-brass/30 font-mono font-black uppercase"
                />
             </div>
             <div className="space-y-2">
                <label className="text-[10px] font-mono font-black text-oxford-blue/60 uppercase tracking-widest flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5 text-brass" /> Thời gian kết thúc
                </label>
                <input
                  required
                  type="datetime-local"
                  name="end_time"
                  value={formData.end_time}
                  onChange={handleChange}
                  className="w-full bg-white border border-oxford-blue/20 rounded-academic px-4 py-2.5 text-sm text-oxford-blue focus:outline-none focus:border-brass/30 font-mono font-black uppercase"
                />
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="space-y-2">
                <label className="text-[10px] font-mono font-black text-oxford-blue/60 uppercase tracking-widest flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 text-brass" /> Địa điểm tổ chức
                </label>
                <input
                  required
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="VD: Hội trường lớn, Khu A"
                  className="w-full bg-white border border-oxford-blue/20 rounded-academic px-4 py-2.5 text-sm text-oxford-blue focus:outline-none focus:border-brass/30 font-serif font-bold"
                />
             </div>
             <div className="space-y-2">
                <label className="text-[10px] font-mono font-black text-oxford-blue/60 uppercase tracking-widest flex items-center gap-2">
                  <QrCode className="h-3.5 w-3.5 text-brass" /> Mã Sự kiện
                </label>
                <input
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  placeholder="VD: EVT-2024-01"
                  className="w-full bg-white border border-oxford-blue/20 rounded-academic px-4 py-2.5 text-sm text-brass font-mono font-black uppercase tracking-widest"
                />
             </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-mono font-black text-oxford-blue/60 uppercase tracking-widest flex items-center gap-2">
              <Globe className="h-3.5 w-3.5 text-brass" /> Đường dẫn Ảnh bìa (Banner)
            </label>
            <input
              name="banner_url"
              value={formData.banner_url}
              onChange={handleChange}
              placeholder="https://..."
              className="w-full bg-white border border-oxford-blue/20 rounded-academic px-4 py-2.5 text-xs text-charcoal focus:outline-none focus:border-brass/30 font-mono"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-mono font-black text-oxford-blue/60 uppercase tracking-widest flex items-center gap-2">
              <AlignLeft className="h-3.5 w-3.5 text-brass" /> Mô tả chi tiết sự kiện
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              placeholder="Cung cấp mô tả chi tiết cho sự kiện này..."
              className="w-full bg-white border border-oxford-blue/20 rounded-academic px-4 py-2.5 text-sm text-oxford-blue focus:outline-none focus:border-brass/30 font-serif shadow-sm resize-none"
            />
          </div>
        </form>

        {/* Footer */}
        <div className="p-6 border-t border-oxford-blue/10 flex justify-between items-center bg-white/50">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="text-xs font-mono font-black text-oxford-blue/60 uppercase tracking-widest hover:text-oxford-blue disabled:opacity-30 cursor-pointer"
          >
            Huỷ bỏ
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !formData.title}
            className="btn-academic text-xs flex items-center gap-2 min-w-[150px] justify-center cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Đang lưu...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Lưu sự kiện
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventModal;
