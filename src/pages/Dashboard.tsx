import { TrendingUp, GraduationCap, Archive, Newspaper, Library, Loader2 } from 'lucide-react';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { useState, useEffect } from 'react';
import api from '../services/api';



const SCHOLARLY_COLORS = ['#002147', '#B5A642', '#1A1A1A', '#4A5568', '#2D4A22', '#6B2D5C', '#326685'];

const Dashboard = () => {
  const [peakData, setPeakData] = useState<{ name: string; count: number }[]>([]);
  const [categoryData, setCategoryData] = useState<{ name: string; count: number; color: string }[]>([]);
  const [summaryData, setSummaryData] = useState({
    total_books: 0,
    currently_borrowed: 0,
    overdue_items: 0,
    unpaid_fines: 0,
    active_users: 0,
    borrowed_today: 0
  });
  const [recentActivity, setRecentActivity] = useState<{id: string, user: {name: string}, book: string, action: string, date: string, status: string}[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    
    // Safety valve: ensure loading screen clears eventually (max 10 seconds)
    const safetyTimeout = setTimeout(() => {
      if (mounted && loading) {
        console.warn('Dashboard: Safety valve triggered, clearing loader.');
        setLoading(false);
      }
    }, 10000);

    const fetchData = async () => {
      if (!mounted) return;
      console.log('Dashboard: [FETCH_START]');
      try {
        const trendsPromise = api.get('/stats/borrowing-trends');
        const statsPromise = api.get('/stats/dashboard');
        
        console.log('Dashboard: Requests initiated, awaiting responses...');
        
        const [trendsRes, statsRes] = await Promise.all([
          trendsPromise.catch(err => {
            console.error('Dashboard: [TRENDS_ERROR]', err.message || err);
            return { data: { ok: false } };
          }),
          statsPromise.catch(err => {
            console.error('Dashboard: [STATS_ERROR]', err.message || err);
            return { data: { ok: false } };
          })
        ]);

        if (!mounted) return;

        console.log('Dashboard: [FETCH_COMPLETE]', { 
          trends_ok: trendsRes.data?.ok, 
          stats_ok: statsRes.data?.ok 
        });

        if (trendsRes.data?.ok) {
          setPeakData(trendsRes.data.data);
        }
        
        if (statsRes.data?.ok) {
          setSummaryData(statsRes.data.data.summary);
          if (statsRes.data.data.book_categories) {
            setCategoryData(statsRes.data.data.book_categories);
          }
          if (statsRes.data.data.recent_activity) {
            setRecentActivity(statsRes.data.data.recent_activity);
          }
        }
        
        // If we didn't get OK from both (perhaps auth was still linking), 
        // we could optionally retry here, but the safety valve handles the UI freeze.
      } catch (err: any) {
        console.error('Dashboard: [CRITICAL_ERROR]', err.message || err);
      } finally {
        if (mounted) {
          console.log('Dashboard: [FETCH_FINALLY] setting loading to false');
          setLoading(false);
          clearTimeout(safetyTimeout);
        }
      }
    };
    
    fetchData();

    return () => {
      mounted = false;
      clearTimeout(safetyTimeout);
    };
  }, []);
  return (
    <div className="p-10 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="flex justify-between items-end border-b border-oxford-blue/10 pb-8">
        <div>
          <h1 className="text-4xl font-serif font-black text-oxford-blue mb-2 tracking-tight">Bảng điều khiển Thủ thư</h1>
          <p className="text-charcoal/70 font-sans italic">Các chỉ số quản lý hoạt động thư viện.</p>
        </div>
        <div className="text-right">
          <div className="text-xs font-mono font-black text-brass uppercase tracking-widest mb-1">Trạng thái: Hoạt động</div>
          <div className="text-xs text-charcoal/60 font-medium tracking-tight">Cập nhật lần cuối: {new Date().toLocaleTimeString()}</div>
        </div>
      </div>

      {/* Primary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: 'Tổng số sách', value: (summaryData.total_books || 0).toLocaleString(), icon: Library, color: 'text-oxford-blue', subtitle: 'Sách trong thư viện' },
          { label: 'Độc giả hoạt động', value: (summaryData.active_users || 0).toLocaleString(), icon: GraduationCap, color: 'text-oxford-blue', subtitle: 'Thành viên đã xác minh' },
          { label: 'Mượn hôm nay', value: (summaryData.borrowed_today || 0).toLocaleString(), icon: Newspaper, color: 'text-brass', subtitle: 'Lưu thông trong ngày' },
          { label: 'Sách đang mượn', value: (summaryData.currently_borrowed || 0).toLocaleString(), icon: Archive, color: 'text-oxford-blue', subtitle: 'Lượt mượn hiện tại' },
        ].map((stat, i) => (
          <div key={i} className="card-academic p-6 border-t-4 border-t-oxford-blue group hover:border-t-brass transition-all duration-500 bg-white">
            <div className="flex items-center justify-between mb-4">
               <div className="bg-parchment p-3 rounded-academic border border-oxford-blue/5 group-hover:scale-110 transition-transform">
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
               </div>
               <span className="text-[10px] font-mono font-black text-charcoal/50 uppercase tracking-[0.2em]">{stat.label}</span>
            </div>
            <div className="text-4xl font-serif font-black text-oxford-blue mb-1">{loading ? '...' : stat.value}</div>
            <div className="text-[10px] font-sans font-bold text-charcoal/70 uppercase tracking-widest">{stat.subtitle}</div>
          </div>
        ))}
      </div>

      {/* Analytical Visuals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 card-academic p-8">
          <div className="flex justify-between items-start mb-10">
            <div>
              <h3 className="text-xl font-serif font-bold text-oxford-blue mb-1 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-brass" />
                Xu hướng mượn sách
              </h3>
              <p className="text-xs text-charcoal/60 font-medium tracking-tight">Phân bổ mượn sách hàng tuần.</p>
            </div>
            <select className="bg-parchment border-none text-xs font-mono font-black uppercase tracking-widest focus:ring-0 cursor-pointer">
              <option>7 ngày qua</option>
              <option>Tháng này</option>
            </select>
          </div>
          
          <div className="h-80 w-full relative">
            {loading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-parchment/10 backdrop-blur-[2px] z-10">
                <div className="flex flex-col items-center gap-4">
                  <Loader2 className="h-8 w-8 text-oxford-blue animate-spin" />
                  <span className="text-xs font-mono font-black text-oxford-blue/40 uppercase tracking-[0.3em]">Đang tải...</span>
                </div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={peakData}>
                  <defs>
                    <linearGradient id="colorLoan" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#002147" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#002147" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#00000008" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    stroke="#002147" 
                    fontSize={10} 
                    fontWeight="bold"
                    axisLine={false}
                    tickLine={false}
                    dy={10}
                  />
                  <YAxis 
                    stroke="#002147" 
                    fontSize={10} 
                    fontWeight="bold"
                    axisLine={false}
                    tickLine={false}
                    dx={-10}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#FCFBF7', border: '1px solid #00214710', borderRadius: '2px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}
                    labelStyle={{ fontFamily: 'serif', fontWeight: 'bold', color: '#002147' }}
                  />
                  <Area type="monotone" dataKey="count" stroke="#002147" fillOpacity={1} fill="url(#colorLoan)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="card-academic p-8 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-serif font-bold text-oxford-blue mb-1 flex items-center gap-2">
              <Newspaper className="h-5 w-5 text-brass" />
              Danh mục sách
            </h3>
            <p className="text-xs text-charcoal/40 font-medium mb-8">Phân bổ kho sách theo danh mục.</p>
          </div>

          <div className="h-64 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData.length > 0 ? categoryData : [{ name: 'Đang tải...', count: 1 }]}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={90}
                  paddingAngle={8}
                  dataKey="count"
                  stroke="none"
                >
                  {categoryData.length > 0 ? categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color || SCHOLARLY_COLORS[index % SCHOLARLY_COLORS.length]} />
                  )) : <Cell fill="#e2e8f0" />}
                </Pie>
                <Tooltip 
                   contentStyle={{ backgroundColor: '#FCFBF7', border: '1px solid #00214710', borderRadius: '2px' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <div className="text-2xl font-serif font-black text-oxford-blue">{loading ? '...' : (summaryData.total_books || 0).toLocaleString()}</div>
                <div className="text-[11px] font-mono font-black text-charcoal/50 uppercase tracking-[0.2em]">Tổng số sách</div>
              </div>
            </div>
          </div>

          <div className="mt-8 space-y-3">
             {categoryData.map((item, i) => (
               <div key={i} className="flex justify-between items-center text-xs font-mono font-black uppercase tracking-widest">
                 <div className="flex items-center gap-2">
                   <div className="h-2 w-2" style={{ backgroundColor: item.color || SCHOLARLY_COLORS[i % SCHOLARLY_COLORS.length] }}></div>
                   <span className="text-charcoal/80 font-bold max-w-[150px] truncate" title={item.name}>{item.name}</span>
                 </div>
                 <span className="text-oxford-blue font-black">{item.count}</span>
               </div>
             ))}
             {!loading && categoryData.length === 0 && (
                <div className="text-center text-xs text-charcoal/50 italic py-4">Không tìm thấy danh mục.</div>
             )}
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="card-academic p-8 bg-white">
        <h3 className="text-xl font-serif font-bold text-oxford-blue mb-8 uppercase tracking-tight flex items-center gap-2">
            <Archive className="h-5 w-5 text-brass" />
            Nhật ký hoạt động
        </h3>
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-oxford-blue text-parchment uppercase font-mono text-[10px] font-black tracking-[0.2em]">
                        <th className="px-6 py-4 border-r border-parchment/10">Thành viên</th>
                        <th className="px-6 py-4 border-r border-parchment/10">Hành động</th>
                        <th className="px-6 py-4 border-r border-parchment/10">Tài liệu</th>
                        <th className="px-6 py-4 border-r border-parchment/10 font-black">Thời gian</th>
                        <th className="px-6 py-4 text-right">Trạng thái</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-oxford-blue/5">
                    {loading ? (
                        <tr><td colSpan={5} className="p-10 text-center animate-pulse font-mono text-xs uppercase tracking-widest text-oxford-blue/40">Đang truy xuất dữ liệu...</td></tr>
                    ) : recentActivity.length === 0 ? (
                        <tr><td colSpan={5} className="p-10 text-center font-serif italic text-charcoal/30">Không có giao dịch gần đây.</td></tr>
                    ) : (
                        recentActivity.map((act) => (
                            <tr key={act.id} className="hover:bg-parchment/30 transition-colors">
                                <td className="px-6 py-4 border-r border-oxford-blue/5">
                                    <div className="text-sm font-serif font-black text-oxford-blue">{act.user.name}</div>
                                </td>
                                <td className="px-6 py-4 border-r border-oxford-blue/5">
                                    <span className={`text-[10px] font-mono font-black uppercase tracking-widest px-2 py-0.5 rounded-sm ${
                                        act.action === 'Return' ? 'bg-green-100 text-green-700' : 
                                        act.action === 'Borrow' ? 'bg-blue-100 text-blue-700' : 
                                        'bg-brass/10 text-brass'
                                    }`}>
                                        {act.action}
                                    </span>
                                </td>
                                <td className="px-6 py-4 border-r border-oxford-blue/5">
                                    <div className="text-xs font-sans font-bold text-oxford-blue/80 italic line-clamp-1">{act.book}</div>
                                </td>
                                <td className="px-6 py-4 border-r border-oxford-blue/5">
                                    <div className="text-[10px] font-mono font-black text-charcoal/60 uppercase">{act.date}</div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <span className={`text-[10px] font-mono font-black uppercase tracking-widest ${
                                        act.status === 'Completed' ? 'text-green-600' : 
                                        act.status === 'Active' ? 'text-blue-600' : 'text-brass'
                                    }`}>
                                        {act.status}
                                    </span>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
