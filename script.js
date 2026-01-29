// State management
let clientSignatureData1 = null;
let clientSignatureData2 = null;
let clientFormData = {
    name: '',
    position: '',
    date: ''
};

// Make.com webhook URL - REPLACE WITH YOUR ACTUAL WEBHOOK URL
const WEBHOOK_URL = 'YOUR_MAKE_COM_WEBHOOK_URL_HERE';

// Timeline hexagon interaction
function showMilestone(num) {
    const placeholder = document.getElementById('milestone-placeholder');
    if (placeholder) {
        placeholder.style.display = 'none';
    }
    
    document.querySelectorAll('.hexagon').forEach(hex => {
        hex.classList.remove('active');
    });
    
    document.querySelector(`.hexagon[data-milestone="${num}"]`).classList.add('active');
    
    document.querySelectorAll('.milestone-content').forEach(content => {
        content.classList.remove('active');
    });
    
    document.getElementById(`milestone-${num}`).classList.add('active');
}

// URL Parameter Handling
function loadURLParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    const editableElements = document.querySelectorAll('.editable');
    
    editableElements.forEach(element => {
        const paramValue = urlParams.get(element.id);
        if (paramValue) {
            element.textContent = decodeURIComponent(paramValue);
        }
    });

    // Update client signature headers with company name
    const clientCompanyName = document.getElementById('termsClientName').textContent;
    document.getElementById('clientSignatureHeader').textContent = clientCompanyName;
    document.getElementById('clientSignatureHeader2').textContent = clientCompanyName;
}

// Pre-fill Level One signatures with 5-minute-ago timestamp
function prefillProviderSignatures() {
    const signedDate = new Date(Date.now() - 5 * 60 * 1000);
    const dateStr = signedDate.toLocaleDateString('en-GB', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    const timeStr = signedDate.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit'
    });
    
    document.getElementById('providerDate').textContent = `Signed: ${dateStr} at ${timeStr}`;
    document.getElementById('providerDate2').textContent = `Signed: ${dateStr} at ${timeStr}`;
}

// Check if first form is complete
function checkFormCompletion() {
    const fullName = document.getElementById('clientFullName').value.trim();
    const position = document.getElementById('clientPosition').value.trim();
    const submitBtn = document.getElementById('submitClientSig');
    
    if (fullName && position && clientSignatureData1) {
        submitBtn.disabled = false;
    } else {
        submitBtn.disabled = true;
    }
}

// Check if second form is complete
function checkFormCompletion2() {
    const fullName = document.getElementById('clientFullName2').value.trim();
    const position = document.getElementById('clientPosition2').value.trim();
    const submitBtn = document.getElementById('submitClientSig2');
    
    if (fullName && position && clientSignatureData2) {
        submitBtn.disabled = false;
    } else {
        submitBtn.disabled = true;
    }
}

// Submit first client signature
function submitClientSignature() {
    const fullName = document.getElementById('clientFullName').value.trim();
    const position = document.getElementById('clientPosition').value.trim();
    
    if (!fullName || !position || !clientSignatureData1) {
        alert('Please complete all fields');
        return;
    }

    // Hide form
    document.getElementById('clientForm').classList.add('hidden');
    
    // Show signature display
    const display = document.getElementById('clientSignatureDisplay');
    document.getElementById('clientNameDisplay').textContent = fullName;
    document.getElementById('clientPositionDisplay').textContent = position;
    document.getElementById('clientSigImg').src = clientSignatureData1;
    
    const today = new Date();
    const dateStr = today.toLocaleDateString('en-GB', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    const timeStr = today.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit'
    });
    
    // Store form data
    clientFormData.name = fullName;
    clientFormData.position = position;
    clientFormData.date = `${dateStr} at ${timeStr}`;
    
    document.getElementById('clientDate').textContent = `Signed: ${dateStr} at ${timeStr}`;
    
    display.classList.add('show');
}

