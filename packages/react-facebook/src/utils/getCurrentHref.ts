const canUseDOM = !!(
  typeof window !== 'undefined' &&
  window.document &&
  window.document.createElement
);

export default function getCurrentHref() {
  if (!canUseDOM) {
    return 'https://www.facebook.com';
  }

  return window.location.href;
}
