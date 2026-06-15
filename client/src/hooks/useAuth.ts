import { useAuthContext } from '../context/AuthContext.tsx';

export const useAuth = () => {
  const context = useAuthContext();
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return {
    user: context.user,
    token: context.token,
    login: context.login,
    logout: context.logout,
    isAuthenticated: context.isAuthenticated,
  };
};

export default useAuth;
