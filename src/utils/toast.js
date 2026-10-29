let showToastFn = null;

export function registerToastHandler(fn) {
  showToastFn = fn;
}

export function notify(message, type = 'info') {
  if (showToastFn) {
    showToastFn({ message, type, id: Date.now() });
  }
}
