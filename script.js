// ===================================================
// URL PARAMETER CONFIGURATION AND HANDLER
// ===================================================

// Map URL parameters to element IDs and content
const urlParamConfig = {
    // Page 1 - Cover
    'proposalTitlePrefix': { id: 'proposalTitlePrefix', type: 'text' },
    'companyName': { ids: ['clientNameCover', 'clientSignatureHeader', 'clientSignatureHeader2', 'termsClientName', 'agreementClientName'], type: 'text' },
    'proposalSubtitle': { id: 'proposalSubtitle', type: 'text' },
    
    // Page 2 - Introduction
    'clientName': { id: 'clientName', type: 'text' },
    'problem1': { id: 'problem1', type: 'text' },
    'problem2': { id: 'problem2', type: 'text' },
    'problem3': { id: 'problem3', type: 'text' },
    'problem4': { id: 'problem4', type: 'text' },
    
    // Page 3 - Problem Details
    'detailProblem1Title': { id: 'detailProblem1Title', type: 'text' },
    'detailProblem1Desc': { id: 'detailProblem1Desc', type: 'text' },
    'detailProblem2Title': { id: 'detailProblem2Title', type: 'text' },
    'detailProblem2Desc': { id: 'detailProblem2Desc', type: 'text' },
    'detailProblem3Title': { id: 'detailProblem3Title', type: 'text' },
    'detailProblem3Desc': { id: 'detailProblem3Desc', type: 'text' },
    'detailProblem4Title': { id: 'detailProblem4Title', type: 'text' },
    'detailProblem4Desc': { id: 'detailProblem4Desc', type: 'text' },
    
    // Page 4 - Solutions
    'solution0Title': { id: 'solution0Title', type: 'text' },
    'solution0Desc': { id: 'solution0Desc', type: 'text' },
    'solution1Title': { id: 'solution1Title', type: 'text' },
    'solution1Desc': { id: 'solution1Desc', type: 'text' },
    'solution2Title': { id: 'solution2Title', type: 'text' },
    'solution2Desc': { id: 'solution2Desc', type: 'text' },
    'solution3Title': { id: 'solution3Title', type: 'text' },
    'solution3Desc': { id: 'solution3Desc', type: 'text' },
    'solution4Title': { id: 'solution4Title', type: 'text' },
    'solution4Desc': { id: 'solution4Desc', type: 'text' },
    'solution5Title': { id: 'solution5Title', type: 'text' },
    'solution5Desc': { id: 'solution5Desc', type: 'text' },
    
    // Page 5 - Timeline Milestones
    'milestone1Title': { index: 0, field: 'title', type: 'milestone' },
    'milestone1Date': { index: 0, field: 'date', type: 'milestone' },
    'milestone1Desc': { index: 0, field: 'desc', type: 'milestone' },
    'milestone1Tasks': { index: 0, field: 'tasks', type: 'milestone' },
    
    'milestone2Title': { index: 1, field: 'title', type: 'milestone' },
    'milestone2Date': { index: 1, field: 'date', type: 'milestone' },
    'milestone2Desc': { index: 1, field: 'desc', type: 'milestone' },
    'milestone2Tasks': { index: 1, field: 'tasks', type: 'milestone' },
    
    'milestone3Title': { index: 2, field: 'title', type: 'milestone' },
    'milestone3Date': { index: 2, field: 'date', type: 'milestone' },
    'milestone3Desc': { index: 2, field: 'desc', type: 'milestone' },
    'milestone3Tasks': { index: 2, field: 'tasks', type: 'milestone' },
    
    'milestone4Title': { index: 3, field: 'title', type: 'milestone' },
    'milestone4Date': { index: 3, field: 'date', type: 'milestone' },
    'milestone4Desc': { index: 3, field: 'desc', type: 'milestone' },
    'milestone4Tasks': { index: 3, field: 'tasks', type: 'milestone' },
    
    'milestone5Title': { index: 4, field: 'title', type: 'milestone' },
    'milestone5Date': { index: 4, field: 'date', type: 'milestone' },
    'milestone5Desc': { index: 4, field: 'desc', type: 'milestone' },
    'milestone5Tasks': { index: 4, field: 'tasks', type: 'milestone' },
    
    'milestone6Title': { index: 5, field: 'title', type: 'milestone' },
    'milestone6Date': { index: 5, field: 'date', type: 'milestone' },
    'milestone6Desc': { index: 5, field: 'desc', type: 'milestone' },
    'milestone6Tasks': { index: 5, field: 'tasks', type: 'milestone' },
    
    // Page 6 - Related Systems
    'system1Desc': { id: 'system1Desc', type: 'text' },
    'system2Desc': { id: 'system2Desc', type: 'text' },
    'system3Desc': { id: 'system3Desc', type: 'text' },
    'system4Desc': { id: 'system4Desc', type: 'text' },
    'system5Desc': { id: 'system5Desc', type: 'text' },
    'system6Desc': { id: 'system6Desc', type: 'text' },
    
    // Page 7 - Investment
    'depositTitle': { id: 'depositTitle', type: 'text' },
    'depositPercentage': { id: 'depositPercentage', type: 'text' },
    'depositDesc': { id: 'depositDesc', type: 'text' },
    'depositCoversTitle': { id: 'depositCoversTitle', type: 'text' },
    'depositInclude1': { id: 'depositInclude1', type: 'text' },
    'depositInclude2': { id: 'depositInclude2', type: 'text' },
    'depositInclude3': { id: 'depositInclude3', type: 'text' },
    'depositInclude4': { id: 'depositInclude4', type: 'text' },
    'depositInclude5': { id: 'depositInclude5', type: 'text' },
    'depositAmount': { id: 'depositAmount', type: 'text' },
    
    'remainingTitle': { id: 'remainingTitle', type: 'text' },
    'remainingPercentage': { id: 'remainingPercentage', type: 'text' },
    'remainingDesc': { id: 'remainingDesc', type: 'text' },
    'remainingCoversTitle': { id: 'remainingCoversTitle', type: 'text' },
    'remainingInclude1': { id: 'remainingInclude1', type: 'text' },
    'remainingInclude2': { id: 'remainingInclude2', type: 'text' },
    'remainingInclude3': { id: 'remainingInclude3', type: 'text' },
    'remainingInclude4': { id: 'remainingInclude4', type: 'text' },
    
    'milestone3Payment': { id: 'milestone3Payment', type: 'text' },
    'milestone3Amount': { id: 'milestone3Amount', type: 'text' },
    'milestone4Payment': { id: 'milestone4Payment', type: 'text' },
    'milestone4Amount': { id: 'milestone4Amount', type: 'text' },
    'milestone56Payment': { id: 'milestone56Payment', type: 'text' },
    'milestone56Amount': { id: 'milestone56Amount', type: 'text' },
    'remainingAmount': { id: 'remainingAmount', type: 'text' },
    
    'projectTotal': { id: 'projectTotal', type: 'text' },
    'paymentStructure': { id: 'paymentStructure', type: 'text' },
    'milestoneSignoff': { id: 'milestoneSignoff', type: 'text' },
    
    'platform1Name': { id: 'platform1Name', type: 'text' },
    'platform1Price': { id: 'platform1Price', type: 'text' },
    'platform2Name': { id: 'platform2Name', type: 'text' },
    'platform2Price': { id: 'platform2Price', type: 'text' }
};

