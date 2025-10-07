// Comparison Chart Extension
// Extends chart functionality with comparison and trend analysis

// Initialize comparison charts
function initializeComparisonCharts() {
    createSiteComparisonChart();
    createTrendAnalysisChart();
    createPerformanceBreakdownChart();
}

// Create site comparison chart
function createSiteComparisonChart() {
    const ctx = document.getElementById('siteComparisonChart');
    if (!ctx) return;
    
    const sitesData = window.siteManagement?.getCurrentSites() || [];
    const completedSites = sitesData.filter(site => site.completed);
    
    if (completedSites.length === 0) {
        ctx.parentElement.innerHTML = '<p>No completed sites available for comparison.</p>';
        return;
    }
    
    const labels = completedSites.map(site => site.name);
    const scores = completedSites.map(site => site.score);
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Site Performance Score (%)',
                data: scores,
                backgroundColor: scores.map(score => {
                    if (score >= 80) return '#48bb78';
                    if (score >= 70) return '#38a169';
                    if (score >= 50) return '#ed8936';
                    return '#e53e3e';
                }),
                borderColor: '#2d3748',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    title: {
                        display: true,
                        text: 'Score (%)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Sites'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Site Performance Comparison'
                },
                legend: {
                    display: false
                }
            }
        }
    });
}

// Create trend analysis chart
function createTrendAnalysisChart() {
    const ctx = document.getElementById('trendAnalysisChart');
    if (!ctx) return;
    
    // Get historical data from localStorage or create sample data
    const historicalData = getHistoricalData();
    
    if (historicalData.length === 0) {
        ctx.parentElement.innerHTML = '<p>No historical data available for trend analysis.</p>';
        return;
    }
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: historicalData.map(data => data.date),
            datasets: [{
                label: 'Management System Score',
                data: historicalData.map(data => data.managementScore),
                borderColor: '#4299e1',
                backgroundColor: 'rgba(66, 153, 225, 0.1)',
                tension: 0.4
            }, {
                label: 'Average Site Score',
                data: historicalData.map(data => data.siteScore),
                borderColor: '#48bb78',
                backgroundColor: 'rgba(72, 187, 120, 0.1)',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    title: {
                        display: true,
                        text: 'Score (%)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Time Period'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Performance Trends Over Time'
                }
            }
        }
    });
}

// Create performance breakdown chart
function createPerformanceBreakdownChart() {
    const ctx = document.getElementById('performanceBreakdownChart');
    if (!ctx) return;
    
    const projectData = window.projectManagement?.getCurrentProject();
    const sitesData = window.siteManagement?.getCurrentSites() || [];
    
    // Calculate category scores
    const categoryScores = calculateCategoryScores(projectData, sitesData);
    
    if (Object.keys(categoryScores).length === 0) {
        ctx.parentElement.innerHTML = '<p>No data available for performance breakdown.</p>';
        return;
    }
    
    new Chart(ctx, {
        type: 'radar',
        data: {
            labels: Object.keys(categoryScores),
            datasets: [{
                label: 'Performance Score',
                data: Object.values(categoryScores),
                borderColor: '#805ad5',
                backgroundColor: 'rgba(128, 90, 213, 0.2)',
                pointBackgroundColor: '#805ad5',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: '#805ad5'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        stepSize: 20
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Performance Breakdown by Category'
                }
            }
        }
    });
}

// Get historical data (mock data for demonstration)
function getHistoricalData() {
    // In a real application, this would come from a database
    // For now, we'll create some sample historical data
    const currentProject = window.projectManagement?.getCurrentProject();
    const currentSites = window.siteManagement?.getCurrentSites() || [];
    
    if (!currentProject && currentSites.length === 0) {
        return [];
    }
    
    const currentManagementScore = currentProject ? currentProject.score : 0;
    const currentSiteScore = currentSites.length > 0 ? 
        Math.round(currentSites.reduce((sum, site) => sum + site.score, 0) / currentSites.length) : 0;
    
    // Generate sample historical data showing improvement over time
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const historicalData = [];
    
    for (let i = 0; i < months.length; i++) {
        const progressFactor = (i + 1) / months.length;
        historicalData.push({
            date: months[i],
            managementScore: Math.round(currentManagementScore * (0.6 + 0.4 * progressFactor)),
            siteScore: Math.round(currentSiteScore * (0.5 + 0.5 * progressFactor))
        });
    }
    
    return historicalData;
}

