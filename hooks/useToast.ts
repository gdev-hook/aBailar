import Toast from 'react-native-toast-message';

export function useToast() {
  const showToast = (
    type: 'success' | 'error' | 'info',
    text1: string,
    text2?: string
  ) => {
    Toast.show({
      type,
      text1,
      text2,
      position: 'bottom',
      visibilityTime: 4000,
      autoHide: true,
      bottomOffset: 40,
    });
  };

  return {
    showSuccess: (title: string, message?: string) =>
      showToast('success', title, message),
    showError: (title: string, message?: string) =>
      showToast('error', title, message),
    showInfo: (title: string, message?: string) =>
      showToast('info', title, message),
  };
}