// Submit second client signature
function submitClientSignature2() {
    const fullName = document.getElementById('clientFullName2').value.trim();
    const position = document.getElementById('clientPosition2').value.trim();
    
    if (!fullName || !position || !clientSignatureData2) {
        alert('Please complete all fields');
        return;
    }

    // Hide form
    document.getElementById('clientForm2').classList.add('hidden');
    
    // Show signature display
    const display = document.getElementById('clientSignatureDisplay2');
    document.getElementById('clientNameDisplay2').textContent = fullName;
    document.getElementById('clientPositionDisplay2').textContent = position;
    document.getElementById('clientSigImg2').src = clientSignatureData2;
    
    const today = new Date();
    const dateStr = today.toLocaleDateString('en-GB', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    const timeStr = today.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit'
    });
    
    // Store form data (update if different from first signature)
    if (!clientFormData.name) {
        clientFormData.name = fullName;
        clientFormData.position = position;
        clientFormData.date = `${dateStr} at ${timeStr}`;
    }
    
    document.getElementById('clientDate2').textContent = `Signed: ${dateStr} at ${timeStr}`;
    
    display.classList.add('show');
}

// ===== SIGNATURE CANVAS FUNCTIONALITY =====
let currentSignatureForm = null;
let canvas = null;
let ctx = null;
let isDrawing = false;
let lastX = 0;
let lastY = 0;

// Open signature modal
function openSignatureModal(formNumber) {
    currentSignatureForm = formNumber;
    const modal = document.getElementById('signatureModal');
    modal.classList.add('active');
    
    // Initialize canvas
    canvas = document.getElementById('signatureCanvas');
    ctx = canvas.getContext('2d');
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Setup event listeners
    setupCanvasListeners();
}

// Close signature modal
function closeSignatureModal() {
    const modal = document.getElementById('signatureModal');
    modal.classList.remove('active');
    currentSignatureForm = null;
}

// Clear canvas
function clearCanvas() {
    if (ctx && canvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}

// Setup canvas drawing listeners
function setupCanvasListeners() {
    // Mouse events
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
    
    // Touch events
    canvas.addEventListener('touchstart', handleTouchStart);
    canvas.addEventListener('touchmove', handleTouchMove);
    canvas.addEventListener('touchend', stopDrawing);
}

function startDrawing(e) {
    isDrawing = true;
    const rect = canvas.getBoundingClientRect();
    lastX = e.clientX - rect.left;
    lastY = e.clientY - rect.top;
}

function draw(e) {
    if (!isDrawing) return;
    
    const rect = canvas.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;
    
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(currentX, currentY);
    ctx.stroke();
    
    lastX = currentX;
    lastY = currentY;
}

function stopDrawing() {
    isDrawing = false;
}

function handleTouchStart(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    lastX = touch.clientX - rect.left;
    lastY = touch.clientY - rect.top;
    isDrawing = true;
}

function handleTouchMove(e) {
    if (!isDrawing) return;
    e.preventDefault();
    
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const currentX = touch.clientX - rect.left;
    const currentY = touch.clientY - rect.top;
    
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(currentX, currentY);
    ctx.stroke();
    
    lastX = currentX;
    lastY = currentY;
}

// Save signature
function saveSignature() {
    if (!canvas) return;
    
    // Check if canvas is empty
    const canvasData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixelData = canvasData.data;
    let isEmpty = true;
    
    for (let i = 0; i < pixelData.length; i += 4) {
        if (pixelData[i + 3] !== 0) {
            isEmpty = false;
            break;
        }
    }
    
    if (isEmpty) {
        alert('Please draw your signature before submitting');
        return;
    }
    
    // Convert canvas to data URL
    const signatureDataURL = canvas.toDataURL('image/png');
    
    // Save to appropriate form
    if (currentSignatureForm === 1) {
        clientSignatureData1 = signatureDataURL;
        const preview = document.getElementById('clientSigPreview');
        preview.innerHTML = `<img src="${signatureDataURL}" alt="Signature Preview">`;
        checkFormCompletion();
    } else if (currentSignatureForm === 2) {
        clientSignatureData2 = signatureDataURL;
        const preview = document.getElementById('clientSigPreview2');
        preview.innerHTML = `<img src="${signatureDataURL}" alt="Signature Preview">`;
        checkFormCompletion2();
    }
    
    closeSignatureModal();
}

// ===== PREVIEW FUNCTIONALITY =====
function openPreview() {
    // Check if both signatures are submitted
    const sig1Complete = document.getElementById('clientSignatureDisplay').classList.contains('show');
    const sig2Complete = document.getElementById('clientSignatureDisplay2').classList.contains('show');
    
    if (!sig1Complete || !sig2Complete) {
        alert('Please complete both signature sections before previewing the proposal.');
        return;
    }

    const modal = document.getElementById('previewModal');
    const previewPages = document.getElementById('previewPages');
    
    // Clear previous content
    previewPages.innerHTML = '';
    
    // Clone all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        const clonedPage = page.cloneNode(true);
        clonedPage.classList.add('no-highlights');
        previewPages.appendChild(clonedPage);
    });
    
    modal.classList.add('active');
    
    // Scroll to top
    modal.scrollTop = 0;
}

