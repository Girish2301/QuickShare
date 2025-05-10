document.addEventListener('DOMContentLoaded', () => {
    const dropZone = document.querySelector('.drop-zone');
    const fileInput = document.getElementById('file-input');
    const browseBtn = document.getElementById('browse-btn');
    const uploadForm = document.getElementById('upload-form');
    const progressContainer = document.querySelector('.progress-container');
    const progressBarFill = document.querySelector('.progress-bar-fill');
    const progressPercent = document.querySelector('.percent');
    const uploadStatus = document.querySelector('.upload-status');
    const uploadContainer = document.querySelector('.upload-container');
    const shareContainer = document.querySelector('.share-container');
    const shareLink = document.getElementById('share-link');
    const copyBtn = document.getElementById('copy-btn');
    const qrCodeContainer = document.getElementById('qr-code');
    const downloadQrBtn = document.getElementById('download-qr');
    const senderEmail = document.getElementById('sender-email');
    const receiverEmail = document.getElementById('receiver-email');
    const sendEmailBtn = document.getElementById('send-email-btn');

    // File selection via browse button
    browseBtn.addEventListener('click', () => {
        fileInput.click();
    });

    // File selection change
    fileInput.addEventListener('change', () => {
        if (fileInput.files.length) {
            uploadFile(fileInput.files[0]);
        }
    });

    // Drag and drop functionality
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('active');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('active');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('active');
        
        if (e.dataTransfer.files.length) {
            fileInput.files = e.dataTransfer.files;
            uploadFile(e.dataTransfer.files[0]);
        }
    });

    // Copy link to clipboard
    copyBtn.addEventListener('click', () => {
        shareLink.select();
        document.execCommand('copy');
        showToast('Link copied to clipboard!');
    });

    // Download QR code
    downloadQrBtn.addEventListener('click', () => {
        const qrCanvas = qrCodeContainer.querySelector('canvas');
        if (qrCanvas) {
            const link = document.createElement('a');
            link.download = 'quickshare-qr.png';
            link.href = qrCanvas.toDataURL();
            link.click();
        }
    });

    // Send email
    sendEmailBtn.addEventListener('click', () => {
        const senderEmailValue = senderEmail.value;
        const receiverEmailValue = receiverEmail.value;
        const fileLink = shareLink.value;
        const uuid = fileLink.split('/').pop();

        if (!senderEmailValue || !receiverEmailValue) {
            showToast('Please fill in all email fields', 'error');
            return;
        }

        if (!validateEmail(senderEmailValue) || !validateEmail(receiverEmailValue)) {
            showToast('Please enter valid email addresses', 'error');
            return;
        }

        sendEmailBtn.textContent = 'Sending...';
        sendEmailBtn.disabled = true;

        // Send email via API
        fetch('/api/files/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                uuid: uuid,
                senderEmail: senderEmailValue,
                receiverEmail: receiverEmailValue
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showToast('Email sent successfully!');
                senderEmail.value = '';
                receiverEmail.value = '';
            } else {
                showToast('Failed to send email', 'error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showToast('Failed to send email', 'error');
        })
        .finally(() => {
            sendEmailBtn.textContent = 'Send Email';
            sendEmailBtn.disabled = false;
        });
    });

    // File upload function
    function uploadFile(file) {
        // Show progress container
        progressContainer.style.display = 'block';
        uploadStatus.textContent = 'Uploading...';
        
        const formData = new FormData();
        formData.append('uploadedFile', file);

        const xhr = new XMLHttpRequest();
        
        // Track upload progress
        xhr.upload.addEventListener('progress', (event) => {
            if (event.lengthComputable) {
                const percentComplete = Math.round((event.loaded / event.total) * 100);
                progressBarFill.style.width = percentComplete + '%';
                progressPercent.textContent = percentComplete + '%';
            }
        });

        // Handle upload completion
        xhr.addEventListener('load', () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                const response = JSON.parse(xhr.responseText);
                uploadStatus.textContent = 'Upload Complete!';
                
                // Show success UI after a short delay
                setTimeout(() => {
                    uploadContainer.classList.add('hidden');
                    shareContainer.classList.remove('hidden');
                    
                    // Set and display link
                    const fileLink = response.file;
                    shareLink.value = fileLink;
                    
                    // Generate QR code
                    generateQRCode(fileLink);
                }, 1000);
            } else {
                uploadStatus.textContent = 'Upload Failed';
                showToast('Upload failed. Please try again.', 'error');
                progressContainer.style.display = 'none';
            }
        });

        // Handle network errors
        xhr.addEventListener('error', () => {
            uploadStatus.textContent = 'Network Error';
            showToast('Network error. Please check your connection.', 'error');
        });

        // Send the file
        xhr.open('POST', '/api/files/upload');
        xhr.send(formData);
    }

    // Generate QR code for the file link
    function generateQRCode(link) {
        qrCodeContainer.innerHTML = '';
        
        // Using qrcode.js library
        new QRCode(qrCodeContainer, {
            text: link,
            width: 200,
            height: 200,
            colorDark: '#343a40',
            colorLight: '#ffffff',
            correctLevel: QRCode.CorrectLevel.H
        });
    }

    // Toast notification function
    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }

    // Email validation function
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Add toast styles dynamically
    const style = document.createElement('style');
    style.textContent = `
        .toast {
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 12px 20px;
            border-radius: 4px;
            background-color: #28a745;
            color: white;
            font-size: 16px;
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.3s ease;
            z-index: 1000;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        
        .toast.show {
            opacity: 1;
            transform: translateY(0);
        }
        
        .toast.error {
            background-color: #dc3545;
        }
    `;
    document.head.appendChild(style);
});