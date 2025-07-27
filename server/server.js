// server/server.js
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Set up multer for file storage
const upload = multer({ dest: 'uploads/' });

// === Middleware ===
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// === API Endpoint for PDF to DOCX Conversion ===
app.post('/api/convert', upload.single('pdfFile'), (req, res) => {
    if (!req.file) return res.status(400).send('No file uploaded.');

    const inputPath = req.file.path;
    const outputPath = `${inputPath}.docx`;

    const pythonProcess = spawn('python', ['converter.py', inputPath, outputPath]);

    pythonProcess.stdout.on('data', (data) => console.log(`Python Script stdout: ${data}`));
    pythonProcess.stderr.on('data', (data) => console.error(`Python Script stderr: ${data}`));

    pythonProcess.on('close', (code) => {
        if (code === 0) {
            res.download(outputPath, (err) => {
                if (err) console.error('Error sending the file:', err);
                fs.unlinkSync(inputPath);
                fs.unlinkSync(outputPath);
            });
        } else {
            res.status(500).send('File conversion failed.');
            fs.unlinkSync(inputPath);
        }
    });
});

// === API Endpoint for Securing a PDF with a Password ===
app.post('/api/secure', upload.single('pdfFile'), (req, res) => {
    if (!req.file) return res.status(400).send('No file uploaded.');
    if (!req.body.password) return res.status(400).send('No password provided.');

    const inputPath = req.file.path;
    const outputPath = `${inputPath}_secured.pdf`;
    const password = req.body.password;

    const pythonProcess = spawn('python', ['secure_pdf.py', inputPath, outputPath, password]);
    
    pythonProcess.stdout.on('data', (data) => console.log(`Python Script stdout: ${data}`));
    pythonProcess.stderr.on('data', (data) => console.error(`Python Script stderr: ${data}`));

    pythonProcess.on('close', (code) => {
        if (code === 0) {
            res.download(outputPath, (err) => {
                if (err) console.error('Error sending the file:', err);
                fs.unlinkSync(inputPath);
                fs.unlinkSync(outputPath);
            });
        } else {
            res.status(500).send('Failed to secure the PDF.');
            fs.unlinkSync(inputPath);
        }
    });
});

// === API Endpoint for Removing a Password from a PDF ===
app.post('/api/unlock', upload.single('pdfFile'), (req, res) => {
    if (!req.file) return res.status(400).send('No file uploaded.');
    if (!req.body.password) return res.status(400).send('No password provided.');

    const inputPath = req.file.path;
    const outputPath = `${inputPath}_unlocked.pdf`;
    const password = req.body.password;

    const pythonProcess = spawn('python', ['remove_password.py', inputPath, outputPath, password]);

    pythonProcess.stdout.on('data', (data) => console.log(`Python Script stdout: ${data}`));
    pythonProcess.stderr.on('data', (data) => console.error(`Python Script stderr: ${data}`));

    pythonProcess.on('close', (code) => {
        if (code === 0) {
            res.download(outputPath, (err) => {
                if (err) console.error('Error sending the file:', err);
                fs.unlinkSync(inputPath);
                fs.unlinkSync(outputPath);
            });
        } else {
            // This could fail if the password is wrong or the file is corrupt
            res.status(500).send('Failed to unlock the PDF. Please check the password.');
            fs.unlinkSync(inputPath);
        }
    });
});

// === Start the Server ===
app.listen(PORT, () => {
    console.log(`Server is running on https://pdf-toolkit-backend-7s5o.onrender.com:${PORT}`);
});