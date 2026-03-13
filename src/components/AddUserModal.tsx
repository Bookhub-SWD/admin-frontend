import React, { useState, useEffect } from 'react';
import { X, UserPlus, Loader2, User, Shield, Phone, MapPin, Mail, CreditCard } from 'lucide-react';
import api from '../services/api';
import { useSnackbar } from 'notistack';

interface Role {
  id: number;
  name: string;
}

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddUserModal: React.FC<AddUserModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loadingRoles, setLoadingRoles] = useState(false);

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    identity_code: '',
    phone: '',
    address: '',
    role_id: 3, // Default to Member
  });

  useEffect(() => {
    if (isOpen) {
      fetchRoles();
      // Reset form when opening
      setFormData({
        full_name: '',
        email: '',
        identity_code: '',
        phone: '',
        address: '',
        role_id: 3,
      });
    }
  }, [isOpen]);

  const fetchRoles = async () => {
    setLoadingRoles(true);
    try {
      const res = await api.get('/users/roles');
      if (res.data.ok) {
        setRoles(res.data.data);
      }
    } catch (err) {
      console.error('AddUserModal: Error fetching roles', err);
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
    if (!formData.email || !formData.full_name) {
      enqueueSnackbar('Full Name and Email are required', { variant: 'warning' });
      return;
    }
    
    setLoading(true);

    try {
      const res = await api.post('/users', formData);
      if (res.data.ok) {
        enqueueSnackbar('User created successfully!', { variant: 'success' });
        onSuccess();
        onClose();
      } else {
        enqueueSnackbar(res.data.message || 'Failed to create user', { variant: 'error' });
      }
    } catch (err: any) {
      console.error('AddUserModal: Error submitting form', err);
      enqueueSnackbar(err.response?.data?.message || 'Failed to create user', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-oxford-blue/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-parchment w-full max-w-2xl max-h-[90vh] rounded-academic shadow-2xl flex flex-col overflow-hidden border border-oxford-blue/10">
        {/* Header */}
        <div className="p-6 border-b border-oxford-blue/10 flex justify-between items-center bg-white/50">
          <div>
            <h2 className="text-2xl font-serif font-black text-oxford-blue tracking-tight uppercase">Enter New Subject</h2>
            <p className="text-xs font-mono font-black text-brass uppercase tracking-widest mt-1">Personnel Registry Induction</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-oxford-blue/5 rounded-full transition-colors cursor-pointer">
            <X className="h-6 w-6 text-oxford-blue/40" />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-6">
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
                placeholder="PROF. JOHN DOE"
                className="w-full bg-white border border-oxford-blue/20 rounded-academic px-4 py-2.5 text-sm text-oxford-blue focus:outline-none focus:border-brass/30 font-serif font-bold shadow-sm uppercase placeholder:opacity-20"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono font-black text-oxford-blue/60 uppercase tracking-widest flex items-center gap-2">
                <Mail className="h-3 w-3 text-brass" /> Academic Email
              </label>
              <input
                required
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="subject@university.edu"
                className="w-full bg-white border border-oxford-blue/20 rounded-academic px-4 py-2.5 text-sm text-oxford-blue focus:outline-none focus:border-brass/30 font-mono font-black shadow-sm placeholder:opacity-20 lowercase"
              />
            </div>

            {/* Role */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono font-black text-oxford-blue/60 uppercase tracking-widest flex items-center gap-2">
                <Shield className="h-3 w-3 text-brass" /> Authorization Tier
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

            {/* Identity Code */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono font-black text-oxford-blue/60 uppercase tracking-widest flex items-center gap-2">
                <CreditCard className="h-3 w-3 text-brass" /> Identity Code
              </label>
              <input
                name="identity_code"
                value={formData.identity_code}
                onChange={handleChange}
                placeholder="ID-000-000"
                className="w-full bg-white border border-oxford-blue/20 rounded-academic px-4 py-2.5 text-sm text-brass font-mono font-black focus:outline-none focus:border-brass/30 shadow-sm uppercase"
              />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono font-black text-oxford-blue/60 uppercase tracking-widest flex items-center gap-2">
                <Phone className="h-3 w-3 text-brass" /> Communication Line
              </label>
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+00 (0) 000 000"
                className="w-full bg-white border border-oxford-blue/20 rounded-academic px-4 py-2.5 text-sm text-oxford-blue font-mono font-black focus:outline-none focus:border-brass/30 shadow-sm"
              />
            </div>
          </div>

          {/* Address */}
          <div className="space-y-2">
            <label className="text-[10px] font-mono font-black text-oxford-blue/60 uppercase tracking-widest flex items-center gap-2">
              <MapPin className="h-3 w-3 text-brass" /> Residentiary Detail
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows={3}
              placeholder="Full address of the subject..."
              className="w-full bg-white border border-oxford-blue/20 rounded-academic px-4 py-2.5 text-sm text-oxford-blue focus:outline-none focus:border-brass/30 font-serif shadow-sm resize-none placeholder:opacity-20"
            />
          </div>

          <div className="bg-brass/5 p-4 rounded-academic border border-brass/10 border-dashed">
            <p className="text-[9px] font-mono font-black text-brass uppercase leading-relaxed text-center">
              Note: Manually inducted users must authenticate via Google using their registered email to access the system.
            </p>
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
            Abort Induction
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !formData.full_name || !formData.email}
            className="btn-academic text-xs flex items-center gap-2 min-w-[200px] justify-center cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing Registry...
              </>
            ) : (
              <>
                <UserPlus className="h-4 w-4" />
                Induct New Subject
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddUserModal;
