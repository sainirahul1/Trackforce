import { getAuthHeader } from '../core/authService';

const getBaseUrl = () => {
  let url = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
  url = url.replace(/\/$/, '');
  if (!url.endsWith('/api')) url += '/api';
  return url;
};
const BASE_URL = getBaseUrl();
const API_URL = `${BASE_URL}/employee/documents`;

export const fetchDocuments = async () => {
    const response = await fetch(API_URL, {
        headers: {
            ...getAuthHeader(),
        },
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch documents');
    return data;
};

export const uploadDocument = async (docData) => {
    const isFormData = docData instanceof FormData;
    const headers = getAuthHeader();
    if (!isFormData) {
        headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(API_URL, {
        method: 'POST',
        headers,
        body: isFormData ? docData : JSON.stringify(docData),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to upload document');
    return data;
};

export const updateDocumentService = async (id, docData) => {
    const isFormData = docData instanceof FormData;
    const headers = getAuthHeader();
    if (!isFormData) {
        headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers,
        body: isFormData ? docData : JSON.stringify(docData),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to update document');
    return data;
};

export const deleteDocumentService = async (id) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: {
            ...getAuthHeader(),
        },
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to delete document');
    return data;
};
