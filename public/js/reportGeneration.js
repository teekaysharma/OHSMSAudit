// Report Generation Module
// Handles generation of audit reports in various formats

// Generate comprehensive audit report
function generateAuditReport() {
    try {
        const project = window.app ? window.app.getCurrentProject() : null;
        
        if (!project) {
            alert('No audit data available to generate report.');
            return null;
        }
        
        const report = {
            metadata: {
                generatedDate: new Date().toISOString(),
                generatedBy: 'OHS Management System Audit Tool',
                version: '2.3',
                reportTitle: document.getElementById('reportTitle')?.value || 'OCCUPATIONAL HEALTH & SAFETY AUDIT REPORT',
                reportSubtitle: document.getElementById('reportSubtitle')?.value || 'Management System & Site Performance Audit',
                companyName: document.getElementById('companyName')?.value || '',
                reportDescription: document.getElementById('reportDescription')?.value || ''
            },
            project: project,
            summary: generateReportSummary(project),
            recommendations: window.recommendations?.generateRecommendations() || [],
            charts: captureChartsForReport()
        };
        
        return report;
    } catch (error) {
        console.error('Error generating audit report:', error);
        alert('Error generating report. Please check the console for details.');
        return null;
    }
}

// Generate comprehensive summary for report
function generateReportSummary(project) {
    try {
        const summary = {
            projectName: project.projectName || 'Default Project',
            currentSite: project.currentSite || 'Default Site',
            totalSites: project.sites ? Object.keys(project.sites).length : 0,
            inspectionDate: document.getElementById('inspectionDate')?.value || new Date().toISOString().split('T')[0],
            leadAuditor: project.leadAuditor || document.getElementById('leadAuditor')?.value || 'Not specified',
            projectDirector: project.projectDirector || document.getElementById('projectDirector')?.value || 'Not specified',
            overallScores: {},
            siteScores: {},
            managementScore: 0,
            criticalIssues: [],
            recommendations: 0
        };
        
        // Calculate management system score
        if (project.managementSystemAudit) {
            let totalManagementScore = 0;
            let totalManagementQuestions = 0;
            
            for (const section in project.managementSystemAudit) {
                if (Array.isArray(project.managementSystemAudit[section])) {
                    project.managementSystemAudit[section].forEach(item => {
                        if (item.score > 0) {
                            totalManagementScore += item.score;
                            totalManagementQuestions++;
                        }
                        if (item.score === 1) {
                            summary.criticalIssues.push({
                                type: 'Management System',
                                section: section,
                                issue: item.name
                            });
                        }
                    });
                }
            }
            
            summary.managementScore = totalManagementQuestions > 0 ? 
                Math.round((totalManagementScore / totalManagementQuestions) * 100) / 100 : 0;
        }
        
        // Calculate site scores
        if (project.sites) {
            for (const siteName in project.sites) {
                const site = project.sites[siteName];
                let totalSiteScore = 0;
                let totalSiteQuestions = 0;
                
                for (const section in site) {
                    if (Array.isArray(site[section])) {
                        site[section].forEach(item => {
                            if (item.score > 0) {
                                totalSiteScore += item.score;
                                totalSiteQuestions++;
                            }
                            if (item.score === 1) {
                                summary.criticalIssues.push({
                                    type: 'Site Performance',
                                    site: siteName,
                                    section: section,
                                    issue: item.name
                                });
                            }
                        });
                    }
                }
                
                summary.siteScores[siteName] = totalSiteQuestions > 0 ? 
                    Math.round((totalSiteScore / totalSiteQuestions) * 100) / 100 : 0;
            }
        }
        
        // Calculate overall scores using chart management functions
        if (typeof calculateOverallScore === 'function') {
            summary.overallScores = {
                management: calculateOverallScore('management'),
                currentSite: calculateOverallScore('all'),
                allSites: calculateOverallScore('all-sites'),
                projectOverview: calculateOverallScore('total')
            };
        } else {
            console.warn('calculateOverallScore function not available, using basic calculations');
            summary.overallScores = {
                management: { score: summary.managementScore, rating: 'N/A', percentage: 0 },
                currentSite: { score: 0, rating: 'N/A', percentage: 0 },
                allSites: { score: 0, rating: 'N/A', percentage: 0 },
                projectOverview: { score: 0, rating: 'N/A', percentage: 0 }
            };
        }
        
        return summary;
    } catch (error) {
        console.error('Error generating report summary:', error);
        return {
            projectName: 'Unknown Project',
            currentSite: 'Unknown Site',
            totalSites: 0,
            inspectionDate: new Date().toISOString().split('T')[0],
            leadAuditor: 'Not specified',
            projectDirector: 'Not specified',
            managementScore: 0,
            siteScores: {},
            criticalIssues: [],
            overallScores: {
                management: { score: 0, rating: 'N/A', percentage: 0 },
                currentSite: { score: 0, rating: 'N/A', percentage: 0 },
                allSites: { score: 0, rating: 'N/A', percentage: 0 },
                projectOverview: { score: 0, rating: 'N/A', percentage: 0 }
            }
        };
    }
}
    
