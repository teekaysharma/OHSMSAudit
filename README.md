# OHS Management System & Site Audit Tool

A comprehensive web-based Occupational Health & Safety (OHS) audit application designed for construction and industrial projects. This tool enables organizations to conduct systematic safety audits, track performance metrics, and generate professional reports for compliance and continuous improvement.

## 🏗️ Overview

The OHS Audit Tool provides a dual-audit approach combining **Management System Audits** (project-wide) and **Site Performance Audits** (site-specific) with real-time analytics, automated recommendations, and comprehensive reporting capabilities.

### ✨ Key Features

#### 📊 Dashboard & Analytics
- **Real-time Performance Dashboard** with interactive charts
- **Multi-scope Analytics** (Current Site, Management Only, All Sites, Project Overview)
- **Performance Rating System** (Excellent, Good, Satisfactory, Low, Unacceptable)
- **Executive Summary** with automated insights
- **Audit Status Indicators** for progress tracking

#### 🏢 Management System Audit (Project-wide)
- Health & Safety Policy compliance tracking
- Project responsibilities and accountability assessment
- Health & Safety Plans and documentation review
- Scoring system with detailed comments
- Best practices and non-conformance classification

#### 🏭 Site Performance Audit (Site-specific)
- Permits & regulatory compliance (UAE/ADOSH)
- Site preparation & temporary works safety
- Excavation & civil works safety
- Individual site scoring and tracking
- Site-specific recommendations

#### 📈 Advanced Reporting
- **Customizable Report Generation** with multiple output formats
- **Professional PDF Reports** with company branding
- **Site Comparison Analytics** with multiple chart types
- **Data Export/Import** functionality
- **Template Management** for audit configurations

#### 🔧 Project & Site Management
- **Multi-project Support** with project cloning capabilities
- **Dynamic Site Management** with CSV import
- **Template System** for audit questions
- **Configuration Export/Import** for standardization

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn** package manager
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ohs-audit-tool
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open in browser**
   - Navigate to `http://localhost:5173`
   - The application will automatically load with default templates

## 🛠️ Development Setup

### Project Structure

```
/
├── index.html              # Main HTML entry point
├── main.js                 # Application entry point & module loader
├── style.css               # Base Vite styles
├── styles.css              # Application-specific styles
├── package.json            # Dependencies and scripts
├── vite.config.js          # Vite configuration (if present)
└── public/
    ├── css/
    │   └── styles.css      # Main application styles
    └── js/                 # JavaScript modules
        ├── dataManagement.js      # Data persistence & templates
        ├── uiManagement.js        # UI rendering & interactions
        ├── projectManagement.js   # Project & site management
        ├── chartManagement.js     # Chart.js integration
        ├── recommendations.js     # Automated recommendations
        ├── reportGeneration.js    # Report generation
        ├── utils.js               # Utility functions
        └── comparison-chart-extension.js  # Site comparison charts
```

### Technology Stack

- **Build Tool**: Vite 5.4.2
- **Frontend**: Vanilla JavaScript (ES6 Modules)
- **Charts**: Chart.js 3.7.1
- **Styling**: CSS3 with CSS Grid & Flexbox
- **Data Storage**: Browser localStorage
- **Module System**: ES6 imports/exports

### Development Workflow

1. **Start development server**
   ```bash
   npm run dev
   ```

2. **Build for production**
   ```bash
   npm run build
   ```

3. **Preview production build**
   ```bash
   npm run preview
   ```

### Code Architecture

#### Modular Design
- **main.js**: Entry point that imports all modules and initializes the application
- **dataManagement.js**: Handles data persistence, templates, import/export
- **uiManagement.js**: Manages tab navigation, form rendering, and user interactions  
- **chartManagement.js**: Chart.js integration with scope-based filtering
- **projectManagement.js**: Project/site CRUD operations and data calculations
- **recommendations.js**: Automated recommendation generation
- **reportGeneration.js**: PDF report creation and formatting

#### Data Structure
```javascript
app = {
    masterConfig: {
        management: {
            "Section Name": ["Question 1", "Question 2", ...]
        },
        site: {
            "Section Name": ["Question 1", "Question 2", ...]  
        }
    },
    inspectionData: {
        projects: {
            "Project Name": {
                managementSystemAudit: {
                    "Section": [
                        { name: "Question", score: 0-5, comment: "..." }
                    ]
                },
                sites: {
                    "Site Name": {
                        "Section": [
                            { name: "Question", score: 0-5, comment: "..." }
                        ]
                    }
                },
                currentSite: "Site Name"
            }
        },
        currentProject: "Project Name"
    }
}
```

