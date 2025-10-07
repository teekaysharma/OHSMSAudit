// Chart management functions
(function() {
    // Helper function to get filtered data (excluding score 0 for calculations)
    function getFilteredDataForCalculations(data) {
        return data.filter(item => item.score > 0);
    }

    // Helper function to get complete data (including score 0 for visualization)
    function getCompleteDataForVisualization(data) {
        return data;
    }

    // Helper function to get rating from percentage
    function getRatingFromPercentage(percentage) {
        if (percentage > 90) return 'E';
        else if (percentage > 80) return 'G';
        else if (percentage > 70) return 'S';
        else if (percentage > 50) return 'L';
        else return 'U';
    }

    // Helper function to get scope label for display
    function getScopeLabel(scope) {
        switch (scope) {
            case 'management': return 'Management Only';
            case 'all-sites': return 'All Sites Only';
            case 'total': return 'Project Overview';
            default: return 'Current Site Only';
        }
    }

    // Helper function to get data organized by sections
    function getDataBySections(scope) {
        const project = window.app.getCurrentProject();
        if (!project) return { managementSections: {}, siteSections: {} };
        
        const managementSections = {};
        const siteSections = {};
        
        // Get management data by sections
        if (project.managementSystemAudit) {
            for (const section in project.managementSystemAudit) {
                if (Array.isArray(project.managementSystemAudit[section])) {
                    managementSections[section] = project.managementSystemAudit[section];
                }
            }
        }
        
        // Get site data by sections based on scope
        if (scope === 'all-sites' || scope === 'total') {
            // Get all sites data
            if (project.sites) {
                for (const siteName in project.sites) {
                    const site = project.sites[siteName];
                    for (const section in site) {
                        if (Array.isArray(site[section])) {
                            if (!siteSections[section]) {
                                siteSections[section] = [];
                            }
                            siteSections[section] = siteSections[section].concat(site[section]);
                        }
                    }
                }
            }
        } else if (scope === 'all' && project.currentSite && project.sites[project.currentSite]) {
            // Get current site data only
            const site = project.sites[project.currentSite];
            for (const section in site) {
                if (Array.isArray(site[section])) {
                    siteSections[section] = site[section];
                }
            }
        }
        
        return { managementSections, siteSections };
    }

    // Helper function to get unique questions count by scope
    function getUniqueQuestionsCount(scope) {
        const project = window.app.getCurrentProject();
        if (!project) return { totalQuestions: 0, answeredQuestions: 0 };
        
        const baseTemplate = window.app.masterConfig || {};
        let uniqueQuestions = new Set();
        let answeredQuestions = 0;
        
        if (scope === 'management') {
            // Count unique management questions
            if (project.managementSystemAudit) {
                for (const section in project.managementSystemAudit) {
                    if (Array.isArray(project.managementSystemAudit[section])) {
                        project.managementSystemAudit[section].forEach(item => {
                            const questionKey = `management_${section}_${item.name}`;
                            uniqueQuestions.add(questionKey);
                            if (item.score > 0) answeredQuestions++;
                        });
                    }
                }
            }
        } else if (scope === 'all-sites') {
            // Count unique site questions across all sites
            const allSiteQuestions = new Map(); // Map to track unique questions with their scores
            
            if (project.sites) {
                for (const siteName in project.sites) {
                    const site = project.sites[siteName];
                    for (const section in site) {
                        if (Array.isArray(site[section])) {
                            site[section].forEach(item => {
                                const questionKey = `site_${section}_${item.name}`;
                                uniqueQuestions.add(questionKey);
                                // Track if this question is answered in any site
                                if (!allSiteQuestions.has(questionKey)) {
                                    allSiteQuestions.set(questionKey, item.score > 0);
                                } else if (item.score > 0) {
                                    allSiteQuestions.set(questionKey, true);
                                }
                            });
                        }
                    }
                }
            }
            
            // Count answered questions (questions answered in at least one site)
            answeredQuestions = Array.from(allSiteQuestions.values()).filter(answered => answered).length;
        } else if (scope === 'total') {
            // Count unique questions from both management and all sites
            const allQuestions = new Map();
            
            // Add management questions
            if (project.managementSystemAudit) {
                for (const section in project.managementSystemAudit) {
                    if (Array.isArray(project.managementSystemAudit[section])) {
                        project.managementSystemAudit[section].forEach(item => {
                            const questionKey = `management_${section}_${item.name}`;
                            uniqueQuestions.add(questionKey);
                            allQuestions.set(questionKey, item.score > 0);
                        });
                    }
                }
            }
            
            // Add site questions (unique across all sites)
            if (project.sites) {
                for (const siteName in project.sites) {
                    const site = project.sites[siteName];
                    for (const section in site) {
                        if (Array.isArray(site[section])) {
                            site[section].forEach(item => {
                                const questionKey = `site_${section}_${item.name}`;
                                uniqueQuestions.add(questionKey);
                                if (!allQuestions.has(questionKey)) {
                                    allQuestions.set(questionKey, item.score > 0);
                                } else if (item.score > 0) {
                                    allQuestions.set(questionKey, true);
                                }
                            });
                        }
                    }
                }
            }
            
            answeredQuestions = Array.from(allQuestions.values()).filter(answered => answered).length;
        } else {
            // Current site only
            if (project.currentSite && project.sites[project.currentSite]) {
                const site = project.sites[project.currentSite];
                for (const section in site) {
                    if (Array.isArray(site[section])) {
                        site[section].forEach(item => {
                            const questionKey = `site_${section}_${item.name}`;
                            uniqueQuestions.add(questionKey);
                            if (item.score > 0) answeredQuestions++;
                        });
                    }
                }
            }
        }
        
        return {
            totalQuestions: uniqueQuestions.size,
            answeredQuestions: answeredQuestions
        };
    }

    // Helper function to get data based on scope (for chart calculations)
    function getDataByScope(scope) {
        let data = [];
        const project = window.app.getCurrentProject();
        if (!project) return data;
        
        if (scope === 'management') {
            // Get management data
            if (project.managementSystemAudit) {
                for (const section in project.managementSystemAudit) {
                    if (Array.isArray(project.managementSystemAudit[section])) {
                        data = data.concat(project.managementSystemAudit[section]);
                    }
                }
            }
        } else if (scope === 'all-sites') {
            // Get unique site questions (avoid duplicates across sites)
            const uniqueQuestions = new Map();
            if (project.sites) {
                for (const siteName in project.sites) {
                    const site = project.sites[siteName];
                    for (const section in site) {
                        if (Array.isArray(site[section])) {
                            site[section].forEach(item => {
                                const questionKey = `${section}_${item.name}`;
                                if (!uniqueQuestions.has(questionKey)) {
                                    uniqueQuestions.set(questionKey, item);
                                } else {
                                    // If question exists, use the highest score found
                                    const existingItem = uniqueQuestions.get(questionKey);
                                    if (item.score > existingItem.score) {
                                        uniqueQuestions.set(questionKey, item);
                                    }
                                }
                            });
                        }
                    }
                }
            }
            data = Array.from(uniqueQuestions.values());
        } else if (scope === 'total') {
            // Get unique questions from both management and sites
            const uniqueQuestions = new Map();
            
            // Add management questions
            if (project.managementSystemAudit) {
                for (const section in project.managementSystemAudit) {
                    if (Array.isArray(project.managementSystemAudit[section])) {
                        project.managementSystemAudit[section].forEach(item => {
                            const questionKey = `management_${section}_${item.name}`;
                            uniqueQuestions.set(questionKey, item);
                        });
                    }
                }
            }
            
            // Add unique site questions
            if (project.sites) {
                for (const siteName in project.sites) {
                    const site = project.sites[siteName];
                    for (const section in site) {
                        if (Array.isArray(site[section])) {
                            site[section].forEach(item => {
                                const questionKey = `site_${section}_${item.name}`;
                                if (!uniqueQuestions.has(questionKey)) {
                                    uniqueQuestions.set(questionKey, item);
                                } else {
                                    // Use highest score if question exists
                                    const existingItem = uniqueQuestions.get(questionKey);
                                    if (item.score > existingItem.score) {
                                        uniqueQuestions.set(questionKey, item);
                                    }
                                }
                            });
                        }
                    }
                }
            }
            
            data = Array.from(uniqueQuestions.values());
        } else {
            // Get current site data only
            if (project.currentSite && project.sites[project.currentSite]) {
                const site = project.sites[project.currentSite];
                for (const section in site) {
                    if (Array.isArray(site[section])) {
                        data = data.concat(site[section]);
                    }
                }
            }
        }
        
        return data;
    }

    // Calculate overall score
    function calculateOverallScore(scope = 'all') {
        try {
            // Get data based on scope
            const data = getDataByScope(scope);
            
            // Get unique questions count
            const uniqueCount = getUniqueQuestionsCount(scope);
            
            // Filter out score 0 for calculations
            const filteredData = getFilteredDataForCalculations(data);
            
            if (filteredData.length === 0) {
                return {
                    score: 0,
                    percentage: 0,
                    rating: 'Unacceptable',
                    totalItems: uniqueCount.answeredQuestions,
                    totalQuestions: uniqueCount.totalQuestions
                };
            }
            
            // Calculate total score
            const totalScore = filteredData.reduce((sum, item) => sum + item.score, 0);
            const maxPossibleScore = filteredData.length * 5;
            const averageScore = totalScore / filteredData.length;
            const percentage = (averageScore / 5) * 100;
            
            // Get rating based on percentage
            let rating = 'Unacceptable';
            if (percentage > 90) rating = 'Excellent';
            else if (percentage > 80) rating = 'Good';
            else if (percentage > 70) rating = 'Satisfactory';
            else if (percentage > 50) rating = 'Low';
            
            return {
                score: parseFloat(averageScore.toFixed(1)),
                percentage: Math.round(percentage),
                rating,
                totalItems: filteredData.length,
                totalQuestions: uniqueCount.totalQuestions
            };
        } catch (error) {
            console.error('Error calculating overall score:', error);
            return {
                score: 0,
                percentage: 0,
                rating: 'Unacceptable',
                totalItems: 0,
                totalQuestions: 0
            };
        }
    }

    // Render rating chart
    function renderRatingChart(scope = 'all') {
        try {
            const canvas = document.getElementById('ratingChart');
            if (!canvas) {
                console.warn('Rating chart canvas not found');
                return;
            }

            // Get data based on scope
            const data = getDataByScope(scope);
            
            // For calculations, filter out score 0
            const filteredData = getFilteredDataForCalculations(data);
            
            // For visualization, use complete data
            const visualizationData = getCompleteDataForVisualization(data);
            
            // Count ratings from filtered data (for accurate performance metrics)
            const ratingCounts = {
                'E': 0, 'G': 0, 'S': 0, 'L': 0, 'U': 0, 'NA': 0
            };
            
            // Calculate percentage for each item
            filteredData.forEach(item => {
                const percentage = (item.score / 5) * 100;
                const rating = getRatingFromPercentage(percentage);
                ratingCounts[rating]++;
            });
            
            // Count NA items from complete data (for visualization)
            visualizationData.forEach(item => {
                if (item.score === 0) {
                    ratingCounts['NA']++;
                }
            });
            
            // Create or update chart
            const ctx = canvas.getContext('2d');
            
            if (app.charts && app.charts.ratingChart) {
                app.charts.ratingChart.destroy();
            }
            
            if (!app.charts) app.charts = {};
            
            app.charts.ratingChart = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: ['Excellent', 'Good', 'Satisfactory', 'Low', 'Unacceptable', 'Not Applicable'],
                    datasets: [{
                        data: [
                            ratingCounts['E'],
                            ratingCounts['G'],
                            ratingCounts['S'],
                            ratingCounts['L'],
                            ratingCounts['U'],
                            ratingCounts['NA']
                        ],
                        backgroundColor: [
                            '#00b894', // Excellent - Green
                            '#38a169', // Good - Light Green
                            '#d69e2e', // Satisfactory - Yellow
                            '#dd6b20', // Low - Orange
                            '#c53030', // Unacceptable - Red
                            '#a0aec0'  // Not Applicable - Grey
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    layout: {
                        padding: {
                            top: 10,
                            bottom: 10,
                            left: 10,
                            right: 10
                        }
                    },
                    plugins: {
                        legend: {
                            position: 'right',
                            labels: {
                                generateLabels: function(chart) {
                                    const data = chart.data;
                                    if (data.labels.length && data.datasets.length) {
                                        return data.labels.map((label, i) => {
                                            const value = data.datasets[0].data[i];
                                            const total = data.datasets[0].data.reduce((a, b) => a + b, 0);
                                            const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
                                            
                                            return {
                                                text: `${label}: ${value} (${percentage}%)`,
                                                fillStyle: data.datasets[0].backgroundColor[i],
                                                hidden: false,
                                                index: i
                                            };
                                        });
                                    }
                                    return [];
                                }
                            }
                        }
                    }
                }
            });
            
            console.log('Rating chart rendered successfully');
        } catch (error) {
            console.error('Error rendering rating chart:', error);
        }
    }

    // Render distribution chart
    function renderDistributionChart(scope = 'all') {
        try {
            const canvas = document.getElementById('distributionChart');
            if (!canvas) {
                console.warn('Distribution chart canvas not found');
                return;
            }

            // Get data based on scope
            const data = getDataByScope(scope);
            
            // For calculations, filter out score 0
            const filteredData = getFilteredDataForCalculations(data);
            
            // For visualization, use complete data
            const visualizationData = getCompleteDataForVisualization(data);
            
            // Count scores from filtered data (for accurate performance metrics)
            const scoreCounts = {
                '5': 0, '4': 0, '3': 0, '2': 0, '1': 0, '0': 0
            };
            
            filteredData.forEach(item => {
                scoreCounts[item.score]++;
            });
            
            // Count score 0 items from complete data (for visualization)
            visualizationData.forEach(item => {
                if (item.score === 0) {
                    scoreCounts['0']++;
                }
            });
            
            // Create or update chart
            const ctx = canvas.getContext('2d');
            
            if (app.charts && app.charts.distributionChart) {
                app.charts.distributionChart.destroy();
            }
            
            if (!app.charts) app.charts = {};
            
            app.charts.distributionChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Best Practice (5)', 'Conformance (4)', 'Improvement (3)', 'Minor NC (2)', 'Major NC (1)', 'Not Applicable (0)'],
                    datasets: [{
                        label: 'Number of Questions',
                        data: [
                            scoreCounts['5'],
                            scoreCounts['4'],
                            scoreCounts['3'],
                            scoreCounts['2'],
                            scoreCounts['1'],
                            scoreCounts['0']
                        ],
                        backgroundColor: [
                            '#00b894', // Best Practice - Green
                            '#38a169', // Conformance - Light Green
                            '#d69e2e', // Improvement - Yellow
                            '#dd6b20', // Minor NC - Orange
                            '#c53030', // Major NC - Red
                            '#a0aec0'  // Not Applicable - Grey
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    layout: {
                        padding: {
                            top: 10,
                            bottom: 40,
                            left: 10,
                            right: 10
                        }
                    },
                    scales: {
                        x: {
                            ticks: {
                                maxRotation: 45,
                                minRotation: 0,
                                font: {
                                    size: 11
                                }
                            }
                        },
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Number of Questions'
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            display: false
                        }
                    }
                }
            });
            
            console.log('Distribution chart rendered successfully');
        } catch (error) {
            console.error('Error rendering distribution chart:', error);
        }
    }

    // Render management chart
    function renderManagementChart(scope = 'all') {
        try {
            const canvas = document.getElementById('managementChart');
            if (!canvas) {
                console.warn('Management chart canvas not found');
                return;
            }

            // Get current view type (type or sections)
            const viewTypeBtn = document.getElementById('chartViewType');
            const viewSectionsBtn = document.getElementById('chartViewSections');
            const viewType = viewTypeBtn && viewTypeBtn.classList.contains('active') ? 'type' : 'sections';

            // Create or update chart
            const ctx = canvas.getContext('2d');
            
            if (app.charts && app.charts.managementChart) {
                app.charts.managementChart.destroy();
            }
            
            if (!app.charts) app.charts = {};

            if (viewType === 'sections') {
                renderManagementChartBySections(scope, ctx);
            } else {
                renderManagementChartByType(scope, ctx);
            }
            
            console.log('Management chart rendered successfully');
        } catch (error) {
            console.error('Error rendering management chart:', error);
        }
    }

    // Render chart by audit type (original functionality)
    function renderManagementChartByType(scope, ctx) {
        // Get data based on scope
        const data = getDataByScope(scope);
        
        // For calculations, filter out score 0
        const filteredData = getFilteredDataForCalculations(data);
        
        // Group data by audit type (management vs site)
        const auditTypes = {
            'Management System': [],
            'Site Performance': []
        };
        
        // This is a simplified approach - you may need to adjust based on your data structure
        // For now, we'll assume all data is from the current scope
        if (scope === 'management') {
            auditTypes['Management System'] = filteredData;
        } else if (scope === 'all-sites') {
            auditTypes['Site Performance'] = filteredData;
        } else if (scope === 'total') {
            // For 'total' scope, we need to separate the data
            const project = window.app.getCurrentProject();
            if (project) {
                let managementData = [];
                let siteData = [];
                
                // Get management data
                if (project.managementSystemAudit) {
                    for (const section in project.managementSystemAudit) {
                        if (Array.isArray(project.managementSystemAudit[section])) {
                            managementData = managementData.concat(project.managementSystemAudit[section]);
                        }
                    }
                }
                
                // Get all sites data
                if (project.sites) {
                    for (const siteName in project.sites) {
                        const site = project.sites[siteName];
                        for (const section in site) {
                            if (Array.isArray(site[section])) {
                                siteData = siteData.concat(site[section]);
                            }
                        }
                    }
                }
                
                auditTypes['Management System'] = getFilteredDataForCalculations(managementData);
                auditTypes['Site Performance'] = getFilteredDataForCalculations(siteData);
            }
        } else {
            // For 'all' scope (Current Site), show only site performance
            auditTypes['Site Performance'] = filteredData;
        }
        
        // Calculate average scores for each audit type (excluding score 0)
        const auditTypeScores = {};
        for (const type in auditTypes) {
            const typeData = auditTypes[type];
            if (typeData.length > 0) {
                const totalScore = typeData.reduce((sum, item) => sum + item.score, 0);
                const averageScore = totalScore / typeData.length;
                auditTypeScores[type] = parseFloat(averageScore.toFixed(1));
            } else {
                auditTypeScores[type] = 0;
            }
        }
        
        app.charts.managementChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Object.keys(auditTypeScores),
                datasets: [{
                    label: 'Average Score',
                    data: Object.values(auditTypeScores),
                    backgroundColor: [
                        '#4299e1', // Management System - Blue
                        '#48bb78'  // Site Performance - Green
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                layout: {
                    padding: {
                        top: 10,
                        bottom: 40,
                        left: 10,
                        right: 10
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            maxRotation: 0,
                            minRotation: 0,
                            font: {
                                size: 12
                            }
                        }
                    },
                    y: {
                        beginAtZero: true,
                        max: 5,
                        title: {
                            display: true,
                            text: 'Average Score'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }

    // Render chart by sections (new functionality)
    function renderManagementChartBySections(scope, ctx) {
        const sectionsData = getDataBySections(scope);
        const { managementSections, siteSections } = sectionsData;
        
        // Get all unique section names
        const allSections = new Set([
            ...Object.keys(managementSections),
            ...Object.keys(siteSections)
        ]);
        
        const sectionNames = Array.from(allSections).sort();
        
        // Calculate average scores for each section
        const managementScores = [];
        const siteScores = [];
        
        sectionNames.forEach(section => {
            // Management section score
            if (managementSections[section]) {
                const filteredData = getFilteredDataForCalculations(managementSections[section]);
                if (filteredData.length > 0) {
                    const totalScore = filteredData.reduce((sum, item) => sum + item.score, 0);
                    const averageScore = totalScore / filteredData.length;
                    managementScores.push(parseFloat(averageScore.toFixed(1)));
                } else {
                    managementScores.push(0);
                }
            } else {
                managementScores.push(0);
            }
            
            // Site section score
            if (siteSections[section]) {
                const filteredData = getFilteredDataForCalculations(siteSections[section]);
                if (filteredData.length > 0) {
                    const totalScore = filteredData.reduce((sum, item) => sum + item.score, 0);
                    const averageScore = totalScore / filteredData.length;
                    siteScores.push(parseFloat(averageScore.toFixed(1)));
                } else {
                    siteScores.push(0);
                }
            } else {
                siteScores.push(0);
            }
        });
        
        app.charts.managementChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: sectionNames.map(name => name.replace(/([A-Z])/g, ' $1').trim()),
                datasets: [{
                    label: 'Management System',
                    data: managementScores,
                    backgroundColor: '#4299e1',
                    borderWidth: 1
                }, {
                    label: 'Site Performance',
                    data: siteScores,
                    backgroundColor: '#48bb78',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                layout: {
                    padding: {
                        top: 10,
                        bottom: 40,
                        left: 10,
                        right: 10
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            maxRotation: 45,
                            minRotation: 0,
                            font: {
                                size: 10
                            }
                        }
                    },
                    y: {
                        beginAtZero: true,
                        max: 5,
                        title: {
                            display: true,
                            text: 'Average Score'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    }
                }
            }
        });
    }

    // Update dashboard
    function updateDashboard() {
        try {
            console.log('Updating dashboard...');
            
            // Get current chart scope
            const scope = window.app.currentChartScope || 'all';
            
            // Calculate overall score using filtered data
            const overallScore = calculateOverallScore(scope);
            
            // Update dashboard summary
            const overallScoreElement = document.getElementById('overallScore');
            const overallPercentageElement = document.getElementById('overallPercentage');
            const overallRatingElement = document.getElementById('overallRating');
            const totalItemsElement = document.getElementById('totalItemsInspected');
            
            if (overallScoreElement) overallScoreElement.textContent = overallScore.score;
            if (overallPercentageElement) overallPercentageElement.textContent = `${overallScore.percentage}%`;
            if (overallRatingElement) {
                overallRatingElement.textContent = overallScore.rating;
                const ratingDetails = window.app.getRatingDetails(overallScore.percentage);
                overallRatingElement.style.color = ratingDetails.color;
            }
            if (totalItemsElement) {
                const scopeLabel = getScopeLabel(scope);
                totalItemsElement.textContent = `${overallScore.totalItems} of ${overallScore.totalQuestions} (${scopeLabel})`;
            }
            
            // Wait for Chart.js to be available before rendering charts
            if (typeof Chart !== 'undefined') {
                renderRatingChart(scope);
                renderDistributionChart(scope);
                renderManagementChart(scope);
                
                // Update audit status indicators
                updateAuditStatusIndicators();
                
                // Update recommendations
                if (window.recommendations && window.recommendations.updateRecommendations) {
                    window.recommendations.updateRecommendations();
                }
            } else {
                console.warn('Chart.js not loaded yet, skipping chart rendering');
            }
            
            console.log('Dashboard updated successfully');
        } catch (error) {
            console.error('Error updating dashboard:', error);
        }
    }
    
    // Update audit status indicators
    function updateAuditStatusIndicators() {
        try {
            const project = window.app.getCurrentProject();
            if (!project) return;
            
            // Update management audit status
            const managementStatus = document.getElementById('managementAuditStatus');
            if (managementStatus) {
                const managementData = [];
                for (const section in project.managementSystemAudit) {
                    if (Array.isArray(project.managementSystemAudit[section])) {
                        managementData.push(...project.managementSystemAudit[section]);
                    }
                }
                
                const filteredManagementData = managementData.filter(item => item.score > 0);
                
                if (filteredManagementData.length === 0) {
                    managementStatus.className = 'audit-status-indicator incomplete';
                    managementStatus.title = 'Management audit not started';
                } else {
                    const totalScore = filteredManagementData.reduce((sum, item) => sum + item.score, 0);
                    const averageScore = totalScore / filteredManagementData.length;
                    const percentage = (averageScore / 5) * 100;
                    
                    if (percentage >= 70) {
                        managementStatus.className = 'audit-status-indicator completed';
                    } else {
                        managementStatus.className = 'audit-status-indicator incomplete';
                    }
                    
                    managementStatus.title = `Management audit: ${Math.round(percentage)}% complete`;
                }
            }
            
            // Update site audit status
            const siteStatus = document.getElementById('siteAuditStatus');
            if (siteStatus && project.currentSite && project.sites[project.currentSite]) {
                const siteData = [];
                for (const section in project.sites[project.currentSite]) {
                    if (Array.isArray(project.sites[project.currentSite][section])) {
                        siteData.push(...project.sites[project.currentSite][section]);
                    }
                }
                
                const filteredSiteData = siteData.filter(item => item.score > 0);
                
                if (filteredSiteData.length === 0) {
                    siteStatus.className = 'audit-status-indicator incomplete';
                    siteStatus.title = 'Site audit not started';
                } else {
                    const totalScore = filteredSiteData.reduce((sum, item) => sum + item.score, 0);
                    const averageScore = totalScore / filteredSiteData.length;
                    const percentage = (averageScore / 5) * 100;
                    
                    if (percentage >= 70) {
                        siteStatus.className = 'audit-status-indicator completed';
                    } else {
                        siteStatus.className = 'audit-status-indicator incomplete';
                    }
                    
                    siteStatus.title = `Site audit: ${Math.round(percentage)}% complete`;
                }
            }
            
            console.log('Audit status indicators updated successfully');
        } catch (error) {
            console.error('Error updating audit status indicators:', error);
        }
    }

    // Initialize event listeners for chart scope buttons
    function initializeChartScopeListeners() {
        try {
            // Set chart scope function
            function setChartScope(scope) {
                window.app.currentChartScope = scope;
                updateDashboard();
                console.log('Chart scope changed to:', scope);
            }

            // Rating chart scope buttons
            const ratingScopeButtons = [
                { id: 'ratingChartScopeAll', scope: 'all' },
                { id: 'ratingChartScopeManagement', scope: 'management' },
                { id: 'ratingChartScopeAllSites', scope: 'all-sites' },
                { id: 'ratingChartScopeTotal', scope: 'total' }
            ];
            
            ratingScopeButtons.forEach(({ id, scope }) => {
                const button = document.getElementById(id);
                if (button) {
                    button.addEventListener('click', () => {
                        // Update active state for rating chart buttons
                        ratingScopeButtons.forEach(({ id: otherId }) => {
                            const btn = document.getElementById(otherId);
                            if (btn) btn.classList.remove('active');
                        });
                        button.classList.add('active');
                        
                        // Set scope and update charts
                        setChartScope(scope);
                    });
                }
            });
            
            // Distribution chart scope buttons
            const distributionScopeButtons = [
                { id: 'distributionChartScopeAll', scope: 'all' },
                { id: 'distributionChartScopeManagement', scope: 'management' },
                { id: 'distributionChartScopeAllSites', scope: 'all-sites' },
                { id: 'distributionChartScopeTotal', scope: 'total' }
            ];
            
            distributionScopeButtons.forEach(({ id, scope }) => {
                const button = document.getElementById(id);
                if (button) {
                    button.addEventListener('click', () => {
                        // Update active state for distribution chart buttons
                        distributionScopeButtons.forEach(({ id: otherId }) => {
                            const btn = document.getElementById(otherId);
                            if (btn) btn.classList.remove('active');
                        });
                        button.classList.add('active');
                        
                        // Set scope and update charts
                        setChartScope(scope);
                    });
                }
            });
            
            // Main chart scope buttons
            const mainScopeButtons = [
                { id: 'chartScopeAll', scope: 'all' },
                { id: 'chartScopeManagement', scope: 'management' },
                { id: 'chartScopeAllSites', scope: 'all-sites' },
                { id: 'chartScopeTotal', scope: 'total' }
            ];
            
            mainScopeButtons.forEach(({ id, scope }) => {
                const button = document.getElementById(id);
                if (button) {
                    button.addEventListener('click', () => {
                        // Update active state for main chart buttons
                        mainScopeButtons.forEach(({ id: otherId }) => {
                            const btn = document.getElementById(otherId);
                            if (btn) btn.classList.remove('active');
                        });
                        button.classList.add('active');
                        
                        // Set scope and update charts
                        setChartScope(scope);
                    });
                }
            });
            
            // Chart view type buttons (for Performance by Audit Type chart)
            const chartViewTypeBtn = document.getElementById('chartViewType');
            const chartViewSectionsBtn = document.getElementById('chartViewSections');
            
            if (chartViewTypeBtn) {
                chartViewTypeBtn.addEventListener('click', () => {
                    chartViewTypeBtn.classList.add('active');
                    if (chartViewSectionsBtn) chartViewSectionsBtn.classList.remove('active');
                    // Re-render the management chart with current scope
                    renderManagementChart(window.app.currentChartScope || 'all');
                });
            }
            
            if (chartViewSectionsBtn) {
                chartViewSectionsBtn.addEventListener('click', () => {
                    chartViewSectionsBtn.classList.add('active');
                    if (chartViewTypeBtn) chartViewTypeBtn.classList.remove('active');
                    // Re-render the management chart with current scope
                    renderManagementChart(window.app.currentChartScope || 'all');
                });
            }
            
            console.log('Chart scope listeners initialized successfully');
        } catch (error) {
            console.error('Error initializing chart scope listeners:', error);
        }
    }

    // Initialize charts
    function initializeCharts() {
        try {
            console.log('Initializing charts...');
            
            // Initialize app.charts if it doesn't exist
            if (!window.app.charts) {
                window.app.charts = {};
            }
            
            // Set default scope
            window.app.currentChartScope = 'all';
            
            // Initialize event listeners
            initializeChartScopeListeners();
            
            // Update dashboard
            updateDashboard();
            
            console.log('Charts initialized successfully');
        } catch (error) {
            console.error('Error initializing charts:', error);
        }
    }

    // Expose functions to global scope
    window.chartManagement = {
        initializeCharts,
        updateDashboard,
        renderRatingChart,
        renderDistributionChart,
        renderManagementChart,
        calculateOverallScore
    };
    
    // Also expose individual functions
    window.initializeCharts = initializeCharts;
    window.updateDashboard = updateDashboard;
    window.renderRatingChart = renderRatingChart;
    window.renderDistributionChart = renderDistributionChart;
    window.renderManagementChart = renderManagementChart;
    window.calculateOverallScore = calculateOverallScore;
})();