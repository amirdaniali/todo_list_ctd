import DOMPurify from 'dompurify';

// Example: Sanitize user input using DOMPurify
const sanitizeInput = (input) => {
    return DOMPurify.sanitize(input.trim(), {
        ALLOWED_TAGS: [], // Remove all HTML tags
        ALLOWED_ATTR: []  // Remove all attributes
    });
};

export default sanitizeInput;