import { useState, useEffect } from 'react';
import { registerToastHandler } from '../utils/toast';

export default function Toast() {
  const [toast, setToast] = useState(null);

  useEffect(() => {
    registerToastHandler(setToast);
    return () => {
      registerToastHandler(null);
    };
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      setToast(null);
    }, 2800);
    return () => clearTimeout(timer);
  }, [toast]);

  if (!toast) return null;

  return (
    <div className={`global-toast-message ${toast.type}`}>
      <i className={`fa-solid ${toast.type === 'error' ? 'fa-circle-xmark' : toast.type === 'success' ? 'fa-circle-check' : 'fa-circle-info'}`}></i>
      <span>{toast.message}</span>
    </div>
  );
}
