const mongoose = require('mongoose');
require('dotenv').config();
const Document = require('./models/employee/Document');
const fs = require('fs');
const path = require('path');

mongoose.connect(process.env.MONGO_URI).then(async () => {
    const badNames = ['g', 'g name', 'g_name', 'Vehicle Insurance', 'Field Training Cert.', 'gname'];
    const docsToDelete = await Document.find({ 
        name: { $in: badNames }
    });
    
    let deletedCount = 0;
    for (const doc of docsToDelete) {
        if (doc.fileUrl) {
            const filePath = path.join(__dirname, '../', doc.fileUrl.replace(/^\//, ''));
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }
        await Document.findByIdAndDelete(doc._id);
        deletedCount++;
    }

    console.log(`Deleted ${deletedCount} documents with suspicious names.`);
    
    // Fallback: Just let me know what's there
    const all = await Document.find({}, 'name');
    console.log('Remaining documents:', all.map(d => d.name));
    process.exit(0);
}).catch(console.error);
