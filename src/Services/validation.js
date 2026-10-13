// validation inputs

export const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const validateOTP = (otp) => {
  return /^[0-9]{6}$/.test(otp); // 6 أرقام فقط
};

export const validatePassword = (password) => {
  return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,20}$/.test(password);
};

