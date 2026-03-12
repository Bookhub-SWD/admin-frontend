import React, { useState, useEffect, useRef } from 'react';
import { Plus, Search, Filter, BookMarked, Layers, User, ChevronDown, ChevronRight, QrCode, Trash2, Edit, UploadCloud } from 'lucide-react';
import api from '../services/api';
import BookModal from '../components/BookModal';
const Books = () => {
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalBooks, setTotalBooks] = useState(0);
  const [availableBooks, setAvailableBooks] = useState(0);
  const [page, setPage] = useState(1);
  const limit = 20;

  const [expandedBookId, setExpandedBookId] = useState<number | null>(null);
  const [expandedLoading, setExpandedLoading] = useState(false);
  const [expandedCopies, setExpandedCopies] = useState<any[]>([]);

  // CRUD & Import States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editBookData, setEditBookData] = useState<any | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/books?page=${page}&limit=${limit}`);
      if (res.data?.ok) {
        setBooks(res.data.data);
        
        // Calculate available in stock across all fetched copies (simplification for header stats)
        const available = res.data.data.reduce((sum: number, b: any) => sum + (b.available_copies || 0), 0);
        const totalCopies = res.data.data.reduce((sum: number, b: any) => sum + (b.total_copies || 0), 0);
        setAvailableBooks(available);
        setTotalBooks(totalCopies); // Total copies across fetched page
      }
    } catch (err) {
      console.error('Error fetching books:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [page]);

  const handleDelete = async (e: React.MouseEvent, id: number, title: string) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) {
      try {
        const res = await api.delete(`/books/${id}`);
        if (res.data?.ok) {
           alert('Book deleted successfully');
           fetchBooks();
        }
      } catch (err) {
        console.error('Failed to delete:', err);
        alert('Failed to delete book');
      }
    }
  };

  const handleFileImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await api.post('/books/import', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data?.ok) {
        alert(res.data.message || 'Import successful!');
        fetchBooks();
      } else {
        alert(res.data.message || 'Import failed');
      }
    } catch (err: any) {
      console.error('Import error:', err);
      alert(err.response?.data?.message || 'Error importing Excel file');
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const openCreateModal = () => {
    setEditBookData(null);
    setIsModalOpen(true);
  };

  const openEditModal = (e: React.MouseEvent, book: any) => {
    e.stopPropagation();
    setEditBookData(book);
    setIsModalOpen(true);
  };

  const toggleExpand = async (bookId: number) => {
    if (expandedBookId === bookId) {
      setExpandedBookId(null);
      setExpandedCopies([]);
      return;
    }

    setExpandedBookId(bookId);
    setExpandedLoading(true);
    try {
      const res = await api.get(`/books/${bookId}`);
      if (res.data?.ok) {
        setExpandedCopies(res.data.data.copies || []);
      }
    } catch (err) {
      console.error('Error fetching book detail:', err);
    } finally {
      setExpandedLoading(false);
    }
  };

  return (
    <div className="p-10 space-y-10 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex justify-between items-end border-b border-oxford-blue/10 pb-8">
        <div>
          <h1 className="text-4xl font-serif font-black text-oxford-blue mb-2 tracking-tight">Library Management</h1>
          <p className="text-charcoal/70 font-sans font-medium italic">Manage your library inventory, status, and book assets.</p>
        </div>
        <div className="flex gap-4">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileImport} 
            accept=".xlsx, .csv" 
            className="hidden" 
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={isImporting}
            className="px-6 py-2 border border-oxford-blue/30 text-oxford-blue font-mono text-xs font-black uppercase tracking-widest hover:bg-oxford-blue/5 transition-colors rounded-academic flex items-center gap-2 disabled:opacity-50"
          >
            <UploadCloud className="h-4 w-4" />
            {isImporting ? 'Importing...' : 'Import Excel'}
          </button>
          <button onClick={openCreateModal} className="btn-academic flex items-center gap-2 text-xs">
            <Plus className="h-4 w-4" />
            Add New Book
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
              <span className="text-xs font-mono font-black text-oxford-blue uppercase tracking-widest border-b border-brass/50">Total Copies: {loading ? '...' : totalBooks}</span>
            </div>
            <div className="flex items-center gap-2 group cursor-pointer">
              <Layers className="h-4 w-4 text-oxford-blue/40" />
              <span className="text-xs font-mono font-black text-charcoal/70 uppercase tracking-widest">In Stock: {loading ? '...' : availableBooks}</span>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-oxford-blue/30" />
              <input 
                type="text" 
                placeholder="Search by ISBN or Title..." 
                className="bg-white border border-oxford-blue/20 rounded-academic pl-10 pr-4 py-2 text-xs text-charcoal focus:outline-none focus:border-brass/30 w-64 uppercase font-mono font-black tracking-widest"
              />
            </div>
            <button className="p-2 border border-oxford-blue/10 rounded-academic text-oxford-blue/40 hover:text-brass transition-colors">
              <Filter className="h-4 w-4" />
            </button>
          </div>
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-oxford-blue text-parchment uppercase font-mono text-xs font-black tracking-[0.2em]">
              <th className="px-8 py-5 border-r border-parchment/10">Book Details</th>
              <th className="px-8 py-5 border-r border-parchment/10">ISBN No.</th>
              <th className="px-8 py-5 border-r border-parchment/10">Category</th>
              <th className="px-8 py-5 border-r border-parchment/10">Availability</th>
              <th className="px-8 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-oxford-blue/5">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-8 py-10 text-center font-mono text-xs font-black text-oxford-blue/50 uppercase tracking-widest">Loading Archives...</td>
              </tr>
            ) : books.map((book) => {
              const categoryName = book.book_subjects?.[0]?.subject?.category || book.book_subjects?.[0]?.subject?.name || 'Uncategorized';
              const isInStock = book.available_copies > 0;
              const isExpanded = expandedBookId === book.id;

              return (
              <React.Fragment key={book.id}>
              <tr onClick={() => toggleExpand(book.id)} className="hover:bg-parchment/50 transition-colors group cursor-pointer">
                <td className="px-8 py-6 border-r border-oxford-blue/5">
                  <div className="flex items-start gap-4">
                    <div className="mt-1">
                      {isExpanded ? <ChevronDown className="h-5 w-5 text-oxford-blue/40" /> : <ChevronRight className="h-5 w-5 text-oxford-blue/20" />}
                    </div>
                    <div>
                      <div className="text-lg font-serif font-black text-oxford-blue leading-tight group-hover:text-brass transition-colors">{book.title}</div>
                      <div className="flex items-center gap-2 text-xs text-charcoal/60 font-black uppercase tracking-widest mt-1">
                        <User className="h-3.5 w-3.5" /> {book.author}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6 border-r border-oxford-blue/5">
                  <div className="font-mono text-xs font-black text-brass uppercase tracking-widest bg-brass/5 px-2 py-1 rounded-sm inline-block">{book.isbn}</div>
                </td>
                <td className="px-8 py-6 border-r border-oxford-blue/5">
                  <span className="text-xs font-mono font-black text-charcoal/80 uppercase tracking-widest border border-oxford-blue/20 px-2 py-1 rounded-academic">{categoryName}</span>
                </td>
                <td className="px-8 py-6 border-r border-oxford-blue/5">
                  <div className="flex items-center gap-2">
                    <div className={`h-1.5 w-1.5 rounded-full ${
                      isInStock ? 'bg-brass shadow-[0_0_8px_var(--color-brass)]' : 'bg-red-500 animate-pulse'
                    }`}></div>
                    <span className={`text-xs font-mono font-black uppercase tracking-widest ${
                      isInStock ? 'text-brass' : 'text-red-500/80'
                    }`}>
                      {isInStock ? `${book.available_copies} / ${book.total_copies} IN STOCK` : 'OUT OF STOCK'}
                    </span>
                  </div>
                </td>
                <td className="px-8 py-6 text-right relative">
                   <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                     <button onClick={(e) => openEditModal(e, book)} className="text-oxford-blue/40 hover:text-brass transition-colors" title="Edit Book">
                        <Edit className="h-4 w-4" />
                     </button>
                     <button onClick={(e) => handleDelete(e, book.id, book.title)} className="text-oxford-blue/40 hover:text-red-500 transition-colors" title="Delete Book">
                        <Trash2 className="h-4 w-4" />
                     </button>
                   </div>
                </td>
              </tr>
              {/* Expandable Copies Row */}
              {isExpanded && (
                <tr className="bg-parchment/20">
                  <td colSpan={5} className="p-0 border-b border-oxford-blue/10 shadow-[inset_0_4px_6px_-4px_rgba(0,0,0,0.05)]">
                    <div className="p-8 border-l-4 border-l-brass">
                      <h4 className="text-sm font-serif font-bold text-oxford-blue mb-4 uppercase tracking-widest">Inventory Copies</h4>
                      {expandedLoading ? (
                        <div className="text-xs font-mono text-charcoal/50">Fetching copies...</div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {expandedCopies.map((copy: any, i: number) => (
                            <div key={copy.id} className="bg-white p-4 rounded border border-oxford-blue/5 flex justify-between items-center group/copy hover:border-brass/30 transition-colors">
                              <div className="flex items-center gap-3">
                                 <div className="bg-parchment p-2 rounded text-oxford-blue/40">
                                   <QrCode className="h-4 w-4" />
                                 </div>
                                 <div>
                                   <div className="text-xs font-mono font-black text-oxford-blue">{copy.barcode}</div>
                                   <div className="text-[10px] font-mono text-charcoal/50 uppercase tracking-widest mt-0.5">Copy #{i+1} • {copy.condition}</div>
                                 </div>
                              </div>
                              <span className={`text-[10px] font-mono font-black uppercase tracking-widest px-2 py-1 rounded-sm border ${
                                copy.status === 'available' ? 'bg-green-500/10 border-green-500 text-green-600' :
                                copy.status === 'borrowed' ? 'bg-blue-500/10 border-blue-500 text-blue-600' :
                                copy.status === 'reserved' ? 'bg-brass/10 border-brass text-brass' :
                                'bg-red-500/10 border-red-500 text-red-600'
                              }`}>
                                {copy.status}
                              </span>
                            </div>
                          ))}
                          {expandedCopies.length === 0 && (
                            <div className="text-xs text-charcoal/50 font-mono italic">No copies registered for this book yet.</div>
                          )}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              )}
              </React.Fragment>
              )
            })}
          </tbody>
        </table>
        
        <div className="p-6 bg-parchment/10 border-t border-oxford-blue/5 flex justify-between items-center text-xs font-mono font-black text-charcoal/60 uppercase tracking-[0.3em]">
          <span>Page {page} • Currently showing {books.length} records</span>
          <div className="flex gap-6">
            <button 
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="hover:text-oxford-blue disabled:opacity-20 font-black transition-opacity"
            >
              Previous Page
            </button>
            <button 
              onClick={() => setPage(p => p + 1)}
              disabled={books.length < limit}
              className="hover:text-oxford-blue disabled:opacity-20 font-black transition-opacity"
            >
              Next Page
            </button>
          </div>
        </div>
      </div>

      <BookModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchBooks}
        editBook={editBookData}
      />
    </div>
  );
};

export default Books;
