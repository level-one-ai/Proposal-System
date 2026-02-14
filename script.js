// ===================================================
// WEBHOOK CONFIGURATION
// ===================================================
const RETRIEVAL_WEBHOOK = 'https://hook.eu1.make.com/zwyqjvu4bxl35h3prmsd3milfci7dmps';
const SIGNATURE_WEBHOOK = 'https://hook.eu1.make.com/zwyqjvu4bxl35h3prmsd3milfci7dmps';

// ===================================================
// LOAD PROPOSAL DATA FROM WEBHOOK
// ===================================================
async function loadProposalData() {
    const params = new URLSearchParams(window.location.search);
    const configId = params.get('config');
    
    if (configId) {
        // Show loading screen
        const loadingScreen = document.getElementById('proposalLoadingScreen');
        const loadingBar = document.getElementById('loadingBar');
        
        try {
            console.log('Loading proposal config:', configId);
            
            // Animate loading bar to 30%
            loadingBar.style.width = '30%';
            
            // Fetch from Make.com webhook
            const response = await fetch(`${RETRIEVAL_WEBHOOK}?configId=${configId}&Opening=true`);
            
            if (!response.ok) {
                throw new Error('Failed to load proposal');
            }
            
            // Animate loading bar to 60%
            loadingBar.style.width = '60%';
            
            const config = await response.json();
            console.log('Proposal loaded:', config);
            
            // Animate loading bar to 90%
            loadingBar.style.width = '90%';
            
            // Apply configuration to page
            applyConfigToPage(config);
            
            // Complete loading bar
            loadingBar.style.width = '100%';
            
            // Wait a moment before hiding loading screen
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Hide loading screen
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 300);
            
        } catch (error) {
            console.error('Error loading proposal:', error);
            loadingScreen.style.display = 'none';
            alert('Unable to load this proposal. Please contact Level One support.');
        }
    } else {
        // No config ID, hide loading screen immediately
        document.getElementById('proposalLoadingScreen').style.display = 'none';
    }
}

function applyConfigToPage(config) {
    // Apply each text field from config
    for (const [key, value] of Object.entries(config)) {
        // Skip milestone tasks (they're arrays, handle separately)
        if (key.includes('Tasks')) continue;
        
        const element = document.getElementById(key);
        if (element) {
            element.textContent = value;
        }
    }
    
    // Special handling for companyName (multiple locations)
    if (config.companyName) {
        const companyNameElements = [
            'clientNameCover',
            'termsClientName',
            'agreementClientName',
            'clientSignatureHeader',
            'clientSignatureHeader2'
        ];
        companyNameElements.forEach(id => {
            const elem = document.getElementById(id);
            if (elem) {
                elem.textContent = config.companyName;
            }
        });
    }
    
    // Handle milestone tasks separately
    for (let i = 1; i <= 6; i++) {
        const tasksKey = `milestone${i}Tasks`;
        if (config[tasksKey]) {
            const tasksContainer = document.getElementById(tasksKey);
            if (tasksContainer) {
                tasksContainer.innerHTML = '';
                
                let tasksArray = [];
                
                // If it's a string with pipe separators, split it
                if (typeof config[tasksKey] === 'string') {
                    tasksArray = config[tasksKey].split('|').map(task => task.trim());
                }
                
                // Create list items for each task
                tasksArray.forEach(task => {
                    if (task) {  // Only add non-empty tasks
                        const li = document.createElement('li');
                        li.textContent = task;
                        tasksContainer.appendChild(li);
                    }
                });
            }
        }
    }
}

// ===================================================
// SIGNATURE FUNCTIONALITY
// ===================================================
let currentSignatureInstance = null;
let canvas, ctx;
let isDrawing = false;
let lastX = 0;
let lastY = 0;
let signatureData1 = null;
let signatureData2 = null;

function openSignatureModal(instance) {
    currentSignatureInstance = instance;
    const modal = document.getElementById('signatureModal');
    modal.classList.add('active');
    
    canvas = document.getElementById('signatureCanvas');
    ctx = canvas.getContext('2d');
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
    
    canvas.addEventListener('touchstart', handleTouch);
    canvas.addEventListener('touchmove', handleTouch);
    canvas.addEventListener('touchend', stopDrawing);
}

function closeSignatureModal() {
    const modal = document.getElementById('signatureModal');
    modal.classList.remove('active');
    currentSignatureInstance = null;
}

function startDrawing(e) {
    isDrawing = true;
    [lastX, lastY] = [e.offsetX, e.offsetY];
}

function draw(e) {
    if (!isDrawing) return;
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
    [lastX, lastY] = [e.offsetX, e.offsetY];
}

function stopDrawing() {
    isDrawing = false;
}