// Create Executive Report HTML with A4 print layout
function createExecutiveReportHTML(report) {
    const logoHTML = window.reportLogoData ? 
        `<img src="${window.reportLogoData}" alt="Company Logo" class="company-logo">` : '';
    
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${report.metadata.reportTitle}</title>
        <style>
            ${getReportCSS()}
        </style>
    </head>
    <body>
        <div class="report-container">
            <!-- Report Header -->
            <header class="report-header">
                <div class="header-content">
                    <div class="header-text">
                        <h1 class="report-title">${report.metadata.reportTitle}</h1>
                        <h2 class="report-subtitle">${report.metadata.reportSubtitle}</h2>
                        <div class="company-info">
                            <h3>${report.metadata.companyName}</h3>
                            <p>${report.metadata.reportDescription}</p>
                        </div>
                    </div>
                    <div class="header-logo">
                        ${logoHTML}
                    </div>
                </div>
                <div class="report-meta">
                    <div class="meta-row">
                        <span><strong>Project:</strong> ${report.summary.projectName}</span>
                        <span><strong>Date:</strong> ${new Date(report.metadata.generatedDate).toLocaleDateString()}</span>
                    </div>
                    <div class="meta-row">
                        <span><strong>Lead Auditor:</strong> ${report.summary.leadAuditor}</span>
                        <span><strong>Project Director:</strong> ${report.summary.projectDirector}</span>
                    </div>
                </div>
            </header>

            <!-- Executive Summary -->
            <section class="executive-summary">
                <h2>Executive Summary</h2>
                <div class="summary-grid">
                    ${generateSummaryHTML(report.summary)}
                </div>
                ${generateScoreCardsHTML(report.summary)}
            </section>

            <!-- Charts Section -->
            <section class="charts-section">
                <h2>Performance Analysis</h2>
                ${generateChartsHTML(report.charts)}
            </section>

            <!-- Critical Issues -->
            ${generateCriticalIssuesHTML(report.summary.criticalIssues)}

            <!-- Recommendations -->
            ${generateRecommendationsHTML(report.recommendations)}

            <!-- Footer -->
            <footer class="report-footer">
                <p>Generated by ${report.metadata.generatedBy} v${report.metadata.version}</p>
                <p>Report generated on ${new Date(report.metadata.generatedDate).toLocaleString()}</p>
            </footer>
        </div>

        <script>
            // Print functionality
            function printReport() {
                window.print();
            }
            
            // Add print button
            const printBtn = document.createElement('button');
            printBtn.textContent = 'Print Report';
            printBtn.className = 'print-btn no-print';
            printBtn.onclick = printReport;
            document.body.appendChild(printBtn);
        </script>
    </body>
    </html>
    `;
}

// Create Full HTML Report (same as executive but with more details)
function createFullHTMLReport(report) {
    return createExecutiveReportHTML(report);
}

// Display report in new window with fallback for popup blockers
function displayReportInNewWindow(htmlContent, title) {
    const newWindow = window.open('', '_blank');
    if (newWindow) {
        newWindow.document.write(htmlContent);
        newWindow.document.close();
        newWindow.focus();
    } else {
        // Fallback for popup blockers - create downloadable HTML file
        console.log('Popup blocked, creating downloadable HTML file instead');
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        alert('Report downloaded as HTML file since pop-ups are blocked. You can open it in your browser.');
    }
}

// Generate report CSS for A4 print layout
function getReportCSS() {
    return `
        @page {
            size: A4;
            margin: 15mm;
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background: white;
        }
        
        .report-container {
            max-width: 210mm;
            margin: 0 auto;
            background: white;
            padding: 20px;
        }
        
        .report-header {
            border-bottom: 3px solid #4c51bf;
            margin-bottom: 30px;
            padding-bottom: 20px;
        }
        
        .header-content {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 20px;
        }
        
        .header-text {
            flex: 1;
        }
        
        .report-title {
            font-size: 24px;
            color: #4c51bf;
            margin-bottom: 8px;
            font-weight: 700;
        }
        
        .report-subtitle {
            font-size: 18px;
            color: #666;
            margin-bottom: 15px;
            font-weight: 500;
        }
        
        .company-info h3 {
            font-size: 16px;
            color: #333;
            margin-bottom: 5px;
        }
        
        .company-info p {
            font-size: 14px;
            color: #666;
        }
        
        .header-logo {
            margin-left: 20px;
        }
        
        .company-logo {
            max-width: 120px;
            max-height: 80px;
            object-fit: contain;
        }
        
        .report-meta {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
        }
        
        .meta-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
        }
        
        .meta-row:last-child {
            margin-bottom: 0;
        }
        
        h2 {
            color: #4c51bf;
            font-size: 20px;
            margin: 30px 0 15px 0;
            border-left: 4px solid #4c51bf;
            padding-left: 10px;
        }
        
        .summary-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 25px;
        }
        
        .summary-card {
            background: #f8f9ff;
            border: 1px solid #e0e6ed;
            border-radius: 10px;
            padding: 20px;
            text-align: center;
        }
        
        .summary-card h3 {
            color: #4c51bf;
            font-size: 14px;
            margin-bottom: 10px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .summary-card .value {
            font-size: 28px;
            font-weight: 700;
            color: #333;
            margin-bottom: 5px;
        }
        
        .summary-card .label {
            font-size: 12px;
            color: #666;
        }
        
        .score-cards {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
            gap: 15px;
            margin: 20px 0;
        }
        
        .score-card {
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            border-radius: 10px;
            padding: 20px;
            text-align: center;
        }
        
        .score-card h4 {
            font-size: 14px;
            margin-bottom: 10px;
            opacity: 0.9;
        }
        
        .score-card .score {
            font-size: 24px;
            font-weight: 700;
            margin-bottom: 5px;
        }
        
        .score-card .rating {
            font-size: 12px;
            opacity: 0.8;
        }
        
        .charts-section img {
            max-width: 100%;
            height: auto;
            margin: 15px 0;
            border: 1px solid #ddd;
            border-radius: 8px;
        }
        
        .critical-issues {
            background: #fee;
            border: 1px solid #fcc;
            border-radius: 10px;
            padding: 20px;
            margin: 20px 0;
        }
        
        .critical-issues h3 {
            color: #c53030;
            margin-bottom: 15px;
        }
        
        .issue-item {
            background: white;
            border-left: 4px solid #c53030;
            padding: 15px;
            margin-bottom: 10px;
            border-radius: 0 8px 8px 0;
        }
        
        .recommendations-section {
            background: #f0f8ff;
            border: 1px solid #bde4ff;
            border-radius: 10px;
            padding: 20px;
            margin: 20px 0;
        }
        
        .recommendation-item {
            background: white;
            border-left: 4px solid #4299e1;
            padding: 15px;
            margin-bottom: 15px;
            border-radius: 0 8px 8px 0;
        }
        
        .report-footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            text-align: center;
            color: #666;
            font-size: 12px;
        }
        
        .print-btn {
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4c51bf;
            color: white;
            border: none;
            padding: 12px 20px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 600;
            box-shadow: 0 4px 12px rgba(76, 81, 191, 0.3);
            transition: all 0.2s ease;
        }
        
        .print-btn:hover {
            background: #3c4099;
            transform: translateY(-2px);
        }
        
        @media print {
            .no-print {
                display: none !important;
            }
            
            .report-container {
                max-width: none;
                margin: 0;
                padding: 0;
            }
            
            body {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }
        }
    `;
}

// Generate summary HTML section
function generateSummaryHTML(summary) {
    return `
        <div class="summary-card">
            <h3>Total Sites</h3>
            <div class="value">${summary.totalSites}</div>
            <div class="label">Audited Locations</div>
        </div>
        <div class="summary-card">
            <h3>Management Score</h3>
            <div class="value">${summary.managementScore}</div>
            <div class="label">System Performance</div>
        </div>
        <div class="summary-card">
            <h3>Critical Issues</h3>
            <div class="value">${summary.criticalIssues.length}</div>
            <div class="label">Major Non-Conformances</div>
        </div>
        <div class="summary-card">
            <h3>Current Site</h3>
            <div class="value">${summary.currentSite}</div>
            <div class="label">Primary Location</div>
        </div>
    `;
}

// Generate score cards HTML
function generateScoreCardsHTML(summary) {
    if (!summary.overallScores) return '';
    
    return `
        <div class="score-cards">
            ${Object.entries(summary.overallScores).map(([scope, scoreData]) => `
                <div class="score-card">
                    <h4>${scope.replace(/([A-Z])/g, ' $1').trim()}</h4>
                    <div class="score">${scoreData.score || 0}</div>
                    <div class="rating">${scoreData.rating || 'N/A'} (${scoreData.percentage || 0}%)</div>
                </div>
            `).join('')}
        </div>
    `;
}

// Generate charts HTML section
function generateChartsHTML(charts) {
    if (!charts || Object.keys(charts).length === 0) {
        return '<p>No charts available for this report.</p>';
    }
    
    return Object.entries(charts).map(([chartId, chartData]) => {
        if (chartData) {
            const chartTitle = chartId.replace('Chart', '').replace(/([A-Z])/g, ' $1').trim();
            return `
                <div class="chart-container">
                    <h3>${chartTitle} Chart</h3>
                    <img src="${chartData}" alt="${chartTitle} Chart" />
                </div>
            `;
        }
        return '';
    }).join('');
}

// Generate critical issues HTML
function generateCriticalIssuesHTML(criticalIssues) {
    if (!criticalIssues || criticalIssues.length === 0) {
        return '';
    }
    
    return `
        <section class="critical-issues">
            <h3>Critical Issues Identified</h3>
            ${criticalIssues.map(issue => `
                <div class="issue-item">
                    <strong>${issue.type}</strong>
                    ${issue.site ? ` - ${issue.site}` : ''}
                    ${issue.section ? ` (${issue.section})` : ''}
                    <br>
                    <span>${issue.issue}</span>
                </div>
            `).join('')}
        </section>
    `;
}

// Generate recommendations HTML
function generateRecommendationsHTML(recommendations) {
    if (!recommendations || recommendations.length === 0) {
        return '';
    }
    
    return `
        <section class="recommendations-section">
            <h2>Recommendations</h2>
            ${recommendations.map(rec => `
                <div class="recommendation-item">
                    <strong>${rec.priority} Priority - ${rec.type}</strong>
                    ${rec.site ? ` (${rec.site})` : ''}
                    <br>
                    <strong>Issue:</strong> ${rec.issue}
                    <br>
                    <strong>Recommendation:</strong> ${rec.recommendation}
                </div>
            `).join('')}
        </section>
    `;
}

// Capture charts for report
function captureChartsForReport() {
    try {
        const charts = {};
        
        // Capture dashboard charts if they exist
        const chartElements = ['ratingChart', 'distributionChart', 'managementChart'];
        
        chartElements.forEach(chartId => {
            const canvas = document.getElementById(chartId);
            if (canvas && canvas.getContext) {
                try {
                    // Check if canvas has been rendered
                    const ctx = canvas.getContext('2d');
                    if (ctx) {
                        charts[chartId] = canvas.toDataURL('image/png', 0.8);
                        console.log(`Successfully captured chart: ${chartId}`);
                    }
                } catch (error) {
                    console.warn(`Could not capture chart ${chartId}:`, error);
                    charts[chartId] = null;
                }
            } else {
                console.warn(`Chart canvas not found or not ready: ${chartId}`);
                charts[chartId] = null;
            }
        });
        
        console.log('Charts captured for report:', Object.keys(charts));
        return charts;
    } catch (error) {
        console.error('Error capturing charts:', error);
        return {};
    }
}

// Initialize report generation functionality
function initializeReportGeneration() {
    try {
        console.log('Initializing report generation...');
        
        // Initialize logo upload functionality
        initializeLogoUpload();
        
        // Initialize new report generation buttons
        const generateBtn = document.getElementById('generateDetailedReportBtn');
        if (generateBtn) {
            generateBtn.addEventListener('click', generateExecutiveReport);
        }
        
        const exportHtmlBtn = document.getElementById('exportHtmlReportBtn');
        if (exportHtmlBtn) {
            exportHtmlBtn.addEventListener('click', exportToHTML);
        }
        
        // Initialize legacy report generation
        initializeLegacyReportGeneration();
        
        console.log('Report generation initialized successfully');
    } catch (error) {
        console.error('Error initializing report generation:', error);
    }
}

// Initialize logo upload functionality
function initializeLogoUpload() {
    try {
        const uploadBtn = document.getElementById('uploadLogoBtn');
        const fileInput = document.getElementById('logoFileInput');
        const removeBtn = document.getElementById('removeLogoBtn');
        const logoPreview = document.getElementById('logoPreview');
        const logoImage = document.getElementById('logoImage');
        
        if (uploadBtn && fileInput) {
            uploadBtn.addEventListener('click', () => {
                fileInput.click();
            });
            
            fileInput.addEventListener('change', (event) => {
                const file = event.target.files[0];
                if (file) {
                    if (file.type.startsWith('image/')) {
                        const reader = new FileReader();
                        reader.onload = (e) => {
                            if (logoImage) {
                                logoImage.src = e.target.result;
                                logoPreview.style.display = 'block';
                                removeBtn.style.display = 'inline-block';
                                
                                // Store logo data for report generation
                                window.reportLogoData = e.target.result;
                            }
                        };
                        reader.readAsDataURL(file);
                    } else {
                        alert('Please select a valid image file (PNG, JPG, GIF, etc.)');
                    }
                }
            });
        }
        
        if (removeBtn) {
            removeBtn.addEventListener('click', () => {
                if (logoPreview) logoPreview.style.display = 'none';
                if (removeBtn) removeBtn.style.display = 'none';
                if (fileInput) fileInput.value = '';
                window.reportLogoData = null;
            });
        }
        
        console.log('Logo upload functionality initialized');
    } catch (error) {
        console.error('Error initializing logo upload:', error);
    }
}

// Generate Executive Report
function generateExecutiveReport() {
    try {
        console.log('Generating executive report...');
        
        // Step 1: Test basic data availability
        console.log('Step 1: Checking data availability...');
        const project = window.app ? window.app.getCurrentProject() : null;
        console.log('Project data:', project);
        
        if (!project) {
            console.error('No project data available');
            alert('No project data available. Please ensure you have a project selected.');
            return;
        }
        
        // Step 2: Generate report data
        console.log('Step 2: Generating report data...');
        const report = generateAuditReport();
        console.log('Generated report:', report);
        
        if (!report) {
            console.error('Failed to generate report data');
            alert('Failed to generate report data. Please check the console for details.');
            return;
        }
        
        // Step 3: Create HTML
        console.log('Step 3: Creating report HTML...');
        const reportHtml = createExecutiveReportHTML(report);
        console.log('Report HTML generated successfully, length:', reportHtml.length);
        
        // Step 4: Display in new window
        console.log('Step 4: Opening report in new window...');
        displayReportInNewWindow(reportHtml, 'Executive Audit Report');
        
        console.log('Executive report generation completed successfully!');
        
    } catch (error) {
        console.error('Detailed error in generateExecutiveReport:', error);
        console.error('Error stack:', error.stack);
        alert(`Error generating executive report: ${error.message}\n\nCheck console for details.`);
    }
}

// Export to HTML
function exportToHTML() {
    try {
        console.log('Exporting report to HTML...');
        
        const report = generateAuditReport();
        if (!report) {
            return;
        }
        
        // Create full HTML report
        const reportHtml = createFullHTMLReport(report);
        
        // Create downloadable HTML file
        const blob = new Blob([reportHtml], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `audit_report_${new Date().toISOString().split('T')[0]}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        console.log('HTML report exported successfully');
        alert('Report exported successfully! The HTML file has been downloaded to your Downloads folder.');
        
    } catch (error) {
        console.error('Error exporting HTML report:', error);
        alert('Error exporting HTML report. Please check the console for details.');
    }
}

