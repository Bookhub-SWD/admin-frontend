import { useState, useEffect, useCallback } from 'react';
import { UserPlus, Search, Mail, Loader2, UserX, UserCheck, Edit3, ChevronLeft, ChevronRight, Eye, BadgeCheck, Shield, Users as UsersIcon, AlertCircle } from 'lucide-react';
import api from '../services/api';
import { useSnackbar } from 'notistack';
import EditUserModal from '../components/EditUserModal';
import AddUserModal from '../components/AddUserModal';
import UserDetailModal from '../components/UserDetailModal';

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
  avatar_url?: string;
}

const Users = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [roleId, setRoleId] = useState<string>('');
  const [roles, setRoles] = useState<{id: number, name: string}[]>([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    total_items: 0,
    limit: 10
  });
  const [failedAvatars, setFailedAvatars] = useState<Set<string>>(new Set());

  const fetchUsers = useCallback(async (page = 1, query = '') => {
    setLoading(true);
    try {
      const res = await api.get('/users', {
        params: {
          page,
          search: query,
          role_id: roleId,
          limit: pagination.limit
        }
      });
      if (res.data.ok) {
        setUsers(res.data.data.users);
        setPagination(res.data.data.pagination);
      }
    } catch (err) {
      console.error('Users: Error fetching data', err);
      enqueueSnackbar('Tải danh sách thất bại', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar, pagination.limit, roleId]);

  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const res = await api.get('/users/stats');
      if (res.data.ok) {
        setStats(res.data.data);
      }
    } catch (err) {
      console.error('Users: Error fetching stats', err);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  const fetchRoles = useCallback(async () => {
    try {
      const res = await api.get('/users/roles');
      if (res.data.ok) {
        setRoles(res.data.data);
      }
    } catch (err) {
      console.error('Users: Error fetching roles', err);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    fetchRoles();
  }, [fetchStats, fetchRoles]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers(1, search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search, roleId, fetchUsers]);

  const getRoleStyles = (roleName?: string) => {
    switch (roleName?.toUpperCase()) {
      case 'ADMIN':
        return 'bg-red-50 text-red-700 border border-red-100';
      case 'LIBRARIAN':
        return 'bg-brass/10 text-brass border border-brass/20';
      default:
        return 'bg-oxford-blue/5 text-oxford-blue/60 border border-oxford-blue/10';
    }
  };

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
          <h1 className="text-4xl font-serif font-black text-oxford-blue mb-2 tracking-tight uppercase">Quản lý Độc giả</h1>
          <p className="text-charcoal/70 font-sans font-medium italic">Quản lý độc giả thư viện, phân quyền và cấp độ truy cập.</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="btn-academic flex items-center gap-2 text-xs cursor-pointer"
        >
          <UserPlus className="h-4 w-4" />
          Thêm Độc giả
        </button>
      </div>

      {/* Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
         {/* Main content table */}
         <div className="lg:col-span-3 card-academic bg-white overflow-hidden shadow-2xl relative flex flex-col min-h-[600px]">
            <div className="p-6 bg-parchment/30 border-b border-oxford-blue/10 flex justify-between items-center">
              <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-oxford-blue/30" />
                <input 
                  type="text" 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Tìm kiếm theo Tên, Email hoặc CCCD..." 
                  className="bg-white border border-oxford-blue/20 rounded-academic pl-10 pr-4 py-3 text-xs text-charcoal focus:outline-none focus:border-brass/30 w-full font-sans font-semibold shadow-sm"
                />
              </div>
              <div className="flex gap-4 items-center">
                <select 
                  value={roleId}
                  onChange={(e) => setRoleId(e.target.value)}
                  className="bg-white border border-oxford-blue/20 rounded-academic px-4 py-3 text-xs text-charcoal focus:outline-none focus:border-brass/30 font-mono font-black uppercase tracking-widest cursor-pointer shadow-sm appearance-none min-w-[150px]"
                >
                  <option value="">Tất cả vai trò</option>
                  {roles.map(role => (
                    <option key={role.id} value={role.id}>{role.name}</option>
                  ))}
                </select>
                <div className="text-[10px] font-mono font-black text-brass uppercase tracking-[0.2em]">
                  Tổng số độc giả: {pagination.total_items}
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-oxford-blue text-parchment uppercase font-mono text-xs font-black tracking-[0.2em]">
                    <th className="px-8 py-5 border-r border-parchment/10">Độc giả</th>
                    <th className="px-8 py-5 border-r border-parchment/10">Vai trò</th>
                    <th className="px-8 py-5 border-r border-parchment/10">Trạng thái</th>
                    <th className="px-8 py-5 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-oxford-blue/5">
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="px-8 py-20 text-center">
                        <div className="flex flex-col items-center gap-4">
                          <Loader2 className="h-8 w-8 text-oxford-blue animate-spin" />
                          <span className="text-xs font-mono font-black text-oxford-blue/40 uppercase tracking-[0.3em]">Đang tìm kiếm...</span>
                        </div>
                      </td>
                    </tr>
                  ) : users.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-8 py-20 text-center font-mono font-black text-charcoal/40 uppercase italic tracking-widest">
                        Không tìm thấy dữ liệu.
                      </td>
                    </tr>
                  ) : (
                    users.map((user) => (
                      <tr key={user.id} className="hover:bg-parchment/50 transition-colors group">
                        <td className="px-8 py-6 border-r border-oxford-blue/5">
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-academic bg-oxford-blue/5 flex items-center justify-center font-serif font-bold text-oxford-blue border border-oxford-blue/10 overflow-hidden">
                              {user.avatar_url && !failedAvatars.has(user.id) ? (
                                <img 
                                  src={user.avatar_url} 
                                  alt={user.full_name} 
                                  className="h-full w-full object-cover" 
                                  onError={() => setFailedAvatars(prev => new Set(prev).add(user.id))}
                                />
                              ) : (
                                user.full_name?.[0] || user.email[0]
                              )}
                            </div>
                            <div>
                              <div className="text-base font-serif font-black text-oxford-blue tracking-tight leading-none group-hover:text-brass transition-colors truncate max-w-[200px]">{user.full_name || 'Vô danh'}</div>
                              <div className="text-[10px] font-mono font-black text-charcoal/50 flex items-center gap-1 mt-1 uppercase tracking-widest truncate max-w-[200px]">
                                <Mail className="h-3 w-3" /> {user.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6 border-r border-oxford-blue/5">
                          <div className="flex flex-col">
                            <span className={`text-[10px] font-mono font-black uppercase tracking-widest px-2 py-0.5 rounded-sm inline-block w-fit ${getRoleStyles(user.roles?.name)}`}>
                              {user.roles?.name || 'Độc giả'}
                            </span>
                            <span className="text-[9px] font-mono font-black text-charcoal/40 uppercase tracking-[0.2em] mt-1 shrink-0">UID: {user.id.substring(0, 8)}...</span>
                          </div>
                        </td>
                        <td className="px-8 py-6 border-r border-oxford-blue/5">
                           <div className="flex items-center gap-2">
                            <BadgeCheck className={`h-4 w-4 ${user.status === 'active' ? 'text-brass' : 'text-charcoal/40'}`} />
                            <span className={`text-[10px] font-mono font-black uppercase tracking-widest ${user.status === 'active' ? 'text-brass' : 'text-charcoal/60'}`}>
                              {user.status}
                            </span>
                           </div>
                        </td>
                        <td className="px-8 py-6 text-right">
                           <div className="flex justify-end gap-2">
                             <button 
                               onClick={() => {
                                 setSelectedUser(user);
                                 setIsDetailModalOpen(true);
                               }}
                               className="p-2 text-oxford-blue/20 hover:text-brass transition-colors border border-transparent hover:border-brass/20 rounded-academic cursor-pointer"
                               title="Xem chi tiết"
                             >
                                <Eye className="h-4 w-4" />
                             </button>
                             <button 
                               onClick={() => {
                                 setSelectedUser(user);
                                 setIsEditModalOpen(true);
                               }}
                               className="p-2 text-oxford-blue/20 hover:text-brass transition-colors border border-transparent hover:border-brass/20 rounded-academic cursor-pointer"
                               title="Chỉnh sửa"
                             >
                                <Edit3 className="h-4 w-4" />
                             </button>

                             <button 
                                onClick={() => toggleStatus(user)}
                                className={`p-2 transition-colors border border-transparent hover:border-red-200 rounded-academic cursor-pointer ${user.status === 'active' ? 'text-red-300 hover:text-red-500' : 'text-green-300 hover:text-green-500'}`}
                                title={user.status === 'active' ? 'Khoá tài khoản' : 'Mở khoá tài khoản'}
                             >
                                {user.status === 'active' ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
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
              <span>Trang {pagination.current_page} / {pagination.total_pages}</span>
              <div className="flex gap-4">
                <button 
                  onClick={() => fetchUsers(pagination.current_page - 1, search)}
                  disabled={pagination.current_page === 1 || loading}
                  className="p-2 hover:text-oxford-blue disabled:opacity-20 font-black cursor-pointer border border-transparent hover:border-oxford-blue/10 rounded-academic transition-colors"
                  title="Trang trước"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button 
                  onClick={() => fetchUsers(pagination.current_page + 1, search)}
                  disabled={pagination.current_page === pagination.total_pages || loading}
                  className="p-2 hover:text-oxford-blue disabled:opacity-20 font-black cursor-pointer border border-transparent hover:border-oxford-blue/10 rounded-academic transition-colors"
                  title="Trang sau"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
         </div>

         {/* Sidebar Utility Column */}
         <div className="space-y-8">
            {/* Quick Stats Card */}
            <div className="card-academic bg-oxford-blue p-8 text-parchment relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                  <BadgeCheck className="h-20 w-20" />
               </div>
               <h3 className="text-xs font-mono font-black uppercase tracking-[0.3em] text-brass mb-6">Tình trạng hệ thống</h3>
               <div className="space-y-6 relative z-10">
                  <div className="flex justify-between items-end">
                     <div>
                        <div className="text-[10px] font-mono font-black text-parchment/40 uppercase tracking-widest mb-1">Độc giả hoạt động</div>
                        <div className="text-3xl font-serif font-black">{stats?.active_users || 0}</div>
                     </div>
                     <div className="h-10 w-10 bg-white/10 rounded-academic flex items-center justify-center">
                        <UsersIcon className="h-5 w-5 text-brass" />
                     </div>
                  </div>
                  <div className="flex justify-between items-end">
                     <div>
                        <div className="text-[10px] font-mono font-black text-parchment/40 uppercase tracking-widest mb-1">Tài liệu quá hạn</div>
                        <div className="text-3xl font-serif font-black text-red-400">{stats?.overdue_users || 0}</div>
                     </div>
                     <div className="h-10 w-10 bg-red-400/10 rounded-academic flex items-center justify-center">
                        <AlertCircle className="h-5 w-5 text-red-400" />
                     </div>
                  </div>
               </div>
            </div>

            {/* Access Tier Distribution Card */}
            <div className="card-academic bg-white p-8 border border-oxford-blue/10">
               <div className="flex items-center gap-3 mb-8">
                  <Shield className="h-5 w-5 text-brass" />
                  <h3 className="text-sm font-serif font-black text-oxford-blue uppercase tracking-tight">Phân bổ vai trò</h3>
               </div>
               
               <div className="space-y-6">
                  {statsLoading ? (
                     Array.from({length: 3}).map((_, i) => (
                        <div key={i} className="h-12 bg-oxford-blue/5 animate-pulse rounded-academic"></div>
                     ))
                  ) : stats?.role_distribution?.map((role: any) => (
                     <div key={role.name} className="space-y-2">
                        <div className="flex justify-between items-end text-[10px] font-mono font-black uppercase tracking-widest">
                           <span className="text-oxford-blue/60">{role.name}</span>
                           <span className="text-brass">{role.count}</span>
                        </div>
                        <div className="h-1.5 w-full bg-oxford-blue/5 rounded-full overflow-hidden">
                           <div 
                              className="h-full bg-brass transition-all duration-1000 ease-out"
                              style={{ width: `${role.percentage}%` }}
                           ></div>
                        </div>
                     </div>
                  ))}
               </div>

               <div className="mt-10 pt-6 border-t border-oxford-blue/5">
                  <div className="flex justify-between text-[10px] font-mono font-black text-charcoal/40 uppercase tracking-widest">
                     <span>Tổng số thành viên</span>
                     <span>{stats?.total_users || 0}</span>
                  </div>
               </div>
            </div>
         </div>
      </div>

      <AddUserModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => fetchUsers(1, search)}
      />

      <EditUserModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={() => fetchUsers(pagination.current_page, search)}
        user={selectedUser}
      />

      <UserDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        user={selectedUser}
      />
    </div>
  );
};

export default Users;
