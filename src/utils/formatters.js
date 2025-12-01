import { format, formatDistance, formatRelative, parseISO } from 'date-fns';

// Date and time formatters
export const formatters = {
  // Format date
  date: (date, formatString = 'MMM dd, yyyy') => {
    if (!date) return '';
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, formatString);
  },

  // Format date and time
  dateTime: (date) => {
    if (!date) return '';
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, 'MMM dd, yyyy hh:mm a');
  },

  // Format time
  time: (date) => {
    if (!date) return '';
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, 'hh:mm a');
  },

  // Format relative time (e.g., "2 hours ago")
  relativeTime: (date) => {
    if (!date) return '';
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return formatDistance(dateObj, new Date(), { addSuffix: true });
  },

  // Format relative date (e.g., "today at 5:30 PM")
  relativeDate: (date) => {
    if (!date) return '';
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return formatRelative(dateObj, new Date());
  },

  // Currency formatter
  currency: (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount);
  },

  // Number formatter
  number: (num) => {
    return new Intl.NumberFormat('en-US').format(num);
  },

  // Phone number formatter
  phone: (phoneNumber) => {
    if (!phoneNumber) return '';
    const cleaned = phoneNumber.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return phoneNumber;
  },

  // Truncate text
  truncate: (text, maxLength = 100, suffix = '...') => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + suffix;
  },

  // Capitalize first letter
  capitalize: (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  },

  // Title case
  titleCase: (str) => {
    if (!str) return '';
    return str
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  },

  // File size formatter
  fileSize: (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  },

  // Rating formatter
  rating: (rating) => {
    if (!rating) return '0.0';
    return Number(rating).toFixed(1);
  },

  // Status badge formatter
  status: (status) => {
    const statusMap = {
      pending: { text: 'Pending', class: 'bg-yellow-100 text-yellow-800' },
      confirmed: { text: 'Confirmed', class: 'bg-blue-100 text-blue-800' },
      in_progress: { text: 'In Progress', class: 'bg-purple-100 text-purple-800' },
      completed: { text: 'Completed', class: 'bg-green-100 text-green-800' },
      cancelled: { text: 'Cancelled', class: 'bg-red-100 text-red-800' },
      paid: { text: 'Paid', class: 'bg-green-100 text-green-800' },
      failed: { text: 'Failed', class: 'bg-red-100 text-red-800' },
    };
    return statusMap[status] || { text: status, class: 'bg-gray-100 text-gray-800' };
  },

  // Initials generator
  initials: (name) => {
    if (!name) return '';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  },
};
