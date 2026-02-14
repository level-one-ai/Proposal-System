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
            
            console.log('Response status:', response.status);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Webhook error response:', errorText);
                throw new Error(`Failed to load proposal: ${response.status}`);
            }
            
            // Animate loading bar to 60%
            loadingBar.style.width = '60%';
            
            // Get response text first for better error handling
            const responseText = await response.text();
            console.log('Raw response:', responseText);
            
            let config;
            try {
                config = JSON.parse(responseText);
            } catch (jsonError) {
                console.error('JSON parsing error:', jsonError);
                console.error('Response text around error position:', responseText.substring(4000, 4100));
                throw new Error('Invalid JSON response from webhook. Check Make.com scenario output format.');
            }
            
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
            alert('Unable to load this proposal. Please contact Level One support.\n\nError: ' + error.message);
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
        
        const htmlContent = await generateProposalPDFContent();
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

async function generateProposalPDFContent() {
    // Get all the populated data from the current page
    const getData = (id) => {
        const elem = document.getElementById(id);
        return elem ? elem.textContent : '';
    };
    
    // Get signature data
    const clientSigImg = document.getElementById('clientSigImg')?.src || 
                        document.getElementById('clientSigImg2')?.src || '';
    const clientName = document.getElementById('clientNameDisplay')?.textContent || 
                      document.getElementById('clientNameDisplay2')?.textContent || '';
    const clientPosition = document.getElementById('clientPositionDisplay')?.textContent || 
                          document.getElementById('clientPositionDisplay2')?.textContent || '';
    const clientDate = new Date().toLocaleDateString();
    
    // Get milestone tasks as HTML lists
    const getMilestoneTasks = (milestoneNum) => {
        const tasksContainer = document.getElementById(`milestone${milestoneNum}Tasks`);
        if (!tasksContainer) return '';
        
        const tasks = Array.from(tasksContainer.querySelectorAll('li'));
        return tasks.map(task => `<li>${task.textContent}</li>`).join('');
    };
    
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Level One - Proposal</title>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Source+Sans+Pro:wght@300;400;600;700&display=swap" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        :root {
            --primary-orange: #e67e22;
            --dark-bg: #0a0a0a;
            --card-bg: #141414;
            --text-light: #ffffff;
            --text-muted: #a0a0a0;
            --border-light: #333;
        }
        body { font-family: 'Source Sans Pro', sans-serif; background: #f5f5f5; color: #333; line-height: 1.6; }
        .page { width: 8.5in; height: 11in; margin: 20px auto; background: white; box-shadow: 0 0 20px rgba(0,0,0,0.1); page-break-after: always; position: relative; overflow: hidden; }
        .page-1 { background: url('https://github.com/level-one-ai/Proposal-System/blob/main/processed-image.png?raw=true') center center / cover no-repeat; color: var(--text-light); display: flex; flex-direction: column; justify-content: space-between; padding: 0; position: relative; }
        .page-1::before { content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.8) 100%); z-index: 1; }
        .cover-content { position: relative; z-index: 2; padding: 40px 55px 35px 55px; height: 100%; display: flex; flex-direction: column; justify-content: space-between; }
        .logo-section { display: flex; align-items: center; }
        .logo-main { height: 70px; width: auto; display: block; }
        .cover-center { flex: 1; display: flex; flex-direction: column; justify-content: center; max-width: 85%; padding: 15px 0; }
        .proposal-label { font-size: 12px; text-transform: uppercase; letter-spacing: 3px; color: var(--primary-orange); margin-bottom: 12px; font-weight: 600; }
        .proposal-title { font-family: 'Playfair Display', serif; font-size: 38px; font-weight: 700; line-height: 1.2; margin: 0 0 20px 0; color: var(--text-light); }
        .proposal-subtitle { font-size: 14px; color: rgba(255,255,255,0.85); max-width: 520px; line-height: 1.6; font-weight: 300; }
        .cover-footer { display: flex; justify-content: space-between; align-items: flex-end; padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.2); }
        .cover-footer-item { font-size: 11px; color: rgba(255,255,255,0.7); }
        .cover-footer-item strong { display: block; color: var(--text-light); font-size: 12px; margin-top: 2px; }
        .dark-page { background: var(--dark-bg); color: var(--text-light); padding: 50px 55px; }
        .dark-page .page-header { font-family: 'Playfair Display', serif; font-size: 28px; font-weight: 600; color: var(--text-light); margin-bottom: 8px; border: none; padding-bottom: 0; }
        .dark-page .page-subheader { font-size: 13px; color: var(--text-muted); margin-bottom: 30px; line-height: 1.7; max-width: 90%; }
        .content-page { padding: 50px 55px; }
        .page-header { font-family: 'Playfair Display', serif; font-size: 26px; font-weight: 600; color: #000; margin-bottom: 8px; border-bottom: 2px solid #000; padding-bottom: 12px; }
        .page-subheader { font-size: 13px; color: #666; margin-bottom: 25px; line-height: 1.7; }
        .bullet-list { list-style: disc; margin: 20px 0; padding-left: 25px; }
        .bullet-list li { font-size: 13px; line-height: 1.7; margin-bottom: 12px; color: #444; }
        .letter-content { font-size: 13px; line-height: 1.8; margin-bottom: 15px; }
        .letter-content p { margin-bottom: 12px; }
        .signature-line { margin-top: 25px; font-size: 13px; }
        .problem-list, .solution-list { list-style: none; margin: 20px 0; }
        .problem-list li, .solution-list li { padding: 18px 20px; margin-bottom: 12px; background: var(--card-bg); border-left: 3px solid var(--primary-orange); font-size: 13px; line-height: 1.6; border-radius: 0 8px 8px 0; }
        .problem-list li strong, .solution-list li strong { display: block; font-size: 14px; margin-bottom: 6px; color: var(--text-light); font-weight: 600; }
        .problem-list li span, .solution-list li span { color: var(--text-muted); }
        .closing-statement { margin-top: 25px; padding: 18px 20px; background: rgba(230, 126, 34, 0.15); border-left: 3px solid var(--primary-orange); font-style: italic; font-size: 13px; line-height: 1.7; color: var(--text-muted); border-radius: 0 8px 8px 0; }
        .timeline-grid-container { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin: 25px 0; }
        .timeline-grid-item { background: var(--card-bg); border-radius: 8px; padding: 20px 15px; border-left: 4px solid var(--primary-orange); display: flex; flex-direction: column; align-items: center; text-align: center; min-height: 220px; }
        .timeline-hexagon { width: 50px; height: 50px; position: relative; margin-bottom: 15px; }
        .timeline-hexagon::before { content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: var(--primary-orange); clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%); }
        .hexagon-number { position: relative; z-index: 1; display: flex; align-items: center; justify-content: center; height: 100%; font-family: 'Playfair Display', serif; font-size: 20px; font-weight: 700; color: white; }
        .timeline-grid-content { flex: 1; display: flex; flex-direction: column; }
        .timeline-grid-content h3 { font-family: 'Playfair Display', serif; font-size: 14px; font-weight: 600; color: var(--text-light); margin-bottom: 6px; line-height: 1.3; }
        .timeline-grid-date { font-size: 10px; color: var(--primary-orange); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 10px; }
        .timeline-grid-desc { font-size: 11px; color: var(--text-muted); line-height: 1.5; }
        .milestone-tasks { list-style: none; padding: 0; margin-top: 10px; text-align: left; }
        .milestone-tasks li { font-size: 9px; color: var(--text-muted); padding: 3px 0; padding-left: 12px; position: relative; line-height: 1.4; }
        .milestone-tasks li::before { content: '→'; position: absolute; left: 0; color: var(--primary-orange); font-size: 9px; }
        .timeline-footer { margin-top: 15px; padding: 12px 16px; background: rgba(230, 126, 34, 0.1); border-left: 3px solid var(--primary-orange); font-size: 11px; line-height: 1.6; color: var(--text-muted); border-radius: 0 6px 6px 0; }
        .investment-section { margin: 10px 0; }
        .investment-block { background: #fafafa; border: 1px solid #e5e5e5; border-radius: 6px; padding: 12px 15px; margin-bottom: 12px; }
        .investment-block-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px; }
        .investment-block-header h3 { font-family: 'Playfair Display', serif; font-size: 13px; font-weight: 600; color: #000; margin: 0; }
        .investment-percentage { font-size: 11px; font-weight: 600; color: var(--primary-orange); background: rgba(230, 126, 34, 0.1); padding: 2px 8px; border-radius: 12px; }
        .investment-block-desc { font-size: 10px; color: #666; margin-bottom: 8px; line-height: 1.4; }
        .investment-includes { background: #fff; border: 1px solid #e5e5e5; border-radius: 4px; padding: 8px 10px; margin-bottom: 8px; }
        .investment-includes-title { font-size: 9px; font-weight: 600; color: #333; margin-bottom: 5px; }
        .investment-includes-list { list-style: none; padding: 0; margin: 0; }
        .investment-includes-list li { font-size: 9px; color: #555; padding: 2px 0; padding-left: 12px; position: relative; line-height: 1.3; }
        .investment-includes-list li::before { content: '✓'; position: absolute; left: 0; color: var(--primary-orange); font-size: 8px; }
        .investment-milestone-breakdown { background: #fff; border: 1px solid #e5e5e5; border-radius: 4px; margin-bottom: 8px; overflow: hidden; }
        .milestone-payment-row { display: flex; justify-content: space-between; align-items: center; padding: 6px 10px; font-size: 9px; border-bottom: 1px solid #eee; }
        .milestone-payment-row:last-child { border-bottom: none; }
        .milestone-payment-row span:first-child { color: #555; }
        .milestone-payment-row span:last-child { font-weight: 600; color: #333; }
        .investment-block-amount { font-size: 20px; font-weight: 700; color: #000; text-align: right; }
        .investment-total { display: flex; justify-content: space-between; align-items: center; padding: 15px 20px; background: #000; color: #fff; border-radius: 6px; margin: 15px 0; }
        .investment-total-label { font-family: 'Playfair Display', serif; font-size: 14px; font-weight: 600; }
        .investment-total-amount { font-size: 22px; font-weight: 700; }
        .investment-notes { background: #f9f9f9; border: 1px solid #e0e0e0; border-radius: 4px; padding: 10px 12px; margin-bottom: 12px; }
        .investment-notes p { font-size: 9px; line-height: 1.5; color: #555; margin-bottom: 5px; }
        .investment-notes p:last-child { margin-bottom: 0; }
        .investment-notes strong { color: #333; }
        .platform-section { margin-top: 12px; padding-top: 12px; border-top: 1px solid #ddd; }
        .platform-header { font-family: 'Playfair Display', serif; font-size: 11px; font-weight: 600; margin-bottom: 8px; color: #000; }
        .platform-fees-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .platform-fee-item { display: flex; justify-content: space-between; align-items: center; padding: 10px 12px; background: #fafafa; border: 1px solid #e5e5e5; border-radius: 4px; }
        .platform-fee-name { font-size: 10px; color: #333; }
        .platform-fee-price { font-size: 10px; font-weight: 600; color: #000; }
        .terms-content { font-size: 11px; line-height: 1.7; margin-bottom: 20px; }
        .terms-content h3 { font-family: 'Playfair Display', serif; font-size: 13px; font-weight: 600; margin: 18px 0 8px 0; color: #000; }
        .terms-content p { margin-bottom: 10px; text-align: justify; color: #444; }
        .signature-section { display: grid; grid-template-columns: 1fr 1fr; gap: 25px; margin-top: 30px; }
        .signature-box { border: 1px solid #ddd; border-radius: 6px; overflow: hidden; background: white; }
        .signature-box h4 { font-family: 'Playfair Display', serif; padding: 10px 15px; font-size: 12px; font-weight: 600; text-align: center; background: #f8f8f8; border-bottom: 1px solid #ddd; margin: 0; }
        .signature-display { padding: 0; }
        .sig-info-row { display: flex; padding: 8px 15px; background: #fafafa; border-bottom: 1px solid #eee; font-size: 10px; }
        .sig-info-label { font-weight: 600; color: #666; width: 60px; }
        .sig-info-value { color: #333; flex: 1; }
        .sig-divider { height: 1px; background: #eee; margin: 0; }
        .sig-image-container { padding: 15px; background: white; border: 1px solid #eee; margin: 10px; border-radius: 4px; height: 80px; display: flex; align-items: center; justify-content: center; }
        .signature-display img { max-width: 100%; height: auto; max-height: 60px; display: block; }
        .sig-date-row { padding: 8px 15px; background: #fafafa; border-top: 1px solid #eee; font-size: 9px; color: #666; text-align: center; }
        @media print { body { background: white; } .page { margin: 0; box-shadow: none; } }
    </style>
</head>
<body>
    <!-- Page 1: Cover -->
    <div class="page page-1">
        <div class="cover-content">
            <div class="logo-section">
                <img src="https://github.com/level-one-ai/Proposal-System/blob/main/level-one-logo.png?raw=true" alt="Level One Logo" class="logo-main">
            </div>
            <div class="cover-center">
                <div class="proposal-label">Project Proposal</div>
                <h1 class="proposal-title">${getData('proposalTitlePrefix')} ${getData('clientNameCover')}</h1>
                <p class="proposal-subtitle">${getData('proposalSubtitle')}</p>
            </div>
            <div class="cover-footer">
                <div class="cover-footer-item">Prepared by <strong>Dean</strong></div>
                <div class="cover-footer-item">Date <strong>February 2026</strong></div>
                <div class="cover-footer-item">Contact <strong>dean@levelone.digital</strong></div>
            </div>
        </div>
    </div>

    <!-- Page 2: Introduction -->
    <div class="page content-page">
        <h2 class="page-header">Understanding Your Challenges</h2>
        <p class="page-subheader">Before we can solve a problem, we need to understand it. This section outlines the key challenges we've identified through our discussions, and why addressing them is crucial for your business growth.</p>
        <div class="letter-content">
            <p>Dear ${getData('clientName')},</p>
            <p style="margin-top: 15px;">Thank you for taking the time to discuss your business needs with us. After our conversations, it's clear that you're facing several operational challenges that are limiting your growth potential and consuming valuable resources that could be better spent elsewhere.</p>
            <p>The good news? Every challenge you're facing has a solution. Modern automation and AI technologies can transform these pain points into competitive advantages. Below, we've summarized the key issues we'll be addressing together.</p>
        </div>
        <ul class="bullet-list">
            <li>${getData('problem1')}</li>
            <li>${getData('problem2')}</li>
            <li>${getData('problem3')}</li>
            <li>${getData('problem4')}</li>
        </ul>
        <div class="letter-content" style="margin-top: 25px;">
            <p>The following pages detail exactly how we'll tackle each of these challenges, the timeline for implementation, and the investment required. If you have any questions at any point, please reach out to me directly at <strong>dean@levelone.digital</strong>.</p>
            <p class="signature-line" style="margin-top: 30px;">Looking forward to working together,<br><strong>Dean</strong></p>
        </div>
    </div>

    <!-- Page 3: Problems -->
    <div class="page dark-page">
        <h2 class="page-header">The Problems We'll Solve</h2>
        <p class="page-subheader">Each challenge below represents not just a problem, but an opportunity. By automating these processes, you'll free up resources, reduce errors, and create a foundation for scalable growth.</p>
        <ul class="problem-list">
            <li><strong>${getData('detailProblem1Title')}</strong><span>${getData('detailProblem1Desc')}</span></li>
            <li><strong>${getData('detailProblem2Title')}</strong><span>${getData('detailProblem2Desc')}</span></li>
            <li><strong>${getData('detailProblem3Title')}</strong><span>${getData('detailProblem3Desc')}</span></li>
            <li><strong>${getData('detailProblem4Title')}</strong><span>${getData('detailProblem4Desc')}</span></li>
        </ul>
        <div class="closing-statement">These aren't just technical improvements—they're business transformations. Each solution we implement will directly impact your bottom line through reduced costs, increased conversions, and improved customer satisfaction.</div>
    </div>

    <!-- Page 4: Solutions -->
    <div class="page dark-page">
        <h2 class="page-header">Our Solution</h2>
        <p class="page-subheader">We've designed a comprehensive solution that addresses each of your challenges through strategic automation and AI integration. Here's how we'll transform your operations.</p>
        <ul class="solution-list">
            <li><strong>${getData('solution0Title')}</strong><span>${getData('solution0Desc')}</span></li>
            <li><strong>${getData('solution1Title')}</strong><span>${getData('solution1Desc')}</span></li>
            <li><strong>${getData('solution2Title')}</strong><span>${getData('solution2Desc')}</span></li>
            <li><strong>${getData('solution3Title')}</strong><span>${getData('solution3Desc')}</span></li>
            <li><strong>${getData('solution4Title')}</strong><span>${getData('solution4Desc')}</span></li>
            <li><strong>${getData('solution5Title')}</strong><span>${getData('solution5Desc')}</span></li>
        </ul>
        <div class="closing-statement">This integrated approach ensures every component works together seamlessly. The result is a platform that runs smarter, responds faster, and grows with your business.</div>
    </div>

    <!-- Page 5: Timeline -->
    <div class="page dark-page">
        <h2 class="page-header">Project Timeline</h2>
        <p class="page-subheader">We've structured this project into clear milestones, each building upon the last. Every phase includes built-in review points and your approval before we proceed.</p>
        <div class="timeline-grid-container">
            <div class="timeline-grid-item">
                <div class="timeline-hexagon"><div class="hexagon-number">01</div></div>
                <div class="timeline-grid-content">
                    <h3>${getData('milestone1Title')}</h3>
                    <p class="timeline-grid-date">${getData('milestone1Date')}</p>
                    <p class="timeline-grid-desc">${getData('milestone1Desc')}</p>
                    <ul class="milestone-tasks">${getMilestoneTasks(1)}</ul>
                </div>
            </div>
            <div class="timeline-grid-item">
                <div class="timeline-hexagon"><div class="hexagon-number">02</div></div>
                <div class="timeline-grid-content">
                    <h3>${getData('milestone2Title')}</h3>
                    <p class="timeline-grid-date">${getData('milestone2Date')}</p>
                    <p class="timeline-grid-desc">${getData('milestone2Desc')}</p>
                    <ul class="milestone-tasks">${getMilestoneTasks(2)}</ul>
                </div>
            </div>
            <div class="timeline-grid-item">
                <div class="timeline-hexagon"><div class="hexagon-number">03</div></div>
                <div class="timeline-grid-content">
                    <h3>${getData('milestone3Title')}</h3>
                    <p class="timeline-grid-date">${getData('milestone3Date')}</p>
                    <p class="timeline-grid-desc">${getData('milestone3Desc')}</p>
                    <ul class="milestone-tasks">${getMilestoneTasks(3)}</ul>
                </div>
            </div>
            <div class="timeline-grid-item">
                <div class="timeline-hexagon"><div class="hexagon-number">04</div></div>
                <div class="timeline-grid-content">
                    <h3>${getData('milestone4Title')}</h3>
                    <p class="timeline-grid-date">${getData('milestone4Date')}</p>
                    <p class="timeline-grid-desc">${getData('milestone4Desc')}</p>
                    <ul class="milestone-tasks">${getMilestoneTasks(4)}</ul>
                </div>
            </div>
            <div class="timeline-grid-item">
                <div class="timeline-hexagon"><div class="hexagon-number">05</div></div>
                <div class="timeline-grid-content">
                    <h3>${getData('milestone5Title')}</h3>
                    <p class="timeline-grid-date">${getData('milestone5Date')}</p>
                    <p class="timeline-grid-desc">${getData('milestone5Desc')}</p>
                    <ul class="milestone-tasks">${getMilestoneTasks(5)}</ul>
                </div>
            </div>
            <div class="timeline-grid-item">
                <div class="timeline-hexagon"><div class="hexagon-number">06</div></div>
                <div class="timeline-grid-content">
                    <h3>${getData('milestone6Title')}</h3>
                    <p class="timeline-grid-date">${getData('milestone6Date')}</p>
                    <p class="timeline-grid-desc">${getData('milestone6Desc')}</p>
                    <ul class="milestone-tasks">${getMilestoneTasks(6)}</ul>
                </div>
            </div>
        </div>
        <div class="timeline-footer">Each milestone includes built-in review points and your approval before we proceed. This ensures you're never surprised and always in control of the project's direction.</div>
    </div>

    <!-- Page 6: Investment -->
    <div class="page content-page">
        <h2 class="page-header" style="margin-bottom: 20px;">Investment Required</h2>
        <div class="investment-section">
            <div class="investment-block">
                <div class="investment-block-header">
                    <h3>${getData('depositTitle')}</h3>
                    <span class="investment-percentage">${getData('depositPercentage')}</span>
                </div>
                <p class="investment-block-desc">${getData('depositDesc')}</p>
                <div class="investment-includes">
                    <div class="investment-includes-title">${getData('depositCoversTitle')}</div>
                    <ul class="investment-includes-list">
                        <li>${getData('depositInclude1')}</li>
                        <li>${getData('depositInclude2')}</li>
                        <li>${getData('depositInclude3')}</li>
                        <li>${getData('depositInclude4')}</li>
                        <li>${getData('depositInclude5')}</li>
                    </ul>
                </div>
                <div class="investment-block-amount">${getData('depositAmount')}</div>
            </div>
            <div class="investment-block">
                <div class="investment-block-header">
                    <h3>${getData('remainingTitle')}</h3>
                    <span class="investment-percentage">${getData('remainingPercentage')}</span>
                </div>
                <p class="investment-block-desc">${getData('remainingDesc')}</p>
                <div class="investment-includes">
                    <div class="investment-includes-title">${getData('remainingCoversTitle')}</div>
                    <ul class="investment-includes-list">
                        <li>${getData('remainingInclude1')}</li>
                        <li>${getData('remainingInclude2')}</li>
                        <li>${getData('remainingInclude3')}</li>
                        <li>${getData('remainingInclude4')}</li>
                    </ul>
                </div>
                <div class="investment-milestone-breakdown">
                    <div class="milestone-payment-row"><span>${getData('milestone3Payment')}</span><span>${getData('milestone3Amount')}</span></div>
                    <div class="milestone-payment-row"><span>${getData('milestone4Payment')}</span><span>${getData('milestone4Amount')}</span></div>
                    <div class="milestone-payment-row"><span>${getData('milestone56Payment')}</span><span>${getData('milestone56Amount')}</span></div>
                </div>
                <div class="investment-block-amount">${getData('remainingAmount')}</div>
            </div>
            <div class="investment-total">
                <span class="investment-total-label">Project Total</span>
                <span class="investment-total-amount">${getData('projectTotal')}</span>
            </div>
            <div class="investment-notes">
                <p><strong>Payment Structure:</strong> ${getData('paymentStructure')}</p>
                <p><strong>Milestone Sign-off:</strong> ${getData('milestoneSignoff')}</p>
            </div>
            <div class="platform-section">
                <h3 class="platform-header">Ongoing Platform Fees</h3>
                <div class="platform-fees-grid">
                    <div class="platform-fee-item">
                        <span class="platform-fee-name">${getData('platform1Name')}</span>
                        <span class="platform-fee-price">${getData('platform1Price')}</span>
                    </div>
                    <div class="platform-fee-item">
                        <span class="platform-fee-name">${getData('platform2Name')}</span>
                        <span class="platform-fee-price">${getData('platform2Price')}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Page 7: Terms -->
    <div class="page content-page">
        <h2 class="page-header">Terms & Conditions</h2>
        <div class="terms-content">
            <p>This agreement is entered into between <strong>Level One</strong> ("Service Provider") and <strong>${getData('clientNameCover')}</strong> ("Client") for the services described in this proposal.</p>
            <h3>1. Scope of Work</h3>
            <p>Level One agrees to fulfill the scope of work as described in the previous pages of this document. Any changes to scope must be agreed upon in writing by both parties and may result in adjusted timelines and costs.</p>
            <h3>2. Payment Terms</h3>
            <p>A 50% deposit is required to commence work. The remaining balance is payable upon completion of each milestone as outlined in the Investment section. Final payment is due upon delivery and client satisfaction with the completed project.</p>
            <h3>3. Timeline</h3>
            <p>The Service Provider will make reasonable efforts to adhere to the timeline outlined in this proposal. Delays caused by client unavailability, delayed feedback, or scope changes may result in adjusted timelines.</p>
            <h3>4. Client Responsibilities</h3>
            <p>The Client agrees to provide timely access to necessary systems, information, and feedback required for project completion. The Client is responsible for the accuracy of information provided and maintaining appropriate backups of their data.</p>
            <h3>5. Acceptance and Signatures</h3>
            <p>By signing below, both parties agree to the terms outlined in this proposal and commit to fulfilling their respective obligations.</p>
        </div>
        <div class="signature-section">
            <div class="signature-box">
                <h4>Level One</h4>
                <div class="signature-display">
                    <div class="sig-info-row"><span class="sig-info-label">Name:</span><span class="sig-info-value">Dean Finlayson</span></div>
                    <div class="sig-info-row"><span class="sig-info-label">Position:</span><span class="sig-info-value">CEO</span></div>
                    <div class="sig-divider"></div>
                    <div class="sig-image-container">
                        <img src="https://github.com/level-one-ai/Proposal-System/blob/main/Screenshot%202026-01-29%2012.12.00.png?raw=true" alt="Level One Signature">
                    </div>
                    <div class="sig-date-row">Date: ${clientDate}</div>
                </div>
            </div>
            <div class="signature-box">
                <h4>${getData('clientNameCover')}</h4>
                <div class="signature-display">
                    <div class="sig-info-row"><span class="sig-info-label">Name:</span><span class="sig-info-value">${clientName}</span></div>
                    <div class="sig-info-row"><span class="sig-info-label">Position:</span><span class="sig-info-value">${clientPosition}</span></div>
                    <div class="sig-divider"></div>
                    <div class="sig-image-container">
                        <img src="${clientSigImg}" alt="Client Signature">
                    </div>
                    <div class="sig-date-row">Date: ${clientDate}</div>
                </div>
            </div>
        </div>
    </div>

    <!-- Page 8: Service Agreement Part 1 -->
    <div class="page content-page">
        <h2 class="page-header">Service Agreement</h2>
        <div class="terms-content">
            <p>This Service Agreement ("Agreement") is made effective as of the date of last signature below between Level One and <strong>${getData('clientNameCover')}</strong>.</p>
            <h3>1. Services</h3>
            <p>The Service Provider agrees to provide e-commerce development and automation services as described in this proposal. Services will be performed in a professional manner in accordance with industry standards.</p>
            <h3>2. Intellectual Property</h3>
            <p>Upon full payment, all custom work products created specifically for this project become the property of the Client. The Service Provider retains rights to pre-existing materials, frameworks, or tools used in delivery. The Service Provider may showcase completed work in portfolios unless otherwise agreed in writing.</p>
            <h3>3. Confidentiality</h3>
            <p>Both parties agree to maintain confidentiality of proprietary or sensitive information shared during this project. This obligation survives termination of this Agreement. Neither party shall disclose confidential information to third parties without prior written consent, except as required by law.</p>
            <h3>4. Warranties and Disclaimers</h3>
            <p>The Service Provider warrants that services will be performed with reasonable care and skill and that deliverables will be free from material defects for 30 days following delivery. The Service Provider makes no warranties regarding third-party integrations, services, or platforms beyond its control.</p>
            <h3>5. Limitation of Liability</h3>
            <p>The Service Provider's total liability under this Agreement shall not exceed the total amount paid by the Client. Neither party shall be liable for indirect, incidental, consequential, or punitive damages.</p>
            <h3>6. Support and Maintenance</h3>
            <p>The Service Provider will provide support as outlined in the scope of work. Post-launch support periods are specified in the investment section. Additional support may be provided at standard hourly rates or through a separate maintenance agreement.</p>
            <h3>7. Termination</h3>
            <p>Either party may terminate this Agreement with written notice if the other party breaches any material term and fails to remedy such breach within 15 days of written notice. Upon termination, the Client shall pay for all services rendered to date. The Service Provider will deliver all completed work upon receipt of payment.</p>
            <h3>8. Force Majeure</h3>
            <p>Neither party shall be liable for failure or delay in performance due to circumstances beyond their reasonable control, including acts of God, natural disasters, war, terrorism, labor disputes, government actions, or technical failures of third-party services.</p>
        </div>
    </div>

    <!-- Page 9: Service Agreement Part 2 -->
    <div class="page content-page">
        <div class="terms-content" style="margin-top: 0;">
            <h3>9. Dispute Resolution</h3>
            <p>Any disputes arising from this Agreement shall first be attempted to be resolved through good faith negotiation. If negotiation fails within 30 days, the parties agree to pursue mediation before resorting to litigation.</p>
            <h3>10. Independent Contractor</h3>
            <p>The Service Provider is an independent contractor and not an employee, partner, or joint venturer of the Client. The Service Provider is responsible for all taxes, insurance, and other obligations related to its business operations.</p>
            <h3>11. Amendments</h3>
            <p>This Agreement may only be amended by a written document signed by both parties. No oral modifications shall be valid.</p>
            <h3>12. Entire Agreement</h3>
            <p>This Agreement, together with the proposal pages, constitutes the entire agreement between the parties and supersedes all prior negotiations and agreements, whether written or oral.</p>
            <h3>13. Governing Law</h3>
            <p>This Agreement shall be governed by and construed in accordance with the laws of the United Kingdom.</p>
        </div>
        <div class="signature-section" style="margin-top: 20px;">
            <div class="signature-box">
                <h4>Level One</h4>
                <div class="signature-display">
                    <div class="sig-info-row"><span class="sig-info-label">Name:</span><span class="sig-info-value">Dean Finlayson</span></div>
                    <div class="sig-info-row"><span class="sig-info-label">Position:</span><span class="sig-info-value">CEO</span></div>
                    <div class="sig-divider"></div>
                    <div class="sig-image-container">
                        <img src="https://github.com/level-one-ai/Proposal-System/blob/main/Screenshot%202026-01-29%2012.12.00.png?raw=true" alt="Level One Signature">
                    </div>
                    <div class="sig-date-row">Date: ${clientDate}</div>
                </div>
            </div>
            <div class="signature-box">
                <h4>${getData('clientNameCover')}</h4>
                <div class="signature-display">
                    <div class="sig-info-row"><span class="sig-info-label">Name:</span><span class="sig-info-value">${clientName}</span></div>
                    <div class="sig-info-row"><span class="sig-info-label">Position:</span><span class="sig-info-value">${clientPosition}</span></div>
                    <div class="sig-divider"></div>
                    <div class="sig-image-container">
                        <img src="${clientSigImg}" alt="Client Signature">
                    </div>
                    <div class="sig-date-row">Date: ${clientDate}</div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
    `;

    return htmlContent;
}

function getInlineStyles() {
    // This function is no longer needed but kept for compatibility
    return '';
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
