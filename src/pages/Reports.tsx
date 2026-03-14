import { useState, useEffect } from 'react';
import { Download, FileText, TrendingUp, BookOpen, Clock, BarChart as BarIcon, Loader2 } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line } from 'recharts';
import api from '../services/api';

const Reports = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{
    trends: {
      borrowing: { month: string, count: number }[],
      revenue: { month: string, amount: number }[]
    },
    summary: {
      total_books: number,
      active_users: number,
      revenue: number,
      currently_borrowed: number
    }
  }>({
    trends: { borrowing: [], revenue: [] },
    summary: { total_books: 0, active_users: 0, revenue: 0, currently_borrowed: 0 }
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/stats/dashboard');
        if (res.data.ok) {
          setData({
            trends: res.data.data.trends,
            summary: res.data.data.summary
          });
        }
      } catch (err) {
        console.error('Reports: Error fetching stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="p-10 space-y-10 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex justify-between items-end border-b border-oxford-blue/10 pb-8">
        <div>
          <h1 className="text-4xl font-serif font-black text-oxford-blue mb-2 tracking-tight uppercase">Báo cáo & Thống kê</h1>
          <p className="text-charcoal/70 font-sans font-medium italic">Xem báo cáo chi tiết về mượn trả sách, hoạt động của độc giả và tình trạng thư viện.</p>
        </div>
        <button className="btn-academic flex items-center gap-2 text-xs shadow-lg shadow-oxford-blue/10 cursor-pointer">
          <Download className="h-4 w-4" />
          Xuất báo cáo (PDF)
        </button>
      </div>

      {/* Analytical Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {[
          { label: 'Tổng tiền phạt', value: `${(data.summary.revenue || 0).toLocaleString()} VND`, icon: TrendingUp, color: 'text-brass' },
          { label: 'Độc giả hoạt động', value: data.summary.active_users.toLocaleString(), icon: Clock, color: 'text-oxford-blue' },
          { label: 'Tổng lượt mượn', value: data.summary.currently_borrowed.toLocaleString(), icon: BookOpen, color: 'text-oxford-blue' },
          { label: 'Tình trạng kho sách', value: '100%', icon: FileText, color: 'text-brass' },
        ].map((stat, i) => (
          <div key={i} className="card-academic p-6 border-l-4 border-l-oxford-blue bg-white shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4 mb-4">
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
              <span className="text-[10px] font-mono font-black text-charcoal/60 uppercase tracking-widest">{stat.label}</span>
            </div>
            <div className="text-3xl font-serif font-black text-oxford-blue">{loading ? '...' : stat.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Circulation Trends Chart */}
        <div className="card-academic p-8 bg-white">
            <h3 className="text-xl font-serif font-bold text-oxford-blue mb-8 flex items-center gap-2">
            <BarIcon className="h-5 w-5 text-brass" />
            Xu hướng đọc sách hàng tháng
            </h3>
            <div className="h-80 w-full">
            {loading ? (
                <div className="h-full flex flex-col items-center justify-center gap-4">
                    <Loader2 className="h-8 w-8 text-oxford-blue animate-spin" />
                    <span className="text-[10px] font-mono font-black text-oxford-blue/40 uppercase tracking-widest">Đang tổng hợp dữ liệu...</span>
                </div>
            ) : (
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.trends.borrowing}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#00000005" vertical={false} />
                    <XAxis 
                        dataKey="month" 
                        stroke="#002147" 
                        fontSize={10} 
                        fontFamily="mono"
                        fontWeight="900"
                        axisLine={false}
                        tickLine={false}
                        dy={10}
                    />
                    <YAxis 
                        stroke="#002147" 
                        fontSize={10} 
                        fontFamily="mono"
                        fontWeight="900"
                        axisLine={false}
                        tickLine={false}
                        dx={-10}
                    />
                    <Tooltip 
                        contentStyle={{ backgroundColor: '#FCFBF7', border: '1px solid #00214710', borderRadius: '2px' }}
                        labelStyle={{ fontFamily: 'serif', fontWeight: 'bold', color: '#002147' }}
                    />
                    <Bar dataKey="count" fill="#002147" name="Lượt mượn" radius={[2, 2, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            )}
            </div>
        </div>

        {/* Fines Trends Chart */}
        <div className="card-academic p-8 bg-white">
            <h3 className="text-xl font-serif font-bold text-oxford-blue mb-8 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-brass" />
            Biểu đồ Tiền phạt
            </h3>
            <div className="h-80 w-full">
            {loading ? (
                 <div className="h-full flex flex-col items-center justify-center gap-4">
                    <Loader2 className="h-8 w-8 text-oxford-blue animate-spin" />
                    <span className="text-[10px] font-mono font-black text-oxford-blue/40 uppercase tracking-widest">Đang tính toán tiền phạt...</span>
                </div>
            ) : (
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data.trends.revenue}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#00000005" vertical={false} />
                    <XAxis 
                        dataKey="month" 
                        stroke="#002147" 
                        fontSize={10} 
                        fontFamily="mono"
                        fontWeight="900"
                        axisLine={false}
                        tickLine={false}
                        dy={10}
                    />
                    <YAxis 
                        stroke="#002147" 
                        fontSize={10} 
                        fontFamily="mono"
                        fontWeight="900"
                        axisLine={false}
                        tickLine={false}
                        dx={-10}
                    />
                    <Tooltip 
                        contentStyle={{ backgroundColor: '#FCFBF7', border: '1px solid #00214710', borderRadius: '2px' }}
                        labelStyle={{ fontFamily: 'serif', fontWeight: 'bold', color: '#002147' }}
                    />
                    <Line type="monotone" dataKey="amount" stroke="#B5A642" strokeWidth={3} dot={{ r: 4, fill: '#002147' }} name="Tiền phạt (VND)" />
                    </LineChart>
                </ResponsiveContainer>
            )}
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
         <div className="card-academic p-8 bg-white">
            <h2 className="text-xl font-serif font-black text-oxford-blue mb-6 uppercase tracking-tight">Báo cáo đã xuất</h2>
            <div className="space-y-4">
               {[
                 { title: 'Báo cáo Thư viện Thường niên 2025', date: '31 Th12, 2025', size: '2.4 MB' },
                 { title: 'Phân tích Hoạt động Người dùng', date: '15 Th01, 2026', size: '1.1 MB' },
                 { title: 'Kiểm toán Mượn trả Hàng quý', date: '20 Th01, 2026', size: '3.8 MB' },
               ].map((doc, i) => (
                 <div key={i} className="flex justify-between items-center p-4 bg-parchment/30 rounded-academic border border-oxford-blue/5 hover:border-brass/30 transition-colors group cursor-pointer font-sans">
                   <div className="flex items-center gap-4">
                      <div className="bg-oxford-blue/10 p-2 rounded-academic group-hover:bg-brass/10 transition-colors">
                        <FileText className="h-4 w-4 text-oxford-blue group-hover:text-brass" />
                      </div>
                      <div>
                        <div className="text-sm font-black text-oxford-blue">{doc.title}</div>
                        <div className="text-[10px] font-mono font-black text-charcoal/50 flex gap-4 uppercase tracking-widest mt-1">
                          <span>Cập nhật: {doc.date}</span>
                          <span>{doc.size}</span>
                        </div>
                      </div>
                   </div>
                   <Download className="h-4 w-4 text-oxford-blue/20 group-hover:text-brass" />
                 </div>
               ))}
            </div>
         </div>

         <div className="card-academic p-8 bg-white">
            <h2 className="text-xl font-serif font-black text-oxford-blue mb-6 uppercase tracking-tight">Nhật ký Hệ thống</h2>
            <div className="space-y-6">
               {[
                 { event: 'Đồng bộ Cơ sở dữ liệu Hoàn tất', time: '10:45 SA', type: 'Hệ thống' },
                 { event: 'Đăng ký Thành viên mới (USR-8821)', time: '09:30 SA', type: 'Truy cập' },
                 { event: 'Quét kho sách Hoàn tất', time: '04:00 SA', type: 'Cập nhật' },
                 { event: 'Cập nhật Chính sách Hệ thống', time: 'Hôm qua', type: 'Quan trọng' },
               ].map((log, i) => (
                 <div key={i} className="flex gap-4 items-start font-sans">
                   <div className="mt-1 h-3 w-3 rounded-full bg-brass/20 flex items-center justify-center">
                     <div className="h-1.5 w-1.5 rounded-full bg-brass"></div>
                   </div>
                   <div>
                     <div className="text-xs font-black text-oxford-blue">{log.event}</div>
                     <div className="flex gap-4 mt-1">
                       <span className="text-[10px] font-mono font-black text-charcoal/50 uppercase tracking-widest">{log.time}</span>
                       <span className="text-[10px] font-mono font-black text-brass uppercase tracking-widest">{log.type}</span>
                     </div>
                   </div>
                 </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
};

export default Reports;
