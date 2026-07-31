const BASE = '';

async function request<T>(method: string, path: string, body?: any): Promise<T> {
  const opts: RequestInit = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(BASE + path, opts);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || `Request failed: ${res.status}`);
  }
  return res.json();
}

export const api = {
  // Auth
  login: (email: string, role: string) => request<any>('POST', '/api/auth/login', { email, role }),
  register: (data: any) => request<any>('POST', '/api/auth/register', data),
  getMe: (userId: string) => request<any>('GET', `/api/auth/me/${userId}`),

  // Reports
  getReports: (params?: Record<string, string>) => {
    const q = params ? '?' + new URLSearchParams(params).toString() : '';
    return request<any[]>('GET', `/api/reports${q}`);
  },
  getReport: (id: string) => request<any>('GET', `/api/reports/${id}`),
  createReport: (data: any) => request<any>('POST', '/api/reports', data),
  updateReportStatus: (id: string, status: string, completionImageUrl?: string, userName?: string) =>
    request<any>('PUT', `/api/reports/${id}/status`, { status, completionImageUrl, userName }),
  assignReport: (id: string, staffId: string, staffName: string, adminName?: string) =>
    request<any>('PUT', `/api/reports/${id}/assign`, { staffId, staffName, adminName }),
  addComment: (id: string, author: string, authorRole: string, content: string) =>
    request<any>('POST', `/api/reports/${id}/comments`, { author, authorRole, content }),
  deleteReport: (id: string) => request<any>('DELETE', `/api/reports/${id}`),

  // Users
  getUsers: (params?: Record<string, string>) => {
    const q = params ? '?' + new URLSearchParams(params).toString() : '';
    return request<any[]>('GET', `/api/users${q}`);
  },
  updateUser: (id: string, data: any) => request<any>('PUT', `/api/users/${id}`, data),
  updateUserStatus: (id: string, status: string, adminName?: string) =>
    request<any>('PUT', `/api/users/${id}/status`, { status, adminName }),
  updateUserRole: (id: string, role: string, adminName?: string) =>
    request<any>('PUT', `/api/users/${id}/role`, { role, adminName }),
  deleteUser: (id: string, adminName?: string) => request<any>('DELETE', `/api/users/${id}`, { adminName }),

  // Notifications
  getNotifications: () => request<any[]>('GET', '/api/notifications'),
  markAllRead: () => request<any>('PUT', '/api/notifications/read-all'),
  markRead: (id: string) => request<any>('PUT', `/api/notifications/${id}/read`),

  // Logs
  getLogs: () => request<any[]>('GET', '/api/logs'),

  // Map
  getBins: () => request<any[]>('GET', '/api/map/bins'),
  getTrucks: () => request<any[]>('GET', '/api/map/trucks'),
};
