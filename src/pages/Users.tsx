import { UserPlus, Search, GraduationCap, ShieldCheck, Mail, MoreVertical, BadgeCheck } from 'lucide-react';

const users = [
  { id: 'USR-8821', name: 'Prof. Julian Wick', email: 'j.wick@bookhub.edu', role: 'Admin', status: 'Active', accessionDate: '2024-01-12' },
  { id: 'USR-4429', name: 'Dr. Sarah Connor', email: 's.connor@research.edu', role: 'Librarian', status: 'Active', accessionDate: '2024-05-20' },
  { id: 'USR-1033', name: 'James Moriarty', email: 'moriarty@napoleon.edu', role: 'Faculty', status: 'Suspended', accessionDate: '2025-02-01' },
  { id: 'USR-7751', name: 'Ada Lovelace', email: 'ada@computing.edu', role: 'Student', status: 'Active', accessionDate: '2023-11-15' },
];

const Users = () => {
  return (
    <div className="p-10 space-y-10 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex justify-between items-end border-b border-oxford-blue/10 pb-8">
        <div>
          <h1 className="text-4xl font-serif font-black text-oxford-blue mb-2 tracking-tight uppercase">User Management</h1>
          <p className="text-charcoal/70 font-sans font-medium italic">Management of library users, roles, and access levels.</p>
        </div>
        <button className="btn-academic flex items-center gap-2 text-xs">
          <UserPlus className="h-4 w-4" />
          Add New User
        </button>
      </div>

      {/* Registry Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
         <div className="lg:col-span-3 card-academic bg-white overflow-hidden shadow-2xl relative">
            <div className="absolute inset-0 opacity-[0.01] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
            <div className="p-6 bg-parchment/30 border-b border-oxford-blue/10 flex justify-between items-center">
              <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-oxford-blue/30" />
                <input 
                  type="text" 
                  placeholder="Search for Users..." 
                  className="bg-white border border-oxford-blue/20 rounded-academic pl-10 pr-4 py-2 text-xs text-charcoal focus:outline-none focus:border-brass/30 w-full uppercase font-mono font-black tracking-widest"
                />
              </div>
            </div>

            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-oxford-blue text-parchment uppercase font-mono text-xs font-black tracking-[0.2em]">
                  <th className="px-8 py-5 border-r border-parchment/10">User Details</th>
                  <th className="px-8 py-5 border-r border-parchment/10">User Role</th>
                  <th className="px-8 py-5 border-r border-parchment/10">Status</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-oxford-blue/5">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-parchment/50 transition-colors group">
                    <td className="px-8 py-6 border-r border-oxford-blue/5">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-academic bg-oxford-blue/5 flex items-center justify-center font-serif font-bold text-oxford-blue border border-oxford-blue/10">
                          {user.name.split(' ').pop()?.[0]}
                        </div>
                        <div>
                          <div className="text-base font-serif font-black text-oxford-blue tracking-tight leading-none group-hover:text-brass transition-colors">{user.name}</div>
                          <div className="text-xs font-mono font-black text-charcoal/50 flex items-center gap-1 mt-1 uppercase tracking-widest">
                            <Mail className="h-3 w-3" /> {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 border-r border-oxford-blue/5">
                      <div className="flex flex-col">
                        <span className="text-xs font-mono font-black text-oxford-blue uppercase tracking-widest bg-oxford-blue/5 px-2 py-0.5 rounded-sm inline-block w-fit">{user.role}</span>
                        <span className="text-xs font-sans font-black text-charcoal/40 uppercase tracking-[0.2em] mt-1">ID: {user.id}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 border-r border-oxford-blue/5">
                      <div className={`flex items-center gap-2 group/status`}>
                        <BadgeCheck className={`h-4 w-4 ${user.status === 'Active' ? 'text-brass' : 'text-charcoal/40'}`} />
                        <span className={`text-xs font-mono font-black uppercase tracking-widest ${user.status === 'Active' ? 'text-brass' : 'text-charcoal/60'}`}>
                          {user.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                       <button className="text-oxford-blue/10 hover:text-brass transition-colors">
                          <MoreVertical className="h-5 w-5" />
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
         </div>

         <div className="space-y-8">
            <div className="card-academic p-8 bg-oxford-blue border-t-4 border-brass relative overflow-hidden group">
               <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
               <div className="relative z-10 text-center">
                  <div className="bg-brass/20 p-4 rounded-academic inline-block mb-4">
                    <ShieldCheck className="h-8 w-8 text-brass" />
                  </div>
                  <h3 className="text-parchment font-serif font-black text-xl mb-2">User Audit</h3>
                  <p className="text-parchment/70 text-xs font-mono font-black uppercase tracking-widest mb-6">Last Identity Verification: Today 04:00 AM</p>
                  <button className="w-full bg-brass text-oxford-blue font-black py-4 rounded-academic text-xs uppercase tracking-widest shadow-xl hover:bg-white hover:scale-[1.02] transition-all">
                    Initiate User Audit
                  </button>
               </div>
            </div>

            <div className="card-academic p-8">
               <h3 className="text-sm font-serif font-bold text-oxford-blue mb-6 flex items-center gap-2 uppercase tracking-tight">
                  <GraduationCap className="h-4 w-4 text-brass" />
                  User Distribution
               </h3>
               <div className="space-y-4">
                  {[
                    { label: 'Admins', count: 12, percent: 15 },
                    { label: 'Librarians', count: 45, percent: 45 },
                    { label: 'Students', count: 128, percent: 40 },
                  ].map((tier, i) => (
                    <div key={i} className="space-y-2">
                       <div className="flex justify-between text-xs font-mono font-black uppercase tracking-[0.2em]">
                          <span className="text-charcoal/60">{tier.label}</span>
                          <span className="text-oxford-blue">{tier.count}</span>
                       </div>
                       <div className="h-1 bg-oxford-blue/5 rounded-full overflow-hidden">
                          <div className="h-full bg-oxford-blue opacity-30" style={{ width: `${tier.percent}%` }}></div>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Users;
