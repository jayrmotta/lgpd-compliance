// Authentication utility functions
// Used to reduce code duplication in pages

export const isLoggedIn = (): boolean => {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('isLoggedIn') === 'true';
};

export const getUserEmail = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('userEmail');
};

export const loginUser = (email: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('isLoggedIn', 'true');
  localStorage.setItem('userEmail', email);
};

export const logoutUser = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('authToken');
};

export const validateEmail = (email: string): boolean => {
  return /\S+@\S+\.\S+/.test(email);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 8;
};

export const validatePasswordStrong = (password: string): boolean => {
  // At least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return strongPasswordRegex.test(password);
};