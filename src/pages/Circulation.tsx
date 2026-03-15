import { useState, useEffect, useCallback } from 'react';
import { 
  RotateCcw, Search, BookOpen, AlertCircle, 
  CreditCard, CheckCircle2, User, 
  Loader2, Calendar, Timer
} from 'lucide-react';
import api from '../services/api';
import { useSnackbar } from 'notistack';

const Circulation = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState<any[]>([]);
  const [fines, setFines] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<'loans' | 'fines'>('loans');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [stats, setStats] = useState({
    activeBorrows: 0,
    overdueItems: 0,
    pendingFines: 0,
    totalFines: 0
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [borrowsRes, finesRes, statsRes] = await Promise.all([
        api.get('/borrow/all'),
        api.get('/payments/all'),
        api.get('/payments/stats')
      ]);

      if (borrowsRes.data.ok) setRecords(borrowsRes.data.data);
      if (finesRes.data.ok) setFines(finesRes.data.data);
      if (statsRes.data.ok) {
        setStats({
          activeBorrows: borrowsRes.data.data.filter((r: any) => r.status === 'borrowed').length,
          overdueItems: borrowsRes.data.data.filter((r: any) => {
             if (r.status !== 'borrowed') return false;
             return new Date(r.due_date) < new Date();
          }).length,
          pendingFines: finesRes.data.data.filter((f: any) => f.status === 'pending').length,
          totalFines: statsRes.data.data.totalRevenue + statsRes.data.data.totalPending
        });
      }
    } catch (err) {
      console.error('Circulation: Error fetching data', err);
      enqueueSnackbar('Tải dữ liệu mượn trả thất bại', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredLoans = records.filter(r => {
    const matchesSearch = 
      r.user?.full_name?.toLowerCase().includes(search.toLowerCase()) || 
      r.user?.email?.toLowerCase().includes(search.toLowerCase()) ||
      r.copy?.book?.title?.toLowerCase().includes(search.toLowerCase());
    
    const isOverdue = r.status === 'borrowed' && new Date(r.due_date) < new Date();
    const matchesStatus = 
        statusFilter === '' || 
        (statusFilter === 'overdue' && isOverdue) ||
        (statusFilter !== 'overdue' && r.status === statusFilter);

    return matchesSearch && matchesStatus;
  });

  const filteredFines = fines.filter(f => {
    const matchesSearch = 
      f.user?.full_name?.toLowerCase().includes(search.toLowerCase()) || 
      f.user?.email?.toLowerCase().includes(search.toLowerCase()) ||
      f.borrow_record?.copy?.book?.title?.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = statusFilter === '' || f.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-10 space-y-10 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex justify-between items-end border-b border-oxford-blue/10 pb-8">
        <div>
          <h1 className="text-4xl font-serif font-black text-oxford-blue mb-2 tracking-tight uppercase">Mượn & Trả sách</h1>
          <p className="text-charcoal/70 font-sans font-medium italic">Theo dõi mượn trả sách, tài liệu quá hạn và quản lý tiền phạt.</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => { setViewMode('loans'); setStatusFilter(''); }}
            className={`px-6 py-2 rounded-academic font-mono text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'loans' ? 'bg-oxford-blue text-parchment shadow-lg' : 'bg-white text-oxford-blue/40 hover:text-oxford-blue border border-oxford-blue/5'}`}
          >
            Danh sách Mượn
          </button>
          <button 
            onClick={() => { setViewMode('fines'); setStatusFilter(''); }}
            className={`px-6 py-2 rounded-academic font-mono text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'fines' ? 'bg-oxford-blue text-parchment shadow-lg' : 'bg-white text-oxford-blue/40 hover:text-oxford-blue border border-oxford-blue/5'}`}
          >
            Quản lý Phạt
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {[
          { label: 'Đang mượn', value: stats.activeBorrows, icon: BookOpen, color: 'text-oxford-blue', border: 'border-l-oxford-blue' },
          { label: 'Quá hạn', value: stats.overdueItems, icon: Timer, color: 'text-red-500', border: 'border-l-red-500' },
          { label: 'Chưa nộp phạt', value: stats.pendingFines, icon: AlertCircle, color: 'text-brass', border: 'border-l-brass' },
          { label: 'Tổng tiền phạt', value: `${stats.totalFines.toLocaleString()} VND`, icon: CreditCard, color: 'text-green-600', border: 'border-l-green-600' },
        ].map((stat, i) => (
          <div key={i} className={`card-academic p-6 border-l-4 ${stat.border} bg-white shadow-sm`}>
            <div className="flex items-center gap-4 mb-4">
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
              <span className="text-[10px] font-mono font-black text-charcoal/60 uppercase tracking-widest">{stat.label}</span>
            </div>
            <div className="text-2xl font-serif font-black text-oxford-blue leading-none">{loading ? '...' : stat.value}</div>
          </div>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="card-academic bg-white overflow-hidden shadow-2xl flex flex-col min-h-[600px] relative">
        <div className="absolute inset-0 opacity-[0.01] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
        <div className="p-6 bg-parchment/30 border-b border-oxford-blue/10 flex justify-between items-center z-10">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-oxford-blue/30" />
            <input 
              type="text" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`Tìm kiếm ${viewMode === 'loans' ? 'đơn mượn' : 'khoản phạt'} theo tên hoặc sách...`} 
              className="bg-white border border-oxford-blue/20 rounded-academic pl-10 pr-4 py-3 text-xs text-charcoal focus:outline-none focus:border-brass/30 w-full uppercase font-mono font-black tracking-widest shadow-sm"
            />
          </div>
          <div className="flex gap-4">
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-white border border-oxford-blue/20 rounded-academic px-4 py-2 text-xs text-oxford-blue font-mono font-black uppercase tracking-widest cursor-pointer focus:outline-none focus:border-brass/30"
              >
                <option value="">Tất cả trạng thái</option>
                {viewMode === 'loans' ? (
                  <>
                    <option value="requested">Yêu cầu</option>
                    <option value="borrowed">Đang mượn</option>
                    <option value="overdue">Quá hạn</option>
                    <option value="returned">Đã trả</option>
                    <option value="cancelled">Đã huỷ</option>
                  </>
                ) : (
                  <>
                    <option value="pending">Chưa nộp</option>
                    <option value="paid">Đã nộp</option>
                  </>
                )}
              </select>
              <button onClick={fetchData} className="p-2 border border-oxford-blue/10 rounded-academic text-oxford-blue/40 hover:text-brass transition-colors cursor-pointer group" title="Làm mới dữ liệu">
                <RotateCcw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
          </div>
        </div>

        <div className="flex-1 overflow-x-auto z-10">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-oxford-blue text-parchment uppercase font-mono text-[10px] font-black tracking-[0.2em]">
                <th className="px-8 py-5 border-r border-parchment/10">{viewMode === 'loans' ? 'Người mượn & Sách' : 'Chi tiết Phạt'}</th>
                <th className="px-8 py-5 border-r border-parchment/10">{viewMode === 'loans' ? 'Thời hạn mượn' : 'Giao dịch mượn'}</th>
                <th className="px-8 py-5">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-oxford-blue/5">
              {loading ? (
                <tr>
                   <td colSpan={3} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <Loader2 className="h-8 w-8 text-oxford-blue animate-spin" />
                      <span className="text-xs font-mono font-black text-oxford-blue/40 uppercase tracking-[0.3em]">Đang truy xuất dữ liệu...</span>
                    </div>
                  </td>
                </tr>
              ) : (viewMode === 'loans' ? filteredLoans : filteredFines).length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-8 py-20 text-center font-mono font-black text-charcoal/40 uppercase italic tracking-widest text-[10px]">
                    Không tìm thấy dữ liệu phù hợp.
                  </td>
                </tr>
              ) : (
                (viewMode === 'loans' ? filteredLoans : filteredFines).map((item) => {
                  if (viewMode === 'loans') {
                    const isOverdue = item.status === 'borrowed' && new Date(item.due_date) < new Date();
                    return (
                        <tr key={item.id} className="hover:bg-parchment/50 transition-colors group">
                          <td className="px-8 py-6 border-r border-oxford-blue/5">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-academic bg-oxford-blue/5 flex items-center justify-center font-serif font-bold text-oxford-blue border border-oxford-blue/10 text-xs text-center p-1 leading-none">
                                    {item.copy?.book?.title?.[0] || 'B'}
                                </div>
                                <div>
                                    <div className="text-sm font-serif font-black text-oxford-blue tracking-tight leading-none group-hover:text-brass transition-colors uppercase truncate max-w-[200px]">{item.copy?.book?.title}</div>
                                    <div className="text-[9px] font-mono font-black text-charcoal/50 flex items-center gap-1 mt-1 uppercase tracking-widest truncate max-w-[200px]">
                                        <User className="h-3 w-3" /> {item.user?.full_name || item.user?.email}
                                    </div>
                                </div>
                            </div>
                          </td>
                          <td className="px-8 py-6 border-r border-oxford-blue/5">
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2 text-[10px] font-mono font-black text-oxford-blue uppercase tracking-widest">
                                    <Calendar className="h-3 w-3 text-brass" /> 
                                    {item.borrow_date ? new Date(item.borrow_date).toLocaleDateString() : 'N/A'} 
                                    <span className="text-charcoal/30 mx-1">→</span>
                                    {item.due_date ? new Date(item.due_date).toLocaleDateString() : 'N/A'}
                                </div>
                                {item.return_date && (
                                    <div className="text-[9px] font-mono font-black text-green-600 uppercase tracking-widest flex items-center gap-1">
                                        <CheckCircle2 className="h-3 w-3" /> Đã trả: {new Date(item.return_date).toLocaleDateString()}
                                    </div>
                                )}
                            </div>
                          </td>
                          <td className="px-8 py-6 border-r border-oxford-blue/5">
                            <div className={`text-[9px] font-mono font-black uppercase tracking-widest px-2 py-0.5 rounded-sm inline-block ${
                                isOverdue ? 'bg-red-50 text-red-700 border border-red-100 animate-pulse' :
                                item.status === 'borrowed' ? 'bg-brass/10 text-brass border border-brass/20' :
                                item.status === 'returned' ? 'bg-green-50 text-green-700 border border-green-100' :
                                'bg-oxford-blue/5 text-oxford-blue/60 border border-oxford-blue/10'
                            }`}>
                                {isOverdue ? 'Quá hạn' : item.status === 'borrowed' ? 'Đang mượn' : item.status === 'returned' ? 'Đã trả' : item.status === 'requested' ? 'Yêu cầu' : item.status === 'cancelled' ? 'Đã huỷ' : item.status}
                            </div>
                          </td>

                        </tr>
                    );
                  } else {
                    return (
                        <tr key={item.id} className="hover:bg-parchment/50 transition-colors group">
                           <td className="px-8 py-6 border-r border-oxford-blue/5">
                             <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-full bg-red-50 flex items-center justify-center text-red-600 border border-red-100">
                                    <CreditCard className="h-4 w-4" />
                                </div>
                                <div>
                                    <div className="text-sm font-black text-oxford-blue uppercase tracking-tight">{item.amount.toLocaleString()} VND</div>
                                    <div className="text-[9px] font-mono font-black text-charcoal/50 flex items-center gap-1 mt-1 uppercase tracking-widest">
                                        <User className="h-3 w-3" /> {item.user?.full_name || item.user?.email}
                                    </div>
                                </div>
                             </div>
                           </td>
                           <td className="px-8 py-6 border-r border-oxford-blue/5">
                                <div className="text-[10px] font-serif font-black text-oxford-blue uppercase truncate max-w-[200px]">
                                    {item.borrow_record?.copy?.book?.title || 'Phạt hệ thống'}
                                </div>
                                <div className="text-[9px] font-mono font-black text-charcoal/30 uppercase tracking-widest mt-1">
                                    Mã giao dịch: {item.id.substring(0, 8)}
                                </div>
                           </td>
                           <td className="px-8 py-6 border-r border-oxford-blue/5">
                              <span className={`text-[9px] font-mono font-black uppercase tracking-widest px-2 py-0.5 rounded-sm border ${
                                item.status === 'paid' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100 animate-pulse'
                              }`}>
                                {item.status === 'paid' ? 'Đã nộp' : item.status === 'pending' ? 'Chưa nộp' : item.status}
                              </span>
                           </td>

                        </tr>
                    );
                  }
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Circulation;
