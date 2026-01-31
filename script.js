// Milestone data
const milestoneData = [
    {
        title: "Core Foundation & Content Automation",
        date: "Weeks 1-3 • May 2026",
        desc: "Building the essential platform infrastructure and implementing AI-powered content generation.",
        tasks: [
            "Platform setup: domain, hosting, CDN, and core framework",
            "Product Information Management (PIM) database",
            "User authentication and secure login system",
            "AI content generation for product descriptions",
            "Automated catalog tagging using image recognition"
        ]
    },
    {
        title: "Transactional MVP & Security",
        date: "Weeks 4-6 • May-June 2026",
        desc: "Enabling secure purchasing with fraud protection and intelligent search.",
        tasks: [
            "Shopping cart and multi-step checkout",
            "Payment gateway integration (Stripe/PayPal)",
            "Shipping and tax calculation",
            "Real-time AI fraud detection",
            "Smart semantic search"
        ]
    },
    {
        title: "Support Automation & CX",
        date: "Weeks 7-9 • June 2026",
        desc: "Deploying 24/7 AI support and customer account features.",
        tasks: [
            "Customer account dashboard",
            "Order Management System backend",
            "AI Support Agent chatbot",
            "Review summarization using NLP"
        ]
    },
    {
        title: "Personalisation & Predictive Ops",
        date: "Weeks 10-12 • June-July 2026",
        desc: "Implementing data-driven personalization and analytics.",
        tasks: [
            "Loyalty program infrastructure",
            "Analytics dashboard",
            "Predictive recommendation engine",
            "Demand forecasting"
        ]
    },
    {
        title: "Advanced Discovery & Growth",
        date: "Weeks 13-15 • July 2026",
        desc: "Adding sophisticated features for conversions.",
        tasks: [
            "Visual search / \"Shop the Look\"",
            "Dynamic pricing",
            "AI-driven A/B testing"
        ]
    },
    {
        title: "Launch & Handover",
        date: "Week 16 • July-August 2026",
        desc: "Final deployment, training, and handover.",
        tasks: [
            "Production deployment",
            "Performance optimization",
            "Team training sessions",
            "Documentation and guides"
        ]
    }
];

