// Data management functions
(function() {
    // Version for data structure migration
    const DATA_VERSION = "1.0.1";
    const STORAGE_KEY = 'ohsAuditToolData';
    
    // Initialize data management
    function initializeDataManagement() {
        console.log('Initializing Data Management...');
        
        // Load data from localStorage
        loadData();
        
        // Initialize event listeners for data management buttons
        initializeDataManagementButtons();
        
        console.log('Data Management initialized successfully');
    }
    
    // Initialize event listeners for data management buttons
    function initializeDataManagementButtons() {
        // Load default template button
        const loadDefaultBtn = document.getElementById('loadDefaultTemplateBtn');
        if (loadDefaultBtn) {
            loadDefaultBtn.addEventListener('click', loadDefaultTemplate);
        }
        
        // Save custom template button
        const saveCustomBtn = document.getElementById('saveCustomTemplateBtn');
        if (saveCustomBtn) {
            saveCustomBtn.addEventListener('click', saveCustomTemplate);
        }
        
        // Load custom template button
        const loadCustomBtn = document.getElementById('loadCustomTemplateBtn');
        if (loadCustomBtn) {
            loadCustomBtn.addEventListener('click', loadCustomTemplate);
        }
        
        // Export configuration button
        const exportConfigBtn = document.getElementById('exportConfigBtn');
        if (exportConfigBtn) {
            exportConfigBtn.addEventListener('click', exportConfiguration);
        }
        
        // Import configuration button
        const importConfigBtn = document.getElementById('importConfigBtn');
        if (importConfigBtn) {
            importConfigBtn.addEventListener('click', importConfiguration);
        }
        
        // Export all data button
        const exportDataBtn = document.getElementById('exportDataBtn');
        if (exportDataBtn) {
            exportDataBtn.addEventListener('click', exportAllAuditData);
        }
        
        // Import all data button
        const importDataBtn = document.getElementById('importDataBtn');
        if (importDataBtn) {
            importDataBtn.addEventListener('click', importAllAuditData);
        }
        
        // Reset button
        const resetBtn = document.getElementById('resetBtn');
        if (resetBtn) {
            resetBtn.addEventListener('click', resetAll);
        }
    }
    
    // Load data from localStorage
    function loadData() {
        try {
            console.log('Loading data from localStorage...');
            const saved = localStorage.getItem(STORAGE_KEY);
            
            if (saved) {
                const parsedData = JSON.parse(saved);
                
                // Load masterConfig and inspectionData
                app.masterConfig = parsedData.masterConfig || { management: {}, site: {} };
                app.inspectionData = parsedData.inspectionData || {
                    projects: {},
                    currentProject: '',
                    version: DATA_VERSION
                };
                
                console.log('Data loaded from localStorage', {
                    masterConfig: app.masterConfig,
                    inspectionData: app.inspectionData
                });
            } else {
                console.log('No saved data found, initializing default data');
                initializeDefaultData();
            }
        } catch (error) {
            console.error('Error loading data:', error);
            initializeDefaultData();
        }
    }
    
    // Initialize default data
    function initializeDefaultData() {
        try {
            console.log('Initializing default data...');
            const defaultProjectName = "Default Project";
            const defaultSiteName = "Default Site";
            
            // Initialize masterConfig if it doesn't exist
            if (!app.masterConfig) {
                app.masterConfig = {
                    management: {},
                    site: {}
                };
                console.log('Initialized empty masterConfig');
            }
            
            // Initialize inspectionData if it doesn't exist
            if (!app.inspectionData) {
                app.inspectionData = {
                    projects: {},
                    currentProject: '',
                    version: DATA_VERSION
                };
                console.log('Initialized empty inspectionData');
            }
            
            // Initialize default project structure
            app.inspectionData.projects = {
                [defaultProjectName]: {
                    managementSystemAudit: {},
                    sites: {
                        [defaultSiteName]: {}
                    },
                    currentSite: defaultSiteName
                }
            };
            
            app.inspectionData.currentProject = defaultProjectName;
            
            // Only initialize management system audit if there are management questions
            const project = app.inspectionData.projects[defaultProjectName];
            if (app.masterConfig.management && Object.keys(app.masterConfig.management).length > 0) {
                console.log('Initializing management system audit with sections:', Object.keys(app.masterConfig.management));
                for (const section in app.masterConfig.management) {
                    project.managementSystemAudit[section] = app.masterConfig.management[section].map(name => ({
                        name: name, 
                        score: 0, 
                        comment: ''
                    }));
                }
            } else {
                console.log('No management questions found in master config');
            }
            
            // Only initialize site data if there are site questions
            if (app.masterConfig.site && Object.keys(app.masterConfig.site).length > 0) {
                console.log('Initializing site data with sections:', Object.keys(app.masterConfig.site));
                for (const section in app.masterConfig.site) {
                    project.sites[defaultSiteName][section] = app.masterConfig.site[section].map(name => ({
                        name: name, 
                        score: 0, 
                        comment: ''
                    }));
                }
            } else {
                console.log('No site questions found in master config');
            }
            
            saveData(false); // Pass false to avoid recursion
            console.log('Default data initialized successfully');
        } catch (error) {
            console.error('Error initializing default data:', error);
            
            // Fallback initialization
            app.masterConfig = { management: {}, site: {} };
            app.inspectionData = {
                projects: {},
                currentProject: '',
                version: DATA_VERSION
            };
        }
    }
    
    // Save data to localStorage
    function saveData(showAlert = true) {
        try {
            // Ensure both masterConfig and inspectionData exist
            if (!app.masterConfig) {
                app.masterConfig = { management: {}, site: {} };
            }
            
            if (!app.inspectionData) {
                app.inspectionData = {
                    projects: {},
                    currentProject: '',
                    version: DATA_VERSION
                };
            }
            
            // Create data object to save
            const dataToSave = {
                masterConfig: app.masterConfig,
                inspectionData: app.inspectionData,
                version: DATA_VERSION,
                lastSaved: new Date().toISOString()
            };
            
            localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
            
            if (typeof updateDashboard === 'function') {
                updateDashboard();
            }
            
            console.log('Data saved to localStorage');
        } catch (error) {
            console.error('Error saving data:', error);
            if (showAlert) {
                alert('Error saving data. Please check the console for details.');
            }
        }
    }
    
    // Load default template
    function loadDefaultTemplate(skipConfirmation = false) {
        try {
            console.log('Loading default template...');
            if (skipConfirmation || confirm("Load default template? This will overwrite your current configuration and data.")) {
                // Built-in default template configuration
                const defaultConfig = {
                    management: {
                        "1.0 Health and Safety Policy": [
                            "Is there a documented Health and Safety Policy that is communicated to all employees?",
                            "Does the policy clearly state management commitment to health and safety?",
                            "Is the policy reviewed and updated regularly?",
                            "Are health and safety responsibilities clearly defined and assigned?",
                            "Is the policy signed and dated by senior management?"
                        ],
                        "2.0 Project Health and Safety responsibilities, authorities and accountability": [
                            "Are health and safety responsibilities clearly defined for all levels?",
                            "Is there a clear chain of command for health and safety matters?",
                            "Are resources adequate for implementing health and safety programs?",
                            "Are health and safety performance indicators monitored and reviewed?",
                            "Is there a process for reviewing health and safety responsibilities?"
                        ],
                        "3.0 Project Health and Safety Plans and documentation": [
                            "Is there a comprehensive Project Health and Safety Plan?",
                            "Are risk assessments conducted and documented?",
                            "Are emergency response plans in place and communicated?",
                            "Is health and safety documentation readily available?",
                            "Are plans reviewed and updated as necessary?"
                        ]
                    },
                    site: {
                        "1. PERMITS & REGULATORY COMPLIANCE (UAE/ADOSH)": [
                            "Are all required permits obtained before work begins?",
                            "Are permit conditions followed and documented?",
                            "Is there a system for tracking permit expiry and renewal?",
                            "Are regulatory requirements identified and complied with?",
                            "Is there a process for updating permits when scope changes?"
                        ],
                        "2. SITE PREPARATION & TEMPORARY WORKS SAFETY": [
                            "Is the site properly secured and controlled?",
                            "Are temporary works properly planned and supervised?",
                            "Are site access routes clearly marked and maintained?",
                            "Are emergency exits clearly identified and unobstructed?",
                            "Is there adequate lighting for all work areas?"
                        ],
                        "3. EXCAVATION & CIVIL WORKS SAFETY": [
                            "Are excavation risks assessed and controlled?",
                            "Is shoring provided where required?",
                            "Are utilities located before excavation?",
                            "Is there a system for inspecting excavations daily?",
                            "Are barricades and warning signs in place?"
                        ]
                    }
                };
                
                // Replace master configuration with the default template
                app.masterConfig = {
                    management: defaultConfig.management || {},
                    site: defaultConfig.site || {}
                };
                
                console.log('Default template loaded:', app.masterConfig);
                
                // Reset inspection data
                app.inspectionData = {
                    projects: {},
                    currentProject: '',
                    version: DATA_VERSION
                };
                
                // Re-initialize default data with the default configuration
                initializeDefaultData();
                
                // Update project and site selectors
                if (typeof updateProjectSelector === 'function') updateProjectSelector();
                if (typeof updateSiteSelector === 'function') updateSiteSelector();
                
                console.log('Template loaded, master config now:', app.masterConfig);
                
                // Force a complete UI refresh
                setTimeout(() => {
                    // Save data first
                    saveData();
                    
                    // Update all UI components
                    if (typeof updateProjectSelector === 'function') updateProjectSelector();
                    if (typeof updateSiteSelector === 'function') updateSiteSelector();
                    
                    // Force refresh of current tab to show questions
                    const currentTab = document.querySelector('.tab.active')?.dataset.tabName;
                    if (currentTab && typeof showTab === 'function') {
                        showTab(currentTab);
                    }
                    
                    console.log('Default template loaded successfully');
                    alert('Default template loaded successfully!');
                }, 300);
            }
        } catch (error) {
            console.error('Error loading default template:', error);
            alert('Error loading default template. Please check the console for details.');
        }
    }
    
    // Export configuration
    function exportConfiguration() {
        try {
            console.log('Exporting configuration...');
            const config = JSON.stringify(app.masterConfig, null, 2);
            const blob = new Blob([config], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'audit_config.json';
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            console.log('Configuration exported successfully');
        } catch (error) {
            console.error('Error exporting configuration:', error);
            alert('Error exporting configuration. Please check the console for details.');
        }
    }
    
    // Import configuration
    function importConfiguration() {
        try {
            console.log('Importing configuration...');
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json';
            input.onchange = e => {
                const file = e.target.files[0];
                if (!file) return;
                
                const reader = new FileReader();
                reader.onload = evt => {
                    try {
                        const config = JSON.parse(evt.target.result);
                        
                        if (confirm("Import configuration? This will overwrite your current configuration and data.")) {
                            // Replace master configuration with the imported configuration
                            app.masterConfig = {
                                management: config.management || {},
                                site: config.site || {}
                            };
                            
                            console.log('Configuration imported:', app.masterConfig);
                            
                            // Reset inspection data
                            app.inspectionData = {
                                projects: {},
                                currentProject: '',
                                version: DATA_VERSION
                            };
                            
                            // Re-initialize default data with new configuration
                            initializeDefaultData();
                            
                            // Update project and site selectors
                            if (typeof updateProjectSelector === 'function') updateProjectSelector();
                            if (typeof updateSiteSelector === 'function') updateSiteSelector();
                            
                            console.log('Configuration imported, master config now:', app.masterConfig);
                            
                            // Force a complete UI refresh
                            setTimeout(() => {
                                // Save data first
                                saveData();
                                
                                // Update all UI components
                                if (typeof renderMasterConfigTab === 'function') renderMasterConfigTab();
                                if (typeof renderQuestionManagement === 'function') renderQuestionManagement();
                                if (typeof renderManagementTab === 'function') renderManagementTab();
                                if (typeof renderSitePerformanceTab === 'function') renderSitePerformanceTab();
                                
                                console.log('Configuration imported successfully');
                                alert('Configuration imported successfully!');
                            }, 300);
                        }
                    } catch (err) {
                        console.error('Error parsing JSON:', err);
                        alert('Error parsing JSON. Please check the file format.');
                    }
                };
                reader.readAsText(file);
            };
            input.click();
        } catch (error) {
            console.error('Error importing configuration:', error);
            alert('Error importing configuration. Please check the console for details.');
        }
    }
    
    // Export all audit data
    function exportAllAuditData() {
        try {
            console.log('Exporting all audit data...');
            // Create a complete data object with all audit information
            const auditData = {
                projects: app.inspectionData.projects,
                currentProject: app.inspectionData.currentProject,
                masterConfig: app.masterConfig,
                exportDate: new Date().toISOString(),
                version: DATA_VERSION
            };
            
            // Convert to JSON
            const jsonData = JSON.stringify(auditData, null, 2);
            
            // Create and trigger download
            const blob = new Blob([jsonData], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            
            // Sanitize project name for file name
            const projectName = document.getElementById('projectName')?.value || 'export';
            const sanitizedName = projectName.replace(/[^\w\s-]/g, '').replace(/\s+/g, '_');
            
            a.download = `OHS_Audit_Data_${sanitizedName}_${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            console.log('Audit data exported successfully');
        } catch (error) {
            console.error('Error exporting audit data:', error);
            alert('Error exporting audit data. Please check the console for details.');
        }
    }
    
    // Import all audit data
    function importAllAuditData() {
        try {
            console.log('Importing all audit data...');
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json';
            input.onchange = e => {
                const file = e.target.files[0];
                if (!file) return;
                
                const reader = new FileReader();
                reader.onload = evt => {
                    try {
                        const importedData = JSON.parse(evt.target.result);
                        
                        const confirmation = confirm(
                            'WARNING: This will completely replace all existing audit data with the imported data.\n\n' +
                            'All previous questions, sections, scores, comments, and site data will be permanently removed.\n\n' +
                            'Do you want to continue?'
                        );
                        
                        if (confirmation) {
                            // Replace master configuration
                            app.masterConfig = {
                                management: importedData.masterConfig.management || {},
                                site: importedData.masterConfig.site || {}
                            };
                            
                            console.log('Master configuration updated from import:', JSON.stringify(app.masterConfig, null, 2));
                            
                            // Replace inspection data
                            app.inspectionData = {
                                projects: importedData.projects,
                                currentProject: importedData.currentProject || Object.keys(importedData.projects)[0] || '',
                                version: DATA_VERSION
                            };
                            
                            // Update project info if available
                            const project = app.getCurrentProject?.();
                            if (project) {
                                const projectNameElement = document.getElementById('projectName');
                                if (projectNameElement) {
                                    projectNameElement.value = app.inspectionData.currentProject;
                                }
                                
                                if (project.currentSite) {
                                    const siteNameElement = document.getElementById('siteName');
                                    if (siteNameElement) {
                                        siteNameElement.value = project.currentSite;
                                    }
                                }
                            }
                            
                            // Force a complete UI refresh
                            setTimeout(() => {
                                // Save data first
                                saveData();
                                
                                // Update all UI components
                                if (typeof updateProjectSelector === 'function') updateProjectSelector();
                                if (typeof updateSiteSelector === 'function') updateSiteSelector();
                                if (typeof renderSiteList === 'function') renderSiteList();
                                if (typeof updateReportSiteSelector === 'function') updateReportSiteSelector();
                                if (typeof renderQuestionManagement === 'function') renderQuestionManagement();
                                
                                // Refresh current tab
                                const currentTab = document.querySelector('.tab.active')?.dataset.tabName;
                                if (currentTab && typeof showTab === 'function') showTab(currentTab);
                                
                                console.log('Audit data imported successfully');
                                alert('Audit data imported successfully!\n\nAll previous data has been completely replaced with the imported data.');
                            }, 300);
                        }
                    } catch (err) {
                        console.error('Error parsing audit data file:', err);
                        alert('Error parsing audit data file. Please check the file format.');
                    }
                };
                reader.readAsText(file);
            };
            input.click();
        } catch (error) {
            console.error('Error importing audit data:', error);
            alert('Error importing audit data. Please check the console for details.');
        }
    }
    
    // Save custom template
    function saveCustomTemplate() {
        try {
            const templateName = prompt('Enter a name for your custom template:');
            if (!templateName) return;
            
            // Sanitize template name
            const sanitizedName = templateName.replace(/[^\w\s-]/g, '').replace(/\s+/g, '_');
            
            // Create a copy of the current master configuration
            const customConfig = JSON.parse(JSON.stringify(app.masterConfig));
            
            // Save to a new file
            const blob = new Blob([JSON.stringify(customConfig, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${sanitizedName}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            alert(`Custom template "${templateName}" saved successfully!`);
        } catch (error) {
            console.error('Error saving custom template:', error);
            alert('Error saving custom template. Please check the console for details.');
        }
    }
    
    // Load custom template
    function loadCustomTemplate() {
        try {
            // Create a file input to select a custom template
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json';
            input.onchange = e => {
                const file = e.target.files[0];
                if (!file) return;
                
                const reader = new FileReader();
                reader.onload = evt => {
                    try {
                        const config = JSON.parse(evt.target.result);
                        
                        if (confirm(`Load custom template "${file.name}"? This will overwrite your current configuration and data.`)) {
                            // Replace master configuration with the custom template
                            app.masterConfig = {
                                management: config.management || {},
                                site: config.site || {}
                            };
                            
                            console.log('Custom template loaded:', app.masterConfig);
                            
                            // Reset inspection data
                            app.inspectionData = {
                                projects: {},
                                currentProject: '',
                                version: DATA_VERSION
                            };
                            
                            // Re-initialize default data with the custom configuration
                            initializeDefaultData();
                            
                            // Update project and site selectors
                            if (typeof updateProjectSelector === 'function') updateProjectSelector();
                            if (typeof updateSiteSelector === 'function') updateSiteSelector();
                            
                            console.log('Custom template loaded, master config now:', app.masterConfig);
                            
                            // Force a complete UI refresh
                            setTimeout(() => {
                                // Save data first
                                saveData();
                                
                                // Update all UI components
                                if (typeof renderManagementTab === 'function') renderManagementTab();
                                if (typeof renderSitePerformanceTab === 'function') renderSitePerformanceTab();
                                
                                // Force refresh of current tab to show questions
                                const currentTab = document.querySelector('.tab.active')?.dataset.tabName;
                                if (currentTab && typeof showTab === 'function') {
                                    showTab(currentTab);
                                }
                                
                                console.log('Custom template loaded successfully');
                                alert(`Custom template "${file.name}" loaded successfully!`);
                            }, 300);
                        }
                    } catch (err) {
                        console.error('Error parsing template file:', err);
                        alert('Error parsing template file. Please check the file format.');
                    }
                };
                reader.readAsText(file);
            };
            input.click();
        } catch (error) {
            console.error('Error loading custom template:', error);
            alert('Error loading custom template. Please check the console for details.');
        }
    }
    
    // Reset all data
    function resetAll() {
        try {
            console.log('Resetting all data...');
            if (confirm("Reset all data? This will clear all questions, scores, and comments.")) {
                // Reset master configuration to empty
                app.masterConfig = {
                    management: {},
                    site: {}
                };
                
                console.log('Master configuration reset to empty:', JSON.stringify(app.masterConfig, null, 2));
                
                // Reset inspection data
                app.inspectionData = {
                    projects: {},
                    currentProject: '',
                    version: DATA_VERSION
                };
                
                // Re-initialize default data with empty configuration
                initializeDefaultData();
                
                // Update project and site selectors
                if (typeof updateProjectSelector === 'function') updateProjectSelector();
                if (typeof updateSiteSelector === 'function') updateSiteSelector();
                
                console.log('Data reset, master config now:', app.masterConfig);
                
                // Force a complete UI refresh
                setTimeout(() => {
                    // Save data first
                    saveData();
                    
                    // Update all UI components
                    if (typeof renderMasterConfigTab === 'function') renderMasterConfigTab();
                    if (typeof renderQuestionManagement === 'function') renderQuestionManagement();
                    if (typeof renderManagementTab === 'function') renderManagementTab();
                    if (typeof renderSitePerformanceTab === 'function') renderSitePerformanceTab();
                    
                    console.log('All data reset successfully');
                }, 100);
            }
        } catch (error) {
            console.error('Error resetting all data:', error);
            alert('Error resetting data. Please check the console for details.');
        }
    }
    
    // Expose functions to global scope
    window.initializeDataManagement = initializeDataManagement;
    window.loadData = loadData;
    window.saveData = saveData;
    window.exportAllAuditData = exportAllAuditData;
    window.importAllAuditData = importAllAuditData;
    window.exportConfiguration = exportConfiguration;
    window.importConfiguration = importConfiguration;
    window.resetAll = resetAll;
    window.loadDefaultTemplate = loadDefaultTemplate;
    window.saveCustomTemplate = saveCustomTemplate;
    window.loadCustomTemplate = loadCustomTemplate;
})();