import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Edit2, Check, Loader2, Barcode, ShieldCheck } from 'lucide-react';
import api from '../services/api';
import { useSnackbar } from 'notistack';

interface ManageCopiesModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookId: string;
  bookTitle: string;
}

interface Copy {
  id: string;
  barcode: string;
  status: string;
  condition: string;
}

const ManageCopiesModal: React.FC<ManageCopiesModalProps> = ({ isOpen, onClose, bookId, bookTitle }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [copies, setCopies] = useState<Copy[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // New Copy State
  const [isAdding, setIsAdding] = useState(false);
  const [newCopy, setNewCopy] = useState({
    barcode: '',
    condition: 'New'
  });

  // Edit Copy State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Copy>>({});

  useEffect(() => {
    if (isOpen && bookId) {
      fetchCopies();
    }
  }, [isOpen, bookId]);

  const fetchCopies = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/copies?book_id=${bookId}`);
      if (res.data.ok) {
        setCopies(res.data.data);
      }
    } catch (err) {
      console.error('ManageCopiesModal: Error fetching copies', err);
      enqueueSnackbar('Failed to fetch book copies', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCopy = async () => {
    if (!newCopy.barcode) {
      enqueueSnackbar('Barcode is required', { variant: 'warning' });
      return;
    }
    setActionLoading('create');
    try {
      const res = await api.post('/copies', {
        book_id: bookId,
        barcode: newCopy.barcode,
        condition: newCopy.condition
      });
      if (res.data.ok) {
        enqueueSnackbar('Copy added successfully', { variant: 'success' });
        setIsAdding(false);
        setNewCopy({ barcode: '', condition: 'New' });
        fetchCopies();
      }
    } catch (err: any) {
      enqueueSnackbar(err.response?.data?.message || 'Failed to add copy', { variant: 'error' });
    } finally {
      setActionLoading(null);
    }
  };

  const handleUpdateCopy = async (id: string) => {
    setActionLoading(id);
    try {
      const res = await api.put(`/copies/${id}`, editData);
      if (res.data.ok) {
        enqueueSnackbar('Copy updated successfully', { variant: 'success' });
        setEditingId(null);
        fetchCopies();
      }
    } catch (err: any) {
      enqueueSnackbar(err.response?.data?.message || 'Failed to update copy', { variant: 'error' });
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteCopy = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this copy?')) return;
    setActionLoading(id);
    try {
      const res = await api.delete(`/copies/${id}`);
      if (res.data.ok) {
        enqueueSnackbar('Copy deleted successfully', { variant: 'success' });
        fetchCopies();
      }
    } catch (err: any) {
      enqueueSnackbar(err.response?.data?.message || 'Failed to delete copy', { variant: 'error' });
    } finally {
      setActionLoading(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-oxford-blue/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-parchment w-full max-w-3xl max-h-[90vh] rounded-academic shadow-2xl flex flex-col overflow-hidden border border-oxford-blue/10">
        {/* Header */}
        <div className="p-6 border-b border-oxford-blue/10 flex justify-between items-center bg-white/50">
          <div>
            <h2 className="text-2xl font-serif font-black text-oxford-blue tracking-tight uppercase truncate max-w-[500px]">{bookTitle}</h2>
            <p className="text-xs font-mono font-black text-brass uppercase tracking-widest mt-1">Inventory & Copy Management</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-oxford-blue/5 rounded-full transition-colors cursor-pointer">
            <X className="h-6 w-6 text-oxford-blue/40" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-mono font-black text-oxford-blue uppercase tracking-widest border-b-2 border-brass pb-1">Current Holdings</h3>
            <button 
              onClick={() => setIsAdding(!isAdding)}
              className="flex items-center gap-2 text-[10px] font-mono font-black text-brass uppercase tracking-widest hover:text-brass/80 transition-colors"
            >
              <Plus className="h-4 w-4" />
              {isAdding ? 'Cancel' : 'Add New Holding'}
            </button>
          </div>

          {/* Add Form */}
          {isAdding && (
            <div className="p-4 bg-white/50 rounded-academic border border-brass/20 animate-in slide-in-from-top-2 duration-300 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-[9px] font-mono font-black text-oxford-blue/60 uppercase">Barcode</label>
                <input 
                  value={newCopy.barcode}
                  onChange={(e) => setNewCopy({...newCopy, barcode: e.target.value})}
                  className="w-full bg-white border border-oxford-blue/20 rounded-academic px-3 py-2 text-xs font-mono font-black uppercase text-brass focus:outline-none focus:border-brass/30"
                  placeholder="BC-000000"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-mono font-black text-oxford-blue/60 uppercase">Condition</label>
                <select 
                  value={newCopy.condition}
                  onChange={(e) => setNewCopy({...newCopy, condition: e.target.value})}
                  className="w-full bg-white border border-oxford-blue/20 rounded-academic px-3 py-2 text-xs font-mono font-black uppercase text-oxford-blue focus:outline-none"
                >
                  <option value="New">New</option>
                  <option value="Excellent">Excellent</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                  <option value="Poor">Poor</option>
                </select>
              </div>
              <div className="flex items-end">
                <button 
                  onClick={handleCreateCopy}
                  disabled={actionLoading === 'create'}
                  className="btn-academic text-[10px] w-full py-2 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {actionLoading === 'create' ? <Loader2 className="h-3 w-3 animate-spin" /> : <ShieldCheck className="h-3 w-3" />}
                  Register Copy
                </button>
              </div>
            </div>
          )}

          {/* Copies Table */}
          <div className="border border-oxford-blue/10 rounded-academic overflow-hidden shadow-inner bg-white/30">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-oxford-blue text-parchment font-mono font-black uppercase tracking-widest">
                  <th className="px-4 py-3">Barcode</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Condition</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-oxford-blue/5">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-12 text-center">
                      <Loader2 className="h-6 w-6 text-oxford-blue animate-spin mx-auto mb-2" />
                      <span className="text-[10px] font-mono font-black text-oxford-blue/40 uppercase">Accessing Archives...</span>
                    </td>
                  </tr>
                ) : copies.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-12 text-center font-mono font-black text-charcoal/40 uppercase italic">
                      No copies registered for this volume.
                    </td>
                  </tr>
                ) : (
                  copies.map((copy) => (
                    <tr key={copy.id} className="hover:bg-parchment/50 transition-colors">
                      <td className="px-4 py-4">
                        {editingId === copy.id ? (
                           <input 
                            value={editData.barcode ?? copy.barcode}
                            onChange={(e) => setEditData({...editData, barcode: e.target.value})}
                            className="bg-white border border-brass/30 px-2 py-1 rounded font-mono font-black text-brass uppercase w-full"
                           />
                        ) : (
                          <div className="flex items-center gap-2">
                            <Barcode className="h-3 w-3 text-brass/40" />
                            <span className="font-mono font-black text-brass uppercase">{copy.barcode}</span>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        {editingId === copy.id ? (
                          <select 
                            value={editData.status ?? copy.status}
                            onChange={(e) => setEditData({...editData, status: e.target.value})}
                            className="bg-white border border-brass/30 px-2 py-1 rounded font-mono font-black text-oxford-blue uppercase"
                          >
                            <option value="available">Available</option>
                            <option value="borrowed">Borrowed</option>
                            <option value="lost">Lost</option>
                            <option value="maintenance">Maintenance</option>
                          </select>
                        ) : (
                          <span className={`px-2 py-0.5 rounded-academic font-mono font-black uppercase text-[9px] ${
                            copy.status === 'available' ? 'bg-green-100 text-green-700' : 
                            copy.status === 'borrowed' ? 'bg-oxford-blue/10 text-oxford-blue' : 
                            'bg-red-100 text-red-700'
                          }`}>
                            {copy.status}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4 uppercase font-mono font-black text-oxford-blue/60 tracking-tighter">
                        {editingId === copy.id ? (
                           <select 
                            value={editData.condition ?? copy.condition}
                            onChange={(e) => setEditData({...editData, condition: e.target.value})}
                            className="bg-white border border-brass/30 px-2 py-1 rounded font-mono font-black text-oxford-blue uppercase"
                           >
                            <option value="New">New</option>
                            <option value="Excellent">Excellent</option>
                            <option value="Good">Good</option>
                            <option value="Fair">Fair</option>
                            <option value="Poor">Poor</option>
                           </select>
                        ) : (
                          copy.condition
                        )}
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex justify-end gap-3">
                          {editingId === copy.id ? (
                            <button 
                              onClick={() => handleUpdateCopy(copy.id)}
                              disabled={actionLoading === copy.id}
                              className="text-green-600 hover:text-green-700 transition-colors"
                            >
                              {actionLoading === copy.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                            </button>
                          ) : (
                            <button 
                              onClick={() => { setEditingId(copy.id); setEditData(copy); }}
                              className="text-oxford-blue/30 hover:text-oxford-blue transition-colors"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                          <button 
                            onClick={() => handleDeleteCopy(copy.id)}
                            disabled={actionLoading === copy.id}
                            className="text-oxford-blue/30 hover:text-red-500 transition-colors"
                          >
                            {actionLoading === copy.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-oxford-blue/10 flex justify-end items-center bg-white/50">
          <button
            onClick={onClose}
            className="text-xs font-mono font-black text-oxford-blue/60 uppercase tracking-widest hover:text-oxford-blue cursor-pointer"
          >
            Close Archives
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageCopiesModal;