// Function to get URL parameters
function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    const paramObject = {};
    for (const [key, value] of params) {
        paramObject[key] = decodeURIComponent(value);
    }
    return paramObject;
}

// Function to apply URL parameters to the page
function applyUrlParams() {
    const params = getUrlParams();
    
    for (const [paramName, config] of Object.entries(urlParamConfig)) {
        if (params[paramName]) {
            const value = params[paramName];
            
            if (config.type === 'text') {
                // Handle single ID or multiple IDs
                if (config.id) {
                    const element = document.getElementById(config.id);
                    if (element) {
                        element.textContent = value;
                    }
                } else if (config.ids) {
                    // Apply to multiple elements (like company name)
                    config.ids.forEach(id => {
                        const element = document.getElementById(id);
                        if (element) {
                            element.textContent = value;
                        }
                    });
                }
            } else if (config.type === 'milestone') {
                // Update milestone data
                if (milestoneData[config.index]) {
                    if (config.field === 'tasks') {
                        // Tasks should be passed as comma-separated or pipe-separated
                        milestoneData[config.index][config.field] = value.split('|');
                    } else {
                        milestoneData[config.index][config.field] = value;
                    }
                }
            }
        }
    }
}

// ===================================================
// MILESTONE DATA
// ===================================================

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

// Configuration for the hexagon timeline
const timelineConfig = {
    containerWidth: 720,
    containerHeight: 450,
    hexagonRadius: 100,
    hexagonSize: 90,
    hexagonHeight: 104,
    cardWidth: 220,
    lineLength: 60,
    lineLengthShort: 30,
    cardGap: 15
};

