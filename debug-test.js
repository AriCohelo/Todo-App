// Debug: Test isValidTitle function
import { isValidTitle } from './src/utils/security.js';

console.log('isValidTitle("My New Title"):', isValidTitle("My New Title"));
console.log('isValidTitle(""):', isValidTitle(""));
console.log('isValidTitle("a"):', isValidTitle("a"));