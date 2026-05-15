# REACH Platform - UI Design System

A comprehensive, modern, and accessible user interface design system for the REACH loan application platform serving Rwandan entrepreneurs.

## 🎯 Quick Start

### View the Design System

Open `index.html` in your browser to explore:
- **Design System Overview** - Color palette, typography, components
- **Links to all 5 modules** - Click any module to see interactive mockup

### File Structure

```
ui-design/
├── index.html                      # Main design system page
├── styles.css                      # Complete CSS design system
├── DESIGN_SYSTEM.md               # Full documentation
├── README.md                       # This file
└── pages/
    ├── identity-portal.html        # 🔐 Login & Registration
    ├── eligibility-dashboard.html  # 📊 Loan Qualification
    ├── real-time-tracker.html      # ⏱️ Application Status
    ├── narrative-form.html         # 📝 Business Description
    └── loan-purpose.html           # 💰 Loan Configuration
```

## 📱 The Five Modules

### 1. 🔐 Identity Portal
**File**: `pages/identity-portal.html`

A split-screen authentication interface with:
- Sign in and create account tabs
- Language toggle (English / Kinyarwanda)
- Business ID verification
- Social login options
- Bilingual support

**Key Features**:
- Professional hero message on left
- Intuitive form on right
- Mobile-responsive layout
- Clear error handling

### 2. 📊 Eligibility Dashboard
**File**: `pages/eligibility-dashboard.html`

Real-time loan qualification assessment showing:
- Eligible loan amount (primary metric)
- Eligibility score (%)
- Expected decision timeline
- Tax record verification status
- Detailed assessment breakdown
- Loan calculation transparency
- Next steps guidance

**Key Features**:
- Visual data hierarchy
- Status badges and indicators
- Breakdown of calculation methodology
- Color-coded information

### 3. ⏱️ Real-Time Tracker
**File**: `pages/real-time-tracker.html`

Live application status tracking with:
- Current status overview (4 key cards)
- Visual timeline of application stages
- Step-by-step progress indicator
- Animated active stage marker
- Expected timeline
- Support contact information
- Notification preferences

**Key Features**:
- Animated pulse on current step
- Clear stage descriptions and timings
- Application ID and metadata
- Reassuring "what's happening now" section

### 4. 📝 Early-Stage Narrative Form
**File**: `pages/narrative-form.html`

Comprehensive business description form for early-stage founders:
- About Your Business (name, type, stage)
- Market & Revenue (customer description, projections)
- Loan Purpose (detailed use explanation)
- Repayment Plan (confidence and risk assessment)
- Declaration & Agreement

**Key Features**:
- Multi-section organization
- Character counters on textareas
- Auto-save functionality
- Progress indicator
- Helpful hints and examples
- Bilingual form support

### 5. 💰 Loan Purpose Module
**File**: `pages/loan-purpose.html`

Detailed loan configuration and final review:
- **Step 1**: Amount selection (slider + quick buttons)
- **Step 2**: Loan purpose category selection
- **Step 3**: Repayment timeline selection
- **Step 4**: Final review & confirmation

**Key Features**:
- Interactive slider with real-time feedback
- Category cards for intuitive selection
- Estimated monthly payment display
- Comprehensive review summary
- Timeline explaining next steps

## 🎨 Design System Features

### Color Palette
- **Primary**: `#0066cc` (Trust, actions, verification)
- **Success**: `#00a86b` (Approved, verified)
- **Warning**: `#ff9800` (Pending, review needed)
- **Error**: `#d32f2f` (Errors, rejection)
- **Info**: `#00bcd4` (Help, information)

### Components Included
✓ Buttons (Primary, Secondary, Ghost)
✓ Form Inputs (Text, Email, Password, Number, Select, Textarea)
✓ Cards (Basic, Stat, Content)
✓ Badges & Status Indicators
✓ Progress Bars & Timelines
✓ Alerts & Messages
✓ Navigation (Header, Breadcrumbs)
✓ Modals & Overlays

### Responsive Design
- **Mobile**: 320px-767px (Single column, full-width)
- **Tablet**: 768px-1024px (Two columns, hybrid)
- **Desktop**: 1025px+ (Multi-column, complex layouts)

### Accessibility
✓ WCAG 2.1 AA Compliant
✓ Keyboard Navigation Support
✓ Screen Reader Ready
✓ High Color Contrast
✓ Clear Focus States
✓ Semantic HTML Structure

## 🚀 How to Use This Design System

### For Designers
1. Open `index.html` in browser
2. Review color palette and typography
3. Explore component library
4. Click module links to see full page mockups
5. Refer to `DESIGN_SYSTEM.md` for detailed specifications

### For Developers
1. Use `styles.css` as foundation (or convert to SCSS/CSS-in-JS)
2. CSS Variables defined for easy theming
3. Mobile-first approach—extend from mobile styles
4. All interactive mockups use vanilla HTML/CSS/JS
5. Ready to convert to React/Next.js components