// Create hexagon timeline
function initHexagonTimeline() {
    const container = document.getElementById('hexagon-timeline-container');
    if (!container) return;

    const centerX = 275;
    const centerY = 275;
    const numHexagons = 6;
    const radius = 133;

    // Hexagon vertices (points of a regular hexagon)
    const hexPoints = [
        {x: 90, y: 12},
        {x: 168, y: 58},
        {x: 168, y: 150},
        {x: 90, y: 196},
        {x: 12, y: 150},
        {x: 12, y: 58}
    ];

    // Function to create segment paths with small gaps
    function createHexagonSegments(pattern) {
        const segments = [];
        
        for (let i = 0; i < 6; i++) {
            const start = hexPoints[i];
            const end = hexPoints[(i + 1) % 6];
            
            const dx = end.x - start.x;
            const dy = end.y - start.y;
            const length = Math.sqrt(dx * dx + dy * dy);
            const unitX = dx / length;
            const unitY = dy / length;
            
            const gapSize = pattern[i];
            
            if (gapSize === 0) {
                segments.push(`M${start.x},${start.y} L${end.x},${end.y}`);
            } else {
                const gapStart = length * 0.45;
                const gapEnd = length * 0.55;
                
                const gap1X = start.x + unitX * gapStart;
                const gap1Y = start.y + unitY * gapStart;
                segments.push(`M${start.x},${start.y} L${gap1X},${gap1Y}`);
                
                const gap2X = start.x + unitX * gapEnd;
                const gap2Y = start.y + unitY * gapEnd;
                segments.push(`M${gap2X},${gap2Y} L${end.x},${end.y}`);
            }
        }
        
        return segments;
    }

    // Different gap patterns for each hexagon
    const gapPatterns = [
        [1, 0, 1, 0, 1, 0],
        [0, 1, 0, 1, 0, 1],
        [1, 1, 0, 1, 1, 0],
        [0, 1, 1, 0, 1, 1],
        [1, 0, 1, 1, 0, 1],
        [1, 1, 1, 0, 0, 0]
    ];

    // Create hexagons
    for (let i = 0; i < numHexagons; i++) {
        const angle = (i * 60 - 60) * Math.PI / 180;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);

        const hexagon = document.createElement('div');
        hexagon.className = 'hexagon';
        hexagon.style.left = (x - 60) + 'px';
        hexagon.style.top = (y - 69) + 'px';
        hexagon.setAttribute('data-milestone', i);

        const segments = createHexagonSegments(gapPatterns[i]);
        const segmentPaths = segments.map(seg => `<path class="hex-segment" d="${seg}"/>`).join('');
        const segmentGlowPaths = segments.map(seg => `<path class="hex-segment-glow" d="${seg}"/>`).join('');
        
        const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI'];
        const hexNumber = romanNumerals[i];
        
        hexagon.innerHTML = `
            <div class="hexagon-inner">
                <svg viewBox="0 0 180 207" xmlns="http://www.w3.org/2000/svg">
                    <polygon class="hex-3d-base" points="92,14 170,60 170,152 92,198 14,152 14,60"/>
                    
                    ${segmentGlowPaths}
                    
                    <polyline class="corner-bracket-glow" points="80,12 90,12 90,22"/>
                    <polyline class="corner-bracket-glow" points="100,12 90,12 90,22"/>
                    <polyline class="corner-bracket-glow" points="168,53 168,58 163,61"/>
                    <polyline class="corner-bracket-glow" points="168,63 168,58 163,55"/>
                    <polyline class="corner-bracket-glow" points="168,145 168,150 163,147"/>
                    <polyline class="corner-bracket-glow" points="168,155 168,150 163,153"/>
                    <polyline class="corner-bracket-glow" points="100,196 90,196 90,186"/>
                    <polyline class="corner-bracket-glow" points="80,196 90,196 90,186"/>
                    <polyline class="corner-bracket-glow" points="12,53 12,58 17,61"/>
                    <polyline class="corner-bracket-glow" points="12,63 12,58 17,55"/>
                    <polyline class="corner-bracket-glow" points="12,145 12,150 17,147"/>
                    <polyline class="corner-bracket-glow" points="12,155 12,150 17,153"/>
                    
                    <circle class="circuit-node-glow" cx="90" cy="12" r="4"/>
                    <circle class="circuit-node-glow" cx="168" cy="58" r="4"/>
                    <circle class="circuit-node-glow" cx="168" cy="150" r="4"/>
                    <circle class="circuit-node-glow" cx="90" cy="196" r="4"/>
                    <circle class="circuit-node-glow" cx="12" cy="150" r="4"/>
                    <circle class="circuit-node-glow" cx="12" cy="58" r="4"/>
                    
                    ${segmentPaths}
                    <polygon class="hex-inner-line" points="90,25 155,65 155,143 90,183 25,143 25,65"/>
                    <polygon class="hex-inner-line-faint" points="90,35 145,73 145,135 90,175 35,135 35,73"/>
                    
                    <line class="thick-external" x1="90" y1="0" x2="90" y2="8"/>
                    <line class="thick-external-faded" x1="85" y1="-3" x2="85" y2="5"/>
                    <line class="thick-external-faded" x1="95" y1="-3" x2="95" y2="5"/>
                    <line class="thick-external" x1="175" y1="52" x2="183" y2="56"/>
                    <line class="thick-external-faded" x1="177" y1="47" x2="185" y2="51"/>
                    <line class="thick-external" x1="175" y1="153" x2="183" y2="149"/>
                    <line class="thick-external-faded" x1="177" y1="158" x2="185" y2="154"/>
                    <line class="thick-external" x1="90" y1="207" x2="90" y2="199"/>
                    <line class="thick-external-faded" x1="85" y1="210" x2="85" y2="202"/>
                    <line class="thick-external" x1="5" y1="153" x2="-3" y2="149"/>
                    <line class="thick-external-faded" x1="3" y1="158" x2="-5" y2="154"/>
                    <line class="thick-external" x1="5" y1="52" x2="-3" y2="56"/>
                    <line class="thick-external-faded" x1="3" y1="47" x2="-5" y2="51"/>
                    
                    <polyline class="corner-bracket" points="80,12 90,12 90,22"/>
                    <polyline class="corner-bracket" points="100,12 90,12 90,22"/>
                    <polyline class="corner-bracket" points="168,53 168,58 163,61"/>
                    <polyline class="corner-bracket" points="168,63 168,58 163,55"/>
                    <polyline class="corner-bracket" points="168,145 168,150 163,147"/>
                    <polyline class="corner-bracket" points="168,155 168,150 163,153"/>
                    <polyline class="corner-bracket" points="100,196 90,196 90,186"/>
                    <polyline class="corner-bracket" points="80,196 90,196 90,186"/>
                    <polyline class="corner-bracket" points="12,53 12,58 17,61"/>
                    <polyline class="corner-bracket" points="12,63 12,58 17,55"/>
                    <polyline class="corner-bracket" points="12,145 12,150 17,147"/>
                    <polyline class="corner-bracket" points="12,155 12,150 17,153"/>
                    
                    <circle class="circuit-node" cx="90" cy="12" r="2.5"/>
                    <circle class="circuit-node" cx="168" cy="58" r="2.5"/>
                    <circle class="circuit-node" cx="168" cy="150" r="2.5"/>
                    <circle class="circuit-node" cx="90" cy="196" r="2.5"/>
                    <circle class="circuit-node" cx="12" cy="150" r="2.5"/>
                    <circle class="circuit-node" cx="12" cy="58" r="2.5"/>
                    
                    <line class="accent-line-bright" x1="70" y1="5" x2="85" y2="5"/>
                    <line class="accent-line-medium" x1="95" y1="3" x2="105" y2="3"/>
                    <line class="accent-line-dim" x1="60" y1="8" x2="68" y2="8"/>
                    <line class="accent-line-medium" x1="175" y1="50" x2="175" y2="65"/>
                    <line class="accent-line-bright" x1="178" y1="72" x2="178" y2="85"/>
                    <line class="accent-line-dim" x1="173" y1="40" x2="173" y2="48"/>
                    <line class="accent-line-bright" x1="175" y1="155" x2="175" y2="168"/>
                    <line class="accent-line-medium" x1="173" y1="175" x2="173" y2="185"/>
                    <line class="accent-line-medium" x1="95" y1="203" x2="110" y2="203"/>
                    <line class="accent-line-bright" x1="75" y1="205" x2="88" y2="205"/>
                    <line class="accent-line-dim" x1="112" y1="200" x2="120" y2="200"/>
                    <line class="accent-line-bright" x1="2" y1="145" x2="2" y2="158"/>
                    <line class="accent-line-medium" x1="7" y1="175" x2="7" y2="188"/>
                    <line class="accent-line-bright" x1="2" y1="65" x2="2" y2="78"/>
                    <line class="accent-line-medium" x1="5" y1="48" x2="5" y2="60"/>
                </svg>
                <div class="hex-number">${hexNumber}</div>
            </div>
        `;

        container.appendChild(hexagon);

        // Click event listener
        hexagon.addEventListener('click', function(e) {
            e.stopPropagation();
            const milestoneIndex = parseInt(this.getAttribute('data-milestone'));
            showMilestone(milestoneIndex);
            
            document.querySelectorAll('.hexagon').forEach(hex => hex.classList.remove('active'));
            this.classList.add('active');
            
            isStopped = true;
            document.querySelectorAll('.hexagon').forEach(h => h.classList.remove('pulsing'));
        });

        // Hover pause
        hexagon.addEventListener('mouseenter', () => {
            isPaused = true;
            document.querySelectorAll('.hexagon').forEach(h => h.classList.remove('pulsing'));
        });
        
        hexagon.addEventListener('mouseleave', () => {
            isPaused = false;
        });

        // Create dots between hexagons
        const nextI = (i + 1) % numHexagons;
        const nextAngle = (nextI * 60 - 60) * Math.PI / 180;
        const nextX = centerX + radius * Math.cos(nextAngle);
        const nextY = centerY + radius * Math.sin(nextAngle);
        const midX = (x + nextX) / 2;
        const midY = (y + nextY) / 2;

        for (let j = 0; j < 3; j++) {
            const dot = document.createElement('div');
            dot.className = 'dot';
            const dx = nextX - x;
            const dy = nextY - y;
            const length = Math.sqrt(dx * dx + dy * dy);
            const offset = (j - 1) * 13;
            dot.style.left = (midX + (dx / length) * offset - 3) + 'px';
            dot.style.top = (midY + (dy / length) * offset - 3) + 'px';
            container.appendChild(dot);
        }
    }

    // Create center content container
    const centerContent = document.createElement('div');
    centerContent.className = 'timeline-center-content';
    centerContent.id = 'timeline-center-content';
    
    // Create milestone content divs
    milestoneData.forEach((milestone, index) => {
        const milestoneDiv = document.createElement('div');
        milestoneDiv.className = 'milestone-content';
        milestoneDiv.id = `milestone-${index}`;
        
        const tasksHTML = milestone.tasks.map(task => `<li>${task}</li>`).join('');
        
        milestoneDiv.innerHTML = `
            <div class="milestone-title">${milestone.title}</div>
            <div class="milestone-date editable">${milestone.date}</div>
            <div class="milestone-desc">${milestone.desc}</div>
            <ul class="milestone-tasks">${tasksHTML}</ul>
        `;
        
        centerContent.appendChild(milestoneDiv);
    });
    
    container.appendChild(centerContent);

    // Click outside to hide
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.hexagon') && !e.target.closest('.timeline-center-content')) {
            document.querySelectorAll('.hexagon').forEach(hex => hex.classList.remove('active'));
            document.querySelectorAll('.milestone-content').forEach(content => content.classList.remove('active'));
            isStopped = false;
        }
    });

    // Start pulsing animation
    startPulsing();
}

