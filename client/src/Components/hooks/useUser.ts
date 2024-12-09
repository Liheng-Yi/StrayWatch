import { useAppSelector } from '../../store/hooks';
import { RootState } from '../../store';

export const useUser = () => {
  const user = useAppSelector((state: RootState) => state.user.currentUser);
  const isLoading = useAppSelector((state: RootState) => state.user.isLoading);
  const error = useAppSelector((state: RootState) => state.user.error);

  return {
    user,
    isLoading,
    error,
    isAuthenticated: !!user,
    role: user?.role,
    userId: user?._id,
  };
};