export const Routes = {
  auth: {
    login: '/(auth)/login',
    register: '/(auth)/register',
  },
  tabs: {
    root: '/(tabs)/(home)',
    home: {
      root: '/(tabs)/(home)',
      upload: '/(tabs)/(home)/upload',
    },
    profile: '/(tabs)/(profile)',
  },
} as const;
