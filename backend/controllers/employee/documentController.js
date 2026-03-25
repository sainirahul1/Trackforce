const Document = require('../../models/employee/Document');
const fs = require('fs');
const path = require('path');

// @desc    Get all documents for the logged in employee
// @route   GET /api/employee/documents
// @access  Private
const getEmployeeDocuments = async (req, res) => {
    try {
        const documents = await Document.find({ employeeId: req.user._id }).sort({ createdAt: -1 });
        res.json(documents);
    } catch (error) {
        console.error('getEmployeeDocuments error:', error.message);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Upload/Add a new document
// @route   POST /api/employee/documents
// @access  Private
const uploadDocument = async (req, res) => {
    try {
        const { name, status } = req.body;
        
        if (!name) {
            return res.status(400).json({ message: 'Document name is required' });
        }

        let fileUrl = '';
        let size = req.body.size || '0 MB';
        let type = req.body.type || 'PDF';

        if (req.file) {
            fileUrl = `/uploads/documents/${req.file.filename}`;
            size = `${(req.file.size / (1024 * 1024)).toFixed(1)} MB`;
        }

        const newDocument = await Document.create({
            employeeId: req.user._id,
            name,
            size,
            type,
            status: status || (req.file ? 'Verified' : 'Pending Review'),
            fileUrl: fileUrl || (req.body.fileUrl || '')
        });

        res.status(201).json(newDocument);
    } catch (error) {
        console.error('uploadDocument error:', error.message);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Update a document
// @route   PUT /api/employee/documents/:id
// @access  Private
const updateDocument = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, status } = req.body;

        const document = await Document.findOne({ _id: id, employeeId: req.user._id });

        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }

        if (name !== undefined) document.name = name;
        if (status !== undefined) document.status = status;
        if (req.body.type !== undefined) document.type = req.body.type;

        if (req.file) {
            // Unlink old file securely
            if (document.fileUrl) {
                const oldFilePath = path.join(__dirname, '../../', document.fileUrl.replace(/^\//, ''));
                if (fs.existsSync(oldFilePath)) fs.unlinkSync(oldFilePath);
            }
            document.fileUrl = `/uploads/documents/${req.file.filename}`;
            document.size = `${(req.file.size / (1024 * 1024)).toFixed(1)} MB`;
            document.status = 'Verified';
        } else if (req.body.fileUrl !== undefined) {
            document.fileUrl = req.body.fileUrl;
        }

        await document.save();
        res.json(document);
    } catch (error) {
        console.error('updateDocument error:', error.message);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Delete a document
// @route   DELETE /api/employee/documents/:id
// @access  Private
const deleteDocument = async (req, res) => {
    try {
        const { id } = req.params;

        const document = await Document.findOneAndDelete({ _id: id, employeeId: req.user._id });

        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }

        if (document.fileUrl) {
            const filePath = path.join(__dirname, '../../', document.fileUrl.replace(/^\//, ''));
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        res.json({ message: 'Document removed' });
    } catch (error) {
        console.error('deleteDocument error:', error.message);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    getEmployeeDocuments,
    uploadDocument,
    updateDocument,
    deleteDocument
};
