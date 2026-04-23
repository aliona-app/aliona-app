export function getEffectiveReadingMode(requestedMode, isTouchDevice, format) {
  if (format === 'pdf') return 'scroll';
  if (isTouchDevice) return 'scroll';
  return requestedMode === 'paginated' ? 'paginated' : 'scroll';
}
