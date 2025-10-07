// Utility functions

// DOM helper functions
const domHelpers = {
    // Check if element exists
    elementExists(id) {
        try {
            return document.getElementById(id) !== null;
        } catch (error) {
            console.error(`Error checking if element "${id}" exists:`, error);
            return false;
        }
    },
    
    // Get element safely
    getElement(id) {
        try {
            return document.getElementById(id);
        } catch (error) {
            console.error(`Error getting element "${id}":`, error);
            return null;
        }
    },
    
    // Add event listener safely
    addEventListener(elementId, eventType, handler) {
        try {
            const element = document.getElementById(elementId);
            if (element) {
                element.addEventListener(eventType, handler);
                return true;
            }
            console.warn(`Element with id "${elementId}" not found`);
            return false;
        } catch (error) {
            console.error(`Error adding event listener to element "${elementId}":`, error);
            return false;
        }
    },
    
    // Create element safely
    createElement(tagName, attributes = {}, content = '') {
        try {
            const element = document.createElement(tagName);
            
            // Set attributes
            for (const attr in attributes) {
                if (attr === 'className') {
                    element.className = attributes[attr];
                } else if (attr === 'innerHTML') {
                    element.innerHTML = attributes[attr];
                } else {
                    element.setAttribute(attr, attributes[attr]);
                }
            }
            
            // Set content if provided
            if (content) {
                element.textContent = content;
            }
            
            return element;
        } catch (error) {
            console.error(`Error creating element "${tagName}":`, error);
            return null;
        }
    }
};

// Add this helper function to create score dropdowns
function createScoreDropdown(selectedValue = '') {
    const scoreOptions = [
        { value: '0', text: '0 - Not Applicable/Not Observed: Item does not apply or was not observed during audit' },
        { value: '1', text: '1 - Major Non-Conformance: Serious deficiency requiring immediate corrective action' },
        { value: '2', text: '2 - Minor Non-Conformance: Deficiency requiring corrective action in specified timeframe' },
        { value: '3', text: '3 - Observation/Improvement Opportunity: Area for improvement but not a non-conformance' },
        { value: '4', text: '4 - Conformance: Meets requirements' },
        { value: '5', text: '5 - Best Practice: Exceeds requirements and demonstrates excellence' }
    ];
    
    const select = document.createElement('select');
    select.className = 'score-select';
    
    scoreOptions.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option.value;
        optionElement.textContent = option.text;
        if (option.value === selectedValue) {
            optionElement.selected = true;
        }
        select.appendChild(optionElement);
    });
    
    return select;
}

// Expose functions to global scope
window.domHelpers = domHelpers;
window.createScoreDropdown = createScoreDropdown;