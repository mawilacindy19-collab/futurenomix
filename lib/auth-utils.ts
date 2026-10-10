import { useState, useEffect } from 'react';
import { auth, db } from './firebase';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';

export interface UserRole {
  isAdmin: boolean;
  role: string;
  loading: boolean;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return { user, loading };
}

export function useUserRole(): UserRole {
  const { user, loading: authLoading } = useAuth();
  const [roleInfo, setRoleInfo] = useState<UserRole>({
    isAdmin: false,
    role: 'Member',
    loading: true,
  });

  useEffect(() => {
    if (authLoading || !user) return;

    // Check admin status
    const adminRef = doc(db, 'admins', user.uid);
    const userRef = doc(db, 'users', user.uid);

    const unsubAdmin = onSnapshot(adminRef, (docSnap) => {
      const isAdmin = docSnap.exists();
      
      // Also get profile role
      getDoc(userRef).then((userSnap) => {
        const userData = userSnap.data();
        setRoleInfo({
          isAdmin,
          role: userData?.role || 'Member',
          loading: false,
        });
      }).catch((err) => {
        console.warn('Error fetching profile role from Firestore:', err);
        setRoleInfo({
          isAdmin,
          role: 'Member',
          loading: false,
        });
      });
    }, (err) => {
      console.warn('Error checking admin status:', err);
      setRoleInfo(prev => ({ ...prev, loading: false }));
    });

    return () => unsubAdmin();
  }, [user, authLoading]);

  if (authLoading) {
    return { isAdmin: false, role: 'Member', loading: true };
  }

  if (!user) {
    return { isAdmin: false, role: 'Guest', loading: false };
  }

  return roleInfo;
}
