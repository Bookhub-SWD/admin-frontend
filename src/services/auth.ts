import { supabase } from './supabase';

export interface UserProfile {
    id: string;
    full_name: string | null;
    email: string;
    roles: {
        id: number;
        name: string;
    } | null;
    avatar_url?: string | null;
}

export const getCurrentSession = async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
};

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
    const { data, error } = await supabase
        .from('users')
        .select('id, full_name, email, roles(id, name), avatar_url')
        .eq('id', userId)
        .single();

    if (error) {
        console.error('Error fetching user profile from public.users:', error);
        return null;
    }

    return data as any;
};

export const signOut = async () => {
    // Clear all Bookhub related storage
    Object.keys(localStorage).forEach(key => {
        if (key.startsWith('bookhub_')) {
            localStorage.removeItem(key);
        }
    });
    try {
        const { error } = await supabase.auth.signOut();
        if (error) console.warn('Supabase signout warning:', error);
    } catch (e) {
        console.warn('Supabase signout caught error:', e);
    }
};
