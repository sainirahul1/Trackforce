import apiClient from '../apiClient';

const API_URL = '/reatchall/employee/documents';

export const fetchDocuments = async () => {
    const response = await apiClient.get(API_URL);
    return response.data;
};

export const uploadDocument = async (docData) => {
    const isFormData = docData instanceof FormData;
    const config = isFormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};

    const response = await apiClient.post(API_URL, docData, config);
    return response.data;
};

export const updateDocumentService = async (id, docData) => {
    const isFormData = docData instanceof FormData;
    const config = isFormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};

    const response = await apiClient.put(`${API_URL}/${id}`, docData, config);
    return response.data;
};

export const deleteDocumentService = async (id) => {
    const response = await apiClient.delete(`${API_URL}/${id}`);
    return response.data;
};
