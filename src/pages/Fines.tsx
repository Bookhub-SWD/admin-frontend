import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, MoreHorizontal, Award, User as UserIcon, Calendar, Loader2 } from 'lucide-react';
import api from '../services/api';

const Fines = () => {
  const [searchParams] = useSearchParams();
  const statusFilter = searchParams.get('status');

  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFines = async () => {
      try {
        const res = await api.get('/payments/all');
        if (res.data?.ok) {
          let data = res.data.data || [];
          if (statusFilter) {
            data = data.filter((r: any) => r.status.toLowerCase() === statusFilter.toLowerCase());
          }
          setRecords(data);
        }
      } catch (err) {
        console.error('Error fetching fines:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFines();
  }, [statusFilter]);

  return (
    <div className="p-10 space-y-10 animate-in fade-in duration-500">
      <div className="flex justify-between items-end border-b border-oxford-blue/10 pb-8">
        <div>
          <h1 className="text-4xl font-serif font-black text-oxford-blue mb-2 tracking-tight">Quản lý tiền phạt</h1>
          <p className="text-charcoal/70 font-sans font-medium italic">
            Theo dõi các khoản tiền phạt chờ thanh toán và đã thanh toán cho việc trả sách quá hạn.
            {statusFilter && <span className="ml-2 font-bold text-red-500 uppercase tracking-widest text-xs">[{statusFilter === 'pending' ? 'CHỜ THANH TOÁN' : statusFilter === 'paid' ? 'ĐÃ THANH TOÁN' : statusFilter} ĐANG LỌC]</span>}
          </p>
        </div>
      </div>

      <div className="card-academic overflow-hidden bg-white shadow-2xl relative">
        <div className="absolute inset-0 opacity-[0.01] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
        <div className="p-6 bg-parchment/30 border-b border-oxford-blue/10 flex justify-between items-center relative z-10">
          <div className="flex gap-8">
            <div className="flex items-center gap-2 group cursor-pointer">
              <Award className="h-4 w-4 text-brass" />
              <span className="text-xs font-mono font-black text-oxford-blue uppercase tracking-widest border-b border-brass/50">
                Tổng số khoản phạt: {loading ? '...' : records.length}
              </span>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-oxford-blue/30" />
              <input 
                type="text" 
                placeholder="Tìm kiếm..." 
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
                  <th className="px-8 py-5 border-r border-parchment/10">Người dùng</th>
                  <th className="px-8 py-5 border-r border-parchment/10">Số tiền (VND)</th>
                  <th className="px-8 py-5 border-r border-parchment/10">Thông tin sách</th>
                  <th className="px-8 py-5 border-r border-parchment/10">Trạng thái</th>
                  <th className="px-8 py-5 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-oxford-blue/5">
                {records.length > 0 ? records.map((record) => (
                  <tr key={record.id} className="hover:bg-parchment/50 transition-colors group">
                    <td className="px-8 py-6 border-r border-oxford-blue/5">
                      <div className="flex items-center gap-2 text-sm font-bold text-oxford-blue">
                        <UserIcon className="h-4 w-4 text-brass" />
                        {record.user?.full_name || 'Người dùng không xác định'}
                      </div>
                      <div className="text-xs font-mono text-charcoal/50 mt-1">{record.user?.email || ''}</div>
                    </td>
                    <td className="px-8 py-6 border-r border-oxford-blue/5">
                      <div className="text-lg font-serif font-black text-red-600">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(record.amount)}
                      </div>
                    </td>
                    <td className="px-8 py-6 border-r border-oxford-blue/5">
                      <div className="text-sm font-serif font-bold text-oxford-blue leading-tight mb-1 truncate max-w-[200px]">
                        {record.borrow_record?.copy?.book?.title || 'Sách không xác định'}
                      </div>
                      <div className="text-xs font-mono font-black text-charcoal/50 uppercase tracking-widest flex items-center gap-2 mt-2">
                        <Calendar className="h-3 w-3" />
                        Ngày tạo: {record.created_at ? new Date(record.created_at).toLocaleDateString('vi-VN') : 'N/A'}
                      </div>
                    </td>
                    <td className="px-8 py-6 border-r border-oxford-blue/5">
                      <span className={`text-xs font-mono font-black uppercase tracking-widest px-2 py-1 rounded-sm border ${
                        record.status === 'pending' ? 'bg-red-500/10 border-red-500 text-red-600' :
                        record.status === 'paid' ? 'bg-green-500/10 border-green-500 text-green-600' :
                        'bg-oxford-blue/10 border-oxford-blue text-oxford-blue'
                      }`}>
                        {record.status === 'pending' ? 'Chờ thanh toán' : record.status === 'paid' ? 'Đã thanh toán' : record.status}
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
                      Không tìm thấy dữ liệu tiền phạt
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

export default Fines;
