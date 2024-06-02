import process from 'process';
import generateKey from '@tryghost/admin-api/lib/token.js';

console.log(generateKey(process.env.GHOST_ADMIN_API_KEY, '/admin/'));