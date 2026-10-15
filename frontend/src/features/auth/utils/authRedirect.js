const dashboardPaths = {
  ADMIN: '/admin',
  BUYER: '/buyer',
  FARMER: '/farmer',
};

const rolePathPrefixes = {
  ADMIN: '/admin',
  BUYER: '/buyer',
  FARMER: '/farmer',
};

export function getSafeReturnTo(value) {
  if (typeof value !== 'string' || !value.startsWith('/') || value.startsWith('//') || value.includes('\\')) {
    return null;
  }

  const url = new URL(value, 'https://agrisass.local');
  if (url.origin !== 'https://agrisass.local') return null;

  const isDashboardPath = Object.values(rolePathPrefixes).some(
    (prefix) => url.pathname === prefix || url.pathname.startsWith(`${prefix}/`),
  );

  return isDashboardPath ? `${url.pathname}${url.search}${url.hash}` : null;
}

export function getPostAuthPath(role, returnTo) {
  const safeReturnTo = getSafeReturnTo(returnTo);
  const rolePrefix = rolePathPrefixes[role];

  if (role === 'FARMER' && safeReturnTo) {
    const buyerPath = new URL(safeReturnTo, 'https://agrisass.local').pathname;
    if (buyerPath === '/buyer/market') return '/farmer/listings';
    if (buyerPath === '/buyer/requests') return '/farmer/requests';
  }

  if (safeReturnTo && rolePrefix) {
    const pathname = new URL(safeReturnTo, 'https://agrisass.local').pathname;
    if (pathname === rolePrefix || pathname.startsWith(`${rolePrefix}/`)) return safeReturnTo;
  }

  return dashboardPaths[role] || '/farmer';
}

export function getStoredReturnTo() {
  return getSafeReturnTo(localStorage.getItem('authReturnTo'));
}