// Calculate category scores based on question groupings
function calculateCategoryScores(projectData, sitesData) {
    const categories = {
        'Policy & Planning': [],
        'Training & Competency': [],
        'Risk Management': [],
        'Incident Management': [],
        'Emergency Preparedness': [],
        'Monitoring & Review': []
    };
    
    // Categorize questions based on keywords
    const template = window.dataManagement?.getCurrentTemplate();
    if (!template) return {};
    
    // Process management system questions
    if (projectData && projectData.questions && template.managementQuestions) {
        projectData.questions.forEach(q => {
            const questionText = template.managementQuestions[q.index]?.text.toLowerCase() || '';
            
            if (questionText.includes('policy') || questionText.includes('planning')) {
                categories['Policy & Planning'].push(q.score);
            } else if (questionText.includes('training') || questionText.includes('competency')) {
                categories['Training & Competency'].push(q.score);
            } else if (questionText.includes('risk') || questionText.includes('hazard')) {
                categories['Risk Management'].push(q.score);
            } else if (questionText.includes('incident') || questionText.includes('accident')) {
                categories['Incident Management'].push(q.score);
            } else if (questionText.includes('emergency') || questionText.includes('evacuation')) {
                categories['Emergency Preparedness'].push(q.score);
            } else {
                categories['Monitoring & Review'].push(q.score);
            }
        });
    }
    
    // Process site questions
    if (sitesData && template.siteQuestions) {
        sitesData.forEach(site => {
            if (site.questions) {
                site.questions.forEach(q => {
                    const questionText = template.siteQuestions[q.index]?.text.toLowerCase() || '';
                    
                    if (questionText.includes('policy') || questionText.includes('planning')) {
                        categories['Policy & Planning'].push(q.score);
                    } else if (questionText.includes('training') || questionText.includes('competency')) {
                        categories['Training & Competency'].push(q.score);
                    } else if (questionText.includes('risk') || questionText.includes('hazard')) {
                        categories['Risk Management'].push(q.score);
                    } else if (questionText.includes('incident') || questionText.includes('accident')) {
                        categories['Incident Management'].push(q.score);
                    } else if (questionText.includes('emergency') || questionText.includes('evacuation')) {
                        categories['Emergency Preparedness'].push(q.score);
                    } else {
                        categories['Monitoring & Review'].push(q.score);
                    }
                });
            }
        });
    }
    
    // Calculate average scores for each category
    const categoryScores = {};
    Object.keys(categories).forEach(category => {
        const scores = categories[category].filter(score => score > 0); // Exclude N/A scores
        if (scores.length > 0) {
            categoryScores[category] = Math.round((scores.reduce((sum, score) => sum + score, 0) / scores.length) * 25);
        }
    });
    
    return categoryScores;
}

// Update all comparison charts
function updateComparisonCharts() {
    // Clear existing charts
    const chartContainers = ['siteComparisonChart', 'trendAnalysisChart', 'performanceBreakdownChart'];
    chartContainers.forEach(containerId => {
        const container = document.getElementById(containerId);
        if (container) {
            // Destroy existing chart if it exists
            const existingChart = Chart.getChart(container);
            if (existingChart) {
                existingChart.destroy();
            }
        }
    });
    
    // Recreate charts with updated data
    setTimeout(() => {
        initializeComparisonCharts();
    }, 100);
}

// Export functions for use in other modules
window.comparisonCharts = {
    initializeComparisonCharts,
    updateComparisonCharts
};

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit for other modules to initialize
    setTimeout(() => {
        if (typeof Chart !== 'undefined') {
            initializeComparisonCharts();
        }
    }, 1000);
});