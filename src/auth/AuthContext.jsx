import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api, tokenStore } from '../api/backend';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!tokenStore.get()) { setLoading(false); return undefined; }
    let active = true;
    api.me().then((profile) => active && setUser(profile))
      .catch(() => tokenStore.set(null))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, []);

  const value = useMemo(() => ({
    user,
    loading,
    async login(email, password) {
      const result = await api.login(email, password);
      tokenStore.set(result.token);
      setUser(result.user);
      return result.user;
    },
    async register(name, email, password) {
      const result = await api.register(name, email, password);
      tokenStore.set(result.token);
      setUser(result.user);
      return result.user;
    },
    logout() { tokenStore.set(null); setUser(null); },
    setUser,
  }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth ต้องใช้ภายใน AuthProvider');
  return context;
}
