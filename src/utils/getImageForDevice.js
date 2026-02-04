export default function getImageForDevice() {
  // Allow manual override for testing via query string: ?device=android or ?device=iphone
  try {
    const params = new URLSearchParams(window.location.search);
    const forced = params.get('device');
    if (forced === 'android') return '/images/android_size/mainbga.png';
    if (forced === 'iphone') return '/images/iphone_size/mainbgi.png';
  } catch (e) { /* ignore */ }

  const ANDROID_PATH = '/images/android_size/mainbga.png';
  const IPHONE_PATH = '/images/iphone_size/mainbgi.png';

  // Prefer modern client hints when available
  const uaData = navigator.userAgentData;
  if (uaData) {
    const platform = (uaData.platform || '').toLowerCase();
    if (platform.includes('android')) return ANDROID_PATH;
    if (/ios|iphone|ipad|ipod/.test(platform)) return IPHONE_PATH;

    if (typeof uaData.mobile === 'boolean' && uaData.mobile === true) {
      const ua = navigator.userAgent || '';
      if (/android/i.test(ua)) return ANDROID_PATH;
      if (/iphone|ipad|ipod/i.test(ua)) return IPHONE_PATH;
    }
  }

  // Classic UA fallback
  const ua = navigator.userAgent || navigator.vendor || window.opera || '';
  if (/android/i.test(ua)) return ANDROID_PATH;
  if (/iphone|ipod/i.test(ua)) return IPHONE_PATH;

  // iPadOS (iPadOS 13+) may present as MacIntel; detect touchscreen + Mac platform
  if (navigator.platform === 'MacIntel' && navigator.maxTouchPoints && navigator.maxTouchPoints > 1) {
    return IPHONE_PATH;
  }

  // Final fallback
  return ANDROID_PATH;
}
