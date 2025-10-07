// UI management functions
(function() {
    // Initialize UI Management
    function initializeUI() {
        console.log('Initializing UI Management...');
        
        // Initialize tab functionality
        initializeTabs();
        
        // Initialize scoring category tabs
        initializeScoringCategories();
        
        // Initialize question type tabs
        initializeQuestionTabs();
        
        // Initialize modal functionality
        initializeModal();
        
        // Initialize recommendations editing
        initializeRecommendationsEditing();
        
        // Initialize management lists
        initializeManagementLists();
        
        // Show dashboard by default
        showTab('dashboard');
        
        console.log('UI Management initialized successfully');
    }
    
    // Initialize tab functionality
    function initializeTabs() {
        const tabs = document.querySelectorAll('.tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabName = e.target.dataset.tabName;
                if (tabName) {
                    showTab(tabName);
                }
            });
        });
    }
    
    // Initialize scoring category tabs
    function initializeScoringCategories() {
        const categoryTabs = document.querySelectorAll('.scoring-category-tab');
        categoryTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                const category = e.target.dataset.category;
                if (category) {
                    showScoringCategory(category);
                }
            });
        });
    }
    
    // Initialize question type tabs
    function initializeQuestionTabs() {
        // This will be called when question management is rendered
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('question-tab')) {
                const questionType = e.target.dataset.questionType;
                if (questionType) {
                    showQuestionType(questionType);
                }
            }
        });
    }
    
    // Initialize modal functionality
    function initializeModal() {
        const modal = document.getElementById('reportModal');
        const closeBtn = document.getElementById('closeModalBtn');
        const printBtn = document.getElementById('printReportBtn');
        const resetBtn = document.getElementById('resetReportBtn');
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                if (modal) modal.style.display = 'none';
            });
        }
        
        if (printBtn) {
            printBtn.addEventListener('click', () => {
                if (typeof printReportWithCharts === 'function') {
                    printReportWithCharts();
                }
            });
        }
        
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                if (typeof generateReport === 'function') {
                    generateReport('detailed');
                }
            });
        }
        
        // Close modal when clicking outside
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.style.display = 'none';
                }
            });
        }
    }
    
    // Initialize recommendations editing
    function initializeRecommendationsEditing() {
        const editBtn = document.getElementById('editRecommendationsBtn');
        const saveBtn = document.getElementById('saveRecommendationsBtn');
        const cancelBtn = document.getElementById('cancelEditRecommendationsBtn');
        const regenerateBtn = document.getElementById('regenerateRecommendationsBtn');
        
        if (editBtn) {
            editBtn.addEventListener('click', () => {
                if (typeof enableRecommendationsEdit === 'function') {
                    enableRecommendationsEdit();
                }
            });
        }
        
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                if (typeof saveRecommendationsEdit === 'function') {
                    saveRecommendationsEdit();
                }
            });
        }
        
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                if (typeof cancelRecommendationsEdit === 'function') {
                    cancelRecommendationsEdit();
                }
            });
        }
        
        if (regenerateBtn) {
            regenerateBtn.addEventListener('click', () => {
                if (typeof regenerateRecommendations === 'function') {
                    regenerateRecommendations();
                }
            });
        }
    }
    
    // Show tab function
    function showTab(tabName) {
        try {
            console.log(`Showing tab: ${tabName}`);
            
            // Hide all tab contents
            const tabContents = document.querySelectorAll('.tab-content');
            tabContents.forEach(content => {
                content.classList.remove('active');
            });
            
            // Remove active class from all tabs
            const tabs = document.querySelectorAll('.tab');
            tabs.forEach(tab => {
                tab.classList.remove('active');
            });
            
            // Show selected tab content
            const selectedContent = document.getElementById(tabName);
            if (selectedContent) {
                selectedContent.classList.add('active');
            }
            
            // Add active class to selected tab
            const selectedTab = document.querySelector(`[data-tab-name="${tabName}"]`);
            if (selectedTab) {
                selectedTab.classList.add('active');
            }
            
            // Render tab-specific content
            switch (tabName) {
                case 'dashboard':
                    if (typeof updateDashboard === 'function') {
                        updateDashboard();
                    }
                    if (typeof loadCustomRecommendations === 'function') {
                        loadCustomRecommendations();
                    }
                    if (typeof updateDashboardExecutiveSummary === 'function') {
                        updateDashboardExecutiveSummary();
                    }
                    break;
                case 'management':
                    if (typeof renderManagementTab === 'function') {
                        renderManagementTab();
                    }
                    break;
                case 'site-performance':
                    if (typeof renderSitePerformanceTab === 'function') {
                        renderSitePerformanceTab();
                    }
                    break;
                case 'reports':
                    if (typeof updateReportSiteSelector === 'function') {
                        updateReportSiteSelector();
                    }
                    if (typeof updateComparisonSiteSelector === 'function') {
                        updateComparisonSiteSelector();
                    }
                    break;
                case 'master':
                    if (typeof renderMasterConfigTab === 'function') {
                        renderMasterConfigTab();
                    }
                    if (typeof renderQuestionManagement === 'function') {
                        renderQuestionManagement();
                    }
                    if (typeof renderSiteList === 'function') {
                        renderSiteList();
                    }
                    // Force re-render of question management after loading data
                    setTimeout(() => renderQuestionManagement(), 100);
                    break;
            }
            
            console.log(`Tab ${tabName} shown successfully`);
        } catch (error) {
            console.error(`Error showing tab ${tabName}:`, error);
        }
    }
    
    // Show scoring category
    function showScoringCategory(category) {
        try {
            // Remove active class from all category tabs
            const categoryTabs = document.querySelectorAll('.scoring-category-tab');
            categoryTabs.forEach(tab => {
                tab.classList.remove('active');
            });
            
            // Hide all category contents
            const categoryContents = document.querySelectorAll('.scoring-category-content');
            categoryContents.forEach(content => {
                content.classList.remove('active');
            });
            
            // Add active class to selected category tab
            const selectedTab = document.querySelector(`[data-category="${category}"]`);
            if (selectedTab) {
                selectedTab.classList.add('active');
            }
            
            // Show selected category content
            const selectedContent = document.getElementById(category);
            if (selectedContent) {
                selectedContent.classList.add('active');
            }
            
            console.log(`Scoring category ${category} shown successfully`);
        } catch (error) {
            console.error(`Error showing scoring category ${category}:`, error);
        }
    }
    
    // Show question type
    function showQuestionType(questionType) {
        try {
            // Remove active class from all question tabs
            const questionTabs = document.querySelectorAll('.question-tab');
            questionTabs.forEach(tab => {
                tab.classList.remove('active');
            });
            
            // Hide all question contents
            const questionContents = document.querySelectorAll('.question-content');
            questionContents.forEach(content => {
                content.classList.remove('active');
            });
            
            // Add active class to selected question tab
            const selectedTab = document.querySelector(`[data-question-type="${questionType}"]`);
            if (selectedTab) {
                selectedTab.classList.add('active');
            }
            
            // Show selected question content
            const selectedContent = document.getElementById(`${questionType}Questions`);
            if (selectedContent) {
                selectedContent.classList.add('active');
            }
            
            console.log(`Question type ${questionType} shown successfully`);
        } catch (error) {
            console.error(`Error showing question type ${questionType}:`, error);
        }
    }
    
    // Render management tab
    function renderManagementTab() {
        try {
            console.log('Rendering management tab...');
            const container = document.getElementById('managementElements');
            if (!container) return;
            
            container.innerHTML = '';
            
            const project = app.getCurrentProject();
            console.log('Current project:', project);
            console.log('Master config management sections:', Object.keys(app.masterConfig.management || {}));
            console.log('Has questions:', app.hasQuestions());
            
            if (!project) {
                console.log('No project found, creating default project...');
                // Create default project if none exists
                if (!app.inspectionData.projects['Default Project']) {
                    app.inspectionData.projects['Default Project'] = {
                        managementSystemAudit: {},
                        sites: { 'Default Site': {} },
                        currentSite: 'Default Site'
                    };
                    app.inspectionData.currentProject = 'Default Project';
                    if (typeof saveData === 'function') saveData();
                }
                return;
            }
            
            // Check if there are management questions
            if (!app.masterConfig.management || Object.keys(app.masterConfig.management).length === 0) {
                console.log('No management questions found in master config');
                container.innerHTML = /* html */ `
                    <div class="no-questions-notice">
                        <div class="notice-icon">📋</div>
                        <h4>No Management Questions Available</h4>
                        <p>To get started, please go to the System Settings tab and either:</p>
                        <ul style="text-align: left; max-width: 400px; margin: 0 auto;">
                            <li>Load the default template</li>
                            <li>Import a custom configuration</li>
                            <li>Add questions manually</li>
                        </ul>
                        <button class="btn btn-green" onclick="showTab('master')">Go to System Settings</button>
                    </div>
                `;
                return;
            }
            
            console.log('Found management sections:', Object.keys(app.masterConfig.management));
            
            // Render management system audit sections
            for (const section in app.masterConfig.management) {
                console.log(`Processing section: ${section} with questions:`, app.masterConfig.management[section]);
                
                const focusElement = document.createElement('div');
                focusElement.className = 'focus-element';
                
                const sectionHeader = document.createElement('h3');
                sectionHeader.textContent = section;
                focusElement.appendChild(sectionHeader);
                
                // Get or initialize section data
                if (!project.managementSystemAudit[section]) {
                    console.log(`Initializing section data for: ${section}`);
                    project.managementSystemAudit[section] = app.masterConfig.management[section].map(name => ({
                        name, 
                        score: 0, 
                        comment: ''
                    }));
                }
                
                // Render items in this section
                project.managementSystemAudit[section].forEach((item, index) => {
                    console.log(`Rendering item: ${item.name} with score: ${item.score}`);
                    
                    const inspectionItem = document.createElement('div');
                    inspectionItem.className = 'inspection-item';
                    
                    const itemHeader = document.createElement('div');
                    itemHeader.className = 'item-header';
                    
                    const itemName = document.createElement('div');
                    itemName.className = 'item-name';
                    itemName.textContent = item.name;
                    
                    const scoreInput = document.createElement('div');
                    scoreInput.className = 'score-input';
                    
                    const scoreSelect = document.createElement('select');
                    scoreSelect.className = `score-select score-${item.score}`;
                    
                    const scoreOptions = [
                        { value: '0', text: '0 - Not Applicable/Not Observed' },
                        { value: '1', text: '1 - Major Non-Conformance' },
                        { value: '2', text: '2 - Minor Non-Conformance' },
                        { value: '3', text: '3 - Observation/Improvement Opportunity' },
                        { value: '4', text: '4 - Conformance' },
                        { value: '5', text: '5 - Best Practice' }
                    ];
                    
                    scoreOptions.forEach(option => {
                        const optionElement = document.createElement('option');
                        optionElement.value = option.value;
                        optionElement.textContent = option.text;
                        if (option.value === item.score.toString()) {
                            optionElement.selected = true;
                        }
                        scoreSelect.appendChild(optionElement);
                    });
                    
                    scoreSelect.addEventListener('change', (e) => {
                        const newScore = parseInt(e.target.value);
                        project.managementSystemAudit[section][index].score = newScore;
                        
                        // Update score class
                        scoreSelect.className = `score-select score-${newScore}`;
                        
                        if (typeof saveData === 'function') {
                            saveData();
                        }
                        
                        // Update dashboard, charts, and recommendations after score change
                        updateAllDashboardComponents();
                    });
                    
                    scoreInput.appendChild(scoreSelect);
                    
                    itemHeader.appendChild(itemName);
                    itemHeader.appendChild(scoreInput);
                    
                    const commentsInput = document.createElement('textarea');
                    commentsInput.className = 'comments-input';
                    commentsInput.placeholder = 'Add comments or observations...';
                    commentsInput.value = item.comment || '';
                    commentsInput.addEventListener('input', (e) => {
                        project.managementSystemAudit[section][index].comment = e.target.value;
                        if (typeof saveData === 'function') {
                            saveData();
                        }
                        
                        // Update recommendations when comments change
                        if (typeof renderDashboardRecommendations === 'function') {
                            renderDashboardRecommendations();
                        }
                    });
                    
                    inspectionItem.appendChild(itemHeader);
                    inspectionItem.appendChild(commentsInput);
                    focusElement.appendChild(inspectionItem);
                });
                
                container.appendChild(focusElement);
            }
            
            console.log('Management tab rendered successfully');
        } catch (error) {
            console.error('Error rendering management tab:', error);
        }
    }
    
    // Render site performance tab
    function renderSitePerformanceTab() {
        try {
            console.log('Rendering site performance tab...');
            const container = document.getElementById('sitePerformanceAudit');
            if (!container) return;
            
            container.innerHTML = '';
            
            const project = app.getCurrentProject();
            console.log('Current project:', project);
            console.log('Master config site sections:', Object.keys(app.masterConfig.site || {}));
            console.log('Current site:', project?.currentSite);
            
            if (!project) {
                console.log('No project found for site performance');
                container.innerHTML = '<p>No project selected. Please select or create a project first.</p>';
                return;
            }
            
            if (!project.currentSite) {
                console.log('No current site selected');
                container.innerHTML = '<p>Please select a site to begin the audit.</p>';
                return;
            }
            
            // Check if there are site questions
            if (!app.masterConfig.site || Object.keys(app.masterConfig.site).length === 0) {
                console.log('No site questions found in master config');
                container.innerHTML = /* html */ `
                    <div class="no-questions-notice">
                        <div class="notice-icon">🏗️</div>
                        <h4>No Site Performance Questions Available</h4>
                        <p>To get started, please go to the System Settings tab and either:</p>
                        <ul style="text-align: left; max-width: 400px; margin: 0 auto;">
                            <li>Load the default template</li>
                            <li>Import a custom configuration</li>
                            <li>Add questions manually</li>
                        </ul>
                        <button class="btn btn-green" onclick="showTab('master')">Go to System Settings</button>
                    </div>
                `;
                return;
            }
            
            console.log('Found site sections:', Object.keys(app.masterConfig.site));
            
            // Initialize site data if it doesn't exist
            if (!project.sites[project.currentSite]) {
                console.log(`Initializing site data for: ${project.currentSite}`);
                project.sites[project.currentSite] = {};
            }
            
            // Render site performance audit sections
            for (const section in app.masterConfig.site) {
                console.log(`Processing site section: ${section} with questions:`, app.masterConfig.site[section]);
                
                const focusElement = document.createElement('div');
                focusElement.className = 'focus-element';
                
                const sectionHeader = document.createElement('h3');
                sectionHeader.textContent = section;
                focusElement.appendChild(sectionHeader);
                
                // Get or initialize section data
                if (!project.sites[project.currentSite][section]) {
                    console.log(`Initializing site section data for: ${section}`);
                    project.sites[project.currentSite][section] = app.masterConfig.site[section].map(name => ({
                        name, 
                        score: 0, 
                        comment: ''
                    }));
                }
                
                // Render items in this section
                project.sites[project.currentSite][section].forEach((item, index) => {
                    console.log(`Rendering site item: ${item.name} with score: ${item.score}`);
                    
                    const inspectionItem = document.createElement('div');
                    inspectionItem.className = 'inspection-item';
                    
                    const itemHeader = document.createElement('div');
                    itemHeader.className = 'item-header';
                    
                    const itemName = document.createElement('div');
                    itemName.className = 'item-name';
                    itemName.textContent = item.name;
                    
                    const scoreInput = document.createElement('div');
                    scoreInput.className = 'score-input';
                    
                    const scoreSelect = document.createElement('select');
                    scoreSelect.className = `score-select score-${item.score}`;
                    
                    const scoreOptions = [
                        { value: '0', text: '0 - Not Applicable/Not Observed' },
                        { value: '1', text: '1 - Major Non-Conformance' },
                        { value: '2', text: '2 - Minor Non-Conformance' },
                        { value: '3', text: '3 - Observation/Improvement Opportunity' },
                        { value: '4', text: '4 - Conformance' },
                        { value: '5', text: '5 - Best Practice' }
                    ];
                    
                    scoreOptions.forEach(option => {
                        const optionElement = document.createElement('option');
                        optionElement.value = option.value;
                        optionElement.textContent = option.text;
                        if (option.value === item.score.toString()) {
                            optionElement.selected = true;
                        }
                        scoreSelect.appendChild(optionElement);
                    });
                    
                    scoreSelect.addEventListener('change', (e) => {
                        const newScore = parseInt(e.target.value);
                        project.sites[project.currentSite][section][index].score = newScore;
                        
                        // Update score class
                        scoreSelect.className = `score-select score-${newScore}`;
                        
                        if (typeof saveData === 'function') {
                            saveData();
                        }
                        
                        // Update dashboard, charts, and recommendations after score change
                        updateAllDashboardComponents();
                    });
                    
                    scoreInput.appendChild(scoreSelect);
                    
                    itemHeader.appendChild(itemName);
                    itemHeader.appendChild(scoreInput);
                    
                    const commentsInput = document.createElement('textarea');
                    commentsInput.className = 'comments-input';
                    commentsInput.placeholder = 'Add comments or observations...';
                    commentsInput.value = item.comment || '';
                    commentsInput.addEventListener('input', (e) => {
                        project.sites[project.currentSite][section][index].comment = e.target.value;
                        if (typeof saveData === 'function') {
                            saveData();
                        }
                        
                        // Update recommendations when comments change
                        if (typeof renderDashboardRecommendations === 'function') {
                            renderDashboardRecommendations();
                        }
                    });
                    
                    inspectionItem.appendChild(itemHeader);
                    inspectionItem.appendChild(commentsInput);
                    focusElement.appendChild(inspectionItem);
                });
                
                container.appendChild(focusElement);
            }
            
            console.log('Site performance tab rendered successfully');
        } catch (error) {
            console.error('Error rendering site performance tab:', error);
        }
    }
    
    // Render master config tab
    function renderMasterConfigTab() {
        try {
            console.log('Rendering master config tab...');
            // This function can be expanded to show configuration editing interface
            // For now, it's handled by the question management system
        } catch (error) {
            console.error('Error rendering master config tab:', error);
        }
    }
    
    // Render question management
    function renderQuestionManagement() {
        try {
            console.log('Rendering question management...');
            const container = document.getElementById('questionManagementContainer');
            if (!container) {
                console.warn('Question management container not found');
                return;
            }
            
            // Check if questions exist
            if (!app.hasQuestions()) {
                console.log('No questions found, showing no questions notice');
                container.innerHTML = `
                    <div class="no-questions-notice">
                        <div class="notice-icon">❓</div>
                        <h4>No Questions Available</h4>
                        <p>To get started with your audit system, you need to load questions. You can:</p>
                        <div style="margin: 20px 0;">
                            <button class="btn btn-green" onclick="loadDefaultTemplate()">Load Default Template</button>
                            <button class="btn btn-secondary" onclick="importConfiguration()">Import Custom Configuration</button>
                        </div>
                        <p style="font-size: 0.9rem; color: #888;">
                            The default template includes sample questions for both Management System and Site Performance audits.
                        </p>
                    </div>
                `;
                return;
            }
            
            // Questions exist, show the management interface
            console.log('Questions found, rendering question management interface');
            const questionCounts = app.getQuestionCounts();
            
            console.log('Rendering question management with counts:', questionCounts);
            
            container.innerHTML = `
                <div class="question-tabs">
                    <button class="question-tab active" data-question-type="management">Management Questions (${questionCounts.management})</button>
                    <button class="question-tab" data-question-type="site">Site Questions (${questionCounts.site})</button>
                </div>
                
                <div id="managementQuestions" class="question-content active">
                    ${renderQuestionSections('management')}
                </div>
                
                <div id="siteQuestions" class="question-content">
                    ${renderQuestionSections('site')}
                </div>
            `;
            
            // Add event listeners for question tabs
            const questionTabs = container.querySelectorAll('.question-tab');
            questionTabs.forEach(tab => {
                tab.addEventListener('click', (e) => {
                    const questionType = e.target.dataset.questionType;
                    showQuestionType(questionType);
                });
            });
            
            console.log('Question management rendered successfully');
        } catch (error) {
            console.error('Error rendering question management:', error);
        }
    }
    
    // Render question sections
    function renderQuestionSections(type) {
        try {
            const config = app.masterConfig[type] || {};
            console.log(`Rendering question sections for ${type}:`, config);
            
            let html = '';
            
            for (const section in config) {
                html += `
                    <div class="question-section">
                        <h4>
                            ${section}
                            <button class="btn btn-green" onclick="addQuestion('${type}', '${section}')">Add Question</button>
                        </h4>
                        <div class="question-list">
                `;
                
                config[section].forEach((question, index) => {
                    html += `
                        <div class="question-item">
                            <span class="question-text">${question}</span>
                            <div class="question-actions">
                                <button class="btn btn-secondary" onclick="editQuestion('${type}', '${section}', ${index})">Edit</button>
                                <button class="btn btn-danger" onclick="deleteQuestion('${type}', '${section}', ${index})">Delete</button>
                            </div>
                        </div>
                    `;
                });
                
                html += `
                        </div>
                    </div>
                `;
            }
            
            // Add section for adding new sections
            html += `
                <div class="question-section">
                    <h4>Add New Section</h4>
                    <div style="display: flex; gap: 10px; margin-top: 10px;">
                        <input type="text" id="new${type}Section" placeholder="Enter section name" style="flex: 1; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                        <button class="btn btn-green" onclick="addSection('${type}')">Add Section</button>
                    </div>
                </div>
            `;
            
            return html;
        } catch (error) {
            console.error('Error rendering question sections:', error);
            return '<p>Error rendering questions</p>';
        }
    }
    
    // Add new section
    function addSection(type) {
        try {
            const input = document.getElementById(`new${type}Section`);
            const sectionName = input.value.trim();
            
            if (!sectionName) {
                alert('Please enter a section name');
                return;
            }
            
            if (app.masterConfig[type][sectionName]) {
                alert('A section with this name already exists');
                return;
            }
            
            // Add new section
            app.masterConfig[type][sectionName] = [];
            
            // Update all projects with the new section
            for (const projectName in app.inspectionData.projects) {
                const project = app.inspectionData.projects[projectName];
                
                if (type === 'management') {
                    project.managementSystemAudit[sectionName] = [];
                } else {
                    for (const siteName in project.sites) {
                        project.sites[siteName][sectionName] = [];
                    }
                }
            }
            
            input.value = '';
            if (typeof saveData === 'function') {
                saveData();
            }
            renderQuestionManagement();
            
            console.log(`Section "${sectionName}" added to ${type}`);
        } catch (error) {
            console.error('Error adding section:', error);
        }
    }
    
    // Add question to specific section with appropriate selection options
    function addQuestionToSection(type, section) {
        try {
            const questionText = prompt('Enter the question text:');
            if (!questionText) return;
            
            let applyToAll = true;
            let specificTarget = null;
            
            if (type === 'management') {
                // For management questions, ask about projects
                const projects = getCurrentProjects();
                if (projects.length > 1) {
                    const choice = confirm(`Add this question to all projects?\n\nClick OK for ALL PROJECTS\nClick Cancel to choose a specific project`);
                    if (!choice) {
                        specificTarget = prompt(`Enter project name or choose from: ${projects.join(', ')}`);
                        if (!specificTarget || !projects.includes(specificTarget)) {
                            alert('Invalid project name. Question not added.');
                            return;
                        }
                        applyToAll = false;
                    }
                }
            } else if (type === 'site') {
                // For site questions, ask about sites
                const sites = getCurrentProjectSites();
                if (sites.length > 1) {
                    const choice = confirm(`Add this question to all sites?\n\nClick OK for ALL SITES\nClick Cancel to choose a specific site`);
                    if (!choice) {
                        specificTarget = prompt(`Enter site name or choose from: ${sites.join(', ')}`);
                        if (!specificTarget || !sites.includes(specificTarget)) {
                            alert('Invalid site name. Question not added.');
                            return;
                        }
                        applyToAll = false;
                    }
                }
            }
            
            // Add to master config
            if (!app.masterConfig[type][section]) {
                app.masterConfig[type][section] = [];
            }
            app.masterConfig[type][section].push(questionText);
            
            // Update projects with the new question
            updateProjectsWithNewQuestion(type, section, questionText, applyToAll, specificTarget);
            
            if (typeof saveData === 'function') {
                saveData();
            }
            updateQuestionsList();
            
            const targetType = type === 'management' ? 'project' : 'site';
            console.log(`Question added to ${type} - ${section}${specificTarget ? ` (${targetType}: ${specificTarget})` : ` (all ${targetType}s)`}`);
        } catch (error) {
            console.error('Error adding question:', error);
        }
    }
    
    // Legacy function for backward compatibility
    function addQuestion(type, section) {
        addQuestionToSection(type, section);
    }
    
    // Add section with appropriate selection options
    function addSectionWithOptions(type) {
        try {
            const inputId = `new${type.charAt(0).toUpperCase() + type.slice(1)}SectionName`;
            const input = document.getElementById(inputId);
            const sectionName = input.value.trim();
            
            if (!sectionName) {
                alert('Please enter a section name');
                return;
            }
            
            if (app.masterConfig[type][sectionName]) {
                alert('A section with this name already exists');
                return;
            }
            
            let applyToAll = true;
            let specificTarget = null;
            
            if (type === 'management') {
                // For management sections, handle project selection
                const projects = getCurrentProjects();
                if (projects.length > 1) {
                    const choice = confirm(`Add this section to all projects?\n\nClick OK for ALL PROJECTS\nClick Cancel to choose a specific project`);
                    if (!choice) {
                        specificTarget = prompt(`Enter project name or choose from: ${projects.join(', ')}`);
                        if (!specificTarget || !projects.includes(specificTarget)) {
                            alert('Invalid project name. Section not added.');
                            return;
                        }
                        applyToAll = false;
                    }
                }
            } else if (type === 'site') {
                // For site sections, handle site selection
                const allSitesCheckbox = document.getElementById(`addTo${type.charAt(0).toUpperCase() + type.slice(1)}AllSites`);
                const siteSelector = document.getElementById(`specific${type.charAt(0).toUpperCase() + type.slice(1)}Site`);
                
                if (allSitesCheckbox && siteSelector) {
                    applyToAll = allSitesCheckbox.checked;
                    if (!applyToAll) {
                        specificTarget = siteSelector.value;
                        if (!specificTarget) {
                            alert('Please select a specific site or check "Add to all sites"');
                            return;
                        }
                    }
                }
            }
            
            // Add new section to master config
            app.masterConfig[type][sectionName] = [];
            
            // Update all projects with the new section
            updateProjectsWithNewSection(type, sectionName, applyToAll, specificTarget);
            
            input.value = '';
            if (typeof saveData === 'function') {
                saveData();
            }
            updateQuestionsList();
            
            const targetType = type === 'management' ? 'project' : 'site';
            console.log(`Section "${sectionName}" added to ${type}${specificTarget ? ` (${targetType}: ${specificTarget})` : ` (all ${targetType}s)`}`);
        } catch (error) {
            console.error('Error adding section:', error);
        }
    }
    
    // Helper functions for project updates
    function getCurrentProjectSites() {
        const project = window.app ? window.app.getCurrentProject() : null;
        return project && project.sites ? Object.keys(project.sites) : [];
    }
    
    function getCurrentProjects() {
        return window.app && window.app.inspectionData && window.app.inspectionData.projects ? 
               Object.keys(window.app.inspectionData.projects) : [];
    }
    
    function updateProjectsWithNewQuestion(type, section, questionText, applyToAll, specificTarget) {
        if (type === 'management') {
            // Management questions are project-based
            if (applyToAll) {
                // Add to all projects
                for (const projectName in app.inspectionData.projects) {
                    const project = app.inspectionData.projects[projectName];
                    if (!project.managementSystemAudit[section]) {
                        project.managementSystemAudit[section] = [];
                    }
                    project.managementSystemAudit[section].push({
                        name: questionText,
                        score: 0,
                        comment: ''
                    });
                }
            } else if (specificTarget && app.inspectionData.projects[specificTarget]) {
                // Add to specific project only
                const project = app.inspectionData.projects[specificTarget];
                if (!project.managementSystemAudit[section]) {
                    project.managementSystemAudit[section] = [];
                }
                project.managementSystemAudit[section].push({
                    name: questionText,
                    score: 0,
                    comment: ''
                });
            }
        } else {
            // Site questions are site-based (within current project)
            for (const projectName in app.inspectionData.projects) {
                const project = app.inspectionData.projects[projectName];
                
                if (applyToAll) {
                    // Add to all sites in this project
                    for (const siteName in project.sites) {
                        if (!project.sites[siteName][section]) {
                            project.sites[siteName][section] = [];
                        }
                        project.sites[siteName][section].push({
                            name: questionText,
                            score: 0,
                            comment: ''
                        });
                    }
                } else if (specificTarget && project.sites[specificTarget]) {
                    // Add to specific site only
                    if (!project.sites[specificTarget][section]) {
                        project.sites[specificTarget][section] = [];
                    }
                    project.sites[specificTarget][section].push({
                        name: questionText,
                        score: 0,
                        comment: ''
                    });
                }
            }
        }
    }
    
    function updateProjectsWithNewSection(type, sectionName, applyToAll, specificTarget) {
        if (type === 'management') {
            // Management sections are project-based
            if (applyToAll) {
                // Add to all projects
                for (const projectName in app.inspectionData.projects) {
                    const project = app.inspectionData.projects[projectName];
                    project.managementSystemAudit[sectionName] = [];
                }
            } else if (specificTarget && app.inspectionData.projects[specificTarget]) {
                // Add to specific project only
                const project = app.inspectionData.projects[specificTarget];
                project.managementSystemAudit[sectionName] = [];
            }
        } else {
            // Site sections are site-based (within all projects)
            for (const projectName in app.inspectionData.projects) {
                const project = app.inspectionData.projects[projectName];
                
                if (applyToAll) {
                    // Add to all sites in this project
                    for (const siteName in project.sites) {
                        project.sites[siteName][sectionName] = [];
                    }
                } else if (specificTarget && project.sites[specificTarget]) {
                    // Add to specific site only
                    project.sites[specificTarget][sectionName] = [];
                }
            }
        }
    }
    
    // New enhanced functions
    function editSectionName(type, oldSectionName) {
        try {
            const newSectionName = prompt('Enter new section name:', oldSectionName);
            if (!newSectionName || newSectionName === oldSectionName) return;
            
            if (app.masterConfig[type][newSectionName]) {
                alert('A section with this name already exists');
                return;
            }
            
            // Update master config
            app.masterConfig[type][newSectionName] = app.masterConfig[type][oldSectionName];
            delete app.masterConfig[type][oldSectionName];
            
            // Update all projects
            for (const projectName in app.inspectionData.projects) {
                const project = app.inspectionData.projects[projectName];
                
                if (type === 'management') {
                    if (project.managementSystemAudit[oldSectionName]) {
                        project.managementSystemAudit[newSectionName] = project.managementSystemAudit[oldSectionName];
                        delete project.managementSystemAudit[oldSectionName];
                    }
                } else {
                    for (const siteName in project.sites) {
                        if (project.sites[siteName][oldSectionName]) {
                            project.sites[siteName][newSectionName] = project.sites[siteName][oldSectionName];
                            delete project.sites[siteName][oldSectionName];
                        }
                    }
                }
            }
            
            if (typeof saveData === 'function') {
                saveData();
            }
            updateQuestionsList();
            
            console.log(`Section renamed from "${oldSectionName}" to "${newSectionName}"`);
        } catch (error) {
            console.error('Error editing section name:', error);
        }
    }
    
    function deleteSection(type, sectionName) {
        try {
            if (!confirm(`Are you sure you want to delete section "${sectionName}" and all its questions?\n\nThis action cannot be undone.`)) {
                return;
            }
            
            // Remove from master config
            delete app.masterConfig[type][sectionName];
            
            // Remove from all projects
            for (const projectName in app.inspectionData.projects) {
                const project = app.inspectionData.projects[projectName];
                
                if (type === 'management') {
                    delete project.managementSystemAudit[sectionName];
                } else {
                    for (const siteName in project.sites) {
                        delete project.sites[siteName][sectionName];
                    }
                }
            }
            
            if (typeof saveData === 'function') {
                saveData();
            }
            updateQuestionsList();
            
            console.log(`Section "${sectionName}" deleted from ${type}`);
        } catch (error) {
            console.error('Error deleting section:', error);
        }
    }
    
    function moveQuestion(type, section, index) {
        try {
            const questions = app.masterConfig[type][section];
            const questionText = questions[index];
            const newPosition = prompt(`Move question "${questionText}" to position (1-${questions.length}):`);
            
            if (!newPosition || isNaN(newPosition)) return;
            
            const newIndex = parseInt(newPosition) - 1;
            if (newIndex < 0 || newIndex >= questions.length || newIndex === index) return;
            
            // Move in master config
            questions.splice(index, 1);
            questions.splice(newIndex, 0, questionText);
            
            // Update all projects
            for (const projectName in app.inspectionData.projects) {
                const project = app.inspectionData.projects[projectName];
                
                if (type === 'management') {
                    if (project.managementSystemAudit[section]) {
                        const item = project.managementSystemAudit[section].splice(index, 1)[0];
                        project.managementSystemAudit[section].splice(newIndex, 0, item);
                    }
                } else {
                    for (const siteName in project.sites) {
                        if (project.sites[siteName][section]) {
                            const item = project.sites[siteName][section].splice(index, 1)[0];
                            project.sites[siteName][section].splice(newIndex, 0, item);
                        }
                    }
                }
            }
            
            if (typeof saveData === 'function') {
                saveData();
            }
            updateQuestionsList();
            
            console.log(`Question moved from position ${index + 1} to ${newIndex + 1}`);
        } catch (error) {
            console.error('Error moving question:', error);
        }
    }
    
    // Edit question
    function editQuestion(type, section, index) {
        try {
            const currentText = app.masterConfig[type][section][index];
            const newText = prompt('Edit question text:', currentText);
            
            if (newText && newText !== currentText) {
                // Update master config
                app.masterConfig[type][section][index] = newText;
                
                // Update all projects with the new question text
                for (const projectName in app.inspectionData.projects) {
                    const project = app.inspectionData.projects[projectName];
                    
                    if (type === 'management') {
                        if (project.managementSystemAudit[section] && project.managementSystemAudit[section][index]) {
                            project.managementSystemAudit[section][index].name = newText;
                        }
                    } else {
                        for (const siteName in project.sites) {
                            if (project.sites[siteName][section] && project.sites[siteName][section][index]) {
                                project.sites[siteName][section][index].name = newText;
                            }
                        }
                    }
                }
                
                if (typeof saveData === 'function') {
                    saveData();
                }
                renderQuestionManagement();
                
                console.log(`Question edited in ${type} - ${section}`);
            }
        } catch (error) {
            console.error('Error editing question:', error);
        }
    }
    
    // Delete question
    function deleteQuestion(type, section, index) {
        try {
            const questionText = app.masterConfig[type][section][index];
            
            if (confirm(`Are you sure you want to delete this question?\n\n"${questionText}"\n\nThis will remove it from all projects and sites.`)) {
                // Remove from master config
                app.masterConfig[type][section].splice(index, 1);
                
                // Remove from all projects
                for (const projectName in app.inspectionData.projects) {
                    const project = app.inspectionData.projects[projectName];
                    
                    if (type === 'management') {
                        if (project.managementSystemAudit[section]) {
                            project.managementSystemAudit[section].splice(index, 1);
                        }
                    } else {
                        for (const siteName in project.sites) {
                            if (project.sites[siteName][section]) {
                                project.sites[siteName][section].splice(index, 1);
                            }
                        }
                    }
                }
                
                if (typeof saveData === 'function') {
                    saveData();
                }
                renderQuestionManagement();
                
                console.log(`Question deleted from ${type} - ${section}`);
            }
        } catch (error) {
            console.error('Error deleting question:', error);
        }
    }
    
    // Update all dashboard components
    function updateAllDashboardComponents() {
        try {
            console.log('Updating all dashboard components...');
            
            // Update dashboard summary and charts
            if (window.chartManagement && window.chartManagement.updateDashboard) {
                window.chartManagement.updateDashboard();
            } else if (typeof updateDashboard === 'function') {
                updateDashboard();
            }
            
            // Update recommendations
            if (typeof renderDashboardRecommendations === 'function') {
                renderDashboardRecommendations();
            }
            
            // Update executive summary
            if (typeof updateDashboardExecutiveSummary === 'function') {
                updateDashboardExecutiveSummary();
            }
            
            console.log('All dashboard components updated successfully');
        } catch (error) {
            console.error('Error updating dashboard components:', error);
        }
    }
    
    // Initialize management lists
    function initializeManagementLists() {
        try {
            console.log('Initializing management lists...');
            
            // Initialize refresh buttons
            const refreshQuestionsBtn = document.getElementById('refreshQuestionsBtn');
            if (refreshQuestionsBtn) {
                refreshQuestionsBtn.addEventListener('click', () => {
                    updateQuestionsList();
                });
            }
            
            const refreshProjectsBtn = document.getElementById('refreshProjectsBtn');
            if (refreshProjectsBtn) {
                refreshProjectsBtn.addEventListener('click', () => {
                    updateProjectSelector();
                    updateSiteSelector();
                    updateProjectsList();
                    updateSitesList();
                    console.log('Manual refresh triggered for projects, sites, and selectors');
                });
            }
            
            // Initialize questions tab switching
            initializeQuestionsTabSwitching();
            
            // Update lists when tab is shown
            setTimeout(() => {
                updateProjectSelector();
                updateSiteSelector();
                updateProjectsList();
                updateSitesList();
                updateQuestionsList();
            }, 1000);
            
            // Also update when System Settings tab is clicked
            const systemSettingsTab = document.querySelector('button[data-tab-name="master"]');
            if (systemSettingsTab) {
                systemSettingsTab.addEventListener('click', () => {
                    setTimeout(() => {
                        updateProjectSelector();
                        updateSiteSelector();
                        updateProjectsList();
                        updateSitesList();
                        updateQuestionsList();
                    }, 500);
                });
            }
            
            console.log('Management lists initialized successfully');
        } catch (error) {
            console.error('Error initializing management lists:', error);
        }
    }
    
    // Update header project selector dropdown
    function updateProjectSelector() {
        try {
            const projectSelector = document.getElementById('projectSelector');
            if (!projectSelector) return;
            
            const projects = getCurrentProjects();
            if (projects.length === 0) {
                projectSelector.innerHTML = '<option value="">No projects available</option>';
                return;
            }
            
            let html = '<option value="">Select a project</option>';
            const currentProjectName = window.app && window.app.currentProject ? window.app.currentProject : '';
            
            projects.forEach(projectName => {
                const selected = currentProjectName === projectName ? 'selected' : '';
                html += `<option value="${projectName}" ${selected}>${projectName}</option>`;
            });
            
            projectSelector.innerHTML = html;
            
            // Add event listener for project selection changes
            projectSelector.onchange = (e) => {
                if (e.target.value && window.app) {
                    window.app.currentProject = e.target.value;
                    if (window.app.saveData) window.app.saveData();
                    
                    // Update site selector for new project
                    updateSiteSelector();
                    
                    // Update dashboard and charts
                    if (typeof updateAllDashboardComponents === 'function') {
                        updateAllDashboardComponents();
                    }
                    
                    // Update management lists
                    updateProjectsList();
                    updateSitesList();
                    
                    console.log('Switched to project:', e.target.value);
                }
            };
            
        } catch (error) {
            console.error('Error updating project selector:', error);
        }
    }

    // Update projects list
    function updateProjectsList() {
        try {
            const container = document.getElementById('projectListContainer');
            if (!container) return;
            
            const projects = window.app && window.app.inspectionData && window.app.inspectionData.projects ? 
                            Object.keys(window.app.inspectionData.projects) : [];
            
            if (projects.length === 0) {
                container.innerHTML = '<div style="text-align: center; color: #666; padding: 20px;">No projects created yet. Use the "Add New Project" button to create your first project.</div>';
                return;
            }
            
            let html = '';
            projects.forEach(projectName => {
                const project = window.app.inspectionData.projects[projectName];
                const sitesCount = project.sites ? Object.keys(project.sites).length : 0;
                const currentProject = window.app.currentProject === projectName;
                
                html += `
                    <div class="project-item ${currentProject ? 'current' : ''}">
                        <div class="project-info">
                            <div class="project-name">${projectName} ${currentProject ? '(Current)' : ''}</div>
                            <div class="project-details">${sitesCount} site(s) • Lead Auditor: ${project.leadAuditor || 'Not set'}</div>
                        </div>
                        <div class="project-actions">
                            ${!currentProject ? `<button class="btn btn-sm btn-secondary" onclick="switchToProject('${projectName}')">Switch To</button>` : ''}
                            <button class="btn btn-sm btn-secondary" onclick="editProjectName('${projectName}')">Edit</button>
                            <button class="btn btn-sm btn-danger" onclick="deleteProject('${projectName}')">Delete</button>
                        </div>
                    </div>
                `;
            });
            
            container.innerHTML = html;
        } catch (error) {
            console.error('Error updating projects list:', error);
        }
    }
    
    // Update header site selector dropdown
    function updateSiteSelector() {
        try {
            const siteSelector = document.getElementById('siteSelector');
            if (!siteSelector) return;
            
            const project = window.app ? window.app.getCurrentProject() : null;
            if (!project || !project.sites) {
                siteSelector.innerHTML = '<option value="">No sites available</option>';
                return;
            }
            
            const sites = Object.keys(project.sites);
            let html = '<option value="">Select a site</option>';
            
            sites.forEach(siteName => {
                const selected = project.currentSite === siteName ? 'selected' : '';
                html += `<option value="${siteName}" ${selected}>${siteName}</option>`;
            });
            
            siteSelector.innerHTML = html;
            
            // Add event listener for site selection changes
            siteSelector.onchange = (e) => {
                if (e.target.value && window.app) {
                    const currentProject = window.app.getCurrentProject();
                    if (currentProject) {
                        currentProject.currentSite = e.target.value;
                        if (window.app.saveData) window.app.saveData();
                        // Update dashboard and charts
                        if (typeof updateAllDashboardComponents === 'function') {
                            updateAllDashboardComponents();
                        }
                        console.log('Switched to site:', e.target.value);
                    }
                }
            };
            
        } catch (error) {
            console.error('Error updating site selector:', error);
        }
    }

    // Update sites list
    function updateSitesList() {
        try {
            const container = document.getElementById('siteListContainer');
            if (!container) return;
            
            const project = window.app ? window.app.getCurrentProject() : null;
            if (!project || !project.sites) {
                container.innerHTML = '<div style="text-align: center; color: #666; padding: 20px;">No sites found. Add a site using the form above.</div>';
                return;
            }
            
            const sites = Object.keys(project.sites);
            if (sites.length === 0) {
                container.innerHTML = '<div style="text-align: center; color: #666; padding: 20px;">No sites created yet. Add a site using the form above.</div>';
                return;
            }
            
            let html = '';
            sites.forEach(siteName => {
                const currentSite = project.currentSite === siteName;
                
                html += `
                    <div class="site-item ${currentSite ? 'current' : ''}">
                        <div class="site-name">${siteName} ${currentSite ? '(Current)' : ''}</div>
                        <div class="site-actions">
                            ${!currentSite ? `<button class="btn btn-sm btn-secondary" onclick="switchToSite('${siteName}')">Switch To</button>` : ''}
                            <button class="btn btn-sm btn-secondary" onclick="editSiteName('${siteName}')">Edit</button>
                            <button class="btn btn-sm btn-danger" onclick="deleteSite('${siteName}')">Delete</button>
                        </div>
                    </div>
                `;
            });
            
            container.innerHTML = html;
        } catch (error) {
            console.error('Error updating sites list:', error);
        }
    }
    
    // Initialize questions tab switching
    function initializeQuestionsTabSwitching() {
        try {
            const tabs = document.querySelectorAll('.questions-tab');
            const panels = document.querySelectorAll('.questions-panel');
            
            tabs.forEach(tab => {
                tab.addEventListener('click', () => {
                    // Remove active class from all tabs and panels
                    tabs.forEach(t => t.classList.remove('active'));
                    panels.forEach(p => p.classList.remove('active'));
                    
                    // Add active class to clicked tab
                    tab.classList.add('active');
                    
                    // Show corresponding panel
                    const tabName = tab.dataset.questionsTab;
                    const targetPanel = document.getElementById(`${tabName}QuestionsPanel`);
                    if (targetPanel) {
                        targetPanel.classList.add('active');
                    }
                });
            });
            
            console.log('Questions tab switching initialized');
        } catch (error) {
            console.error('Error initializing questions tab switching:', error);
        }
    }

    // Update questions list with proper numbering and section organization
    function updateQuestionsList() {
        try {
            const managementContainer = document.getElementById('managementQuestionsContainer');
            const siteContainer = document.getElementById('siteQuestionsContainer');
            
            if (!managementContainer || !siteContainer) return;
            
            const masterConfig = window.app && window.app.masterConfig ? window.app.masterConfig : null;
            if (!masterConfig) {
                managementContainer.innerHTML = '<div style="text-align: center; color: #666; padding: 40px;">No template loaded. Use "Load Default Template" to load questions.</div>';
                siteContainer.innerHTML = '<div style="text-align: center; color: #666; padding: 40px;">No template loaded. Use "Load Default Template" to load questions.</div>';
                updateQuestionCounts(0, 0);
                return;
            }
            
            let managementQuestionCount = 0;
            let siteQuestionCount = 0;
            
            // Update management questions with section organization
            if (masterConfig.management) {
                let managementHtml = renderQuestionsWithSections('management', masterConfig.management);
                managementContainer.innerHTML = managementHtml;
                // Count total management questions
                for (const section in masterConfig.management) {
                    managementQuestionCount += masterConfig.management[section].length;
                }
            }
            
            // Update site questions with section organization
            if (masterConfig.site) {
                let siteHtml = renderQuestionsWithSections('site', masterConfig.site);
                siteContainer.innerHTML = siteHtml;
                // Count total site questions
                for (const section in masterConfig.site) {
                    siteQuestionCount += masterConfig.site[section].length;
                }
            }
            
            // Update tab counts
            updateQuestionCounts(managementQuestionCount, siteQuestionCount);
        } catch (error) {
            console.error('Error updating questions list:', error);
        }
    }
    
    // Update question counts in tab headers
    function updateQuestionCounts(managementCount, siteCount) {
        const managementCountElement = document.getElementById('managementQuestionsCount');
        const siteCountElement = document.getElementById('siteQuestionsCount');
        
        if (managementCountElement) {
            managementCountElement.textContent = `(${managementCount})`;
        }
        if (siteCountElement) {
            siteCountElement.textContent = `(${siteCount})`;
        }
    }
    
    // Render questions organized by sections with proper numbering
    function renderQuestionsWithSections(type, config) {
        let html = '';
        let sectionNumber = 1;
        let totalQuestions = 0;
        
        for (const section in config) {
            const questions = config[section];
            totalQuestions += questions.length;
            
            // Section header with number and controls
            html += `
                <div class="question-section-group">
                    <div class="section-header">
                        <div class="section-title">
                            <span class="section-number">${sectionNumber}.</span>
                            <span class="section-name">${formatSectionName(section)}</span>
                            <span class="section-count">(${questions.length} questions)</span>
                        </div>
                        <div class="section-actions">
                            <button class="btn btn-sm btn-green" onclick="addQuestionToSection('${type}', '${section}')">Add Question</button>
                            <button class="btn btn-sm btn-secondary" onclick="editSectionName('${type}', '${section}')">Edit Section</button>
                            <button class="btn btn-sm btn-danger" onclick="deleteSection('${type}', '${section}')">Delete Section</button>
                        </div>
                    </div>
                    
                    <div class="questions-in-section">
            `;
            
            // Questions within the section
            if (questions.length === 0) {
                html += '<div class="no-questions">No questions in this section. Click "Add Question" to add one.</div>';
            } else {
                questions.forEach((question, index) => {
                    const questionNumber = `${sectionNumber}.${index + 1}`;
                    html += `
                        <div class="question-item-detailed">
                            <div class="question-number">${questionNumber}</div>
                            <div class="question-content-full">
                                <div class="question-text-full">${question}</div>
                                <div class="question-meta-full">
                                    Section: ${formatSectionName(section)} • Position: ${index + 1} of ${questions.length}
                                </div>
                            </div>
                            <div class="question-actions-full">
                                <button class="btn btn-sm btn-secondary" onclick="editQuestion('${type}', '${section}', ${index})">
                                    <span>✏️</span> Edit
                                </button>
                                <button class="btn btn-sm btn-orange" onclick="moveQuestion('${type}', '${section}', ${index})">
                                    <span>↕️</span> Move
                                </button>
                                <button class="btn btn-sm btn-danger" onclick="deleteQuestion('${type}', '${section}', ${index})">
                                    <span>🗑️</span> Delete
                                </button>
                            </div>
                        </div>
                    `;
                });
            }
            
            html += `
                    </div>
                </div>
            `;
            
            sectionNumber++;
        }
        
        // Add section controls at the bottom
        html += `
            <div class="add-section-controls">
                <h4>Add New Section</h4>
                <div class="add-section-form">
                    <input type="text" id="new${type.charAt(0).toUpperCase() + type.slice(1)}SectionName" placeholder="Enter section name" class="section-name-input">
                    ${type === 'site' ? `
                        <div class="add-section-options">
                            <label class="checkbox-label">
                                <input type="checkbox" id="addTo${type.charAt(0).toUpperCase() + type.slice(1)}AllSites" checked>
                                <span>Add to all sites</span>
                            </label>
                            <select id="specific${type.charAt(0).toUpperCase() + type.slice(1)}Site" class="site-selector-small" style="display: none;">
                                <option value="">Select specific site</option>
                            </select>
                        </div>
                    ` : ''}
                    <button class="btn btn-green" onclick="addSectionWithOptions('${type}')">Add Section</button>
                    ${type === 'management' ? '<p class="help-text">Management sections will be added based on project selection during creation.</p>' : ''}
                </div>
            </div>
            
            <div class="questions-summary">
                <strong>Total: ${Object.keys(config).length} sections, ${totalQuestions} questions</strong>
            </div>
        `;
        
        if (totalQuestions === 0) {
            html = '<div style="text-align: center; color: #666; padding: 40px;">No questions found. Use "Load Default Template" to load questions or add sections manually.</div>';
        }
        
        return html;
    }
    
    // Format section name for display
    function formatSectionName(sectionName) {
        return sectionName
            .replace(/([A-Z])/g, ' $1')
            .trim()
            .replace(/^\w/, c => c.toUpperCase());
    }
    
    // Project management functions
    function switchToProject(projectName) {
        if (window.app && window.app.switchToProject) {
            window.app.switchToProject(projectName);
            updateProjectsList();
            updateSitesList();
            updateAllDashboardComponents();
        }
    }
    
    function editProjectName(projectName) {
        const newName = prompt('Enter new project name:', projectName);
        if (newName && newName !== projectName && window.app) {
            // Implementation would depend on the app's project management system
            alert('Project renaming functionality to be implemented');
        }
    }
    
    function deleteProject(projectName) {
        if (confirm(`Are you sure you want to delete project "${projectName}"? This action cannot be undone.`)) {
            // Implementation would depend on the app's project management system
            alert('Project deletion functionality to be implemented');
        }
    }
    
    // Site management functions
    function switchToSite(siteName) {
        if (window.app && window.app.getCurrentProject) {
            const project = window.app.getCurrentProject();
            if (project) {
                project.currentSite = siteName;
                if (window.app.saveData) window.app.saveData();
                updateSitesList();
                updateAllDashboardComponents();
            }
        }
    }
    
    function editSiteName(siteName) {
        const newName = prompt('Enter new site name:', siteName);
        if (newName && newName !== siteName && window.app) {
            const project = window.app.getCurrentProject();
            if (project && project.sites) {
                project.sites[newName] = project.sites[siteName];
                delete project.sites[siteName];
                if (project.currentSite === siteName) {
                    project.currentSite = newName;
                }
                if (window.app.saveData) window.app.saveData();
                updateSitesList();
                updateAllDashboardComponents();
            }
        }
    }
    
    function deleteSite(siteName) {
        if (confirm(`Are you sure you want to delete site "${siteName}"? This action cannot be undone.`)) {
            if (window.app) {
                const project = window.app.getCurrentProject();
                if (project && project.sites) {
                    delete project.sites[siteName];
                    // If this was the current site, switch to the first available site
                    if (project.currentSite === siteName) {
                        const remainingSites = Object.keys(project.sites);
                        project.currentSite = remainingSites.length > 0 ? remainingSites[0] : null;
                    }
                    if (window.app.saveData) window.app.saveData();
                    updateSitesList();
                    updateAllDashboardComponents();
                }
            }
        }
    }
    
    // Expose functions to global scope
    window.initializeUI = initializeUI;
    window.showTab = showTab;
    window.showScoringCategory = showScoringCategory;
    window.showQuestionType = showQuestionType;
    window.renderManagementTab = renderManagementTab;
    window.renderSitePerformanceTab = renderSitePerformanceTab;
    window.renderMasterConfigTab = renderMasterConfigTab;
    window.renderQuestionManagement = renderQuestionManagement;
    window.addSection = addSection;
    window.addQuestion = addQuestion;
    window.editQuestion = editQuestion;
    window.deleteQuestion = deleteQuestion;
    window.updateAllDashboardComponents = updateAllDashboardComponents;
    window.updateProjectSelector = updateProjectSelector;
    window.updateSiteSelector = updateSiteSelector;
    window.updateProjectsList = updateProjectsList;
    window.updateSitesList = updateSitesList;
    window.updateQuestionsList = updateQuestionsList;
    window.switchToProject = switchToProject;
    window.editProjectName = editProjectName;
    window.deleteProject = deleteProject;
    window.switchToSite = switchToSite;
    window.editSiteName = editSiteName;
    window.deleteSite = deleteSite;
    window.addQuestionToSection = addQuestionToSection;
    window.addSectionWithOptions = addSectionWithOptions;
    window.editSectionName = editSectionName;
    window.deleteSection = deleteSection;
    window.moveQuestion = moveQuestion;
    window.initializeQuestionsTabSwitching = initializeQuestionsTabSwitching;
    window.updateQuestionCounts = updateQuestionCounts;
})();