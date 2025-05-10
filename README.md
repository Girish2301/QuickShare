# QuickShare

<div align="center">

**Secure, Simple, and Swift File Sharing**

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen)](https://nodejs.org/)

</div>

## 📋 Overview

QuickShare is a lightweight, secure file-sharing platform designed for simplicity and speed. Share files instantly with secure, auto-expiring links, QR codes, or direct email integration—no account required.

## ✨ Features

- **Effortless Uploading** - Simple drag & drop interface or traditional file browser
- **Instant Sharing Options**:
  - Secure link generation
  - QR code generation
  - Direct email delivery
- **Enhanced Security** - All shared links automatically expire after 24 hours
- **Responsive Design** - Seamless experience across desktop and mobile devices
- **Minimal & Clean UI** - Intuitive interface requires no learning curve



## 🔧 Technology Stack

| Component | Technologies |
|-----------|-------------|
| **Frontend** | HTML5, CSS3, JavaScript |
| **Backend** | Node.js, Express.js |
| **Email Service** | Nodemailer with SMTP integration |
| **File Storage** | Local storage with secure access control |
| **Security** | UUID generation, automated cleanup |

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Girish2301/quickshare.git
   cd quickshare
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   
   Create a `.env` file in the root directory with:
   ```
   PORT=3000
   HOST=localhost
   STORAGE_DIR=./uploads
   EMAIL_HOST=smtp.example.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@example.com
   EMAIL_PASS=your-password
   EXPIRY_HOURS=24
   ```

4. **Start the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

5. **Access the application**
   
   Open your browser and navigate to `http://localhost:3000`

## 📝 Usage Guide

### Uploading Files

1. Visit the homepage
2. Drag and drop files into the designated area or click to browse files
3. Wait for the upload to complete
4. Use any of the provided sharing options

### Sharing Files

Once uploaded, you have multiple sharing options:

- **Direct Link** - Copy the generated secure link to clipboard
- **QR Code** - Download the QR code for mobile scanning
- **Email** - Send the link directly to recipients with optional custom message

## 🔒 Security & Privacy

- All file links automatically expire after 24 hours
- Files are stored with randomly generated unique identifiers
- No user accounts or persistent personal data storage
- Email validation ensures proper recipient addresses
- Regular automated cleanup of expired files

## 📚 API Documentation

### Endpoints

| Method | Endpoint | Description | Parameters |
|--------|----------|-------------|------------|
| `POST` | `/api/files` | Upload a new file | `file`: File object |
| `GET` | `/api/files/:uuid` | Download a file by UUID | `uuid`: File identifier |
| `POST` | `/api/files/send` | Email a file link | `uuid`: File id, `to`: Email addresses, `message`: Optional message |
| `GET` | `/api/files/status/:uuid` | Check file status | `uuid`: File identifier |





---

<div align="center">
  Made with ❤️ by <a href="https://github.com/Girish2301">Girish Kumar</a>
</div>