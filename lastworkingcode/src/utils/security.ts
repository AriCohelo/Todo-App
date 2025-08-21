import DOMPurify from 'dompurify';

export const validateInput = (input: string, maxLength: number = 1000, shouldTrim: boolean = true): string => {
  if (typeof input !== 'string') {
    return '';
  }
  
  const processedInput = shouldTrim ? input.trim() : input;
  if (processedInput.length > maxLength) {
    return processedInput.substring(0, maxLength);
  }
  
  // Sanitize using DOMPurify - strips all HTML tags but keeps content
  return DOMPurify.sanitize(processedInput, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true
  });
};

export const isValidTitle = (title: string): boolean => {
  return title.length > 0 && title.length <= 100;
};

export const isValidContent = (content: string): boolean => {
  return content.length <= 1000;
};