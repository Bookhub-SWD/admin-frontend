import { TrendingUp, GraduationCap, Archive, Award, Newspaper, Library } from 'lucide-react';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';

const peakData = [
  { name: 'Mon', count: 400 },
  { name: 'Tue', count: 300 },
  { name: 'Wed', count: 600 },
  { name: 'Thu', count: 800 },
  { name: 'Fri', count: 500 },
  { name: 'Sat', count: 900 },
  { name: 'Sun', count: 700 },
];

const collectionData = [
  { name: 'Scientific Research', value: 450 },
  { name: 'Classical Literature', value: 300 },
  { name: 'Economic Theory', value: 300 },
  { name: 'Periodicals', value: 150 },
];

const SCHOLARLY_COLORS = ['#002147', '#B5A642', '#1A1A1A', '#4A5568'];

const Dashboard = () => {
  return (
    <div className="p-10 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="flex justify-between items-end border-b border-oxford-blue/10 pb-8">
        <div>
          <h1 className="text-4xl font-serif font-black text-oxford-blue mb-2 tracking-tight">Librarian Dashboard</h1>
          <p className="text-charcoal/70 font-sans italic">Management metrics for the library operations.</p>
        </div>
        <div className="text-right">
          <div className="text-xs font-mono font-black text-brass uppercase tracking-widest mb-1">Status: Operational</div>
          <div className="text-xs text-charcoal/60 font-medium tracking-tight">Last updated: {new Date().toLocaleTimeString()}</div>
        </div>
      </div>

      {/* Primary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: 'Total Books', value: '12,450', icon: Library, color: 'text-oxford-blue', subtitle: 'Books in Collection' },
          { label: 'Active Users', value: '3,210', icon: GraduationCap, color: 'text-oxford-blue', subtitle: 'Registered Members' },
          { label: 'Pending Returns', value: '45', icon: Archive, color: 'text-brass', subtitle: 'Overdue items' },
          { label: 'Today Loans', value: '128', icon: Award, color: 'text-oxford-blue', subtitle: 'New Transactions' },
        ].map((stat, i) => (
          <div key={i} className="card-academic p-6 border-t-4 border-t-oxford-blue group hover:border-t-brass transition-all duration-500">
            <div className="flex items-center justify-between mb-4">
               <div className="bg-parchment p-3 rounded-academic border border-oxford-blue/5 group-hover:scale-110 transition-transform">
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
               </div>
               <span className="text-xs font-mono font-black text-charcoal/50 uppercase tracking-[0.2em]">{stat.label}</span>
            </div>
            <div className="text-4xl font-serif font-black text-oxford-blue mb-1">{stat.value}</div>
            <div className="text-xs font-sans font-bold text-charcoal/70 uppercase tracking-widest">{stat.subtitle}</div>
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
                Borrowing Trends
              </h3>
              <p className="text-xs text-charcoal/60 font-medium tracking-tight">Weekly book loan distribution.</p>
            </div>
            <select className="bg-parchment border-none text-xs font-mono font-black uppercase tracking-widest focus:ring-0 cursor-pointer">
              <option>Last 7 Days</option>
              <option>This Month</option>
            </select>
          </div>
          
          <div className="h-80 w-full">
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
          </div>
        </div>

        <div className="card-academic p-8 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-serif font-bold text-oxford-blue mb-1 flex items-center gap-2">
              <Newspaper className="h-5 w-5 text-brass" />
              Book Categories
            </h3>
            <p className="text-xs text-charcoal/40 font-medium mb-8">Inventory distribution by category.</p>
          </div>

          <div className="h-64 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={collectionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={90}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                >
                  {collectionData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={SCHOLARLY_COLORS[index % SCHOLARLY_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ backgroundColor: '#FCFBF7', border: '1px solid #00214710', borderRadius: '2px' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <div className="text-2xl font-serif font-black text-oxford-blue">12.4k</div>
                <div className="text-[11px] font-mono font-black text-charcoal/50 uppercase tracking-[0.2em]">Total Books</div>
              </div>
            </div>
          </div>

          <div className="mt-8 space-y-3">
             {collectionData.map((item, i) => (
               <div key={i} className="flex justify-between items-center text-xs font-mono font-black uppercase tracking-widest">
                 <div className="flex items-center gap-2">
                   <div className="h-2 w-2" style={{ backgroundColor: SCHOLARLY_COLORS[i] }}></div>
                   <span className="text-charcoal/80 font-bold">{item.name}</span>
                 </div>
                 <span className="text-oxford-blue font-black">{item.value}</span>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
