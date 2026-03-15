import { Plus, Search, Filter, BookMarked, Layers, User, Loader2, ChevronLeft, ChevronRight, Edit3, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '../services/api';
import ImportExcelModal from '../components/ImportExcelModal';
import AddBookModal from '../components/AddBookModal';
import EditBookModal from '../components/EditBookModal';
import ManageCopiesModal from '../components/ManageCopiesModal';
import ConfirmModal from '../components/ConfirmModal';
import { useSnackbar } from 'notistack';



interface Book {
  id: string;
  title: string;
  author: string;
  isbn?: string;
  subjects?: { subject: { category: string } }[];
  status?: string;
  total_copies: number;
  available_copies: number;
}

const Books = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCopiesModalOpen, setIsCopiesModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<{ id: string, title: string, isbn?: string } | null>(null);
  const [selectedEditBook, setSelectedEditBook] = useState<Book | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{isOpen: boolean, id: string, title: string}>({isOpen: false, id: '', title: ''});
  const [totalItems, setTotalItems] = useState(0);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [subject, setSubject] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [subjects, setSubjects] = useState<{ id: number, name: string }[]>([]);

  const fetchFilters = async () => {
    try {
      const [catRes, subRes] = await Promise.all([
        api.get('/subjects/categories'),
        api.get('/subjects')
      ]);
      if (catRes.data.ok) setCategories(catRes.data.data);
      if (subRes.data.ok) setSubjects(subRes.data.data);
    } catch (err) {
      console.error('Books: Error fetching filters', err);
    }
  };

  const fetchData = async (query = '', cat = '', sub = '') => {
    setLoading(true);
    try {
      const res = await api.get('/books', {
        params: {
          limit: 10,
          search: query,
          category: cat,
          subject_id: sub
        }
      });
      if (res.data.ok) {
        setBooks(res.data.data);
        setTotalItems(res.data.pagination.total_items);
      }
    } catch (err) {
      console.error('Books: Error fetching data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBookConfirm = (id: string, title: string) => {
    setDeleteConfirm({ isOpen: true, id, title });
  };

  const executeDeleteBook = async () => {
    const { id } = deleteConfirm;
    setDeleteConfirm({ isOpen: false, id: '', title: '' });
    try {
      const res = await api.delete(`/books/${id}`);
      if (res.data.ok) {
        enqueueSnackbar('Xóa sách thành công!', { variant: 'success' });
        fetchData(search, category, subject);
      }
    } catch (err: any) {
      console.error('Books: Error deleting book', err);
      enqueueSnackbar(err.response?.data?.message || 'Không thể xóa sách', { variant: 'error' });
    }
  };

  useEffect(() => {
    fetchFilters();
    fetchData();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData(search, category, subject);
    }, 500);
    return () => clearTimeout(timer);
  }, [search, category, subject]);

  return (
    <div className="p-10 space-y-10 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex justify-between items-end border-b border-oxford-blue/10 pb-8">
        <div>
          <h1 className="text-4xl font-serif font-black text-oxford-blue mb-2 tracking-tight">Quản lý Sách</h1>
          <p className="text-charcoal/70 font-sans font-medium italic">Quản lý kho sách, trạng thái và tài sản thư viện.</p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="px-6 py-2 border border-oxford-blue/30 text-oxford-blue font-mono text-xs font-black uppercase tracking-widest hover:bg-oxford-blue/5 transition-colors rounded-academic cursor-pointer"
          >
            Nhập từ Excel
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="btn-academic flex items-center gap-2 text-xs cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Thêm Sách mới
          </button>

        </div>
      </div>

      {/* Registry Table */}
      <div className="card-academic overflow-hidden bg-white shadow-2xl relative">
        <div className="absolute inset-0 opacity-[0.01] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
        <div className="p-6 bg-parchment/30 border-b border-oxford-blue/10 flex justify-between items-center">
          <div className="flex gap-8">
            <div className="flex items-center gap-2 group cursor-pointer">
              <BookMarked className="h-4 w-4 text-brass" />
              <span className="text-xs font-mono font-black text-oxford-blue uppercase tracking-widest border-b border-brass/50">Tổng số sách: {totalItems.toLocaleString()}</span>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-oxford-blue/30" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm theo ISBN hoặc Tên sách..."
                className="bg-white border border-oxford-blue/20 rounded-academic pl-10 pr-4 py-2 text-xs text-charcoal focus:outline-none focus:border-brass/30 w-64 uppercase font-mono font-black tracking-widest"
              />
            </div>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-white border border-oxford-blue/20 rounded-academic px-4 py-2 text-xs text-charcoal focus:outline-none focus:border-brass/30 font-mono font-black uppercase tracking-widest cursor-pointer appearance-none min-w-[150px]"
            >
              <option value="">Tất cả danh mục</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="bg-white border border-oxford-blue/20 rounded-academic px-4 py-2 text-xs text-charcoal focus:outline-none focus:border-brass/30 font-mono font-black uppercase tracking-widest cursor-pointer appearance-none min-w-[150px]"
            >
              <option value="">Tất cả chủ đề</option>
              {subjects.map(sub => (
                <option key={sub.id} value={sub.id}>{sub.name}</option>
              ))}
            </select>

            <button
              onClick={() => {
                setSearch('');
                setCategory('');
                setSubject('');
              }}
              className="p-2 border border-oxford-blue/10 rounded-academic text-oxford-blue/40 hover:text-brass transition-colors cursor-pointer"
              title="Xoá bộ lọc"
            >
              <Filter className="h-4 w-4" />
            </button>
          </div>
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-oxford-blue text-parchment uppercase font-mono text-xs font-black tracking-[0.2em]">
              <th className="px-8 py-5 border-r border-parchment/10">Thông tin sách</th>
              <th className="px-8 py-5 border-r border-parchment/10">Mã ISBN</th>
              <th className="px-8 py-5 border-r border-parchment/10">Danh mục</th>
              <th className="px-8 py-5 border-r border-parchment/10">Tình trạng</th>
              <th className="px-8 py-5 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-oxford-blue/5">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-8 py-20 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-8 w-8 text-oxford-blue animate-spin" />
                    <span className="text-xs font-mono font-black text-oxford-blue/40 uppercase tracking-[0.3em]">Đang tải dữ liệu thư viện...</span>
                  </div>
                </td>
              </tr>
            ) : books.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-8 py-20 text-center text-xs font-mono font-black text-charcoal/40 uppercase tracking-widest italic">
                  Không tìm thấy dữ liệu sách.
                </td>
              </tr>
            ) : (
              books.map((book) => (
                <tr key={book.id} className="hover:bg-parchment/50 transition-colors group">
                  <td className="px-8 py-6 border-r border-oxford-blue/5">
                    <div className="text-lg font-serif font-black text-oxford-blue leading-tight group-hover:text-brass transition-colors">{book.title}</div>
                    <div className="flex items-center gap-2 text-xs text-charcoal/60 font-black uppercase tracking-widest mt-1">
                      <User className="h-3.5 w-3.5" /> {book.author}
                    </div>
                  </td>
                  <td className="px-8 py-6 border-r border-oxford-blue/5">
                    <div className="font-mono text-xs font-black text-brass uppercase tracking-widest bg-brass/5 px-2 py-1 rounded-sm inline-block">{book.id}</div>
                  </td>
                  <td className="px-8 py-6 border-r border-oxford-blue/5">
                    <span className="text-xs font-mono font-black text-charcoal/80 uppercase tracking-widest border border-oxford-blue/20 px-2 py-1 rounded-academic">
                      {book.subjects?.[0]?.subject?.category || 'Chưa phân loại'}
                    </span>
                  </td>
                  <td className="px-8 py-6 border-r border-oxford-blue/5">
                    <div className="flex items-center gap-2">
                      <div className={`h-1.5 w-1.5 rounded-full ${book.available_copies > 0 ? 'bg-brass shadow-[0_0_8px_var(--color-brass)]' : 'bg-oxford-blue animate-pulse'
                        }`}></div>
                      <span className={`text-xs font-mono font-black uppercase tracking-widest ${book.available_copies > 0 ? 'text-brass' : 'text-oxford-blue/80'
                        }`}>
                        {book.available_copies > 0 ? 'Còn sách' : 'Đã mượn'} ({book.available_copies}/{book.total_copies})
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        title="Quản lý bản sao"
                        onClick={() => {
                          setSelectedBook({ id: book.id, title: book.title, isbn: book.isbn });
                          setIsCopiesModalOpen(true);
                        }}
                        className="p-2 text-oxford-blue/60 hover:text-brass transition-colors cursor-pointer border border-transparent hover:border-brass/20 rounded-academic"
                      >
                        <Layers className="h-4 w-4" />
                      </button>

                      <button 
                        title="Sửa thông tin"
                        onClick={() => {
                          setSelectedEditBook(book);
                          setIsEditModalOpen(true);
                        }}
                        className="p-2 text-oxford-blue/60 hover:text-blue-600 transition-colors cursor-pointer border border-transparent hover:border-blue-600/20 rounded-academic"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      
                      <button 
                        title="Xóa sách"
                        onClick={() => handleDeleteBookConfirm(book.id, book.title)}
                        className="p-2 text-oxford-blue/60 hover:text-red-500 transition-colors cursor-pointer border border-transparent hover:border-red-500/20 rounded-academic"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>

                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="p-6 bg-parchment/10 border-t border-oxford-blue/5 flex justify-between items-center text-xs font-mono font-black text-charcoal/60 uppercase tracking-[0.3em]">
          <span>Hiển thị 1-{books.length} trên {totalItems.toLocaleString()} sách</span>
          <div className="flex gap-4">
            <button
              className="p-2 hover:text-oxford-blue disabled:opacity-20 font-black cursor-pointer border border-transparent hover:border-oxford-blue/10 rounded-academic transition-colors"
              disabled
              title="Trang trước"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              className="p-2 hover:text-oxford-blue font-black cursor-pointer border border-transparent hover:border-oxford-blue/10 rounded-academic transition-colors"
              onClick={() => fetchData()}
              title="Làm mới / Kế tiếp"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <ImportExcelModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onSuccess={fetchData}
      />

      <AddBookModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => fetchData(search, category, subject)}
      />

      {selectedEditBook && (
        <EditBookModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedEditBook(null);
          }}
          onSuccess={() => fetchData(search, category, subject)}
          bookId={selectedEditBook.id}
          initialData={selectedEditBook}
        />
      )}

      <ConfirmModal
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, id: '', title: '' })}
        onConfirm={executeDeleteBook}
        title="Xác nhận xóa"
        message={`Bạn có chắc chắn muốn xóa sách "${deleteConfirm.title}" không? Hành động này không thể hoàn tác.`}
      />

      {selectedBook && (
        <ManageCopiesModal
          isOpen={isCopiesModalOpen}
          onClose={() => {
            setIsCopiesModalOpen(false);
            fetchData(); // Refresh to update copy counts
          }}
          bookId={selectedBook.id}
          bookTitle={selectedBook.title}
          bookIsbn={selectedBook.isbn}
        />
      )}


    </div>
  );
};

export default Books;
