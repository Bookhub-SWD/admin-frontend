import { X, Mail, Phone, CreditCard, Calendar, BookOpen, RotateCcw, Shield } from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '../services/api';

interface UserDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
}

const UserDetailModal = ({ isOpen, onClose, user }: UserDetailModalProps) => {
  const [history, setHistory] = useState<any[]>([]);
  const [fines, setFines] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    if (isOpen) setImgError(false); // Reset error state when modal opens
    if (isOpen && user) {
      const fetchData = async () => {
        setLoading(true);
        try {
          const [histRes, fineRes] = await Promise.all([
            api.get('/borrow/all', { params: { user_id: user.id } }),
            api.get('/payments/all', { params: { user_id: user.id } })
          ]);
          if (histRes.data.ok) setHistory(histRes.data.data);
          if (fineRes.data.ok) setFines(fineRes.data.data);
        } catch (err) {
          console.error('UserDetailModal: Error fetching records', err);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [isOpen, user]);

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-oxford-blue/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-parchment w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-academic shadow-2xl flex flex-col border border-oxford-blue/10 relative">
        
        {/* Header */}
        <div className="p-8 border-b border-oxford-blue/10 bg-white/50 flex justify-between items-start relative z-10">
          <div className="flex gap-6 items-center">
            <div className="h-20 w-20 rounded-academic bg-oxford-blue flex items-center justify-center text-3xl font-serif font-black text-parchment border-4 border-brass/30 shadow-xl overflow-hidden">
              {user.avatar_url && !imgError ? (
                <img src={user.avatar_url} alt={user.full_name} className="h-full w-full object-cover" onError={() => setImgError(true)} />
              ) : (
                user.full_name?.[0] || user.email[0]
              )}
            </div>
            <div>
              <h2 className="text-3xl font-serif font-black text-oxford-blue tracking-tight uppercase">{user.full_name || 'Unknown User'}</h2>
              <div className="flex gap-4 mt-2">
                <span className="text-[10px] font-mono font-black text-brass uppercase tracking-[0.2em] bg-brass/10 px-2 py-0.5 rounded border border-brass/20">
                  {user.roles?.name || 'Member'}
                </span>
                <span className={`text-[10px] font-mono font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded border ${
                   user.status === 'active' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'
                }`}>
                  {user.status}
                </span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-oxford-blue/5 rounded-full transition-colors cursor-pointer text-oxford-blue/40 hover:text-oxford-blue">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-10 font-sans relative z-10">
          {/* User Info Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card-academic p-5 bg-white border-l-4 border-l-oxford-blue shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                    <Mail className="h-4 w-4 text-oxford-blue/40" />
                    <span className="text-[10px] font-mono font-black text-charcoal/40 uppercase tracking-widest">Email Address</span>
                </div>
                <div className="text-sm font-black text-oxford-blue truncate" title={user.email}>{user.email}</div>
            </div>
            <div className="card-academic p-5 bg-white border-l-4 border-l-brass shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                    <Phone className="h-4 w-4 text-brass/40" />
                    <span className="text-[10px] font-mono font-black text-charcoal/40 uppercase tracking-widest">Phone Number</span>
                </div>
                <div className="text-sm font-black text-oxford-blue">{user.phone || 'No phone on file'}</div>
            </div>
            <div className="card-academic p-5 bg-white border-l-4 border-l-oxford-blue/20 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-4 w-4 text-oxford-blue/20" />
                    <span className="text-[10px] font-mono font-black text-charcoal/40 uppercase tracking-widest">Identity Code</span>
                </div>
                <div className="text-sm font-black text-oxford-blue uppercase tracking-widest font-mono">{user.identity_code || 'Unassigned'}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Borrowing History */}
            <section className="space-y-4">
              <h3 className="text-lg font-serif font-black text-oxford-blue flex items-center gap-2 uppercase tracking-tight">
                <BookOpen className="h-5 w-5 text-brass" />
                Borrowing History
              </h3>
              <div className="space-y-3">
                {loading ? (
                   Array.from({length: 3}).map((_, i) => (
                     <div key={i} className="h-20 bg-white/50 rounded-academic animate-pulse border border-oxford-blue/5"></div>
                   ))
                ) : history.length === 0 ? (
                  <div className="p-8 text-center bg-white/30 rounded-academic border border-dashed border-oxford-blue/10 italic text-xs font-mono font-black text-charcoal/40 uppercase tracking-widest">No loan records found.</div>
                ) : (
                  history.map((record) => (
                    <div key={record.id} className="p-4 bg-white rounded-academic border border-oxford-blue/5 shadow-sm hover:border-brass/30 transition-colors flex gap-4">
                      <div className="h-14 w-10 bg-oxford-blue/5 rounded shrink-0 overflow-hidden border border-oxford-blue/10">
                        {record.copy?.book?.url_img ? (
                          <img src={record.copy.book.url_img} className="h-full w-full object-cover" />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-[10px] font-serif font-bold text-oxford-blue/20">BOOK</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-black text-oxford-blue truncate uppercase tracking-tight">{record.copy?.book?.title}</div>
                        <div className="flex gap-4 mt-1">
                          <span className="text-[9px] font-mono font-black text-charcoal/40 uppercase tracking-widest flex items-center gap-1">
                            <Calendar className="h-3 w-3" /> {new Date(record.borrow_date || record.created_at).toLocaleDateString()}
                          </span>
                          <span className={`text-[9px] font-mono font-black uppercase tracking-widest px-1.5 rounded flex items-center gap-1 ${
                            record.status === 'borrowed' ? 'bg-brass/10 text-brass' : record.status === 'returned' ? 'text-green-600' : 'text-charcoal/40'
                          }`}>
                            {record.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>

            {/* Fines Section */}
            <section className="space-y-4">
              <h3 className="text-lg font-serif font-black text-oxford-blue flex items-center gap-2 uppercase tracking-tight">
                <RotateCcw className="h-5 w-5 text-red-500/50" />
                Fines & Overdues
              </h3>
              <div className="space-y-3">
                {loading ? (
                   Array.from({length: 3}).map((_, i) => (
                     <div key={i} className="h-20 bg-white/50 rounded-academic animate-pulse border border-oxford-blue/5"></div>
                   ))
                ) : fines.length === 0 ? (
                  <div className="p-8 text-center bg-white/30 rounded-academic border border-dashed border-oxford-blue/10 italic text-xs font-mono font-black text-charcoal/40 uppercase tracking-widest">User has no fines.</div>
                ) : (
                  fines.map((fine) => (
                    <div key={fine.id} className="p-4 bg-white rounded-academic border border-oxford-blue/5 shadow-sm hover:border-red-200 transition-colors flex justify-between items-center group">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 bg-red-50 rounded-full flex items-center justify-center text-red-600 group-hover:bg-red-600 group-hover:text-white transition-colors">
                            <CreditCard className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="text-sm font-black text-oxford-blue">{fine.amount.toLocaleString()} VND</div>
                          <div className="text-[9px] font-mono font-black text-charcoal/40 uppercase tracking-widest mt-0.5">{fine.borrow_record?.copy?.book?.title || 'System Fine'}</div>
                        </div>
                      </div>
                      <span className={`text-[9px] font-mono font-black uppercase tracking-widest px-2 py-1 rounded-sm border ${
                        fine.status === 'paid' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100 animate-pulse'
                      }`}>
                        {fine.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-oxford-blue/10 bg-white/30 text-right relative z-10">
          <button 
            onClick={onClose}
            className="px-8 py-3 bg-oxford-blue text-parchment font-mono text-[10px] font-black uppercase tracking-[0.2em] rounded-academic hover:shadow-xl hover:-translate-y-0.5 transition-all cursor-pointer active:scale-95"
          >
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDetailModal;
