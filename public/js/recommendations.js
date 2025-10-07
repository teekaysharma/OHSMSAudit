// Recommendations Module
// Generates recommendations based on audit results

// Generate recommendations based on audit scores
function generateRecommendations() {
    try {
        const recommendations = [];
        const project = window.app.getCurrentProject();
        
        if (!project) {
            console.log('No project data available for recommendations');
            return recommendations;
        }

        // Analyze Management System Audit data
        if (project.managementSystemAudit) {
            for (const section in project.managementSystemAudit) {
                if (Array.isArray(project.managementSystemAudit[section])) {
                    const sectionData = project.managementSystemAudit[section];
                    const lowScoreItems = sectionData.filter(item => item.score <= 2 && item.score > 0);
                    
                    lowScoreItems.forEach(item => {
                        recommendations.push({
                            type: 'Management System',
                            section: formatSectionName(section),
                            priority: item.score === 1 ? 'High' : 'Medium',
                            issue: item.name || 'Audit item requires attention',
                            recommendation: getRecommendationForQuestion(item.name || '', item.score),
                            score: item.score,
                            comments: item.comments || ''
                        });
                    });
                }
            }
        }

        // Analyze Site Performance data
        if (project.sites && project.currentSite && project.sites[project.currentSite]) {
            const currentSite = project.sites[project.currentSite];
            
            for (const section in currentSite) {
                if (Array.isArray(currentSite[section])) {
                    const sectionData = currentSite[section];
                    const lowScoreItems = sectionData.filter(item => item.score <= 2 && item.score > 0);
                    
                    lowScoreItems.forEach(item => {
                        recommendations.push({
                            type: 'Site Performance',
                            site: project.currentSite,
                            section: formatSectionName(section),
                            priority: item.score === 1 ? 'High' : 'Medium',
                            issue: item.name || 'Site audit item requires attention',
                            recommendation: getRecommendationForQuestion(item.name || '', item.score),
                            score: item.score,
                            comments: item.comments || ''
                        });
                    });
                }
            }
        }

        // Sort by priority and score
        recommendations.sort((a, b) => {
            if (a.priority === 'High' && b.priority !== 'High') return -1;
            if (b.priority === 'High' && a.priority !== 'High') return 1;
            return a.score - b.score;
        });

        console.log('Generated recommendations:', recommendations);
        return recommendations;
        
    } catch (error) {
        console.error('Error generating recommendations:', error);
        return [];
    }
}

// Helper function to format section names
function formatSectionName(sectionName) {
    return sectionName
        .replace(/([A-Z])/g, ' $1')
        .trim()
        .replace(/^\w/, c => c.toUpperCase());
}

// Get specific recommendation based on question content and score
function getRecommendationForQuestion(questionText, score) {
    const lowerQuestion = questionText.toLowerCase();
    
    // Policy and documentation recommendations
    if (lowerQuestion.includes('policy') || lowerQuestion.includes('procedure')) {
        if (score === 1) {
            return 'Immediately develop and implement comprehensive policies and procedures. Ensure all staff are trained and documentation is easily accessible.';
        } else {
            return 'Review and update existing policies and procedures. Ensure they are current, comprehensive, and properly communicated to all staff.';
        }
    }
    
    // Training recommendations
    if (lowerQuestion.includes('training') || lowerQuestion.includes('competency')) {
        if (score === 1) {
            return 'Establish a comprehensive training program immediately. Document all training activities and ensure competency assessments are conducted.';
        } else {
            return 'Enhance existing training programs. Implement regular refresher training and improve competency assessment processes.';
        }
    }
    
    // Risk management recommendations
    if (lowerQuestion.includes('risk') || lowerQuestion.includes('hazard')) {
        if (score === 1) {
            return 'Implement a formal risk management system immediately. Conduct comprehensive risk assessments and establish control measures.';
        } else {
            return 'Improve risk identification and assessment processes. Ensure all identified risks have appropriate control measures in place.';
        }
    }
    
    // Incident management recommendations
    if (lowerQuestion.includes('incident') || lowerQuestion.includes('accident')) {
        if (score === 1) {
            return 'Establish formal incident reporting and investigation procedures immediately. Ensure all incidents are properly documented and investigated.';
        } else {
            return 'Enhance incident management processes. Improve investigation quality and ensure corrective actions are effectively implemented.';
        }
    }
    
    // Emergency preparedness recommendations
    if (lowerQuestion.includes('emergency') || lowerQuestion.includes('evacuation')) {
        if (score === 1) {
            return 'Develop comprehensive emergency response procedures immediately. Conduct regular drills and ensure all staff know their roles.';
        } else {
            return 'Review and update emergency procedures. Increase frequency of drills and improve emergency communication systems.';
        }
    }
    
    // PPE recommendations
    if (lowerQuestion.includes('ppe') || lowerQuestion.includes('personal protective')) {
        if (score === 1) {
            return 'Implement comprehensive PPE program immediately. Ensure proper selection, training, and maintenance of all PPE.';
        } else {
            return 'Improve PPE management processes. Enhance training on proper use and ensure regular inspection and replacement schedules.';
        }
    }
    
    // Generic recommendations based on score
    if (score === 1) {
        return 'This area requires immediate attention and significant improvement. Develop and implement comprehensive measures to address this critical issue.';
    } else {
        return 'This area needs improvement. Review current practices and implement enhanced measures to achieve better performance.';
    }
}

