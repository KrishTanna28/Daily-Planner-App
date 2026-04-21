import { useEffect } from 'react';
import { AppState } from 'react-native';

import { AppStack } from './AppStack';
import { AuthStack } from './AuthStack';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { hydrateSession } from '../redux/slices/authSlice';
import { applyDailyResetIfNeededThunk } from '../redux/slices/tasksSlice';
import { SplashScreen } from '../screens/auth/SplashScreen';

const getMillisecondsUntilNextLocalDay = () => {
  const now = new Date();
  const nextDay = new Date(now);
  nextDay.setHours(24, 0, 1, 0);

  return nextDay.getTime() - now.getTime();
};

export function RootNavigator() {
  const dispatch = useAppDispatch();
  const { isAuthenticated, isHydrating } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(hydrateSession());
  }, [dispatch]);

  useEffect(() => {
    if (isHydrating) {
      return;
    }

    void dispatch(applyDailyResetIfNeededThunk());

    let midnightResetTimer: ReturnType<typeof setTimeout>;
    const scheduleMidnightReset = () => {
      midnightResetTimer = setTimeout(() => {
        void dispatch(applyDailyResetIfNeededThunk());
        scheduleMidnightReset();
      }, getMillisecondsUntilNextLocalDay());
    };

    scheduleMidnightReset();

    const appStateSubscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        void dispatch(applyDailyResetIfNeededThunk());
      }
    });

    return () => {
      clearTimeout(midnightResetTimer);
      appStateSubscription.remove();
    };
  }, [dispatch, isHydrating]);

  if (isHydrating) {
    return <SplashScreen />;
  }

  return isAuthenticated ? <AppStack /> : <AuthStack />;
}