function handleTouch(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    
    if (e.type === 'touchstart') {
        isDrawing = true;
        [lastX, lastY] = [x, y];
    } else if (e.type === 'touchmove' && isDrawing) {
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(x, y);
        ctx.stroke();
        [lastX, lastY] = [x, y];
    }
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function saveSignature() {
    const dataURL = canvas.toDataURL();
    
    if (currentSignatureInstance === 1) {
        signatureData1 = dataURL;
        const preview = document.getElementById('clientSigPreview');
        preview.innerHTML = `<img src="${dataURL}" alt="Signature">`;
        document.getElementById('submitClientSig').disabled = false;
    } else if (currentSignatureInstance === 2) {
        signatureData2 = dataURL;
        const preview = document.getElementById('clientSigPreview2');
        preview.innerHTML = `<img src="${dataURL}" alt="Signature">`;
        document.getElementById('submitClientSig2').disabled = false;
    }
    
    closeSignatureModal();
}

// ===================================================
// SEND SIGNATURE TO MAKE.COM WEBHOOK
// ===================================================
async function sendSignatureToWebhook(signatureData, clientName, clientPosition) {
    // Get configId from URL
    const params = new URLSearchParams(window.location.search);
    const configId = params.get('config');
    
    try {
        const cleanName = clientName.replace(/[^a-z0-9]/gi, '_');
        const timestamp = Date.now();
        const filename = `signature_${cleanName}_${timestamp}.png`;
        
        const payload = {
            configId: configId,
            signature_image: signatureData,
            client_name: clientName,
            client_position: clientPosition,
            signed_date: new Date().toISOString(),
            company_name: document.getElementById('clientNameCover')?.textContent || 'N/A',
            filename: filename,
            Signed: true
        };
        
        const response = await fetch(SIGNATURE_WEBHOOK, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        
        if (!response.ok) {
            console.error('Webhook error:', response.status);
        } else {
            console.log('Signature sent to webhook successfully');
        }
    } catch (error) {
        console.error('Error sending to webhook:', error);
    }
}

function submitClientSignature() {
    const name = document.getElementById('clientFullName').value;
    const position = document.getElementById('clientPosition').value;
    
    if (!name || !position || !signatureData1) {
        alert('Please fill in all required fields');
        return;
    }
    
    // Send to Make.com webhook
    sendSignatureToWebhook(signatureData1, name, position);
    
    document.getElementById('clientForm').classList.add('hidden');
    
    const display = document.getElementById('clientSignatureDisplay');
    document.getElementById('clientNameDisplay').textContent = name;
    document.getElementById('clientPositionDisplay').textContent = position;
    document.getElementById('clientSigImg').src = signatureData1;
    document.getElementById('clientDate').textContent = `Date: ${new Date().toLocaleDateString()}`;
    display.classList.add('show');
    
    document.getElementById('providerDate').textContent = `Date: ${new Date().toLocaleDateString()}`;
}

function submitClientSignature2() {
    const name = document.getElementById('clientFullName2').value;
    const position = document.getElementById('clientPosition2').value;
    
    if (!name || !position || !signatureData2) {
        alert('Please fill in all required fields');
        return;
    }
    
    // Send to Make.com webhook
    sendSignatureToWebhook(signatureData2, name, position);
    
    document.getElementById('clientForm2').classList.add('hidden');
    
    const display = document.getElementById('clientSignatureDisplay2');
    document.getElementById('clientNameDisplay2').textContent = name;
    document.getElementById('clientPositionDisplay2').textContent = position;
    document.getElementById('clientSigImg2').src = signatureData2;
    document.getElementById('clientDate2').textContent = `Date: ${new Date().toLocaleDateString()}`;
    display.classList.add('show');
    
    document.getElementById('providerDate2').textContent = `Date: ${new Date().toLocaleDateString()}`;
}

// ===================================================
// PREVIEW AND AGREEMENT FUNCTIONALITY
// ===================================================
function openPreview() {
    const modal = document.getElementById('previewModal');
    const previewContainer = document.getElementById('previewPages');
    previewContainer.innerHTML = '';
    
    const pages = document.querySelectorAll('.page');
    pages.forEach((page, index) => {
        const clone = page.cloneNode(true);
        previewContainer.appendChild(clone);
    });
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closePreview() {
    const modal = document.getElementById('previewModal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

async function agreeToProposal() {
    try {
        closePreview();
        showLoadingScreen();
        
        await sendAgreementToWebhook();
        
        const pdfBlob = await generateProposalPDF();
        window.generatedProposalPDF = pdfBlob;
        
        hideLoadingScreen();
        
        const thankyouModal = document.getElementById('thankyouModal');
        thankyouModal.classList.add('active');
        
    } catch (error) {
        console.error('Error in agreement process:', error);
        hideLoadingScreen();
        alert('There was an error processing your agreement. Please try again or contact support.');
    }
}

function showLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        loadingScreen.classList.add('active');
    }
}

function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        loadingScreen.classList.remove('active');
    }
}

async function sendAgreementToWebhook() {
    try {
        const params = new URLSearchParams(window.location.search);
        const configId = params.get('config');
        
        const payload = {
            configId: configId,
            signature_image: signatureData1 || signatureData2 || null,
            client_name: document.getElementById('clientFullName')?.value || document.getElementById('clientFullName2')?.value || 'N/A',
            client_position: document.getElementById('clientPosition')?.value || document.getElementById('clientPosition2')?.value || 'N/A',
            signed_date: new Date().toISOString(),
            company_name: document.getElementById('clientNameCover')?.textContent || 'N/A',
            filename: `proposal_agreement_${Date.now()}.png`,
            Signed: true
        };
        
        const response = await fetch(SIGNATURE_WEBHOOK, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        
        if (!response.ok) {
            console.error('Agreement webhook error:', response.status);
        } else {
            console.log('Agreement sent to webhook successfully');
        }
    } catch (error) {
        console.error('Error sending agreement to webhook:', error);
    }
}

// ===================================================
// PDF GENERATION USING PDFSHIFT
// ===================================================
const PDFSHIFT_API_KEY = 'sk_b620db3746ace840fc2030d7ff07e49153afbde0';
const PDFSHIFT_API_URL = 'https://api.pdfshift.io/v3/convert/pdf';

async function generateProposalPDF() {
    try {
        console.log('Starting PDF generation with PDFShift...');
        
        const htmlContent = generateProposalPDFContent();
        console.log('HTML content generated');
        
        const requestBody = {
            source: htmlContent,
            sandbox: false,
            landscape: false,
            use_print: false,
            format: 'Letter',
            margin: '0mm'
        };

        const response = await fetch(PDFSHIFT_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + btoa('api:' + PDFSHIFT_API_KEY)
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('PDFShift error:', errorText);
            throw new Error(`PDFShift API error: ${response.status}`);
        }

        const arrayBuffer = await response.arrayBuffer();
        const pdfBlob = new Blob([arrayBuffer], { type: 'application/pdf' });
        console.log('PDF generated successfully');
        
        return pdfBlob;

    } catch (error) {
        console.error('Error generating PDF:', error);
        throw error;
    }
}

function generateProposalPDFContent() {
    const pages = document.querySelectorAll('.page');
    let pagesHTML = '';
    
    pages.forEach((page) => {
        const pageClone = page.cloneNode(true);
        
        const downloadSection = pageClone.querySelector('.download-section');
        if (downloadSection) {
            downloadSection.remove();
        }
        
        pagesHTML += pageClone.outerHTML;
    });
    
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Level One - Proposal</title>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Source+Sans+Pro:wght@300;400;600;700&display=swap" rel="stylesheet">
    <style>
        ${getInlineStyles()}
    </style>
</head>
<body>
    ${pagesHTML}
</body>
</html>
    `;

    return htmlContent;
}

function getInlineStyles() {
    return `
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Source Sans Pro', sans-serif; background: #f5f5f5; color: #333; line-height: 1.6; }
        .page { width: 8.5in; height: 11in; margin: 20px auto; background: white; page-break-after: always; position: relative; overflow: hidden; }
        @page { margin: 15mm; }
    `;
}

async function downloadProposal() {
    try {
        const downloadBtn = document.querySelector('.btn-download-final');
        const originalText = downloadBtn.textContent;
        downloadBtn.textContent = 'Preparing Download...';
        downloadBtn.disabled = true;
        
        let pdfBlob = window.generatedProposalPDF;
        
        if (!pdfBlob) {
            console.log('Generating new PDF...');
            pdfBlob = await generateProposalPDF();
        }
        
        const companyName = document.getElementById('clientNameCover')?.textContent || 'Client';
        const cleanName = companyName.replace(/[^a-z0-9]/gi, '_');
        const filename = `Level_One_Proposal_${cleanName}_${Date.now()}.pdf`;
        
        downloadPDF(pdfBlob, filename);
        
        downloadBtn.textContent = originalText;
        downloadBtn.disabled = false;
        
    } catch (error) {
        console.error('Error downloading PDF:', error);
        alert('There was an error downloading the PDF. Please try again or contact support.');
        
        const downloadBtn = document.querySelector('.btn-download-final');
        if (downloadBtn) {
            downloadBtn.textContent = 'Download Your Copy';
            downloadBtn.disabled = false;
        }
    }
}

function downloadPDF(pdfBlob, filename) {
    const url = window.URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || `Level_One_Proposal_${Date.now()}.pdf`;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    
    setTimeout(() => {
        link.click();
        
        setTimeout(() => {
            if (document.body.contains(link)) {
                document.body.removeChild(link);
            }
            window.URL.revokeObjectURL(url);
        }, 250);
    }, 100);
}

// ===================================================
// INITIALIZATION
// ===================================================
document.addEventListener('DOMContentLoaded', function() {
    loadProposalData();
});
