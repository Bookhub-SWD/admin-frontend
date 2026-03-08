import { Download, FileText, TrendingUp, BookOpen, Clock, BarChart as BarIcon } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const circulationData = [
  { month: 'Jan', physical: 450, digital: 300 },
  { month: 'Feb', physical: 520, digital: 380 },
  { month: 'Mar', physical: 480, digital: 420 },
  { month: 'Apr', physical: 610, digital: 540 },
  { month: 'May', physical: 550, digital: 590 },
  { month: 'Jun', physical: 670, digital: 620 },
];

const Reports = () => {
  return (
    <div className="p-10 space-y-10 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex justify-between items-end border-b border-oxford-blue/10 pb-8">
        <div>
          <h1 className="text-4xl font-serif font-black text-oxford-blue mb-2 tracking-tight uppercase">Reports & Analytics</h1>
          <p className="text-charcoal/70 font-sans font-medium italic">View detailed reports on book circulation, user activity, and library health.</p>
        </div>
        <button className="btn-academic flex items-center gap-2 text-xs">
          <Download className="h-4 w-4" />
          Export Report (PDF)
        </button>
      </div>

      {/* Analytical Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {[
          { label: 'Circulation Growth', value: '+12.4%', icon: TrendingUp, color: 'text-brass' },
          { label: 'Avg Borrowing Time', value: '14 Days', icon: Clock, color: 'text-oxford-blue' },
          { label: 'Top Category', value: 'CS Research', icon: BookOpen, color: 'text-oxford-blue' },
          { label: 'System Accuracy', value: '99.2%', icon: FileText, color: 'text-brass' },
        ].map((stat, i) => (
          <div key={i} className="card-academic p-6 border-l-4 border-l-oxford-blue">
            <div className="flex items-center gap-4 mb-4">
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
              <span className="text-xs font-mono font-black text-charcoal/60 uppercase tracking-widest">{stat.label}</span>
            </div>
            <div className="text-3xl font-serif font-black text-oxford-blue">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Circulation Trends Chart */}
      <div className="card-academic p-8">
        <h3 className="text-xl font-serif font-bold text-oxford-blue mb-8 flex items-center gap-2">
          <BarIcon className="h-5 w-5 text-brass" />
          Physical vs Digital Circulation
        </h3>
        <div className="h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={circulationData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#00000005" vertical={false} />
              <XAxis 
                dataKey="month" 
                stroke="#002147" 
                fontSize={11} 
                fontFamily="mono"
                fontWeight="900"
                axisLine={false}
                tickLine={false}
                dy={10}
              />
              <YAxis 
                stroke="#002147" 
                fontSize={11} 
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
              <Legend verticalAlign="top" align="right" iconType="rect" wrapperStyle={{ paddingBottom: '30px', fontSize: '11px', fontFamily: 'mono', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em' }} />
              <Bar dataKey="physical" fill="#002147" name="Physical Books" radius={[2, 2, 0, 0]} />
              <Bar dataKey="digital" fill="#B5A642" name="Digital Copies" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
         <div className="card-academic p-8">
            <h2 className="text-xl font-serif font-black text-oxford-blue mb-6 uppercase tracking-tight">Exported Reports</h2>
            <div className="space-y-4">
               {[
                 { title: 'Annual Library Report 2025', date: 'Dec 31, 2025', size: '2.4 MB' },
                 { title: 'User Activity Analysis', date: 'Jan 15, 2026', size: '1.1 MB' },
                 { title: 'Quarterly Circulation Audit', date: 'Jan 20, 2026', size: '3.8 MB' },
               ].map((doc, i) => (
                 <div key={i} className="flex justify-between items-center p-4 bg-parchment/30 rounded-academic border border-oxford-blue/5 hover:border-brass/30 transition-colors group cursor-pointer font-sans">
                   <div className="flex items-center gap-4">
                      <div className="bg-oxford-blue/10 p-2 rounded-academic group-hover:bg-brass/10 transition-colors">
                        <FileText className="h-4 w-4 text-oxford-blue group-hover:text-brass" />
                      </div>
                      <div>
                        <div className="text-sm font-black text-oxford-blue">{doc.title}</div>
                        <div className="text-xs font-mono font-black text-charcoal/50 flex gap-4 uppercase tracking-widest mt-1">
                          <span>Verified: {doc.date}</span>
                          <span>{doc.size}</span>
                        </div>
                      </div>
                   </div>
                   <Download className="h-4 w-4 text-oxford-blue/20 group-hover:text-brass" />
                 </div>
               ))}
            </div>
         </div>

         <div className="card-academic p-8">
            <h2 className="text-xl font-serif font-black text-oxford-blue mb-6 uppercase tracking-tight">Activity Log</h2>
            <div className="space-y-6">
               {[
                 { event: 'Database Synchronization Finished', time: '10:45 AM', type: 'System' },
                 { event: 'New Member Registration (USR-8821)', time: '09:30 AM', type: 'Access' },
                 { event: 'Inventory Scan Finished', time: '04:00 AM', type: 'Update' },
                 { event: 'System Policy Updated', time: 'Yesterday', type: 'Critical' },
               ].map((log, i) => (
                 <div key={i} className="flex gap-4 items-start font-sans">
                   <div className="mt-1 h-3 w-3 rounded-full bg-brass/20 flex items-center justify-center">
                     <div className="h-1.5 w-1.5 rounded-full bg-brass"></div>
                   </div>
                   <div>
                     <div className="text-xs font-black text-oxford-blue">{log.event}</div>
                     <div className="flex gap-4 mt-1">
                       <span className="text-xs font-mono font-black text-charcoal/50 uppercase tracking-widest">{log.time}</span>
                       <span className="text-xs font-mono font-black text-brass uppercase tracking-widest">{log.type}</span>
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
