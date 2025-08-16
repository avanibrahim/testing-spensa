// src/utils/notifications.js
export async function registerSW() {
  if ('serviceWorker' in navigator) {
    try {
      const reg = await navigator.serviceWorker.register('/sw.js');
      return reg;
    } catch (e) {
      console.error('SW register failed', e);
    }
  }
  return null;
}

export async function requestNotificationPermission() {
  if (!('Notification' in window)) return 'unsupported';
  if (Notification.permission === 'granted' || Notification.permission === 'denied') {
    return Notification.permission;
  }
  const res = await Notification.requestPermission();
  if (res === 'granted') localStorage.setItem('notifEnabled', '1');
  return res;
}

export async function showLocalNotification({ title, body, tag = 'alert', icon = '/icon-192.png' }) {
  if (!('Notification' in window) || Notification.permission !== 'granted') return false;
  try {
    const reg = await navigator.serviceWorker.getRegistration();
    if (reg?.showNotification) {
      await reg.showNotification(title, { body, tag, icon, badge: icon, renotify: true });
    } else {
      new Notification(title, { body, tag, icon });
    }
    navigator.vibrate?.([100, 50, 100]);
    return true;
  } catch (e) {
    console.error('showLocalNotification failed', e);
    return false;
  }
}