function showMilestone(index) {
    document.querySelectorAll('.milestone-content').forEach(content => {
        content.classList.remove('active');
    });
    
    const milestone = document.getElementById(`milestone-${index}`);
    if (milestone) {
        milestone.classList.add('active');
    }
}

// Pulsing animation variables
let currentPulse = 0;
let pulseInterval;
let isPaused = false;
let isStopped = false;

function startPulsing() {
    if (pulseInterval) return;
    
    pulseInterval = setInterval(() => {
        if (isPaused || isStopped) return;
        
        const hexagons = document.querySelectorAll('.hexagon');
        hexagons.forEach(hex => hex.classList.remove('pulsing'));
        
        setTimeout(() => {
            if (isPaused || isStopped) return;
            currentPulse = (currentPulse + 1) % 6;
            hexagons[currentPulse].classList.add('pulsing');
        }, 600);
        
    }, 3000);
}

// Initialize timeline when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initHexagonTimeline();
});

// Signature functionality
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
    const dataURL = canvas.getDataURL();
    
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

function submitClientSignature() {
    const name = document.getElementById('clientFullName').value;
    const position = document.getElementById('clientPosition').value;
    
    if (!name || !position || !signatureData1) {
        alert('Please fill in all required fields');
        return;
    }
    
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
    
    document.getElementById('clientForm2').classList.add('hidden');
    
    const display = document.getElementById('clientSignatureDisplay2');
    document.getElementById('clientNameDisplay2').textContent = name;
    document.getElementById('clientPositionDisplay2').textContent = position;
    document.getElementById('clientSigImg2').src = signatureData2;
    document.getElementById('clientDate2').textContent = `Date: ${new Date().toLocaleDateString()}`;
    display.classList.add('show');
    
    document.getElementById('providerDate2').textContent = `Date: ${new Date().toLocaleDateString()}`;
}

function openPreview() {
    const modal = document.getElementById('previewModal');
    const previewContainer = document.getElementById('previewPages');
    previewContainer.innerHTML = '';
    
    const pages = document.querySelectorAll('.page');
    pages.forEach((page, index) => {
        const clone = page.cloneNode(true);
        clone.classList.add('no-highlights');
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

function agreeToProposal() {
    closePreview();
    const thankyouModal = document.getElementById('thankyouModal');
    thankyouModal.classList.add('active');
}

function downloadProposal() {
    window.print();
}