let currentActiveMilestone = null;
let isAnimating = false;

// ===================================================
// HEXAGON TIMELINE FUNCTIONS
// ===================================================

// Create hexagon timeline
function initHexagonTimeline() {
    const container = document.getElementById('hexagon-timeline-container');
    if (!container) return;

    const centerX = timelineConfig.containerWidth / 2;
    const centerY = (timelineConfig.containerHeight / 2) - 40;
    const numHexagons = 6;
    const radius = timelineConfig.hexagonRadius;

    const hexPoints = [
        {x: 68, y: 9},
        {x: 126, y: 44},
        {x: 126, y: 113},
        {x: 68, y: 147},
        {x: 9, y: 113},
        {x: 9, y: 44}
    ];

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

    const gapPatterns = [
        [1, 0, 1, 0, 1, 0],
        [0, 1, 0, 1, 0, 1],
        [1, 1, 0, 1, 1, 0],
        [0, 1, 1, 0, 1, 1],
        [1, 0, 1, 1, 0, 1],
        [1, 1, 1, 0, 0, 0]
    ];

    for (let i = 0; i < numHexagons; i++) {
        const angle = (i * 60 - 60) * Math.PI / 180;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);

        const hexagon = document.createElement('div');
        hexagon.className = 'hexagon';
        hexagon.style.left = (x - timelineConfig.hexagonSize / 2) + 'px';
        hexagon.style.top = (y - timelineConfig.hexagonHeight / 2) + 'px';
        hexagon.setAttribute('data-milestone', i);

        const segments = createHexagonSegments(gapPatterns[i]);
        const segmentPaths = segments.map(seg => `<path class="hex-segment" d="${seg}"/>`).join('');
        const segmentGlowPaths = segments.map(seg => `<path class="hex-segment-glow" d="${seg}"/>`).join('');
        
        const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI'];
        const hexNumber = romanNumerals[i];
        
        hexagon.innerHTML = `
            <div class="hexagon-inner">
                <svg viewBox="0 0 135 155" xmlns="http://www.w3.org/2000/svg">
                    <polygon class="hex-3d-base" points="69,11 128,45 128,114 69,149 11,114 11,45"/>
                    
                    ${segmentGlowPaths}
                    
                    <polyline class="corner-bracket-glow" points="60,9 68,9 68,17"/>
                    <polyline class="corner-bracket-glow" points="75,9 68,9 68,17"/>
                    <polyline class="corner-bracket-glow" points="126,40 126,44 122,46"/>
                    <polyline class="corner-bracket-glow" points="126,47 126,44 122,41"/>
                    <polyline class="corner-bracket-glow" points="126,109 126,113 122,110"/>
                    <polyline class="corner-bracket-glow" points="126,116 126,113 122,115"/>
                    <polyline class="corner-bracket-glow" points="75,147 68,147 68,140"/>
                    <polyline class="corner-bracket-glow" points="60,147 68,147 68,140"/>
                    <polyline class="corner-bracket-glow" points="9,40 9,44 13,46"/>
                    <polyline class="corner-bracket-glow" points="9,47 9,44 13,41"/>
                    <polyline class="corner-bracket-glow" points="9,109 9,113 13,110"/>
                    <polyline class="corner-bracket-glow" points="9,116 9,113 13,115"/>
                    
                    <circle class="circuit-node-glow" cx="68" cy="9" r="3"/>
                    <circle class="circuit-node-glow" cx="126" cy="44" r="3"/>
                    <circle class="circuit-node-glow" cx="126" cy="113" r="3"/>
                    <circle class="circuit-node-glow" cx="68" cy="147" r="3"/>
                    <circle class="circuit-node-glow" cx="9" cy="113" r="3"/>
                    <circle class="circuit-node-glow" cx="9" cy="44" r="3"/>
                    
                    ${segmentPaths}
                    <polygon class="hex-inner-line" points="68,19 116,49 116,107 68,137 19,107 19,49"/>
                    <polygon class="hex-inner-line-faint" points="68,26 109,55 109,101 68,131 26,101 26,55"/>
                    
                    <line class="thick-external" x1="68" y1="0" x2="68" y2="6"/>
                    <line class="thick-external-faded" x1="64" y1="-2" x2="64" y2="4"/>
                    <line class="thick-external-faded" x1="71" y1="-2" x2="71" y2="4"/>
                    <line class="thick-external" x1="131" y1="39" x2="137" y2="42"/>
                    <line class="thick-external-faded" x1="133" y1="35" x2="139" y2="38"/>
                    <line class="thick-external" x1="131" y1="115" x2="137" y2="112"/>
                    <line class="thick-external-faded" x1="133" y1="119" x2="139" y2="116"/>
                    <line class="thick-external" x1="68" y1="155" x2="68" y2="149"/>
                    <line class="thick-external-faded" x1="64" y1="158" x2="64" y2="152"/>
                    <line class="thick-external" x1="4" y1="115" x2="-2" y2="112"/>
                    <line class="thick-external-faded" x1="2" y1="119" x2="-4" y2="116"/>
                    <line class="thick-external" x1="4" y1="39" x2="-2" y2="42"/>
                    <line class="thick-external-faded" x1="2" y1="35" x2="-4" y2="38"/>
                    
                    <polyline class="corner-bracket" points="60,9 68,9 68,17"/>
                    <polyline class="corner-bracket" points="75,9 68,9 68,17"/>
                    <polyline class="corner-bracket" points="126,40 126,44 122,46"/>
                    <polyline class="corner-bracket" points="126,47 126,44 122,41"/>
                    <polyline class="corner-bracket" points="126,109 126,113 122,110"/>
                    <polyline class="corner-bracket" points="126,116 126,113 122,115"/>
                    <polyline class="corner-bracket" points="75,147 68,147 68,140"/>
                    <polyline class="corner-bracket" points="60,147 68,147 68,140"/>
                    <polyline class="corner-bracket" points="9,40 9,44 13,46"/>
                    <polyline class="corner-bracket" points="9,47 9,44 13,41"/>
                    <polyline class="corner-bracket" points="9,109 9,113 13,110"/>
                    <polyline class="corner-bracket" points="9,116 9,113 13,115"/>
                    
                    <circle class="circuit-node" cx="68" cy="9" r="2"/>
                    <circle class="circuit-node" cx="126" cy="44" r="2"/>
                    <circle class="circuit-node" cx="126" cy="113" r="2"/>
                    <circle class="circuit-node" cx="68" cy="147" r="2"/>
                    <circle class="circuit-node" cx="9" cy="113" r="2"/>
                    <circle class="circuit-node" cx="9" cy="44" r="2"/>
                    
                    <line class="accent-line-bright" x1="53" y1="4" x2="64" y2="4"/>
                    <line class="accent-line-medium" x1="71" y1="2" x2="79" y2="2"/>
                    <line class="accent-line-dim" x1="45" y1="6" x2="51" y2="6"/>
                    <line class="accent-line-medium" x1="131" y1="38" x2="131" y2="49"/>
                    <line class="accent-line-bright" x1="134" y1="54" x2="134" y2="64"/>
                    <line class="accent-line-dim" x1="130" y1="30" x2="130" y2="36"/>
                    <line class="accent-line-bright" x1="131" y1="116" x2="131" y2="126"/>
                    <line class="accent-line-medium" x1="130" y1="131" x2="130" y2="139"/>
                    <line class="accent-line-medium" x1="71" y1="152" x2="83" y2="152"/>
                    <line class="accent-line-bright" x1="56" y1="154" x2="66" y2="154"/>
                    <line class="accent-line-dim" x1="84" y1="150" x2="90" y2="150"/>
                    <line class="accent-line-bright" x1="2" y1="109" x2="2" y2="119"/>
                    <line class="accent-line-medium" x1="5" y1="131" x2="5" y2="141"/>
                    <line class="accent-line-bright" x1="2" y1="49" x2="2" y2="59"/>
                    <line class="accent-line-medium" x1="4" y1="36" x2="4" y2="45"/>
                </svg>
                <div class="hex-number">${hexNumber}</div>
            </div>
        `;

        container.appendChild(hexagon);

        hexagon.addEventListener('click', function(e) {
            e.stopPropagation();
            if (isAnimating) return;
            
            const milestoneIndex = parseInt(this.getAttribute('data-milestone'));
            
            if (currentActiveMilestone === milestoneIndex) return;
            
            document.querySelectorAll('.hexagon').forEach(hex => hex.classList.remove('active'));
            this.classList.add('active');
            
            isStopped = true;
            document.querySelectorAll('.hexagon').forEach(h => h.classList.remove('pulsing'));
            
            showMilestoneWithAnimation(milestoneIndex);
        });

        hexagon.addEventListener('mouseenter', () => {
            isPaused = true;
            document.querySelectorAll('.hexagon').forEach(h => h.classList.remove('pulsing'));
        });
        
        hexagon.addEventListener('mouseleave', () => {
            isPaused = false;
        });

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
            const offset = (j - 1) * 10;
            dot.style.left = (midX + (dx / length) * offset - 2.5) + 'px';
            dot.style.top = (midY + (dy / length) * offset - 2.5) + 'px';
            container.appendChild(dot);
        }
    }

    createMilestoneElements(container, centerX, centerY, radius);

    document.addEventListener('click', function(e) {
        if (!e.target.closest('.hexagon') && !e.target.closest('.milestone-card')) {
            if (currentActiveMilestone !== null && !isAnimating) {
                hideCurrentMilestone();
            }
            document.querySelectorAll('.hexagon').forEach(hex => hex.classList.remove('active'));
            isStopped = false;
        }
    });

    startPulsing();
}

