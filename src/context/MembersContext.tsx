'use client';

import { createContext, useContext, ReactNode, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';

export interface Member {
  id: string;
  userId: string;
  role: 'OWNER' | 'EMPLOYEE' | 'ADMIN';
  user: {
    name: string;
    email: string;
    image?: string | null;
    isActive: boolean;
  };
}

export interface CreateMemberData {
  name: string;
  email: string;
  password: string;
  role: string;
}

interface MembersContextType {
  members: Member[];
  isLoading: boolean;
  fetchMembers: () => Promise<void>;
  createMember: (data: CreateMemberData) => Promise<void>;
  updateMemberRole: (userId: string, role: string) => Promise<void>;
  updateMemberDetails: (userId: string, data: { name?: string; email?: string }) => Promise<void>;
  deleteMember: (userId: string) => Promise<void>;
}

const MembersContext = createContext<MembersContextType | undefined>(undefined);

interface MembersProviderProps {
  children: ReactNode;
}

export const MembersProvider = ({ children }: MembersProviderProps) => {
  const { data: session } = useSession();
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchMembers = useCallback(async () => {
    if (!session?.user.companyId || !session.accessToken) {
      throw new Error('Sesión o companyId no disponibles');
    }
    
    setIsLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/company-members/${session.user.companyId}`, {
        headers: { Authorization: `Bearer ${session.accessToken}` },
      });
      
      if (!res.ok) {
        throw new Error('No se pudieron cargar los miembros.');
      }
      
      const data = await res.json();
      setMembers(data);
    } catch (error) {
      console.error('Error fetching members:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [session?.user.companyId, session?.accessToken]);

  const createMember = useCallback(async (data: CreateMemberData) => {
    if (!session?.user.companyId || !session.accessToken) {
      throw new Error('Sesión o companyId no disponibles');
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/company-members/${session.user.companyId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error HTTP: ${response.status}`);
    }

  }, [session?.user.companyId, session?.accessToken]);

  const updateMemberRole = useCallback(async (userId: string, role: string) => {
    if (!session?.user.companyId || !session.accessToken) {
      throw new Error('Sesión o companyId no disponibles');
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/company-members/${session.user.companyId}/${userId}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify({ role }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error HTTP: ${response.status}`);
    }

    // Update local state
    setMembers(prev => 
      prev.map(member => 
        member.userId === userId 
          ? { ...member, role: role as 'OWNER' | 'EMPLOYEE' | 'ADMIN' } 
          : member
      )
    );
  }, [session?.user.companyId, session?.accessToken]);

  const updateMemberDetails = useCallback(async (userId: string, data: { name?: string; email?: string }) => {
    if (!session?.accessToken) {
      throw new Error('Sesión no disponible');
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error HTTP: ${response.status}`);
    }

    setMembers(prev => prev.map(m => m.userId === userId ? { ...m, user: { ...m.user, ...data } } : m));
  }, [session?.accessToken]);

  const deleteMember = useCallback(async (userId: string) => {
    if (!session?.user.companyId || !session.accessToken) {
      throw new Error('Sesión o companyId no disponibles');
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/company-members/${session.user.companyId}/${userId}`,
      {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${session.accessToken}` },
      }
    );

    if (!response.ok) {
      throw new Error('No se pudo eliminar al miembro.');
    }

    // Update local state
    setMembers(prev => prev.filter(member => member.userId !== userId));
  }, [session?.user.companyId, session?.accessToken]);

  const value = {
    members,
    isLoading,
    fetchMembers,
    createMember,
    updateMemberRole,
    updateMemberDetails,
    deleteMember,
  };

  return <MembersContext.Provider value={value}>{children}</MembersContext.Provider>;
};

export const useMembers = () => {
  const context = useContext(MembersContext);
  if (context === undefined) {
    throw new Error('useMembers must be used within a MembersProvider');
  }
  return context;
};