# Freshers Recruitment Portal

A comprehensive web application for managing and reviewing student profiles for recruitment purposes. Built with Express.js, MongoDB, and EJS, this portal allows recruiters to efficiently search, filter, and manage student records.

---

##  Features

###  Student Profile Management
- **Create** student records with comprehensive information
- **Read** detailed student profiles with all information displayed beautifully
- **Update** student profiles with new skills, certifications, and achievements
- **Delete** student records with confirmation dialogs

###  Advanced Search & Filtering
- **Real-time search** by name, college, course, or skills
- **Filter by college** - view students from specific institutions
- **Filter by course** - narrow down by academic program
- **Filter by CGPA range** - find top performers or specific grade brackets
- **Sort capabilities** - by name, CGPA, or college

###  Dashboard Analytics
- Total student count display
- Filtered results counter
- Unique colleges and courses tracker
- Active filter tags with individual remove options

###  Resume Management
- **Interactive Resume Preview** - view formatted student resume
- **Save as PDF** - download student resume in PDF format
- **Responsive Resume Template** - professional layout with sections for:
  - Career Objective
  - Education Details
  - Technical Skills (categorized)
  - Certifications
  - Activities & Achievements
  - Professional Profiles (GitHub, LinkedIn)

###  Student Profile Sections
- **Personal Information** - name, email, phone, date of birth
- **Academic Details** - college, course, CGPA
- **Technical Skills** - organized by category:
  - Programming Languages
  - Databases
  - Frameworks
  - Frontend Technologies
  - Backend Technologies
  - Tools & DevOps
- **Career Objective** - career goals and aspirations
- **Certifications** - professional certifications
- **Professional Links** - GitHub, LinkedIn, portfolio links
- **Activities & Achievements** - extracurricular activities

###  UI/UX Features
- **Responsive Design** - works seamlessly on desktop, tablet, and mobile
- **Dark-themed Dashboard** - professional and modern look
- **Card-based Layout** - clean organization of student information
- **Smooth Animations** - engaging loading and transition effects
- **Interactive Filter Tags** - easily remove individual filters
- **Empty State Messaging** - helpful guidance when no results found

---

##  Tech Stack

| Category | Technology |
|----------|-----------|
| **Frontend** | HTML5, CSS3, JavaScript (Vanilla) |
| **Backend** | Express.js (Node.js) |
| **Database** | MongoDB |
| **Templating** | EJS (Embedded JavaScript) |
| **PDF Generation** | html2pdf.js (Client-side) |
| **Server Management** | Nodemon (Development) |
| **Unique IDs** | UUID v4 |

---

##  Installation

### Prerequisites
- **Node.js** (v14 or higher)
- **npm** (v6 or higher)
- **MongoDB** (running locally on `mongodb://localhost:27017`)

### Steps

1. **Clone or navigate to the project directory:**
   ```bash
   cd skill
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Ensure MongoDB is running:**
   - On Windows (if installed as service): MongoDB should start automatically
   - Or run manually:
     ```bash
     mongod
     ```

4. **Start the development server:**
   ```bash
   npm start
   ```
   
   Or with auto-reload (if nodemon is installed):
   ```bash
   nodemon server.js
   ```

5. **Access the application:**
   - Open your browser and navigate to: `http://localhost:3000`

---

##  Project Structure

```
skill/
├── server.js              # Main Express server & MongoDB schema
├── package.json           # Project dependencies
├── README.md              # This file
├── public/
│   ├── style.css          # Global styles (if added)
│   └── uploads/           # Upload directory for student files
├── views/
│   ├── index.ejs          # Dashboard - list all students
│   ├── new.ejs            # Create new student profile form
│   ├── show.ejs           # View individual student profile + resume
│   └── edit.ejs           # Edit student profile form
└── node_modules/          # Dependencies (auto-generated)
```

---

##  Database Schema

### Student Collection

```javascript
{
  uuid: String (unique),           // Auto-generated UUID
  name: String (required),         // Full name
  email: String (required),        // Email address
  phone: String (required),        // Contact number
  college: String (required),      // Institution name
  course: String (required),       // Degree/Program
  rollno: String (required),       // Roll number
  cgpa: Number (required),         // Grade point average
  Dob: Date (required),            // Date of birth
  Aim: String (required),          // Career objective
  skills: {
    ProgrammingLanguages: [String],
    DataBase: [String],
    FrameWorks: [String],
    Frontend: [String],
    Backend: [String],
    Tools: [String]
  },
  certifications: [String],        // List of certifications
  codingProfiles: {
    github: String,
    linkedIn: String
  },
  otherLinks: [{                   // Additional links
    title: String,
    url: String
  }],
  other_activities: [String],      // Achievements & activities
  createdAt: Date (default: now)   // Record creation timestamp
}
```