function createMilestoneElements(container, centerX, centerY, radius) {
    const milestonePositions = [
        { side: 'right', lineAngle: -45, verticalOffset: -120, useShortLine: false },
        { side: 'right', lineAngle: 0, verticalOffset: -45, useShortLine: true },
        { side: 'right', lineAngle: 30, verticalOffset: -20, useShortLine: false },
        { side: 'left', lineAngle: 150, verticalOffset: -20, useShortLine: false },
        { side: 'left', lineAngle: 180, verticalOffset: -45, useShortLine: true },
        { side: 'left', lineAngle: -150, verticalOffset: -70, useShortLine: false }
    ];

    milestoneData.forEach((milestone, index) => {
        const position = milestonePositions[index];
        const hexAngle = (index * 60 - 60) * Math.PI / 180;
        
        const hexCenterX = centerX + radius * Math.cos(hexAngle);
        const hexCenterY = centerY + radius * Math.sin(hexAngle);
        
        const lineAngleRad = position.lineAngle * Math.PI / 180;
        const hexEdgeDistance = timelineConfig.hexagonSize / 2 + 5;
        
        const lineStartX = hexCenterX + hexEdgeDistance * Math.cos(lineAngleRad);
        const lineStartY = hexCenterY + hexEdgeDistance * Math.sin(lineAngleRad);
        
        const lineLength = position.useShortLine ? timelineConfig.lineLengthShort : timelineConfig.lineLength;
        
        const line = document.createElement('div');
        line.className = 'milestone-line';
        line.id = `milestone-line-${index}`;
        line.style.left = lineStartX + 'px';
        line.style.top = lineStartY + 'px';
        line.style.width = '0px';
        line.style.transform = `rotate(${position.lineAngle}deg)`;
        line.style.transformOrigin = 'left center';
        line.setAttribute('data-line-length', lineLength);
        
        container.appendChild(line);
        
        const card = document.createElement('div');
        card.className = 'milestone-card';
        card.id = `milestone-card-${index}`;
        
        const tasksHTML = milestone.tasks.map(task => `<li>${task}</li>`).join('');
        
        card.innerHTML = `
            <div class="milestone-title">${milestone.title}</div>
            <div class="milestone-date">${milestone.date}</div>
            <div class="milestone-desc">${milestone.desc}</div>
            <ul class="milestone-tasks">${tasksHTML}</ul>
        `;
        
        const cardGap = timelineConfig.cardGap;
        
        const lineEndX = lineStartX + lineLength * Math.cos(lineAngleRad);
        const lineEndY = lineStartY + lineLength * Math.sin(lineAngleRad);
        
        if (position.side === 'right') {
            const cardX = lineEndX + cardGap;
            const cardY = lineEndY + position.verticalOffset;
            card.style.left = cardX + 'px';
            card.style.top = cardY + 'px';
            card.classList.add('card-right');
        } else {
            const cardX = lineEndX - cardGap - timelineConfig.cardWidth;
            const cardY = lineEndY + position.verticalOffset;
            card.style.left = cardX + 'px';
            card.style.top = cardY + 'px';
            card.classList.add('card-left');
        }
        
        container.appendChild(card);
    });
}

