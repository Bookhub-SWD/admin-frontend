import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, MoreHorizontal, BookMarked, User as UserIcon, Calendar, Clock, Loader2 } from 'lucide-react';
import api from '../services/api';

const Borrows = () => {
  const [searchParams] = useSearchParams();
  const statusFilter = searchParams.get('status');

  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBorrows = async () => {
      try {
        const res = await api.get('/borrow/all');
        if (res.data?.ok) {
          let data = res.data.data || [];
          // Filter if status is specified in URL query
          if (statusFilter) {
            data = data.filter((r: any) => r.status.toLowerCase() === statusFilter.toLowerCase());
          }
          setRecords(data);
        }
      } catch (err) {
        console.error('Error fetching borrows:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBorrows();
  }, [statusFilter]);

  return (
    <div className="p-10 space-y-10 animate-in fade-in duration-500">
      <div className="flex justify-between items-end border-b border-oxford-blue/10 pb-8">
        <div>
          <h1 className="text-4xl font-serif font-black text-oxford-blue mb-2 tracking-tight">Borrow Records</h1>
          <p className="text-charcoal/70 font-sans font-medium italic">
            Manage active loans, overdue items, and borrower history.
            {statusFilter && <span className="ml-2 font-bold text-oxford-blue uppercase tracking-widest text-xs">[{statusFilter} FILTER ACTIVE]</span>}
          </p>
        </div>
      </div>

      <div className="card-academic overflow-hidden bg-white shadow-2xl relative">
        <div className="absolute inset-0 opacity-[0.01] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
        <div className="p-6 bg-parchment/30 border-b border-oxford-blue/10 flex justify-between items-center relative z-10">
          <div className="flex gap-8">
            <div className="flex items-center gap-2 group cursor-pointer">
              <BookMarked className="h-4 w-4 text-brass" />
              <span className="text-xs font-mono font-black text-oxford-blue uppercase tracking-widest border-b border-brass/50">
                Total Records: {loading ? '...' : records.length}
              </span>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-oxford-blue/30" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="bg-white border border-oxford-blue/20 rounded-academic pl-10 pr-4 py-2 text-xs text-charcoal focus:outline-none focus:border-brass/30 w-64 uppercase font-mono font-black tracking-widest"
              />
            </div>
            <button className="p-2 border border-oxford-blue/10 rounded-academic text-oxford-blue/40 hover:text-brass transition-colors">
              <Filter className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="relative min-h-[400px]">
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm z-20">
               <Loader2 className="h-8 w-8 text-oxford-blue animate-spin" />
            </div>
          ) : (
            <table className="w-full text-left border-collapse relative z-10">
              <thead>
                <tr className="bg-oxford-blue text-parchment uppercase font-mono text-xs font-black tracking-[0.2em]">
                  <th className="px-8 py-5 border-r border-parchment/10">Book & Copy</th>
                  <th className="px-8 py-5 border-r border-parchment/10">Borrower</th>
                  <th className="px-8 py-5 border-r border-parchment/10">Dates</th>
                  <th className="px-8 py-5 border-r border-parchment/10">Status</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-oxford-blue/5">
                {records.length > 0 ? records.map((record) => (
                  <tr key={record.id} className="hover:bg-parchment/50 transition-colors group">
                    <td className="px-8 py-6 border-r border-oxford-blue/5">
                      <div className="text-sm font-serif font-black text-oxford-blue leading-tight mb-1">{record.copy?.book?.title || 'Unknown Book'}</div>
                      <div className="text-xs font-mono font-black text-charcoal/50 uppercase tracking-widest">
                        Barcode: {record.copy?.barcode || 'N/A'}
                      </div>
                    </td>
                    <td className="px-8 py-6 border-r border-oxford-blue/5">
                      <div className="flex items-center gap-2 text-sm font-bold text-oxford-blue">
                        <UserIcon className="h-4 w-4 text-brass" />
                        {record.user?.full_name || 'Unknown User'}
                      </div>
                      <div className="text-xs font-mono text-charcoal/50 mt-1">{record.user?.email || ''}</div>
                    </td>
                    <td className="px-8 py-6 border-r border-oxford-blue/5 space-y-1">
                      <div className="flex items-center gap-2 text-xs font-mono font-black text-charcoal/70 uppercase tracking-widest">
                        <Calendar className="h-3 w-3" /> 
                        Borrow: {record.borrow_date ? new Date(record.borrow_date).toLocaleDateString() : 'N/A'}
                      </div>
                      <div className="flex items-center gap-2 text-xs font-mono font-black text-red-500/80 uppercase tracking-widest">
                        <Clock className="h-3 w-3" /> 
                        Due: {record.due_date ? new Date(record.due_date).toLocaleDateString() : 'N/A'}
                      </div>
                    </td>
                    <td className="px-8 py-6 border-r border-oxford-blue/5">
                      <span className={`text-xs font-mono font-black uppercase tracking-widest px-2 py-1 rounded-sm border ${
                        record.status === 'borrowed' ? 'bg-brass/10 border-brass text-brass' :
                        record.status === 'overdue' ? 'bg-red-500/10 border-red-500 text-red-600' :
                        record.status === 'returned' ? 'bg-green-500/10 border-green-500 text-green-600' :
                        'bg-oxford-blue/10 border-oxford-blue text-oxford-blue'
                      }`}>
                        {record.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                       <button className="text-oxford-blue/20 hover:text-brass transition-colors">
                          <MoreHorizontal className="h-5 w-5" />
                       </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-charcoal/40 font-mono text-xs uppercase tracking-widest">
                      No borrow records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Borrows;
