// Main entry point for the OHS Audit Tool
import './style.css';
import './public/css/styles.css';

// Import Chart.js
import Chart from 'chart.js/auto';
window.Chart = Chart;

// Initialize global app object before loading any scripts
window.app = {
    masterConfig: {
        management: {},
        site: {}
    },
    inspectionData: {
        projects: {},
        currentProject: ''
    },
    charts: {},
    currentChartScope: 'all',
    companyLogo: null,
    customRecommendations: null,
    
    // Score labels mapping
    scoreLabels: {
        0: "0 - Not Applicable/Not Observed",
        1: "1 - Major Non-Conformance",
        2: "2 - Minor Non-Conformance",
        3: "3 - Observation/Improvement Opportunity",
        4: "4 - Conformance",
        5: "5 - Best Practice"
    },
    
    // Rating details mapping
    ratingDetails: {
        'E': { text: 'Excellent', color: '#00b894' },
        'G': { text: 'Good', color: '#38a169' },
        'S': { text: 'Satisfactory', color: '#d69e2e' },
        'L': { text: 'Low', color: '#dd6b20' },
        'U': { text: 'Unacceptable', color: '#c53030' }
    },
    
    // Site colors for charts
    siteColors: [
        '#667eea', '#764ba2', '#f093fb', '#f5576c',
        '#4facfe', '#00f2fe', '#43e97b', '#38f9d7',
        '#ffecd2', '#fcb69f', '#a8edea', '#fed6e3',
        '#fad0c4', '#ffd1ff', '#c2e9fb', '#a1c4fd'
    ],
    
    // Helper function to get current project
    getCurrentProject() {
        try {
            if (!app.inspectionData || !app.inspectionData.currentProject) {
                console.warn('No current project set');
                return null;
            }
            return app.inspectionData.projects[app.inspectionData.currentProject] || null;
        } catch (error) {
            console.error('Error getting current project:', error);
            return null;
        }
    },
    
    // Helper function to get rating details based on percentage
    getRatingDetails(percentage) {
        try {
            if (percentage > 90) return { text: 'Excellent', color: '#00b894' };
            else if (percentage > 80) return { text: 'Good', color: '#38a169' };
            else if (percentage > 70) return { text: 'Satisfactory', color: '#d69e2e' };
            else if (percentage > 50) return { text: 'Low', color: '#dd6b20' };
            else return { text: 'Unacceptable', color: '#c53030' };
        } catch (error) {
            console.error('Error getting rating details:', error);
            return { text: 'Unknown', color: '#718096' };
        }
    },
    
    // Function to check if questions have been imported
    hasQuestions() {
        try {
            // Check if masterConfig exists
            if (!app.masterConfig) {
                console.warn('Master configuration not found');
                return false;
            }
            
            // Check management questions
            let hasManagementQuestions = false;
            if (app.masterConfig.management) {
                const managementSections = Object.keys(app.masterConfig.management);
                hasManagementQuestions = managementSections.length > 0 && 
                                        managementSections.some(section => 
                                            Array.isArray(app.masterConfig.management[section]) && 
                                            app.masterConfig.management[section].length > 0
                                        );
            }
            
            // Check site questions
            let hasSiteQuestions = false;
            if (app.masterConfig.site) {
                const siteSections = Object.keys(app.masterConfig.site);
                hasSiteQuestions = siteSections.length > 0 && 
                                 siteSections.some(section => 
                                     Array.isArray(app.masterConfig.site[section]) && 
                                     app.masterConfig.site[section].length > 0
                                 );
            }
            
            const result = hasManagementQuestions || hasSiteQuestions;
            console.log('hasQuestions check result:', { 
                hasManagementQuestions, 
                hasSiteQuestions, 
                result,
                managementSections: Object.keys(app.masterConfig.management || {}),
                siteSections: Object.keys(app.masterConfig.site || {})
            });
            
            return result;
        } catch (error) {
            console.error('Error checking if questions exist:', error);
            return false;
        }
    }
};

// Import all JavaScript modules
import './public/js/utils.js';
import './public/js/dataManagement.js';
import './public/js/uiManagement.js';
import './public/js/chartManagement.js';
import './public/js/projectManagement.js';
import './public/js/recommendations.js';
import './public/js/reportGeneration.js';
import './public/js/comparison-chart-extension.js';