### Scoring System API

#### Score Values
- **0**: Not Applicable/Not Observed
- **1**: Major Non-Conformance (Critical issues)
- **2**: Minor Non-Conformance (Requires corrective action)
- **3**: Observation/Improvement Opportunity
- **4**: Conformance (Meets requirements)
- **5**: Best Practice (Exceeds requirements)

#### Rating Calculation
```javascript
// Performance ratings based on percentage
percentage > 90: "Excellent"
percentage > 80: "Good" 
percentage > 70: "Satisfactory"
percentage > 50: "Low"
percentage ≤ 50: "Unacceptable"

// Calculation excludes score 0 (Not Applicable)
averageScore = totalScore / ratedItemsCount
percentage = (averageScore / 5) * 100
```

## 📚 User Guide

### Getting Started

#### 1. Initial Setup
1. **Access the application** in your web browser
2. **Load Default Template**: Click "System Settings" → "Load Default Template"
3. **Create Project**: Use the project selector to create your first project
4. **Add Sites**: Navigate to "System Settings" → "Site Management" to add sites

#### 2. Conducting Audits

##### Management System Audit
1. Navigate to **"Management System"** tab
2. Complete scoring for each audit element:
   - Select appropriate score (0-5) from dropdown
   - Add detailed comments for observations
   - Focus on policy, responsibilities, and documentation
3. Scores are automatically saved and calculated

##### Site Performance Audit  
1. Navigate to **"Site Performance"** tab
2. Ensure correct site is selected in header
3. Complete scoring for each site element:
   - Permits & regulatory compliance
   - Site preparation & safety measures
   - Excavation & civil works safety
4. Add site-specific comments and observations

#### 3. Dashboard Analytics

##### Performance Overview
- **Overall Score**: Weighted average across all rated items
- **Performance Rating**: Automatic classification based on percentage
- **Items Inspected**: Count of completed vs. total audit items
- **Audit Status**: Visual indicators for audit completion

##### Chart Scopes
- **Current Site**: Shows selected site + management data
- **Management Only**: Management system audit results
- **All Sites**: Aggregated data from all project sites  
- **Project Overview**: Complete project performance (management + all sites)

##### Chart Types
- **Performance by Rating**: Pie chart showing distribution of ratings
- **Score Distribution**: Bar chart of score frequencies
- **Performance by Type/Sections**: Comparative analysis

### Advanced Features

#### 4. Report Generation

##### Customization Options
1. Navigate to **"Reports"** tab
2. Configure report sections:
   - Include/exclude best practices
   - Include/exclude non-conformances  
   - Include/exclude recommendations
   - Select chart types for inclusion
3. Configure report header:
   - Company name and logo
   - Report title and subtitle
   - Project details

##### Report Types
- **Executive Report**: Summary with key metrics and recommendations
- **Detailed Report**: Comprehensive analysis with all sections
- **Site Comparison**: Multi-site performance analysis

##### Output Formats
- **HTML Export**: For web viewing and sharing
- **PDF Print**: Professional print-ready format
- **Data Export**: JSON format for backup/transfer

#### 5. Data Management

##### Templates
- **Default Template**: Pre-configured audit questions for common scenarios
- **Custom Templates**: Save and load organization-specific configurations
- **Template Import/Export**: Share configurations across teams

##### Project Management
- **Project Creation**: Set up new audit projects
- **Project Cloning**: Duplicate existing project structures  
- **Site Management**: Add individual or bulk sites via CSV
- **Data Import/Export**: Complete audit data backup and restore

##### Configuration Management
- **Question Management**: Add, edit, delete audit questions
- **Section Management**: Organize questions into logical groups
- **Master Configuration**: Control audit structure and content

### Best Practices

#### 6. Audit Workflow Recommendations

1. **Preparation Phase**
   - Load appropriate template for your industry/region
   - Configure project and site details
   - Review audit questions for applicability

2. **Execution Phase**
   - Conduct management audit first (project-wide baseline)
   - Complete site audits systematically
   - Use detailed comments for all non-conformances
   - Take photos/evidence (store externally, reference in comments)

3. **Analysis Phase**
   - Review dashboard analytics for trends
   - Use site comparison features for benchmarking
   - Generate executive reports for management review

4. **Follow-up Phase**
   - Export audit data for records management
   - Use recommendations for corrective action planning
   - Schedule follow-up audits using project cloning

