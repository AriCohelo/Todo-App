import DOMPurify from 'dompurify';

export const sanitizeHtml = (input: string): string => {
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true
  });
};

export const validateInput = (input: string, maxLength: number = 1000, shouldTrim: boolean = true): string => {
  if (typeof input !== 'string') {
    return '';
  }
  
  const processedInput = shouldTrim ? input.trim() : input;
  if (processedInput.length > maxLength) {
    return processedInput.substring(0, maxLength);
  }
  
  return sanitizeHtml(processedInput);
};

export const isValidTitle = (title: string): boolean => {
  return title.length > 0 && title.length <= 100;
};

export const isValidContent = (content: string): boolean => {
  return content.length <= 1000;
};

export const escapeHtml = (text: string): string => {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
};

export const preventXSS = (input: string): string => {
  return escapeHtml(sanitizeHtml(input));
};