---

##  API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| **GET** | `/` | Dashboard - list all students |
| **GET** | `/students/new` | Show create student form |
| **POST** | `/students` | Create new student record |
| **GET** | `/students/:uuid` | View student profile & resume |
| **GET** | `/students/:uuid/edit` | Show edit student form |
| **POST** | `/students/:uuid` | Update student record |
| **POST** | `/students/:uuid/delete` | Delete student record |

---

## 👥 How to Use

### Creating a Student Record
1. Click **" Upload Student Records"** button on dashboard
2. Fill in all required fields:
   - Personal information (name, email, phone, DOB)
   - Academic details (college, course, CGPA)
   - Skills (select from categories)
   - Career objective
3. Click **"Create Profile"** to save

### Viewing Student Details
1. Click **"👁 View Details"** on any student card
2. View:
   - Complete profile information
   - Resume preview (right side)
   - All skills and certifications
   - Professional links
3. Use **" Save PDF"** to download resume

### Editing a Profile
1. Click **"✏ Edit"** on student card or details page
2. Modify any field
3. Click **"Update Profile"** to save changes

### Searching & Filtering
1. Use **search bar** to find by name, college, course, or skills
2. Use **dropdowns** to filter by:
   - College
   - Course
   - CGPA range
3. Use **Sort By** to organize results
4. Click **"Clear All Filters"** to reset

### Deleting Records
1. Click **"🗑 Delete"** on student card
2. Confirm the deletion (shows student name)
3. Record is permanently removed

---

##  Data Validation

- **UUID**: Auto-generated for each student (unique identifier)
- **Name, Email, Phone**: Required fields with format validation
- **CGPA**: Numeric field (0-10 scale)
- **Date of Birth**: Date picker format
- **Skills**: Comma-separated input, converted to arrays
- **Certifications & Activities**: Comma-separated input, converted to arrays

---

##  Features Breakdown

### Dashboard (index.ejs)
- Displays all student records in card format
- Real-time search across multiple fields
- Multi-filter capability with active filter tags
- Statistics bar showing totals
- Animations on filter and sort
- Empty state message when no results

### Student Profile (show.ejs)
- Left panel: Detailed profile information
- Right panel: Professional resume preview
- Two-column responsive layout
- PDF download functionality
- Link previews for GitHub/LinkedIn
- Formatted contact information

### Forms (new.ejs & edit.ejs)
- Comprehensive form with step-by-step sections
- Skill category inputs (databases, languages, frameworks)
- Link management (GitHub, LinkedIn, custom links)
- Textarea for career objective
- Date picker for DOB
- Form validation and error handling

---

##  Performance Features

- **Client-side filtering** - instant results without page reload
- **Lazy animations** - smooth transitions for visual feedback
- **Optimized queries** - efficient MongoDB operations
- **UUID indexing** - fast student lookup
- **CSS Grid/Flexbox** - responsive layout without heavy libraries

---

##  Customization

### Colors
Edit CSS variables in view files:
```css
--primary-color: #2c3e50;
--secondary-color: #3498db;
--accent-color: #e74c3c;
--success-color: #27ae60;
```

### PDF Export Settings
Modify in `show.ejs`:
```javascript
const opt = {
    margin: 0.5,
    filename: '<studentname>_Resume.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
};
```

---

##  Troubleshooting

### MongoDB Connection Error
```
Error: Mongo DB not connected
```
**Solution**: Ensure MongoDB is running on `localhost:27017`

### Form Validation Errors
- Ensure all required fields (marked with *) are filled
- Check date format (use date picker)
- Skills should be comma-separated values

### PDF Download Not Working
- Check if html2pdf CDN is loaded (browser console)
- Ensure resume container is not hidden
- Try different browser if issues persist

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::3000
```
**Solution**: Change port in server.js or kill process using port 3000

---

##  Future Enhancements

- [ ] User authentication & authorization
- [ ] Bulk student import (CSV/Excel)
- [ ] Advanced analytics dashboard
- [ ] Email notifications
- [ ] Resume template customization
- [ ] Interview scheduling integration
- [ ] Skill matching algorithm
- [ ] Job position matching

---

##  License

ISC

---

##  Author

Created as a Freshers Recruitment Management System

---

##  Support

For issues or questions, check the console for detailed error messages and ensure all dependencies are properly installed.

---

**Version**: 1.0.0  
**Last Updated**: February 2026
