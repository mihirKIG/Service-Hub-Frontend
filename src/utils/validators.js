// Validation utility functions
export const validators = {
  // Email validation
  isValidEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Phone validation
  isValidPhone: (phone) => {
    const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
    return phoneRegex.test(phone);
  },

  // Password validation
  isValidPassword: (password) => {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    return password.length >= 8 && 
           /[A-Z]/.test(password) && 
           /[a-z]/.test(password) && 
           /[0-9]/.test(password);
  },

  // URL validation
  isValidURL: (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  // Required field validation
  required: (value) => {
    if (typeof value === 'string') {
      return value.trim().length > 0;
    }
    return value !== null && value !== undefined;
  },

  // Min length validation
  minLength: (value, min) => {
    return value && value.length >= min;
  },

  // Max length validation
  maxLength: (value, max) => {
    return value && value.length <= max;
  },

  // Number range validation
  inRange: (value, min, max) => {
    const num = Number(value);
    return !isNaN(num) && num >= min && num <= max;
  },

  // Match validation (for password confirmation)
  matches: (value, compareValue) => {
    return value === compareValue;
  },

  // File size validation (in MB)
  isValidFileSize: (file, maxSizeMB) => {
    return file && file.size <= maxSizeMB * 1024 * 1024;
  },

  // File type validation
  isValidFileType: (file, allowedTypes) => {
    return file && allowedTypes.includes(file.type);
  },
};

// Form validation helper
export const validateForm = (values, rules) => {
  const errors = {};
  
  Object.keys(rules).forEach(field => {
    const fieldRules = rules[field];
    const value = values[field];
    
    fieldRules.forEach(rule => {
      if (rule.required && !validators.required(value)) {
        errors[field] = rule.message || `${field} is required`;
      } else if (rule.email && !validators.isValidEmail(value)) {
        errors[field] = rule.message || 'Invalid email address';
      } else if (rule.phone && !validators.isValidPhone(value)) {
        errors[field] = rule.message || 'Invalid phone number';
      } else if (rule.password && !validators.isValidPassword(value)) {
        errors[field] = rule.message || 'Password must be at least 8 characters with uppercase, lowercase, and number';
      } else if (rule.minLength && !validators.minLength(value, rule.minLength)) {
        errors[field] = rule.message || `Minimum length is ${rule.minLength}`;
      } else if (rule.maxLength && !validators.maxLength(value, rule.maxLength)) {
        errors[field] = rule.message || `Maximum length is ${rule.maxLength}`;
      } else if (rule.matches && !validators.matches(value, values[rule.matches])) {
        errors[field] = rule.message || 'Values do not match';
      }
    });
  });
  
  return errors;
};
