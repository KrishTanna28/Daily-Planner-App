import { useEffect } from 'react';

import { AppStack } from './AppStack';
import { AuthStack } from './AuthStack';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { hydrateSession } from '../redux/slices/authSlice';
import { SplashScreen } from '../screens/auth/SplashScreen';

export function RootNavigator() {
  const dispatch = useAppDispatch();
  const { isAuthenticated, isHydrating } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(hydrateSession());
  }, [dispatch]);

  if (isHydrating) {
    return <SplashScreen />;
  }

  return isAuthenticated ? <AppStack /> : <AuthStack />;
}
