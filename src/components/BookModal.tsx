import React, { useState, useEffect } from 'react';
import { X, BookOpen, Loader2, Link as LinkIcon, AlertCircle } from 'lucide-react';
import api from '../services/api';

interface BookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editBook?: any | null; // Null means create mode
}

const BookModal: React.FC<BookModalProps> = ({ isOpen, onClose, onSuccess, editBook }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    publisher: '',
    isbn: '',
    description: '',
    language: 'Vietnamese',
    page_count: '',
    category: '', // Subject string
    subjects: [] as any[],
    url_img: ''
  });

  useEffect(() => {
    if (isOpen) {
      if (editBook) {
        // Pre-fill
        setFormData({
          title: editBook.title || '',
          author: editBook.author || '',
          publisher: editBook.publisher || '',
          isbn: editBook.isbn || '',
          description: editBook.description || '',
          language: editBook.language || 'Vietnamese',
          page_count: editBook.page_count?.toString() || '',
          category: editBook.book_subjects?.[0]?.subject?.name || '',
          subjects: editBook.book_subjects ? editBook.book_subjects.map((s:any) => s.subject) : [],
          url_img: editBook.url_img || ''
        });
      } else {
        // Reset
        setFormData({
          title: '', author: '', publisher: '', isbn: '', description: '', 
          language: 'Vietnamese', page_count: '', category: '', subjects: [], url_img: ''
        });
      }
      setError(null);
    }
  }, [isOpen, editBook]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Prepare payload
      const payload = {
        title: formData.title,
        author: formData.author,
        publisher: formData.publisher,
        isbn: formData.isbn,
        description: formData.description,
        language: formData.language,
        page_count: parseInt(formData.page_count) || null,
        url_img: formData.url_img,
        // Optional naive single subject generation for category
        subjects: formData.category ? [{
           code: formData.category.substring(0, 5).toUpperCase() + '-' + Math.floor(Math.random()*10),
           name: formData.category,
           category: formData.category
        }] : undefined
      };

      let res;
      if (editBook) {
        res = await api.put(`/books/${editBook.id}`, payload);
      } else {
        res = await api.post('/books', payload);
      }

      if (res.data?.ok) {
        onSuccess();
        onClose();
      } else {
        setError(res.data?.message || 'Operation failed.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const autofillMetadata = async () => {
    if (!formData.isbn) {
        setError("Please enter an ISBN first.");
        return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/books/isbn/${formData.isbn.trim()}`);
      if (res.data?.data) {
        const d = res.data.data;
        if (d.title) setFormData(p => ({ ...p, title: d.title }));
        if (d.author) setFormData(p => ({ ...p, author: d.author }));
        if (d.publisher) setFormData(p => ({ ...p, publisher: d.publisher }));
        if (d.description) setFormData(p => ({ ...p, description: d.description }));
        if (d.page_count) setFormData(p => ({ ...p, page_count: d.page_count.toString() }));
        if (d.category) setFormData(p => ({ ...p, category: d.category }));
        if (d.language) setFormData(p => ({ ...p, language: d.language }));
        if (d.url_img) setFormData(p => ({ ...p, url_img: d.url_img }));
      }
    } catch(err: any) {
       setError("Could not autofill by ISBN. Try again or fill manually.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-oxford-blue/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-academic shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-in slide-in-from-bottom-4 duration-300">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-oxford-blue/10 bg-parchment/30">
          <div className="flex items-center gap-3">
             <div className="bg-brass/20 p-2 rounded-full">
                <BookOpen className="h-5 w-5 text-brass" />
             </div>
             <div>
               <h2 className="text-xl font-serif font-black text-oxford-blue leading-tight">
                 {editBook ? 'Edit Book Details' : 'Register New Book'}
               </h2>
               <p className="text-xs font-mono text-charcoal/60 uppercase tracking-widest mt-1">
                 {editBook ? `ID: ${editBook.id}` : 'Manual Entry / ISBN Lookup'}
               </p>
             </div>
          </div>
          <button onClick={onClose} className="p-2 text-charcoal/40 hover:text-red-500 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 flex items-start gap-3 text-red-700">
               <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
               <div className="text-sm">{error}</div>
            </div>
          )}

          <form id="book-form" onSubmit={handleSubmit} className="space-y-6">
            
            {/* Split layout: ISBN Autofill section */}
            <div className="bg-oxford-blue/5 p-4 rounded-academic border border-oxford-blue/10 flex items-end gap-4">
              <div className="flex-1">
                <label className="block text-xs font-mono font-black text-oxford-blue uppercase tracking-widest mb-2">ISBN Number *</label>
                <input 
                  type="text" name="isbn" value={formData.isbn} onChange={handleChange} required
                  className="w-full bg-white border border-oxford-blue/20 rounded-academic px-4 py-2 text-sm text-oxford-blue focus:outline-none focus:border-brass/50 font-mono"
                  placeholder="e.g. 9780132350884"
                />
              </div>
              {!editBook && (
                <button type="button" onClick={autofillMetadata} disabled={loading || !formData.isbn}
                  className="px-4 py-2 bg-oxford-blue text-parchment font-mono text-xs font-black uppercase tracking-widest hover:bg-brass transition-colors rounded-academic disabled:opacity-50 flex items-center gap-2 h-10"
                >
                  <LinkIcon className="h-3 w-3" /> Fetch Data
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-mono font-black text-oxford-blue uppercase tracking-widest mb-2">Title *</label>
                <input type="text" name="title" value={formData.title} onChange={handleChange} required
                  className="w-full bg-white border border-oxford-blue/20 rounded-academic px-4 py-2 text-sm text-oxford-blue focus:outline-none focus:border-brass/50" />
              </div>
              <div>
                <label className="block text-xs font-mono font-black text-oxford-blue uppercase tracking-widest mb-2">Author *</label>
                <input type="text" name="author" value={formData.author} onChange={handleChange} required
                  className="w-full bg-white border border-oxford-blue/20 rounded-academic px-4 py-2 text-sm text-oxford-blue focus:outline-none focus:border-brass/50" />
              </div>

              <div>
                <label className="block text-xs font-mono font-black text-oxford-blue uppercase tracking-widest mb-2">Publisher</label>
                <input type="text" name="publisher" value={formData.publisher} onChange={handleChange}
                  className="w-full bg-white border border-oxford-blue/20 rounded-academic px-4 py-2 text-sm text-oxford-blue focus:outline-none focus:border-brass/50" />
              </div>
              <div>
                <label className="block text-xs font-mono font-black text-oxford-blue uppercase tracking-widest mb-2">Category (Subject)</label>
                <input type="text" name="category" value={formData.category} onChange={handleChange}
                  className="w-full bg-white border border-oxford-blue/20 rounded-academic px-4 py-2 text-sm text-oxford-blue focus:outline-none focus:border-brass/50" />
              </div>

              <div>
                <label className="block text-xs font-mono font-black text-oxford-blue uppercase tracking-widest mb-2">Language</label>
                <input type="text" name="language" value={formData.language} onChange={handleChange}
                  className="w-full bg-white border border-oxford-blue/20 rounded-academic px-4 py-2 text-sm text-oxford-blue focus:outline-none focus:border-brass/50" />
              </div>
              <div>
                <label className="block text-xs font-mono font-black text-oxford-blue uppercase tracking-widest mb-2">Page Count</label>
                <input type="number" name="page_count" value={formData.page_count} onChange={handleChange}
                  className="w-full bg-white border border-oxford-blue/20 rounded-academic px-4 py-2 text-sm text-oxford-blue focus:outline-none focus:border-brass/50" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono font-black text-oxford-blue uppercase tracking-widest mb-2">Cover Image URL</label>
              <div className="flex gap-4">
                <input type="url" name="url_img" value={formData.url_img} onChange={handleChange} placeholder="https://..."
                  className="flex-1 bg-white border border-oxford-blue/20 rounded-academic px-4 py-2 text-sm text-oxford-blue focus:outline-none focus:border-brass/50" />
                {formData.url_img && (
                  <img src={formData.url_img} alt="Cover Preview" className="h-10 w-10 object-cover rounded border border-oxford-blue/10" />
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono font-black text-oxford-blue uppercase tracking-widest mb-2">Synopsis / Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows={4}
                className="w-full bg-white border border-oxford-blue/20 rounded-academic px-4 py-2 text-sm text-oxford-blue focus:outline-none focus:border-brass/50 resize-y"></textarea>
            </div>
            
          </form>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-oxford-blue/10 flex justify-end gap-4 bg-gray-50/50">
           <button onClick={onClose} disabled={loading} type="button"
             className="px-6 py-2 border border-oxford-blue/20 text-oxford-blue font-mono text-xs font-black uppercase tracking-widest hover:bg-oxford-blue/5 transition-colors rounded-academic"
           >
             Cancel
           </button>
           <button type="submit" form="book-form" disabled={loading}
             className="px-8 py-2 bg-brass text-parchment font-mono text-xs font-black uppercase tracking-widest hover:bg-brass-dark transition-colors rounded-academic flex items-center gap-2 shadow-lg shadow-brass/20"
           >
             {loading && <Loader2 className="h-4 w-4 animate-spin" />}
             {editBook ? 'Save Changes' : 'Register Book'}
           </button>
        </div>

      </div>
    </div>
  );
};

export default BookModal;
