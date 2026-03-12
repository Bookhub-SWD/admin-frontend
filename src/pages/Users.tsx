import { useState, useEffect, useCallback } from 'react';
import { UserPlus, Search, GraduationCap, ShieldCheck, Mail, MoreVertical, BadgeCheck, Loader2, UserX, UserCheck, Edit3, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../services/api';
import { useSnackbar } from 'notistack';
import EditUserModal from '../components/EditUserModal';


interface User {
  id: string;
  full_name: string;
  email: string;
  status: string;
  created_at: string;
  role_id: number;
  roles?: {
    id: number;
    name: string;
  };
}

const Users = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [pagination, setPagination] = useState({

    current_page: 1,
    total_pages: 1,
    total_items: 0,
    limit: 10
  });

  const fetchUsers = useCallback(async (page = 1, query = '') => {
    setLoading(true);
    try {
      const res = await api.get('/users', {
        params: {
          page,
          search: query,
          limit: pagination.limit
        }
      });
      if (res.data.ok) {
        setUsers(res.data.data.users);
        setPagination(res.data.data.pagination);
      }
    } catch (err) {
      console.error('Users: Error fetching data', err);
      enqueueSnackbar('Failed to load user archives', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar, pagination.limit]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers(1, search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search, fetchUsers]);

  const toggleStatus = async (user: User) => {
    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    try {
      const res = await api.patch(`/users/${user.id}/status`, { status: newStatus });
      if (res.data.ok) {
        enqueueSnackbar(res.data.message, { variant: 'success' });
        fetchUsers(pagination.current_page, search);
      }
    } catch (err: any) {
      enqueueSnackbar(err.response?.data?.message || 'Failed to update user status', { variant: 'error' });
    }
  };

  return (
    <div className="p-10 space-y-10 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex justify-between items-end border-b border-oxford-blue/10 pb-8">
        <div>
          <h1 className="text-4xl font-serif font-black text-oxford-blue mb-2 tracking-tight uppercase">User Management</h1>
          <p className="text-charcoal/70 font-sans font-medium italic">Management of library users, roles, and access levels.</p>
        </div>
        <button className="btn-academic flex items-center gap-2 text-xs cursor-pointer">
          <UserPlus className="h-4 w-4" />
          Add New User
        </button>
      </div>

      {/* Registry Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
         <div className="lg:col-span-3 card-academic bg-white overflow-hidden shadow-2xl relative flex flex-col min-h-[600px]">
            <div className="absolute inset-0 opacity-[0.01] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
            <div className="p-6 bg-parchment/30 border-b border-oxford-blue/10 flex justify-between items-center">
              <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-oxford-blue/30" />
                <input 
                  type="text" 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by Name, Email or Identity..." 
                  className="bg-white border border-oxford-blue/20 rounded-academic pl-10 pr-4 py-3 text-xs text-charcoal focus:outline-none focus:border-brass/30 w-full uppercase font-mono font-black tracking-widest shadow-sm"
                />
              </div>
              <div className="text-[10px] font-mono font-black text-brass uppercase tracking-[0.2em]">
                Total Records: {pagination.total_items}
              </div>
            </div>

            <div className="flex-1 overflow-x-auto">
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
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="px-8 py-20 text-center">
                        <div className="flex flex-col items-center gap-4">
                          <Loader2 className="h-8 w-8 text-oxford-blue animate-spin" />
                          <span className="text-xs font-mono font-black text-oxford-blue/40 uppercase tracking-[0.3em]">Accessing User Archives...</span>
                        </div>
                      </td>
                    </tr>
                  ) : users.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-8 py-20 text-center font-mono font-black text-charcoal/40 uppercase italic tracking-widest">
                        No subjects matching criteria found.
                      </td>
                    </tr>
                  ) : (
                    users.map((user) => (
                      <tr key={user.id} className="hover:bg-parchment/50 transition-colors group">
                        <td className="px-8 py-6 border-r border-oxford-blue/5">
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-academic bg-oxford-blue/5 flex items-center justify-center font-serif font-bold text-oxford-blue border border-oxford-blue/10">
                              {user.full_name?.[0] || user.email[0]}
                            </div>
                            <div>
                              <div className="text-base font-serif font-black text-oxford-blue tracking-tight leading-none group-hover:text-brass transition-colors truncate max-w-[200px]">{user.full_name || 'Anonymous'}</div>
                              <div className="text-[10px] font-mono font-black text-charcoal/50 flex items-center gap-1 mt-1 uppercase tracking-widest truncate max-w-[200px]">
                                <Mail className="h-3 w-3" /> {user.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6 border-r border-oxford-blue/5">
                          <div className="flex flex-col">
                            <span className="text-[10px] font-mono font-black text-oxford-blue uppercase tracking-widest bg-oxford-blue/5 px-2 py-0.5 rounded-sm inline-block w-fit">{user.roles?.name || 'User'}</span>
                            <span className="text-[9px] font-mono font-black text-charcoal/40 uppercase tracking-[0.2em] mt-1 shrink-0">UID: {user.id.substring(0, 8)}...</span>
                          </div>
                        </td>
                        <td className="px-8 py-6 border-r border-oxford-blue/5">
                          <button 
                            onClick={() => toggleStatus(user)}
                            className={`flex items-center gap-2 group/status cursor-pointer transition-transform active:scale-95`}
                          >
                            <BadgeCheck className={`h-4 w-4 ${user.status === 'active' ? 'text-brass' : 'text-charcoal/40'}`} />
                            <span className={`text-[10px] font-mono font-black uppercase tracking-widest ${user.status === 'active' ? 'text-brass' : 'text-charcoal/60'}`}>
                              {user.status}
                            </span>
                          </button>
                        </td>
                        <td className="px-8 py-6 text-right">
                           <div className="flex justify-end gap-2">
                             <button 
                               onClick={() => {
                                 setSelectedUser(user);
                                 setIsEditModalOpen(true);
                               }}
                               className="p-2 text-oxford-blue/20 hover:text-brass transition-colors border border-transparent hover:border-brass/20 rounded-academic cursor-pointer"
                               title="Modify User Information"
                             >
                                <Edit3 className="h-4 w-4" />
                             </button>

                             <button 
                                onClick={() => toggleStatus(user)}
                                className={`p-2 transition-colors border border-transparent hover:border-red-200 rounded-academic cursor-pointer ${user.status === 'active' ? 'text-red-300 hover:text-red-500' : 'text-green-300 hover:text-green-500'}`}
                                title={user.status === 'active' ? 'Deactivate Account' : 'Activate Account'}
                             >
                                {user.status === 'active' ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                             </button>
                             <button className="p-2 text-oxford-blue/10 hover:text-brass transition-colors cursor-pointer">
                                <MoreVertical className="h-4 w-4" />
                             </button>
                           </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="p-6 bg-parchment/10 border-t border-oxford-blue/5 flex justify-between items-center text-xs font-mono font-black text-charcoal/60 uppercase tracking-[0.3em]">
              <span>Page {pagination.current_page} of {pagination.total_pages}</span>
              <div className="flex gap-4">
                <button 
                  onClick={() => fetchUsers(pagination.current_page - 1, search)}
                  disabled={pagination.current_page === 1 || loading}
                  className="p-2 hover:text-oxford-blue disabled:opacity-20 font-black cursor-pointer border border-transparent hover:border-oxford-blue/10 rounded-academic transition-colors"
                  title="Previous Page"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button 
                  onClick={() => fetchUsers(pagination.current_page + 1, search)}
                  disabled={pagination.current_page === pagination.total_pages || loading}
                  className="p-2 hover:text-oxford-blue disabled:opacity-20 font-black cursor-pointer border border-transparent hover:border-oxford-blue/10 rounded-academic transition-colors"
                  title="Next Page"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
         </div>

         <div className="space-y-8">
            <div className="card-academic p-8 bg-oxford-blue border-t-4 border-brass relative overflow-hidden group">
               <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
               <div className="relative z-10 text-center">
                  <div className="bg-brass/20 p-4 rounded-academic inline-block mb-4">
                    <ShieldCheck className="h-8 w-8 text-brass" />
                  </div>
                  <h3 className="text-parchment font-serif font-black text-xl mb-2">User Audit</h3>
                  <p className="text-parchment/70 text-[10px] font-mono font-black uppercase tracking-widest mb-6 leading-relaxed">System integrity verification protocols active.</p>
                  <button className="w-full bg-brass text-oxford-blue font-black py-4 rounded-academic text-xs uppercase tracking-widest shadow-xl hover:bg-white hover:scale-[1.02] transition-all cursor-pointer">
                    Initiate User Audit
                  </button>
               </div>
            </div>

            <div className="card-academic p-8">
               <h3 className="text-sm font-serif font-bold text-oxford-blue mb-6 flex items-center gap-2 uppercase tracking-tight">
                  <GraduationCap className="h-4 w-4 text-brass" />
                  Access Tier Distribution
               </h3>
               <div className="space-y-6">
                  {[
                    { label: 'Administrative', count: users.filter(u => u.roles?.name === 'ADMIN').length, percent: 15 },
                    { label: 'Professional', count: users.filter(u => u.roles?.name === 'LIBRARIAN').length, percent: 45 },
                    { label: 'General Access', count: users.filter(u => u.roles?.name === 'MEMBER').length, percent: 40 },
                  ].map((tier, i) => (
                    <div key={i} className="space-y-2">
                       <div className="flex justify-between text-[10px] font-mono font-black uppercase tracking-[0.2em]">
                          <span className="text-charcoal/60">{tier.label}</span>
                          <span className="text-oxford-blue">{tier.count}</span>
                       </div>
                       <div className="h-1.5 bg-oxford-blue/5 rounded-full overflow-hidden">
                          <div className={`h-full bg-brass transition-all duration-1000`} style={{ width: `${(tier.count / (users.length || 1)) * 100}%` }}></div>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
         </div>
      </div>

      <EditUserModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={() => fetchUsers(pagination.current_page, search)}
        user={selectedUser}
      />
    </div>

  );
};

export default Users;
