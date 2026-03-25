const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    size: {
        type: String,
        default: '0 MB'
    },
    type: {
        type: String,
        default: 'PDF'
    },
    status: {
        type: String,
        enum: ['Verified', 'Active', 'Pending Review'],
        default: 'Pending Review'
    },
    fileUrl: {
        type: String,
        default: ''
    },
    uploadedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true,
    collection: 'employee.documents'
});

module.exports = mongoose.model('Document', documentSchema);
