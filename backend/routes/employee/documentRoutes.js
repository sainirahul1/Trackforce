const express = require('express');
const router = express.Router();
const upload = require('../../middleware/uploadMiddleware');
const {
    getEmployeeDocuments,
    uploadDocument,
    updateDocument,
    deleteDocument
} = require('../../controllers/employee/documentController');

// All routes are protected by middleware in employeeRoutes.js
router.get('/', getEmployeeDocuments);
router.post('/', upload.single('file'), uploadDocument);
router.put('/:id', upload.single('file'), updateDocument);
router.delete('/:id', deleteDocument);

module.exports = router;
