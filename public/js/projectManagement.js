// Project management functions
(function() {
    // Initialize project management
    function initializeProjectManagement() {
        console.log('Initializing Project Management...');
        
        // Initialize event listeners
        initializeProjectEventListeners();
        
        // Update selectors
        updateProjectSelector();
        updateSiteSelector();
        
        console.log('Project Management initialized successfully');
    }
    
    // Initialize event listeners for project management
    function initializeProjectEventListeners() {
        // Project selector
        const projectSelector = document.getElementById('projectSelector');
        if (projectSelector) {
            projectSelector.addEventListener('change', (e) => {
                selectProject(e.target.value);
            });
        }
        
        // Project name field
        const projectNameField = document.getElementById('projectName');
        if (projectNameField) {
            projectNameField.addEventListener('input', (e) => {
                const newName = e.target.value;
                if (app.inspectionData.currentProject && newName !== app.inspectionData.currentProject) {
                    // Rename current project
                    if (newName && !app.inspectionData.projects[newName]) {
                        app.inspectionData.projects[newName] = app.inspectionData.projects[app.inspectionData.currentProject];
                        delete app.inspectionData.projects[app.inspectionData.currentProject];
                        app.inspectionData.currentProject = newName;
                        updateProjectSelector();
                        if (typeof saveData === 'function') {
                            saveData();
                        }
                    }
                }
            });
        }
        
        // Site selector
        const siteSelector = document.getElementById('siteSelector');
        if (siteSelector) {
            siteSelector.addEventListener('change', (e) => {
                selectSite(e.target.value);
            });
        }
        
        // Site name field
        const siteNameField = document.getElementById('siteName');
        if (siteNameField) {
            siteNameField.addEventListener('input', (e) => {
                const project = app.getCurrentProject();
                if (project && project.currentSite) {
                    const newName = e.target.value;
                    if (newName && newName !== project.currentSite && !project.sites[newName]) {
                        // Rename current site
                        project.sites[newName] = project.sites[project.currentSite];
                        delete project.sites[project.currentSite];
                        project.currentSite = newName;
                        updateSiteSelector();
                        if (typeof saveData === 'function') {
                            saveData();
                        }
                    }
                }
            });
        }
        
        // Add project button
        const addProjectBtn = document.getElementById('addProjectBtn');
        if (addProjectBtn) {
            addProjectBtn.addEventListener('click', addNewProject);
        }
        
        // Clone project button
        const cloneProjectBtn = document.getElementById('cloneProjectBtn');
        if (cloneProjectBtn) {
            cloneProjectBtn.addEventListener('click', cloneCurrentProject);
        }
        
        // Add site button
        const addSiteBtn = document.getElementById('addSiteBtn');
        if (addSiteBtn) {
            addSiteBtn.addEventListener('click', addSiteFromInputField);
        }
        
        // Add multiple sites button
        const addMultipleSitesBtn = document.getElementById('addMultipleSitesBtn');
        if (addMultipleSitesBtn) {
            addMultipleSitesBtn.addEventListener('click', importSitesFromCSV);
        }
        
        // Add site name input field enter key listener
        const newSiteNameField = document.getElementById('newSiteName');
        if (newSiteNameField) {
            newSiteNameField.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    addSiteFromInputField();
                }
            });
        }
    }
    
    // Update project selector
    function updateProjectSelector() {
        try {
            const selector = document.getElementById('projectSelector');
            if (!selector) return;
            
            selector.innerHTML = '<option value="">Select a project</option>';
            
            for (const projectName in app.inspectionData.projects) {
                const option = document.createElement('option');
                option.value = projectName;
                option.textContent = projectName;
                if (projectName === app.inspectionData.currentProject) {
                    option.selected = true;
                }
                selector.appendChild(option);
            }
            
            // Update project name field
            const projectNameField = document.getElementById('projectName');
            if (projectNameField) {
                projectNameField.value = app.inspectionData.currentProject || '';
            }
            
            // Update project name display field
            const projectNameDisplay = document.getElementById('projectNameDisplay');
            if (projectNameDisplay) {
                projectNameDisplay.value = app.inspectionData.currentProject || 'Default Project';
            }
            
            console.log('Project selector updated successfully');
        } catch (error) {
            console.error('Error updating project selector:', error);
        }
    }
    
    // Update site selector
    function updateSiteSelector() {
        try {
            const selector = document.getElementById('siteSelector');
            if (!selector) return;
            
            selector.innerHTML = '<option value="">Select a site</option>';
            
            const project = app.getCurrentProject();
            if (project && project.sites) {
                for (const siteName in project.sites) {
                    const option = document.createElement('option');
                    option.value = siteName;
                    option.textContent = siteName;
                    if (siteName === project.currentSite) {
                        option.selected = true;
                    }
                    selector.appendChild(option);
                }
            }
            
            // Update site name field
            const siteNameField = document.getElementById('siteName');
            if (siteNameField && project && project.currentSite) {
                siteNameField.value = project.currentSite;
                siteNameField.disabled = false;
            } else if (siteNameField) {
                siteNameField.value = '';
                siteNameField.disabled = true;
            }
            
            // Update site name display field
            const siteNameDisplay = document.getElementById('siteNameDisplay');
            if (siteNameDisplay && project && project.currentSite) {
                siteNameDisplay.value = project.currentSite;
            } else if (siteNameDisplay) {
                siteNameDisplay.value = 'Default Site';
            }
            
            console.log('Site selector updated successfully');
        } catch (error) {
            console.error('Error updating site selector:', error);
        }
    }
    
    // Select project
    function selectProject(projectName) {
        try {
            if (!projectName) {
                app.inspectionData.currentProject = '';
                const projectNameField = document.getElementById('projectName');
                const siteNameField = document.getElementById('siteName');
                const projectNameDisplay = document.getElementById('projectNameDisplay');
                const siteNameDisplay = document.getElementById('siteNameDisplay');
                
                if (projectNameField) projectNameField.value = '';
                if (siteNameField) siteNameField.value = '';
                if (projectNameDisplay) projectNameDisplay.value = 'Default Project';
                if (siteNameDisplay) siteNameDisplay.value = 'Default Site';
                
                updateProjectSelector();
                updateSiteSelector();
                if (typeof saveData === 'function') {
                    saveData();
                }
                return;
            }
            
            // Create project if it doesn't exist
            if (!app.inspectionData.projects[projectName]) {
                app.inspectionData.projects[projectName] = {
                    managementSystemAudit: {},
                    sites: {
                        "Default Site": {}
                    },
                    currentSite: "Default Site"
                };
                
                // Initialize with current master configuration
                const project = app.inspectionData.projects[projectName];
                
                // Initialize management system audit
                for (const section in app.masterConfig.management) {
                    project.managementSystemAudit[section] = app.masterConfig.management[section].map(name => ({
                        name, 
                        score: 0, 
                        comment: ''
                    }));
                }
                
                // Initialize default site
                for (const section in app.masterConfig.site) {
                    project.sites["Default Site"][section] = app.masterConfig.site[section].map(name => ({
                        name, 
                        score: 0, 
                        comment: ''
                    }));
                }
            }
            
            app.inspectionData.currentProject = projectName;
            document.getElementById('projectName').value = projectName;
            
            // Update site selector and select current site
            const project = app.getCurrentProject();
            if (project && project.currentSite) {
                document.getElementById('siteName').value = project.currentSite;
            }
            
            updateProjectSelector();
            updateSiteSelector();
            if (typeof saveData === 'function') {
                saveData();
            }
            
            // Refresh current tab to show new project's data
            const currentTab = document.querySelector('.tab.active')?.dataset.tabName;
            if (currentTab && typeof showTab === 'function') {
                showTab(currentTab);
            }
            
            console.log(`Project "${projectName}" selected successfully`);
        } catch (error) {
            console.error('Error selecting project:', error);
        }
    }
    
    // Select site
    function selectSite(siteName) {
        try {
            const project = app.getCurrentProject();
            if (!project) return;
            
            if (!siteName) {
                project.currentSite = '';
                document.getElementById('siteName').value = '';
                updateSiteSelector();
                if (typeof saveData === 'function') {
                    saveData();
                }
                return;
            }
            
            // Create site if it doesn't exist
            if (!project.sites[siteName]) {
                project.sites[siteName] = {};
                
                // Initialize with current master configuration
                for (const section in app.masterConfig.site) {
                    project.sites[siteName][section] = app.masterConfig.site[section].map(name => ({
                        name, 
                        score: 0, 
                        comment: ''
                    }));
                }
            }
            
            project.currentSite = siteName;
            document.getElementById('siteName').value = siteName;
            
            updateSiteSelector();
            if (typeof saveData === 'function') {
                saveData();
            }
            
            // Refresh current tab to show new site's data
            const currentTab = document.querySelector('.tab.active')?.dataset.tabName;
            if (currentTab && typeof showTab === 'function') {
                showTab(currentTab);
            }
            
            console.log(`Site "${siteName}" selected successfully`);
        } catch (error) {
            console.error('Error selecting site:', error);
        }
    }
    
    // Add new project
    function addNewProject() {
        try {
            const projectName = prompt('Enter project name:');
            if (!projectName) return;
            
            if (app.inspectionData.projects[projectName]) {
                alert('A project with this name already exists');
                return;
            }
            
            // Create new project
            app.inspectionData.projects[projectName] = {
                managementSystemAudit: {},
                sites: {
                    "Default Site": {}
                },
                currentSite: "Default Site"
            };
            
            // Initialize with current master configuration
            const project = app.inspectionData.projects[projectName];
            
            // Initialize management system audit
            for (const section in app.masterConfig.management) {
                project.managementSystemAudit[section] = app.masterConfig.management[section].map(name => ({
                    name, 
                    score: 0, 
                    comment: ''
                }));
            }
            
            // Initialize default site
            for (const section in app.masterConfig.site) {
                project.sites["Default Site"][section] = app.masterConfig.site[section].map(name => ({
                    name, 
                    score: 0, 
                    comment: ''
                }));
            }
            
            // Select the new project
            selectProject(projectName);
            
            console.log(`Project "${projectName}" added successfully`);
        } catch (error) {
            console.error('Error adding new project:', error);
        }
    }
    
    // Clone current project
    function cloneCurrentProject() {
        try {
            const currentProject = app.getCurrentProject();
            if (!currentProject) {
                alert('No project selected to clone');
                return;
            }
            
            const newProjectName = prompt('Enter name for the cloned project:');
            if (!newProjectName) return;
            
            if (app.inspectionData.projects[newProjectName]) {
                alert('A project with this name already exists');
                return;
            }
            
            // Deep clone the current project
            app.inspectionData.projects[newProjectName] = JSON.parse(JSON.stringify(currentProject));
            
            // Select the new project
            selectProject(newProjectName);
            
            alert(`Project cloned successfully as "${newProjectName}"`);
            console.log(`Project cloned successfully as "${newProjectName}"`);
        } catch (error) {
            console.error('Error cloning project:', error);
        }
    }
    
    // Add site from input field
    function addSiteFromInputField() {
        try {
            const newSiteNameField = document.getElementById('newSiteName');
            if (!newSiteNameField) {
                console.error('New site name input field not found');
                return;
            }
            
            const siteName = newSiteNameField.value.trim();
            if (!siteName) {
                alert('Please enter a site name');
                return;
            }
            
            const project = window.app.getCurrentProject();
            if (!project) {
                alert('No project selected. Please select or create a project first.');
                return;
            }
            
            if (project.sites[siteName]) {
                alert('A site with this name already exists');
                return;
            }
            
            // Create new site
            project.sites[siteName] = {};
            
            // Initialize with current master configuration
            for (const section in window.app.masterConfig.site) {
                project.sites[siteName][section] = window.app.masterConfig.site[section].map(name => ({
                    name, 
                    score: 0, 
                    comment: ''
                }));
            }
            
            // Select the new site
            selectSite(siteName);
            
            // Clear the input field
            newSiteNameField.value = '';
            
            console.log(`Site "${siteName}" added successfully`);
        } catch (error) {
            console.error('Error adding site from input field:', error);
        }
    }
    
    // Import sites from CSV (placeholder for future implementation)
    function importSitesFromCSV() {
        try {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.csv,.xlsx,.xls';
            input.onchange = e => {
                const file = e.target.files[0];
                if (!file) return;
                
                const reader = new FileReader();
                reader.onload = evt => {
                    try {
                        const text = evt.target.result;
                        const lines = text.split('\n');
                        const siteNames = [];
                        
                        // Parse CSV - assume site names are in first column
                        lines.forEach((line, index) => {
                            const siteName = line.split(',')[0].trim();
                            if (siteName && index > 0) { // Skip header row
                                siteNames.push(siteName);
                            }
                        });
                        
                        if (siteNames.length === 0) {
                            alert('No valid site names found in the file');
                            return;
                        }
                        
                        const project = window.app.getCurrentProject();
                        if (!project) {
                            alert('No project selected. Please select or create a project first.');
                            return;
                        }
                        
                        let addedCount = 0;
                        siteNames.forEach(siteName => {
                            if (siteName && !project.sites[siteName]) {
                                // Create new site
                                project.sites[siteName] = {};
                                
                                // Initialize with current master configuration
                                for (const section in window.app.masterConfig.site) {
                                    project.sites[siteName][section] = window.app.masterConfig.site[section].map(name => ({
                                        name, 
                                        score: 0, 
                                        comment: ''
                                    }));
                                }
                                addedCount++;
                            }
                        });
                        
                        updateSiteSelector();
                        if (typeof saveData === 'function') {
                            saveData();
                        }
                        
                        alert(`Successfully added ${addedCount} sites from CSV file`);
                        console.log(`Imported ${addedCount} sites from CSV`);
                        
                    } catch (err) {
                        console.error('Error parsing CSV file:', err);
                        alert('Error parsing CSV file. Please check the file format.');
                    }
                };
                reader.readAsText(file);
            };
            input.click();
        } catch (error) {
            console.error('Error importing sites from CSV:', error);
            alert('Error importing sites from CSV. Please check the console for details.');
        }
    }
    
    // Get summary data for reports
    function getSummaryData(siteName = null) {
        try {
            const project = app.getCurrentProject();
            if (!project) {
                return {
                    overallScore: '0.0',
                    overallPercentage: '0',
                    totalItemsCount: 0,
                    ratedItemsCount: 0
                };
            }
            
            let allData = [];
            
            // Add management system audit data
            for (const section in project.managementSystemAudit) {
                allData = allData.concat(project.managementSystemAudit[section]);
            }
            
            // Add site data
            if (siteName && project.sites[siteName]) {
                for (const section in project.sites[siteName]) {
                    allData = allData.concat(project.sites[siteName][section]);
                }
            } else if (!siteName && project.currentSite && project.sites[project.currentSite]) {
                for (const section in project.sites[project.currentSite]) {
                    allData = allData.concat(project.sites[project.currentSite][section]);
                }
            }
            
            // Filter out score 0 for calculations
            const ratedItems = allData.filter(item => item.score > 0);
            const totalItems = allData.length;
            
            if (ratedItems.length === 0) {
                return {
                    overallScore: '0.0',
                    overallPercentage: '0',
                    totalItemsCount: totalItems,
                    ratedItemsCount: 0
                };
            }
            
            const totalScore = ratedItems.reduce((sum, item) => sum + item.score, 0);
            const averageScore = totalScore / ratedItems.length;
            const percentage = (averageScore / 5) * 100;
            
            return {
                overallScore: averageScore.toFixed(1),
                overallPercentage: Math.round(percentage).toString(),
                totalItemsCount: totalItems,
                ratedItemsCount: ratedItems.length
            };
        } catch (error) {
            console.error('Error getting summary data:', error);
            return {
                overallScore: '0.0',
                overallPercentage: '0',
                totalItemsCount: 0,
                ratedItemsCount: 0
            };
        }
    }
    
    // Get report summary data
    function getReportSummaryData(reportScope) {
        try {
            const project = app.getCurrentProject();
            if (!project) {
                return {
                    overallScore: '0.0',
                    overallPercentage: '0',
                    totalItemsCount: 0,
                    ratedItemsCount: 0
                };
            }
            
            let allData = [];
            
            if (reportScope === 'management') {
                // Management system only
                for (const section in project.managementSystemAudit) {
                    allData = allData.concat(project.managementSystemAudit[section]);
                }
            } else if (reportScope === 'all') {
                // All sites + management
                for (const section in project.managementSystemAudit) {
                    allData = allData.concat(project.managementSystemAudit[section]);
                }
                
                for (const siteName in project.sites) {
                    for (const section in project.sites[siteName]) {
                        allData = allData.concat(project.sites[siteName][section]);
                    }
                }
            } else {
                // Specific site + management
                for (const section in project.managementSystemAudit) {
                    allData = allData.concat(project.managementSystemAudit[section]);
                }
                
                if (project.sites[reportScope]) {
                    for (const section in project.sites[reportScope]) {
                        allData = allData.concat(project.sites[reportScope][section]);
                    }
                }
            }
            
            // Filter out score 0 for calculations
            const ratedItems = allData.filter(item => item.score > 0);
            const totalItems = allData.length;
            
            if (ratedItems.length === 0) {
                return {
                    overallScore: '0.0',
                    overallPercentage: '0',
                    totalItemsCount: totalItems,
                    ratedItemsCount: 0
                };
            }
            
            const totalScore = ratedItems.reduce((sum, item) => sum + item.score, 0);
            const averageScore = totalScore / ratedItems.length;
            const percentage = (averageScore / 5) * 100;
            
            return {
                overallScore: averageScore.toFixed(1),
                overallPercentage: Math.round(percentage).toString(),
                totalItemsCount: totalItems,
                ratedItemsCount: ratedItems.length
            };
        } catch (error) {
            console.error('Error getting report summary data:', error);
            return {
                overallScore: '0.0',
                overallPercentage: '0',
                totalItemsCount: 0,
                ratedItemsCount: 0
            };
        }
    }
    
    // Generate executive summary
    function generateExecutiveSummary(siteName = null, includeManagement = true, includeSite = true) {
        try {
            const project = app.getCurrentProject();
            if (!project) return 'No project data available.';
            
            const summary = getReportSummaryData(siteName || 'all');
            const ratingInfo = app.getRatingDetails(parseFloat(summary.overallPercentage));
            
            let executiveSummary = `This report presents the findings of the Occupational Health & Safety audit conducted for ${document.getElementById('projectName').value || 'the project'}.\n\n`;
            
            executiveSummary += `OVERALL PERFORMANCE:\n`;
            executiveSummary += `• Overall Score: ${summary.overallScore} out of 5.0\n`;
            executiveSummary += `• Performance Rating: ${ratingInfo.text} (${summary.overallPercentage}%)\n`;
            executiveSummary += `• Items Inspected: ${summary.ratedItemsCount} of ${summary.totalItemsCount} total items\n\n`;
            
            // Add scope-specific information
            if (siteName === 'all') {
                executiveSummary += `AUDIT SCOPE:\n`;
                executiveSummary += `This comprehensive audit covers both the management system (project-wide) and all site performance audits.\n\n`;
            } else if (siteName === 'management') {
                executiveSummary += `AUDIT SCOPE:\n`;
                executiveSummary += `This audit focuses exclusively on the management system components that apply project-wide.\n\n`;
            } else {
                executiveSummary += `AUDIT SCOPE:\n`;
                executiveSummary += `This audit covers the management system (project-wide) and site-specific performance for ${siteName || project.currentSite}.\n\n`;
            }
            
            // Add performance analysis
            const percentage = parseFloat(summary.overallPercentage);
            if (percentage > 90) {
                executiveSummary += `PERFORMANCE ANALYSIS:\n`;
                executiveSummary += `The audit results demonstrate excellent performance with minimal areas for improvement. The organization shows strong commitment to health and safety excellence.\n\n`;
            } else if (percentage > 80) {
                executiveSummary += `PERFORMANCE ANALYSIS:\n`;
                executiveSummary += `The audit results show good overall performance with some opportunities for enhancement. The organization maintains effective health and safety practices.\n\n`;
            } else if (percentage > 70) {
                executiveSummary += `PERFORMANCE ANALYSIS:\n`;
                executiveSummary += `The audit results indicate satisfactory performance with several areas requiring attention. Focused improvements are recommended.\n\n`;
            } else if (percentage > 50) {
                executiveSummary += `PERFORMANCE ANALYSIS:\n`;
                executiveSummary += `The audit results show low performance with significant improvements needed. Priority should be given to addressing identified deficiencies.\n\n`;
            } else {
                executiveSummary += `PERFORMANCE ANALYSIS:\n`;
                executiveSummary += `The audit results indicate unacceptable performance requiring immediate and comprehensive corrective action.\n\n`;
            }
            
            executiveSummary += `RECOMMENDATIONS:\n`;
            executiveSummary += `Detailed recommendations for improvement are provided in Section 3 of this report. Priority should be given to addressing any major non-conformances identified during the audit.\n\n`;
            
            executiveSummary += `CONCLUSION:\n`;
            executiveSummary += `This audit provides a comprehensive assessment of the current health and safety performance. Regular follow-up audits are recommended to ensure continuous improvement and compliance.`;
            
            return executiveSummary;
        } catch (error) {
            console.error('Error generating executive summary:', error);
            return 'Error generating executive summary.';
        }
    }
    
    // Update dashboard executive summary
    function updateDashboardExecutiveSummary() {
        try {
            console.log('Updating dashboard executive summary...');
            const summaryElement = document.getElementById('dashboardExecutiveSummary');
            if (!summaryElement) return;
            
            const project = app.getCurrentProject();
            if (!project) {
                summaryElement.innerHTML = 'No project selected. Please select or create a project to begin.';
                return;
            }
            
            const summary = getSummaryData();
            const ratingInfo = app.getRatingDetails(parseFloat(summary.overallPercentage));
            
            summaryElement.innerHTML = `
                <p><strong>Current Status:</strong> ${summary.ratedItemsCount} of ${summary.totalItemsCount} items have been inspected and scored.</p>
                <p><strong>Overall Performance:</strong> ${summary.overallScore}/5.0 (${summary.overallPercentage}%) - <span style="color: ${ratingInfo.color}; font-weight: bold;">${ratingInfo.text}</span></p>
                <p><strong>Project:</strong> ${document.getElementById('projectName').value || 'Not specified'}</p>
                <p><strong>Current Site:</strong> ${project.currentSite || 'No site selected'}</p>
                <p><strong>Last Updated:</strong> ${new Date().toLocaleDateString()}</p>
            `;
            console.log('Dashboard executive summary updated successfully');
        } catch (error) {
            console.error('Error updating dashboard executive summary:', error);
        }
    }
    
    // Expose functions to global scope
    window.initializeProjectManagement = initializeProjectManagement;
    window.updateProjectSelector = updateProjectSelector;
    window.updateSiteSelector = updateSiteSelector;
    window.selectProject = selectProject;
    window.selectSite = selectSite;
    window.addNewProject = addNewProject;
    window.cloneCurrentProject = cloneCurrentProject;
    window.addSiteFromInputField = addSiteFromInputField;
    window.importSitesFromCSV = importSitesFromCSV;
    window.getSummaryData = getSummaryData;
    window.getReportSummaryData = getReportSummaryData;
    window.generateExecutiveSummary = generateExecutiveSummary;
    window.updateDashboardExecutiveSummary = updateDashboardExecutiveSummary;
})();