### For Product Managers
1. Interactive mockups demonstrate user flows
2. Each module shows how data is presented
3. Forms show data collection strategy
4. Timeline modules show process transparency
5. Accessibility features ensure inclusive design

## 📋 Key Design Principles

1. **Mobile-First**: Designed for mobile, scales to desktop
2. **Accessible**: Keyboard navigation, screen readers, high contrast
3. **Professional**: Corporate aesthetic for financial institution
4. **Data-Driven**: Clear hierarchy for financial information
5. **Transparent**: Explains process at every stage
6. **User-Centric**: Every element serves a specific need

## 🔄 Application Flow

```
1. User Lands on Identity Portal
   ↓
2. Selects Path:
   ├─ Path A: Running Business → Eligibility Dashboard (RRA data)
   └─ Path B: Early-Stage → Narrative Form (business description)
   ↓
3. Either path continues to:
   Loan Purpose Module (configure amount & timeline)
   ↓
4. Submit Application
   ↓
5. Track Status in Real-Time Tracker
   (Verification → Assessment → Decision)
```

## 💡 Design Highlights

### Identity Portal
- **Split Layout**: Hero on left (desktop), form on right
- **Language Toggle**: Easy English/Kinyarwanda switching
- **Bilingual Forms**: All form fields support both languages

### Eligibility Dashboard
- **Transparency**: Shows calculation methodology
- **Status Cards**: Visual overview of application state
- **Next Steps**: Clear call-to-actions for progression

### Real-Time Tracker
- **Animated Progress**: Visual pulse on current stage
- **Timeline Format**: Clear before/after context
- **Reassurance**: "What's happening now" section
- **Support Info**: Easy access to help

### Narrative Form
- **Multi-Section**: Organized by business aspects
- **Character Feedback**: Real-time counters
- **Auto-Save**: Never lose progress
- **Bilingual**: Full English/Kinyarwanda support

### Loan Purpose Module
- **Interactive Slider**: Visual amount selection
- **Real-Time Calculation**: Monthly payments update instantly
- **Review Panel**: Summary before submission
- **Multi-Step**: Clear progression indicator

## 📐 Technical Specifications

### CSS Architecture
- **CSS Variables**: 60+ color/spacing/typography variables
- **Mobile-First**: All styles start mobile, enhance upward
- **No Framework**: Pure HTML/CSS/JS (easy to port)
- **Semantic HTML**: Proper structure for accessibility

### Browser Support
- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Android)

### Performance
- **Optimized CSS**: ~500 lines of lean CSS
- **No Dependencies**: Vanilla JS only
- **Fast Load**: No external stylesheets
- **Responsive**: No layout shifts

## 🎓 Design Decisions Explained

### Why Split-Screen for Identity Portal?
Creates visual hierarchy, hero message builds trust, form is clearly secondary focus.

### Why Category Cards for Loan Purpose?
Cards are more intuitive than dropdowns, visual icons help non-readers, supports bilingual labeling.

### Why Slider for Amount Selection?
Gives visual feedback, shows range/capacity, more engaging than text input, mobile-friendly.

### Why Timeline for Status Tracking?
Natural progression, clear before/after, shows what's completed vs. pending, builds confidence.

### Why Multiple Sections in Narrative Form?
Reduces cognitive load, lets user focus on one business aspect at a time, easier to revisit sections.

## 🔐 Security & Privacy Considerations

- No sensitive data hardcoded in mockups
- Forms don't actually submit data
- Placeholder credentials only
- Production implementation requires:
  - HTTPS encryption
  - Secure API endpoints
  - PCI/DSS compliance for financial data
  - GDPR/Local privacy compliance
  - Regular security audits

## 📞 Support

### For Questions About:
- **Design System**: See `DESIGN_SYSTEM.md`
- **Specific Module**: Open that module's HTML file
- **Components**: Check `index.html` for component showcase

## 🎉 Next Steps

This design system is ready for:
1. ✅ Design Review & Feedback
2. ✅ Stakeholder Presentation
3. ✅ User Testing
4. ✅ Development Implementation (React/Next.js)
5. ✅ API Integration (RRA, RDB, BRD)

## 📝 Version History

**v1.0** - May 2026
- Initial design system
- All 5 modules
- Complete documentation
- Responsive mockups

---

## 🏆 About REACH

REACH is a digital platform making loan applications simple, fast, and accessible for Rwandan entrepreneurs. By connecting directly to RRA and RDB APIs, REACH eliminates paperwork and enables verified, bias-free credit decisions.

**Mission**: No paperwork. No forged documents. No waiting. Just verified data.

---

**Created for**: Development Bank of Rwanda
**Platform**: Next.js (recommended)
**Design System Status**: Production Ready ✅

[View Design System](index.html) | [Full Documentation](DESIGN_SYSTEM.md)