// Generate HTML report
function generateHTMLReport() {
    const report = generateAuditReport();
    if (!report) return;
    
    let html = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>OHS Management System Audit Report</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
                .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
                .summary { background: #f5f5f5; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
                .section { margin-bottom: 30px; }
                .section h2 { color: #333; border-bottom: 1px solid #ddd; padding-bottom: 10px; }
                .score { font-weight: bold; font-size: 1.2em; }
                .score.excellent { color: #48bb78; }
                .score.good { color: #38a169; }
                .score.fair { color: #ed8936; }
                .score.poor { color: #e53e3e; }
                .question-item { margin-bottom: 15px; padding: 10px; border-left: 4px solid #ddd; }
                .recommendation { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; margin-bottom: 10px; border-radius: 4px; }
                .recommendation.high { border-color: #e74c3c; background: #fdf2f2; }
                .recommendation.medium { border-color: #f39c12; background: #fef9e7; }
                table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
                th { background-color: #f2f2f2; }
                .site-section { margin-bottom: 25px; padding: 15px; border: 1px solid #ddd; border-radius: 8px; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>OHS Management System Audit Report</h1>
                <p>Generated on: ${new Date(report.metadata.generatedDate).toLocaleDateString()}</p>
            </div>
            
            <div class="summary">
                <h2>Executive Summary</h2>
                <table>
                    <tr><td><strong>Overall Compliance Score</strong></td><td class="score ${getScoreClass(report.summary.overallCompliance)}">${report.summary.overallCompliance}%</td></tr>
                    <tr><td><strong>Management System Score</strong></td><td class="score ${getScoreClass(report.summary.projectScore)}">${report.summary.projectScore}%</td></tr>
                    <tr><td><strong>Average Site Score</strong></td><td class="score ${getScoreClass(report.summary.averageSiteScore)}">${report.summary.averageSiteScore}%</td></tr>
                    <tr><td><strong>Total Sites Audited</strong></td><td>${report.summary.completedSites} / ${report.summary.totalSites}</td></tr>
                    <tr><td><strong>Critical Issues Identified</strong></td><td>${report.summary.criticalIssues}</td></tr>
                </table>
            </div>
    `;
    
    // Management System Section
    if (report.project) {
        html += `
            <div class="section">
                <h2>Management System Audit Results</h2>
                <p><strong>Overall Score:</strong> <span class="score ${getScoreClass(report.project.score)}">${report.project.score}%</span></p>
                <p><strong>Completion Status:</strong> ${report.project.completed ? 'Completed' : 'In Progress'}</p>
        `;
        
        if (report.project.questions && report.project.questions.length > 0) {
            html += '<h3>Question Responses</h3>';
            const template = window.dataManagement?.getCurrentTemplate();
            
            report.project.questions.forEach(q => {
                if (template && template.managementQuestions[q.index]) {
                    const questionText = template.managementQuestions[q.index].text;
                    html += `
                        <div class="question-item">
                            <strong>${questionText}</strong><br>
                            Score: <span class="score ${getScoreClass(q.score * 25)}">${q.score}/4</span>
                            ${q.comment ? `<br>Comment: ${q.comment}` : ''}
                        </div>
                    `;
                }
            });
        }
        
        html += '</div>';
    }
    
    // Sites Section
    if (report.sites && report.sites.length > 0) {
        html += '<div class="section"><h2>Site Performance Audit Results</h2>';
        
        report.sites.forEach(site => {
            html += `
                <div class="site-section">
                    <h3>${site.name}</h3>
                    <p><strong>Score:</strong> <span class="score ${getScoreClass(site.score)}">${site.score}%</span></p>
                    <p><strong>Status:</strong> ${site.completed ? 'Completed' : 'In Progress'}</p>
            `;
            
            if (site.questions && site.questions.length > 0) {
                const template = window.dataManagement?.getCurrentTemplate();
                
                site.questions.forEach(q => {
                    if (template && template.siteQuestions[q.index]) {
                        const questionText = template.siteQuestions[q.index].text;
                        html += `
                            <div class="question-item">
                                <strong>${questionText}</strong><br>
                                Score: <span class="score ${getScoreClass(q.score * 25)}">${q.score}/4</span>
                                ${q.comment ? `<br>Comment: ${q.comment}` : ''}
                            </div>
                        `;
                    }
                });
            }
            
            html += '</div>';
        });
        
        html += '</div>';
    }
    
    // Recommendations Section
    if (report.recommendations && report.recommendations.length > 0) {
        html += '<div class="section"><h2>Recommendations</h2>';
        
        report.recommendations.forEach(rec => {
            html += `
                <div class="recommendation ${rec.priority.toLowerCase()}">
                    <strong>${rec.priority} Priority - ${rec.type}</strong>
                    ${rec.site ? ` (${rec.site})` : ''}<br>
                    <strong>Issue:</strong> ${rec.issue}<br>
                    <strong>Recommendation:</strong> ${rec.recommendation}
                </div>
            `;
        });
        
        html += '</div>';
    }
    
    html += `
            <div class="section">
                <h2>Report Information</h2>
                <p><strong>Generated by:</strong> ${report.metadata.generatedBy}</p>
                <p><strong>Version:</strong> ${report.metadata.version}</p>
                <p><strong>Generated on:</strong> ${new Date(report.metadata.generatedDate).toLocaleString()}</p>
            </div>
        </body>
        </html>
    `;
    
    return html;
}

// Get CSS class for score styling
function getScoreClass(score) {
    if (score >= 80) return 'excellent';
    if (score >= 70) return 'good';
    if (score >= 50) return 'fair';
    return 'poor';
}

// Download HTML report
function downloadHTMLReport() {
    const html = generateHTMLReport();
    if (!html) return;
    
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `OHS_Audit_Report_${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Download JSON report
function downloadJSONReport() {
    const report = generateAuditReport();
    if (!report) return;
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `OHS_Audit_Data_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Print report
function printReport() {
    const html = generateHTMLReport();
    if (!html) return;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.print();
}

// Initialize legacy report generation (keeping for backward compatibility)
function initializeLegacyReportGeneration() {
    // Setup event listeners for report buttons
    const htmlReportBtn = document.getElementById('generateHTMLReport');
    const jsonReportBtn = document.getElementById('generateJSONReport');
    const printReportBtn = document.getElementById('printReport');
    
    if (htmlReportBtn) {
        htmlReportBtn.addEventListener('click', downloadHTMLReport);
    }
    
    if (jsonReportBtn) {
        jsonReportBtn.addEventListener('click', downloadJSONReport);
    }
    
    if (printReportBtn) {
        printReportBtn.addEventListener('click', printReport);
    }
}

// Export functions for use in other modules
window.reportGeneration = {
    generateAuditReport,
    generateHTMLReport,
    downloadHTMLReport,
    downloadJSONReport,
    printReport,
    initializeReportGeneration,
    captureChartsForReport,
    initializeLogoUpload,
    generateExecutiveReport,
    exportToHTML
};