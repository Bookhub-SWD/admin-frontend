import React, { useState, useEffect } from 'react';
import { X, Save, Loader2, Book, User, Hash, Info, Image as ImageIcon, Tag, GraduationCap } from 'lucide-react';
import api from '../services/api';
import { useSnackbar } from 'notistack';

interface AddBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface Subject {
  code: string;
  name: string;
  category: string;
}

const AddBookModal: React.FC<AddBookModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    publisher: '',
    isbn: '',
    description: '',
    url_img: '',
    keyword: '',
    subject_code: '',
  });

  useEffect(() => {
    if (isOpen) {
      fetchSubjects();
    }
  }, [isOpen]);

  const fetchSubjects = async () => {
    setLoadingSubjects(true);
    try {
      const res = await api.get('/subjects');
      if (res.data.ok) {
        setSubjects(res.data.data);
      }
    } catch (err) {
      console.error('AddBookModal: Error fetching subjects', err);
    } finally {
      setLoadingSubjects(false);
    }
  };

  const categories = Array.from(new Set(subjects.map(s => s.category || 'Chưa phân loại'))).sort();
  const filteredSubjects = subjects
    .filter(s => s.category === selectedCategory)
    .sort((a, b) => (a.name || a.code || '').localeCompare(b.name || b.code || ''));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
    setFormData(prev => ({ ...prev, subject_code: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        keyword: formData.keyword.split(',').map(k => k.trim()).filter(k => k),
        subjects: formData.subject_code ? subjects.filter(s => s.code === formData.subject_code) : []
      };

      const res = await api.post('/books', payload);
      if (res.data.ok) {
        enqueueSnackbar('Thêm sách thành công!', { variant: 'success' });
        onSuccess();
        onClose();
        setFormData({
          title: '',
          author: '',
          publisher: '',
          isbn: '',
          description: '',
          url_img: '',
          keyword: '',
          subject_code: '',
        });
        setSelectedCategory('');
      } else {
        enqueueSnackbar(res.data.message || 'Thêm sách thất bại', { variant: 'error' });
      }
    } catch (err: any) {
      console.error('AddBookModal: Error submitting form', err);
      enqueueSnackbar(err.response?.data?.message || 'Thêm sách thất bại', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-oxford-blue/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-parchment w-full max-w-2xl max-h-[90vh] rounded-academic shadow-2xl flex flex-col overflow-hidden border border-oxford-blue/10">
        {/* Header */}
        <div className="p-6 border-b border-oxford-blue/10 flex justify-between items-center bg-white/50">
          <div>
            <h2 className="text-2xl font-serif font-black text-oxford-blue tracking-tight uppercase">Lưu trữ mục mới</h2>
            <p className="text-xs font-mono font-black text-brass uppercase tracking-widest mt-1">Đăng ký sách mới vào thư viện</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-oxford-blue/5 rounded-full transition-colors cursor-pointer">
            <X className="h-6 w-6 text-oxford-blue/40" />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono font-black text-oxford-blue/60 uppercase tracking-widest flex items-center gap-2">
                <Book className="h-3 w-3 text-brass" /> Tên sách
              </label>
              <input
                required
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Ví dụ: Đắc Nhân Tâm"
                className="w-full bg-white border border-oxford-blue/20 rounded-academic px-4 py-2.5 text-sm text-oxford-blue focus:outline-none focus:border-brass/30 font-serif font-bold shadow-sm"
              />
            </div>

            {/* Author */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono font-black text-oxford-blue/60 uppercase tracking-widest flex items-center gap-2">
                <User className="h-3 w-3 text-brass" /> Tác giả
              </label>
              <input
                required
                name="author"
                value={formData.author}
                onChange={handleChange}
                placeholder="Ví dụ: Dale Carnegie"
                className="w-full bg-white border border-oxford-blue/20 rounded-academic px-4 py-2.5 text-sm text-oxford-blue focus:outline-none focus:border-brass/30 font-serif font-bold shadow-sm"
              />
            </div>

            {/* ISBN */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono font-black text-oxford-blue/60 uppercase tracking-widest flex items-center gap-2">
                <Hash className="h-3 w-3 text-brass" /> Mã ISBN
              </label>
              <input
                required
                name="isbn"
                value={formData.isbn}
                onChange={handleChange}
                placeholder="9780123456789"
                className="w-full bg-white border border-oxford-blue/20 rounded-academic px-4 py-2.5 text-sm text-brass font-mono font-black focus:outline-none focus:border-brass/30 shadow-sm"
              />
            </div>

            {/* Publisher */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono font-black text-oxford-blue/60 uppercase tracking-widest flex items-center gap-2">
                <GraduationCap className="h-3 w-3 text-brass" /> Nhà xuất bản
              </label>
              <input
                name="publisher"
                value={formData.publisher}
                onChange={handleChange}
                placeholder="Ví dụ: NXB Trẻ"
                className="w-full bg-white border border-oxford-blue/20 rounded-academic px-4 py-2.5 text-sm text-oxford-blue focus:outline-none focus:border-brass/30 font-serif font-bold shadow-sm"
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono font-black text-oxford-blue/60 uppercase tracking-widest flex items-center gap-2">
                <Tag className="h-3 w-3 text-brass" /> Thể loại chính
              </label>
              <select
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="w-full bg-white border border-oxford-blue/20 rounded-academic px-4 py-2.5 text-sm text-oxford-blue focus:outline-none focus:border-brass/30 font-mono font-black uppercase tracking-tight shadow-sm appearance-none cursor-pointer"
              >
                <option value="">Chọn thể loại</option>
                {categories.map((cat, idx) => (
                  <option key={`${cat}-${idx}`} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Subject */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono font-black text-oxford-blue/60 uppercase tracking-widest flex items-center gap-2">
                <Tag className="h-3 w-3 text-brass" /> Chủ đề chi tiết
              </label>
              <select
                name="subject_code"
                disabled={!selectedCategory}
                value={formData.subject_code}
                onChange={handleChange}
                className="w-full bg-white border border-oxford-blue/20 rounded-academic px-4 py-2.5 text-sm text-oxford-blue focus:outline-none focus:border-brass/30 font-mono font-black uppercase tracking-tight shadow-sm appearance-none cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <option value="">{selectedCategory ? 'Chọn chủ đề chi tiết' : 'Vui lòng chọn thể loại trước'}</option>
                {filteredSubjects.map((s, idx) => (
                  <option key={`${s.code}-${idx}`} value={s.code}>{s.name} ({s.code})</option>
                ))}
              </select>
              {loadingSubjects && <p className="text-[9px] font-mono animate-pulse text-brass">Đang tải danh sách...</p>}
            </div>

            {/* Keywords */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono font-black text-oxford-blue/60 uppercase tracking-widest flex items-center gap-2">
                <Info className="h-3 w-3 text-brass" /> Từ khóa (Ngăn cách bằng dấu phẩy)
              </label>
              <input
                name="keyword"
                value={formData.keyword}
                onChange={handleChange}
                placeholder="Ví dụ: kỹ năng sống, thành công, giao tiếp"
                className="w-full bg-white border border-oxford-blue/20 rounded-academic px-4 py-2.5 text-sm text-oxford-blue focus:outline-none focus:border-brass/30 font-mono font-black shadow-sm"
              />
            </div>
          </div>

          {/* Image URL */}
          <div className="space-y-2">
            <label className="text-[10px] font-mono font-black text-oxford-blue/60 uppercase tracking-widest flex items-center gap-2">
              <ImageIcon className="h-3 w-3 text-brass" /> Đường dẫn ảnh bìa
            </label>
            <input
              name="url_img"
              value={formData.url_img}
              onChange={handleChange}
              placeholder="https://example.com/cover.jpg"
              className="w-full bg-white border border-oxford-blue/20 rounded-academic px-4 py-2.5 text-sm text-oxford-blue focus:outline-none focus:border-brass/30 font-mono text-[10px] shadow-sm"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-[10px] font-mono font-black text-oxford-blue/60 uppercase tracking-widest flex items-center gap-2">
              <Info className="h-3 w-3 text-brass" /> Tóm tắt nội dung
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              placeholder="Nhập phần giới thiệu tóm tắt về sách..."
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
            Hủy thao tác
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !formData.title || !formData.isbn}
            className="btn-academic text-xs flex items-center gap-2 min-w-[150px] justify-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Đang xử lý...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Hoàn tất đăng ký
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddBookModal;