function closePreview() {
    const modal = document.getElementById('previewModal');
    modal.classList.remove('active');
}

// ===== AGREE TO PROPOSAL =====
async function agreeToProposal() {
    // Collect all editable data
    const proposalData = {
        timestamp: new Date().toISOString(),
        client: {
            name: clientFormData.name,
            position: clientFormData.position,
            company: document.getElementById('termsClientName').textContent,
            signatureDate: clientFormData.date
        },
        proposal: {
            title: document.getElementById('proposalTitlePrefix').textContent + ' ' + document.getElementById('clientNameCover').textContent,
            subtitle: document.getElementById('proposalSubtitle').textContent,
            totalInvestment: document.getElementById('projectTotal').textContent
        },
        signatures: {
            signature1: clientSignatureData1,
            signature2: clientSignatureData2
        }
    };

    // Add all editable fields
    const editableElements = document.querySelectorAll('.editable, .editable-subtitle');
    proposalData.customFields = {};
    editableElements.forEach(element => {
        if (element.id) {
            proposalData.customFields[element.id] = element.textContent;
        }
    });

    try {
        // Send to Make.com webhook
        const response = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(proposalData)
        });

        if (!response.ok) {
            throw new Error('Failed to send data to webhook');
        }

        // Close preview modal
        closePreview();
        
        // Show thank you modal
        const thankyouModal = document.getElementById('thankyouModal');
        thankyouModal.classList.add('active');

    } catch (error) {
        console.error('Error sending data:', error);
        alert('There was an error submitting your agreement. Please try again or contact support.');
    }
}

// ===== DOWNLOAD PROPOSAL =====
function downloadProposal() {
    const thankyouModal = document.getElementById('thankyouModal');
    thankyouModal.classList.remove('active');
    
    // Trigger print dialog (allows save as PDF)
    window.print();
    
    // After a short delay, show final thank you and close
    setTimeout(() => {
        alert('Thank you for your business! This window will now close.');
        window.close();
        
        // If window.close() doesn't work (some browsers block it), show message
        setTimeout(() => {
            if (!window.closed) {
                document.body.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100vh; font-family: sans-serif; text-align: center;"><div><h1>Thank You!</h1><p>You may now close this window.</p></div></div>';
            }
        }, 100);
    }, 1000);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    loadURLParameters();
    prefillProviderSignatures();
    
    // Add event listeners for client forms
    document.getElementById('clientFullName').addEventListener('input', checkFormCompletion);
    document.getElementById('clientPosition').addEventListener('input', checkFormCompletion);
    document.getElementById('clientFullName2').addEventListener('input', checkFormCompletion2);
    document.getElementById('clientPosition2').addEventListener('input', checkFormCompletion2);
});