## 🌐 Deployment

### Production Build

1. **Create production build**
   ```bash
   npm run build
   ```

2. **Deploy files**
   - Upload `dist/` folder contents to web server
   - Ensure proper MIME types for `.js` and `.css` files
   - Configure server for SPA routing (optional)

### Deployment Options

#### Static Hosting (Recommended)
- **Netlify**: Drag and drop `dist/` folder
- **Vercel**: Connect GitHub repository for auto-deployment
- **GitHub Pages**: Deploy from `gh-pages` branch
- **AWS S3 + CloudFront**: Static website hosting

#### Self-Hosted
- **Apache/Nginx**: Standard web server deployment
- **Docker**: Containerized deployment with nginx
- **Node.js Server**: Express.js static file serving

#### Docker Deployment
```dockerfile
FROM nginx:alpine
COPY dist/ /usr/share/nginx/html/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```bash
docker build -t ohs-audit-tool .
docker run -p 80:80 ohs-audit-tool
```

### Environment Configuration

#### Production Considerations
- **Browser Compatibility**: Modern browsers with ES6 support required
- **Local Storage**: ~5-10MB storage per project (browser-dependent)
- **Performance**: Client-side only, no server requirements
- **Security**: No sensitive data transmission (local storage only)

#### URL Configuration
```javascript
// vite.config.js (if needed)
export default {
  base: '/ohs-audit/', // For subdirectory deployment
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
}
```

## 🔧 Configuration

### Default Template Structure

The application includes a comprehensive default template covering:

#### Management System Sections
- **Health and Safety Policy**
- **Project Health and Safety Responsibilities** 
- **Project Health and Safety Plans and Documentation**

#### Site Performance Sections  
- **Permits & Regulatory Compliance (UAE/ADOSH)**
- **Site Preparation & Temporary Works Safety**
- **Excavation & Civil Works Safety**

### Customization Options

#### Adding Custom Questions
1. Navigate to "System Settings" → "Question Management"
2. Select Management or Site questions tab
3. Click "Add Question" within desired section
4. Questions automatically propagate to all projects/sites

#### Creating Custom Templates
1. Configure audit questions as needed
2. Navigate to "System Settings"  
3. Click "Save Custom Template"
4. Export for sharing across teams/projects

#### Branding Customization
- **Logo Upload**: Support for PNG, JPG, SVG formats
- **Company Information**: Custom headers and footers
- **Color Schemes**: Modify CSS variables for brand colors
- **Report Templates**: Customize report layout and styling

## 📊 Data Schema

### Storage Format
```javascript
{
  "masterConfig": {
    "management": {
      "section_name": ["question1", "question2", ...]
    },
    "site": {
      "section_name": ["question1", "question2", ...]
    }
  },
  "inspectionData": {
    "projects": {
      "project_name": {
        "managementSystemAudit": {
          "section_name": [
            {
              "name": "question_text",
              "score": 0-5,
              "comment": "detailed_comment"
            }
          ]
        },
        "sites": {
          "site_name": {
            "section_name": [
              {
                "name": "question_text", 
                "score": 0-5,
                "comment": "detailed_comment"
              }
            ]
          }
        },
        "currentSite": "site_name",
        "leadAuditor": "auditor_name",
        "projectDirector": "director_name"
      }
    },
    "currentProject": "project_name",
    "version": "1.0.1"
  }
}
```

## 🤝 Contributing

### Development Guidelines

1. **Code Style**
   - Use ES6+ features and modules
   - Follow consistent naming conventions
   - Add comprehensive comments for complex functions
   - Maintain modular architecture

2. **Testing**
   - Test across multiple browsers
   - Verify localStorage functionality
   - Validate chart rendering with various data sets
   - Test import/export functionality

3. **Documentation**
   - Update README for new features
   - Document API changes
   - Provide usage examples
   - Maintain changelog

### Feature Requests

Priority areas for enhancement:
- Multi-language support
- Advanced reporting templates
- Integration with external systems
- Mobile/tablet optimization
- Offline functionality
- User authentication
- Cloud storage integration

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For technical support or questions:
- Create an issue in the repository
- Review existing documentation
- Check browser console for error messages
- Verify browser compatibility requirements

---

**Version**: 2.3  
**Last Updated**: 2025  
**Compatibility**: Modern browsers with ES6 support  
**Dependencies**: Vite ^5.4.2, Chart.js ^3.7.1