async function showMilestoneWithAnimation(index) {
    isAnimating = true;
    
    if (currentActiveMilestone !== null && currentActiveMilestone !== index) {
        await hideCurrentMilestone();
    }
    
    const line = document.getElementById(`milestone-line-${index}`);
    const lineLength = line.getAttribute('data-line-length') || timelineConfig.lineLength;
    
    line.classList.add('active');
    line.style.width = lineLength + 'px';
    
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const card = document.getElementById(`milestone-card-${index}`);
    card.classList.add('active');
    
    currentActiveMilestone = index;
    
    await new Promise(resolve => setTimeout(resolve, 400));
    
    isAnimating = false;
}

async function hideCurrentMilestone() {
    if (currentActiveMilestone === null) return;
    
    const line = document.getElementById(`milestone-line-${currentActiveMilestone}`);
    const card = document.getElementById(`milestone-card-${currentActiveMilestone}`);
    
    card.classList.remove('active');
    await new Promise(resolve => setTimeout(resolve, 400));
    
    line.style.width = '0px';
    await new Promise(resolve => setTimeout(resolve, 600));
    
    line.classList.remove('active');
    
    currentActiveMilestone = null;
}

function showMilestone(index) {
    showMilestoneWithAnimation(index);
}

// ===================================================
// PULSING ANIMATION
// ===================================================

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
    const webhookUrl = 'https://hook.eu1.make.com/hk2iss31bustvql7q5np87532d48hqst';
    
    try {
        // Create a clean filename for the signature
        const cleanName = clientName.replace(/[^a-z0-9]/gi, '_');
        const timestamp = Date.now();
        const filename = `signature_${cleanName}_${timestamp}.png`;
        
        // Create HTML versions of the signature for easy insertion in Make.com
        const signatureHTML = `<img src="${signatureData}" alt="Client Signature" style="max-width: 300px; height: auto; display: block;">`;
        
        const signatureHTMLCentered = `<div style="text-align: center;"><img src="${signatureData}" alt="Client Signature" style="max-width: 300px; height: auto;"></div>`;
        
        const signatureHTMLInBox = `<div style="border: 2px solid #333; padding: 15px; background: white; display: inline-block;"><img src="${signatureData}" alt="Client Signature" style="max-width: 250px; height: auto;"></div>`;
        
        const payload = {
            signature_image: signatureData,
            client_name: clientName,
            client_position: clientPosition,
            signed_date: new Date().toISOString(),
            company_name: document.getElementById('clientNameCover')?.textContent || 'N/A',
            
            // Format signature for Airtable attachment field
            signatureAttachment: [
                {
                    url: signatureData,
                    filename: filename
                }
            ],
            
            // HTML versions of signature - ready to insert in Make.com
            signatureHTML: signatureHTML,
            signatureHTMLCentered: signatureHTMLCentered,
            signatureHTMLInBox: signatureHTMLInBox
        };
        
        const response = await fetch(webhookUrl, {
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
// PREVIEW AND DOWNLOAD FUNCTIONALITY
// ===================================================

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
    
    const previewLines = previewContainer.querySelectorAll('.milestone-line');
    previewLines.forEach(line => {
        const lineLength = line.getAttribute('data-line-length') || 60;
        line.style.width = lineLength + 'px';
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

// ===================================================
// PDF DOWNLOAD WITH PDFSHIFT
// ===================================================

async function downloadProposal() {
    // Show loading state
    const downloadBtn = document.querySelector('.btn-download-final');
    const originalText = downloadBtn.textContent;
    downloadBtn.textContent = 'Generating PDF...';
    downloadBtn.disabled = true;
    
    try {
        // Get the full HTML of the document
        const htmlContent = document.documentElement.outerHTML;
        
        // PDFShift API configuration
        const pdfShiftApiKey = 'sk_de4b0b3aab6d9de23ff4c753c2156e993d9ed62b';
        const apiUrl = 'https://api.pdfshift.io/v3/convert/pdf';
        
        // Convert to PDF using PDFShift
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Authorization': 'Basic ' + btoa('api:' + pdfShiftApiKey),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                source: htmlContent,
                sandbox: false,
                format: 'Letter',
                margin: '0mm',
                landscape: false,
                use_print: true
            })
        });
        
        if (!response.ok) {
            throw new Error('PDF generation failed');
        }
        
        // Get the PDF as a blob
        const pdfBlob = await response.blob();
        
        // Create download link
        const url = window.URL.createObjectURL(pdfBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Level_One_Proposal.pdf';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        // Reset button
        downloadBtn.textContent = originalText;
        downloadBtn.disabled = false;
        
    } catch (error) {
        console.error('Error generating PDF:', error);
        alert('There was an error generating the PDF. Please try again or use your browser\'s print function.');
        
        // Reset button
        downloadBtn.textContent = originalText;
        downloadBtn.disabled = false;
    }
}

// ===================================================
// INITIALIZATION
// ===================================================

document.addEventListener('DOMContentLoaded', function() {
    // Apply URL parameters first
    applyUrlParams();
    
    // Then initialize timeline
    initHexagonTimeline();
});
