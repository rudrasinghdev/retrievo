export const API_ENDPOINTS = {
  // Auth
  REGISTER: '/api/auth/register',
  LOGIN: '/api/auth/login',

  // Items
  ITEMS: '/api/items',
  ITEM_BY_ID: (id) => `/api/items/${id}`,
  MY_ITEMS: '/api/items/me',

  // Claims
  SUBMIT_CLAIM: (itemId) => `/api/items/${itemId}/claims`,
  CLAIMS_BY_ITEM: (itemId) => `/api/items/${itemId}/claims`,
  MY_CLAIMS: '/api/claims/me',
  UPDATE_CLAIM_STATUS: (claimId) => `/api/claims/${claimId}/status`,
};

export const CATEGORIES = [
  { value: 'ELECTRONICS', label: 'Electronics', icon: 'Laptop' },
  { value: 'DOCUMENTS', label: 'Documents', icon: 'FileText' },
  { value: 'ACCESSORIES', label: 'Accessories', icon: 'Watch' },
  { value: 'BAGS', label: 'Bags', icon: 'Briefcase' },
  { value: 'ID_CARDS', label: 'ID Cards', icon: 'CreditCard' },
  { value: 'OTHER', label: 'Other', icon: 'Box' },
];

export const ITEM_TYPES = [
  { value: 'ALL', label: 'All Items' },
  { value: 'LOST', label: 'Lost Items' },
  { value: 'FOUND', label: 'Found Items' },
];
