class DocumentScrutinyTool {
    constructor() {
        this.currentDocument = null;
        this.documentContent = '';
        this.extractedLinks = [];
        this.isProcessing = false;

        this.initializeEventListeners();
    }

    initializeEventListeners() {
        const uploadArea = document.getElementById('uploadArea');
        const fileInput = document.getElementById('fileInput');
        const processBtn = document.getElementById('processBtn');
        const queryBtn = document.getElementById('queryBtn');
        const queryInput = document.getElementById('queryInput');

        // Upload area events
        uploadArea.addEventListener('click', () => fileInput.click());
        uploadArea.addEventListener('dragover', this.handleDragOver.bind(this));
        uploadArea.addEventListener('dragleave', this.handleDragLeave.bind(this));
        uploadArea.addEventListener('drop', this.handleDrop.bind(this));

        // File input event
        fileInput.addEventListener('change', this.handleFileSelect.bind(this));

        // Process button
        processBtn.addEventListener('click', this.processDocument.bind(this));

        // Query events
        queryBtn.addEventListener('click', this.handleQuery.bind(this));
        queryInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleQuery();
        });
    }

    handleDragOver(e) {
        e.preventDefault();
        document.getElementById('uploadArea').classList.add('dragover');
    }

    handleDragLeave(e) {
        e.preventDefault();
        document.getElementById('uploadArea').classList.remove('dragover');
    }

    handleDrop(e) {
        e.preventDefault();
        document.getElementById('uploadArea').classList.remove('dragover');
        const files = e.dataTransfer.files;
        this.processFiles(files);
    }

    handleFileSelect(e) {
        const files = e.target.files;
        this.processFiles(files);
    }

    processFiles(files) {
        if (files.length === 0) return;

        const file = files[0];
        this.currentDocument = file;

        // Validate file type
        const validTypes = ['.pdf', '.doc', '.docx', '.txt'];
        const fileExtension = '.' + file.name.split('.').pop().toLowerCase();

        if (!validTypes.includes(fileExtension)) {
            this.showError('Please upload a valid document (PDF, DOC, DOCX, or TXT)');
            return;
        }

        // Show file info
        const fileInfo = document.getElementById('fileInfo');
        fileInfo.innerHTML = `
                    <strong>📄 ${file.name}</strong><br>
                    <small>Size: ${this.formatFileSize(file.size)} | Type: ${file.type || 'Unknown'}</small>
                `;
        fileInfo.style.display = 'block';

        // Enable process button
        document.getElementById('processBtn').disabled = false;
        this.showSuccess('Document ready for processing!');
    }

    async processDocument() {
        if (!this.currentDocument || this.isProcessing) return;

        this.isProcessing = true;
        this.showProgress();

        try {
            // Simulate document processing
            await this.simulateDocumentProcessing();

            // Generate summary
            const summary = this.generateDocumentSummary();
            this.displaySummary(summary);

            // Extract links (simulated)
            this.extractLinks();

            // Enable query functionality
            document.getElementById('queryInput').disabled = false;
            document.getElementById('queryBtn').disabled = false;

            this.showSuccess('Document processed successfully!');

        } catch (error) {
            this.showError('Error processing document: ' + error.message);
        } finally {
            this.isProcessing = false;
            this.hideProgress();
        }
    }

    async simulateDocumentProcessing() {
        const progressFill = document.getElementById('progressFill');

        for (let i = 0; i <= 100; i += 10) {
            progressFill.style.width = i + '%';
            await new Promise(resolve => setTimeout(resolve, 200));
        }
    }

    generateDocumentSummary() {
        // This is a simulated summary based on the document name and type
        const fileName = this.currentDocument.name.toLowerCase();

        // Detect if it might be a tender document
        const isTenderDoc = fileName.includes('tender') ||
            fileName.includes('bid') ||
            fileName.includes('rfp') ||
            fileName.includes('quotation');

        if (isTenderDoc) {
            return {
                keyPoints: [
                    { label: 'Tender ID', value: 'TD-2025-' + Math.floor(Math.random() * 10000) },
                    { label: 'Tender Number', value: 'BID/2025/' + Math.floor(Math.random() * 1000) },
                    { label: 'Name of the Work', value: 'Infrastructure Development Project' },
                    { label: 'Department Name', value: 'Public Works Department' },
                    { label: 'ECV (Estimated Contract Value)', value: '₹' + (Math.floor(Math.random() * 100) + 50) + ' Lakhs' },
                    { label: 'Contract Period', value: (Math.floor(Math.random() * 24) + 12) + ' months' },
                    { label: 'EMD (Earnest Money Deposit)', value: '₹' + (Math.floor(Math.random() * 10) + 5) + ' Lakhs' },
                    { label: 'EMD Exemption', value: 'MSMEs, Startups as per policy' },
                    { label: 'Mode of Payment', value: 'Online/RTGS/NEFT' },
                    { label: 'Eligibility Criteria', value: 'Class-A contractors with 5+ years experience' }
                ],
                additionalInfo: [
                    'Document submitted in ' + (fileName.includes('.pdf') ? 'PDF' : 'Word') + ' format',
                    'Multi-language content detected and translated to English',
                    'Total pages: ' + (Math.floor(Math.random() * 200) + 50),
                    'Last modified: ' + new Date().toLocaleDateString(),
                    'Security classification: Restricted'
                ]
            };
        } else {
            return {
                keyPoints: [
                    { label: 'Document Type', value: 'General Document' },
                    { label: 'File Name', value: this.currentDocument.name },
                    { label: 'File Size', value: this.formatFileSize(this.currentDocument.size) },
                    { label: 'Language Detected', value: 'Multi-language (Auto-translated to English)' },
                    { label: 'Processing Status', value: 'Successfully Processed' }
                ],
                additionalInfo: [
                    'Document contains standard business content',
                    'No tender-specific information detected',
                    'Content extracted and indexed for search',
                    'Ready for question-answering'
                ]
            };
        }
    }

    displaySummary(summary) {
        const summaryContent = document.getElementById('summaryContent');

        let html = '<ul class="key-points">';

        summary.keyPoints.forEach(point => {
            html += `
                        <li>
                            <strong>${point.label}:</strong>
                            ${point.value}
                        </li>
                    `;
        });

        html += '</ul>';

        if (summary.additionalInfo && summary.additionalInfo.length > 0) {
            html += '<h4 style="margin-top: 20px; color: #2c3e50;">📌 Additional Information:</h4>';
            html += '<ul class="key-points">';
            summary.additionalInfo.forEach(info => {
                html += `<li>${info}</li>`;
            });
            html += '</ul>';
        }

        summaryContent.innerHTML = html;
    }

    extractLinks() {
        // Simulate link extraction
        const possibleLinks = [
            'https://eprocure.gov.in/eprocure/app',
            'https://gem.gov.in/tender/search',
            'https://ireps.gov.in/tender/active',
            'https://sbi.co.in/web/corporate-banking/tenders'
        ];

        // Randomly select some links
        this.extractedLinks = possibleLinks.slice(0, Math.floor(Math.random() * 3) + 1);

        if (this.extractedLinks.length > 0) {
            const linksSection = document.getElementById('linksSection');
            const linksList = document.getElementById('linksList');

            linksList.innerHTML = '';
            this.extractedLinks.forEach(link => {
                const li = document.createElement('li');
                li.innerHTML = `<a href="${link}" target="_blank" style="color: #667eea; text-decoration: none;">${link}</a>`;
                linksList.appendChild(li);
            });

            linksSection.style.display = 'block';
        }
    }

    async handleQuery() {
        const queryInput = document.getElementById('queryInput');
        const query = queryInput.value.trim();

        if (!query) return;

        const queryResponse = document.getElementById('queryResponse');
        const responseContent = document.getElementById('responseContent');

        // Show loading
        responseContent.innerHTML = '<div class="loading"></div> Processing your question...';
        queryResponse.style.display = 'block';

        try {
            // Simulate AI processing
            await new Promise(resolve => setTimeout(resolve, 2000));

            const response = this.generateAIResponse(query);
            responseContent.innerHTML = response;

        } catch (error) {
            responseContent.innerHTML = 'Sorry, I encountered an error while processing your question. Please try again.';
        }

        // Clear input
        queryInput.value = '';
    }

    async handleQuery() {
        const queryInput = document.getElementById('queryInput');
        const query = queryInput.value.trim();
    
        if (!query || !this.currentDocument) return;
    
        const queryResponse = document.getElementById('queryResponse');
        const responseContent = document.getElementById('responseContent');
    
        // Show loading
        responseContent.innerHTML = '<div class="loading"></div> Processing your question...';
        queryResponse.style.display = 'block';
    
        try {
            const formData = new FormData();
            formData.append("file", this.currentDocument);
            formData.append("question", query);
    
            const res = await fetch("http://127.0.0.1:8000/analyze", {
                method: "POST",
                body: formData
            });
    
            const data = await res.json();
    
            if (data.answer) {
                responseContent.innerHTML = `<p>${data.answer}</p>`;
            } else {
                responseContent.innerHTML = `<p style="color:red;">${data.error || 'Unexpected error occurred.'}</p>`;
            }
    
        } catch (error) {
            responseContent.innerHTML = `<p style="color:red;">Error: ${error.message}</p>`;
        }
    
        queryInput.value = '';
    }
    

    showProgress() {
        document.getElementById('progressBar').style.display = 'block';
        document.getElementById('processBtn').disabled = true;
    }

    hideProgress() {
        document.getElementById('progressBar').style.display = 'none';
        document.getElementById('processBtn').disabled = false;
    }

    showError(message) {
        const errorDiv = document.getElementById('errorMessage');
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        setTimeout(() => {
            errorDiv.style.display = 'none';
        }, 5000);
    }

    showSuccess(message) {
        const successDiv = document.getElementById('successMessage');
        successDiv.textContent = message;
        successDiv.style.display = 'block';
        setTimeout(() => {
            successDiv.style.display = 'none';
        }, 3000);
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new DocumentScrutinyTool();
});