// Display recommendations in the UI
function displayRecommendations(recommendations) {
    const container = document.getElementById('recommendationsContent');
    if (!container) {
        console.warn('Recommendations container not found');
        return;
    }
    
    if (recommendations.length === 0) {
        container.innerHTML = '<p>No specific recommendations at this time. Continue monitoring and maintaining current standards.</p>';
        return;
    }
    
    let html = '<div class="recommendations-list">';
    
    recommendations.forEach((rec, index) => {
        const priorityClass = rec.priority.toLowerCase();
        html += `
            <div class="recommendation-item priority-${priorityClass}">
                <div class="recommendation-header">
                    <span class="recommendation-type">${rec.type}</span>
                    ${rec.site ? `<span class="recommendation-site">${rec.site}</span>` : ''}
                    <span class="recommendation-priority priority-${priorityClass}">${rec.priority} Priority</span>
                </div>
                <div class="recommendation-issue">
                    <strong>Issue:</strong> ${rec.issue}
                </div>
                <div class="recommendation-action">
                    <strong>Recommendation:</strong> ${rec.recommendation}
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    container.innerHTML = html;
}

// Generate action plan based on recommendations
function generateActionPlan(recommendations) {
    const actionPlan = {
        immediate: [],
        shortTerm: [],
        longTerm: []
    };
    
    recommendations.forEach(rec => {
        const action = {
            description: rec.recommendation,
            area: rec.type,
            site: rec.site || 'All Sites',
            priority: rec.priority
        };
        
        if (rec.priority === 'High') {
            actionPlan.immediate.push(action);
        } else if (rec.priority === 'Medium') {
            actionPlan.shortTerm.push(action);
        } else {
            actionPlan.longTerm.push(action);
        }
    });
    
    return actionPlan;
}

// Update recommendations display
function updateRecommendations() {
    try {
        console.log('Updating recommendations...');
        const recommendations = generateRecommendations();
        displayRecommendations(recommendations);
        
        // Store recommendations for editing
        if (window.app) {
            window.app.currentRecommendations = recommendations;
        }
        
    } catch (error) {
        console.error('Error updating recommendations:', error);
    }
}

// Generate sample recommendations for demonstration purposes
function generateSampleRecommendations() {
    return [
        {
            type: 'Management System',
            section: 'Safety Policy',
            priority: 'High',
            issue: 'Safety policy documentation is incomplete or outdated',
            recommendation: 'Immediately review and update safety policy documentation. Ensure all policies are current, comprehensive, and properly communicated to all staff members.',
            score: 1
        },
        {
            type: 'Site Performance',
            site: 'Default Site',
            section: 'Personal Protective Equipment',
            priority: 'Medium',
            issue: 'PPE inspection and maintenance procedures need improvement',
            recommendation: 'Enhance PPE management processes. Implement regular inspection schedules and ensure proper training on use and maintenance of all personal protective equipment.',
            score: 2
        },
        {
            type: 'Management System',
            section: 'Training And Competency',
            priority: 'Medium',
            issue: 'Training records and competency assessments require updating',
            recommendation: 'Establish comprehensive training record system. Implement regular competency assessments and ensure all training activities are properly documented.',
            score: 2
        }
    ];
}

// Initialize recommendations when page loads
function initializeRecommendations() {
    try {
        console.log('Initializing recommendations...');
        
        // Set up edit functionality
        setupRecommendationEditing();
        
        // Generate initial recommendations
        updateRecommendations();
        
    } catch (error) {
        console.error('Error initializing recommendations:', error);
    }
}

// Set up recommendation editing functionality
function setupRecommendationEditing() {
    const editBtn = document.getElementById('editRecommendationsBtn');
    const regenerateBtn = document.getElementById('regenerateRecommendationsBtn');
    const saveBtn = document.getElementById('saveRecommendationsBtn');
    const cancelBtn = document.getElementById('cancelEditRecommendationsBtn');
    const content = document.getElementById('recommendationsContent');
    
    if (editBtn) {
        editBtn.addEventListener('click', () => {
            if (content) {
                content.contentEditable = 'true';
                content.style.border = '2px dashed #667eea';
                content.focus();
                
                if (saveBtn) saveBtn.style.display = 'inline-block';
                if (cancelBtn) cancelBtn.style.display = 'inline-block';
            }
        });
    }
    
    if (regenerateBtn) {
        regenerateBtn.addEventListener('click', () => {
            updateRecommendations();
        });
    }
    
    const sampleBtn = document.getElementById('showSampleRecommendationsBtn');
    if (sampleBtn) {
        sampleBtn.addEventListener('click', () => {
            const sampleRecommendations = generateSampleRecommendations();
            displayRecommendations(sampleRecommendations);
        });
    }
    
    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            if (content) {
                content.contentEditable = 'false';
                content.style.border = '1px solid #ddd';
                
                // Store custom recommendations
                if (window.app) {
                    window.app.customRecommendations = content.innerHTML;
                }
                
                saveBtn.style.display = 'none';
                if (cancelBtn) cancelBtn.style.display = 'none';
            }
        });
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            if (content) {
                content.contentEditable = 'false';
                content.style.border = '1px solid #ddd';
                
                // Restore original recommendations
                updateRecommendations();
                
                saveBtn.style.display = 'none';
                cancelBtn.style.display = 'none';
            }
        });
    }
}

// Export functions for use in other modules
window.recommendations = {
    generateRecommendations,
    displayRecommendations,
    generateActionPlan,
    updateRecommendations,
    initializeRecommendations
};