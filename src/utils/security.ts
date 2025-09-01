import DOMPurify from 'dompurify';

export const validateInput = (
  input: string,
  maxLength: number = 1000,
  shouldTrim: boolean = true
): string => {
  if (typeof input !== 'string') return '';
  
  const processedInput = shouldTrim ? input.trim() : input;
  const truncated = processedInput.length > maxLength 
    ? processedInput.substring(0, maxLength) 
    : processedInput;
    
  return DOMPurify.sanitize(truncated, { 
    ALLOWED_TAGS: [],
    KEEP_CONTENT: true,
    ALLOW_DATA_ATTR: false
  });
};

export const isValidTitle = (title: string): boolean => {
  return title.length > 0 && title.length <= 100;
};

export const isValidContent = (content: string): boolean => {
  return content.length <= 1000;
};