// Initialize the application after DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Main entry point - DOM loaded, initializing application...');
    
    try {
        // Initialize data management first
        if (window.dataManagement && window.dataManagement.initializeDataManagement) {
            window.dataManagement.initializeDataManagement();
            console.log('✓ Data Management initialized');
        } else if (typeof initializeDataManagement === 'function') {
            initializeDataManagement();
            console.log('✓ Data Management initialized (fallback)');
        }
        
        // Initialize UI management
        if (window.uiManagement && window.uiManagement.initializeUI) {
            window.uiManagement.initializeUI();
            console.log('✓ UI Management initialized');
        } else if (typeof initializeUI === 'function') {
            initializeUI();
            console.log('✓ UI Management initialized (fallback)');
        }
        
        // Initialize project management
        if (window.projectManagement && window.projectManagement.initializeProjectManagement) {
            window.projectManagement.initializeProjectManagement();
            console.log('✓ Project Management initialized');
        } else if (typeof initializeProjectManagement === 'function') {
            initializeProjectManagement();
            console.log('✓ Project Management initialized (fallback)');
        }
        
        // Initialize site management
        if (window.siteManagement && window.siteManagement.initializeSiteManagement) {
            window.siteManagement.initializeSiteManagement();
            console.log('✓ Site Management initialized');
        } else if (typeof initializeSiteManagement === 'function') {
            initializeSiteManagement();
            console.log('✓ Site Management initialized (fallback)');
        }
        
        // Initialize report generation
        if (window.reportGeneration && window.reportGeneration.initializeReportGeneration) {
            window.reportGeneration.initializeReportGeneration();
            console.log('✓ Report Generation initialized');
        } else if (typeof initializeReportGeneration === 'function') {
            initializeReportGeneration();
            console.log('✓ Report Generation initialized (fallback)');
        }
        
        // Initialize recommendations
        if (window.recommendations && window.recommendations.initializeRecommendations) {
            window.recommendations.initializeRecommendations();
            console.log('✓ Recommendations initialized');
        } else if (typeof initializeRecommendations === 'function') {
            initializeRecommendations();
            console.log('✓ Recommendations initialized (fallback)');
        }
        
        // Initialize charts after Chart.js loads
        const initCharts = () => {
            if (typeof Chart !== 'undefined') {
                if (window.chartManagement && window.chartManagement.initializeCharts) {
                    window.chartManagement.initializeCharts();
                    console.log('✓ Chart Management initialized');
                } else if (typeof initializeCharts === 'function') {
                    initializeCharts();
                    console.log('✓ Chart Management initialized (fallback)');
                }
                
                // Initial dashboard update after charts are initialized
                setTimeout(() => {
                    if (typeof updateAllDashboardComponents === 'function') {
                        updateAllDashboardComponents();
                    }
                }, 500);
            } else {
                console.log('Chart.js not loaded yet, waiting...');
                setTimeout(initCharts, 100);
            }
        };
        
        setTimeout(initCharts, 500); // Give Chart.js time to load
        
        // Load default template if no questions exist (check immediately)
        console.log('Checking if template needs to be loaded...');
        console.log('app.hasQuestions():', app.hasQuestions());
        console.log('Master config:', app.masterConfig);
        
        if (!app.hasQuestions()) {
            console.log('No questions found, loading default template...');
            if (typeof loadDefaultTemplate === 'function') {
                setTimeout(() => {
                    loadDefaultTemplate(true); // Skip confirmation for initial load
                }, 500); // Small delay to ensure all components are ready
            } else {
                console.error('loadDefaultTemplate function not found');
            }
        } else {
            console.log('Questions already exist, skipping template load');
        }
        
        console.log('🎉 OHS Management System Audit Tool fully initialized!');
        
    } catch (error) {
        console.error('Error during initialization:', error);
        
        // Show user-friendly error message
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #fee;
            border: 1px solid #fcc;
            color: #c33;
            padding: 15px;
            border-radius: 5px;
            z-index: 10000;
            max-width: 300px;
        `;
        errorDiv.innerHTML = `
            <strong>Initialization Error</strong><br>
            Some features may not work properly. Please refresh the page.
            <button onclick="this.parentElement.remove()" style="float: right; margin-left: 10px;">×</button>
        `;
        document.body.appendChild(errorDiv);
        
        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (errorDiv.parentElement) {
                errorDiv.remove();
            }
        }, 10000);
    }
});