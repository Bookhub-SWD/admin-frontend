import React, { useState, useEffect } from 'react';
import { X, Save, Loader2, User, Shield, Phone, MapPin, BadgeCheck } from 'lucide-react';
import api from '../services/api';
import { useSnackbar } from 'notistack';

interface Role {
  id: number;
  name: string;
}

interface User {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  address?: string;
  role_id: number;
  status: string;
}

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  user: User | null;
}

const EditUserModal: React.FC<EditUserModalProps> = ({ isOpen, onClose, onSuccess, user }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loadingRoles, setLoadingRoles] = useState(false);

  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    address: '',
    role_id: 0,
  });

  useEffect(() => {
    if (isOpen) {
      fetchRoles();
      if (user) {
        setFormData({
            full_name: user.full_name || '',
            phone: user.phone || '',
            address: user.address || '',
            role_id: user.role_id,
        });
      }
    }
  }, [isOpen, user]);

  const fetchRoles = async () => {
    setLoadingRoles(true);
    try {
      const res = await api.get('/users/roles');
      if (res.data.ok) {
        setRoles(res.data.data);
      }
    } catch (err) {
      console.error('EditUserModal: Error fetching roles', err);
    } finally {
      setLoadingRoles(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'role_id' ? parseInt(value) : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    try {
      const res = await api.put(`/users/${user.id}`, formData);
      if (res.data.ok) {
        enqueueSnackbar('User profile updated successfully!', { variant: 'success' });
        onSuccess();
        onClose();
      } else {
        enqueueSnackbar(res.data.message || 'Failed to update user', { variant: 'error' });
      }
    } catch (err: any) {
      console.error('EditUserModal: Error submitting form', err);
      enqueueSnackbar(err.response?.data?.message || 'Failed to update user', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-oxford-blue/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-parchment w-full max-w-xl max-h-[90vh] rounded-academic shadow-2xl flex flex-col overflow-hidden border border-oxford-blue/10">
        {/* Header */}
        <div className="p-6 border-b border-oxford-blue/10 flex justify-between items-center bg-white/50">
          <div>
            <h2 className="text-2xl font-serif font-black text-oxford-blue tracking-tight uppercase">Edit User Profile</h2>
            <p className="text-xs font-mono font-black text-brass uppercase tracking-widest mt-1">Update account information</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-oxford-blue/5 rounded-full transition-colors cursor-pointer">
            <X className="h-6 w-6 text-oxford-blue/40" />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-6">
          <div className="bg-white/40 p-4 rounded-academic border border-oxford-blue/5 mb-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-academic bg-oxford-blue text-parchment flex items-center justify-center text-xl font-serif font-black shadow-lg">
                {user.full_name?.[0] || user.email[0]}
              </div>
              <div>
                <p className="text-[10px] font-mono font-black text-charcoal/40 uppercase tracking-widest mb-1">Account Holder</p>
                <p className="text-sm font-serif font-black text-oxford-blue truncate max-w-[300px]">{user.email}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono font-black text-oxford-blue/60 uppercase tracking-widest flex items-center gap-2">
                <User className="h-3 w-3 text-brass" /> Full Name
              </label>
              <input
                required
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                className="w-full bg-white border border-oxford-blue/20 rounded-academic px-4 py-2.5 text-sm text-oxford-blue focus:outline-none focus:border-brass/30 font-serif font-bold shadow-sm"
              />
            </div>

            {/* Role */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono font-black text-oxford-blue/60 uppercase tracking-widest flex items-center gap-2">
                <Shield className="h-3 w-3 text-brass" /> User Role
              </label>
              <select
                name="role_id"
                value={formData.role_id}
                onChange={handleChange}
                className="w-full bg-white border border-oxford-blue/20 rounded-academic px-4 py-2.5 text-sm text-oxford-blue focus:outline-none focus:border-brass/30 font-mono font-black uppercase tracking-tight shadow-sm appearance-none cursor-pointer"
              >
                {roles.map(role => (
                  <option key={role.id} value={role.id}>{role.name}</option>
                ))}
              </select>
              {loadingRoles && <p className="text-[9px] font-mono animate-pulse text-brass">Querying role tiers...</p>}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono font-black text-oxford-blue/60 uppercase tracking-widest flex items-center gap-2">
                <Phone className="h-3 w-3 text-brass" /> Phone Number
              </label>
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full bg-white border border-oxford-blue/20 rounded-academic px-4 py-2.5 text-sm text-brass font-mono font-black focus:outline-none focus:border-brass/30 shadow-sm"
              />
            </div>

            {/* Status (Display Only) */}
            <div className="space-y-2 opacity-60">
              <label className="text-[10px] font-mono font-black text-oxford-blue/60 uppercase tracking-widest flex items-center gap-2">
                <BadgeCheck className="h-3 w-3 text-brass" /> Current Status
              </label>
              <div className="w-full bg-oxford-blue/5 border border-oxford-blue/10 rounded-academic px-4 py-2.5 text-xs text-oxford-blue font-mono font-black uppercase tracking-widest shadow-inner">
                {user.status}
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="space-y-2">
            <label className="text-[10px] font-mono font-black text-oxford-blue/60 uppercase tracking-widest flex items-center gap-2">
              <MapPin className="h-3 w-3 text-brass" /> Home Address
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows={3}
              className="w-full bg-white border border-oxford-blue/20 rounded-academic px-4 py-2.5 text-sm text-oxford-blue focus:outline-none focus:border-brass/30 font-serif shadow-sm resize-none"
            />
          </div>
        </form>

        {/* Footer */}
        <div className="p-6 border-t border-oxford-blue/10 flex justify-between items-center bg-white/50">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="text-xs font-mono font-black text-oxford-blue/60 uppercase tracking-widest hover:text-oxford-blue disabled:opacity-30 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !formData.full_name}
            className="btn-academic text-xs flex items-center gap-2 min-w-[150px] justify-center cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditUserModal;
