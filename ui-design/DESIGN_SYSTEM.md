# REACH Platform - UI Design System Documentation

## Overview

The REACH platform is a modern, professional, user-friendly, and mobile-first digital loan application system designed for Rwandan entrepreneurs. This design system establishes a unified visual language across all modules while maintaining accessibility and clarity.

---

## Design Philosophy

### Core Principles

1. **Mobile-First**: All interfaces are designed for mobile (320px+) and scale responsively
2. **Accessibility**: WCAG 2.1 AA compliance with keyboard navigation and screen reader support
3. **Professional**: Clean, corporate aesthetic suitable for financial institutions
4. **Data-Driven**: Clear visual hierarchy for presenting financial and business data
5. **Trust**: Simple, intuitive design that builds confidence in the application process
6. **Transparency**: Clear explanations of what happens at each stage
7. **User-Centric**: Every UI element serves a specific user need

---

## Design Tokens

### Color Palette

#### Primary Colors
- **Primary Blue**: `#0066cc` - Main action color, trust, and brand identity
- **Primary Dark Blue**: `#004499` - Hover states and emphasis
- **Primary Light Blue**: `#e6f0ff` - Backgrounds and highlights

#### Semantic Colors
- **Success Green**: `#00a86b` - Approved, verified, complete status
- **Warning Orange**: `#ff9800` - Pending, attention needed
- **Error Red**: `#d32f2f` - Errors, rejection, warnings
- **Info Cyan**: `#00bcd4` - Information messages, help text

#### Neutral Colors
- **Text Primary**: `#1a202c` - Main text content
- **Text Secondary**: `#4a5568` - Secondary text, descriptions
- **Text Tertiary**: `#718096` - Disabled, placeholder text
- **Background Primary**: `#ffffff` - Main content background
- **Background Secondary**: `#f5f7fa` - Section backgrounds, cards
- **Background Tertiary**: `#ecf0f4` - Hover states, subtle backgrounds
- **Border Light**: `#e2e8f0` - Subtle borders
- **Border Standard**: `#cbd5e0` - Component borders

### Typography

#### Font Family
System fonts for optimal performance:
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
```

#### Font Sizes
- **XS**: 0.75rem (12px) - Labels, hints
- **SM**: 0.875rem (14px) - Secondary content, badges
- **Base**: 1rem (16px) - Body text, input fields
- **LG**: 1.125rem (18px) - Section titles
- **XL**: 1.25rem (20px) - Subheadings
- **2XL**: 1.5rem (24px) - Page titles
- **3XL**: 1.875rem (30px) - Main headings

#### Font Weights
- **Regular**: 400 - Body text
- **Medium**: 500 - Input labels, small emphasis
- **Semibold**: 600 - Section titles, card headers
- **Bold**: 700 - Main headings, strong emphasis

### Spacing System (8px Base Unit)

- **XS**: 2px
- **SM**: 4px
- **MD**: 8px (1 unit)
- **LG**: 12px (1.5 units)
- **XL**: 16px (2 units)
- **2XL**: 24px (3 units)
- **3XL**: 32px (4 units)

### Border Radius

- **SM**: 2px - Small elements
- **MD**: 4px - Form inputs
- **LG**: 8px - Cards, buttons
- **XL**: 12px - Large containers
- **FULL**: 9999px - Circles, badges

### Shadows

- **SM**: `0 1px 2px rgba(0,0,0,0.05)`
- **MD**: `0 4px 6px rgba(0,0,0,0.1)`
- **LG**: `0 10px 15px rgba(0,0,0,0.1)`
- **XL**: `0 20px 25px rgba(0,0,0,0.1)`

---

## Component Library

### Buttons

#### Primary Button
- Used for main actions (submit, continue, apply)
- Background: Primary Blue
- Hover: Primary Dark Blue
- State: Active, Hover, Disabled

#### Secondary Button
- Used for alternative actions (cancel, back, optional actions)
- Background: Light background
- Border: Standard border
- Hover: Tertiary background

#### Ghost Button
- Used for tertiary actions or links
- No background, no border
- Text color: Primary Blue
- Hover: Light blue background

#### Sizes
- **Small**: 8px 12px (button height 40px)
- **Medium**: 12px 16px (button height 44px, default)
- **Large**: 16px 24px (button height 48px)

### Form Elements

#### Input Field
- Single-line text input
- Border: Standard 1px border
- Focus: Blue border + light blue shadow
- Placeholder: Tertiary text color
- Height: 44px (min-touch target)

#### Textarea
- Multi-line text input
- Default height: 120px
- Same border and focus styling as input
- Character counter displayed below

#### Select/Dropdown
- Native select element styled
- Consistent with input fields
- Focus states match input behavior

#### Form Groups
- Label: Medium weight, primary text
- Required indicator: Red asterisk
- Hint text: Tertiary text, smaller font
- Spacing: 8px between label and field

#### Validation
- Error state: Red border + red text
- Success state: Green border + green checkmark
- Info state: Blue border + info text

### Cards

#### Basic Card
- Background: White
- Border: 1px light border
- Border-radius: 8px
- Padding: 16px
- Box-shadow: Small shadow
- Hover: Medium shadow + slight lift

#### Stat Card
- Compact card displaying key metrics
- Large number (24px, bold, primary blue)
- Small label (12px, secondary text)
- Text-aligned center
- Can be highlighted (light blue background, primary border)

#### Content Card
- Full-width card with sections
- Header: Title with bottom border
- Body: Main content
- Footer: Optional action buttons with top border

### Badges & Status Indicators

#### Badges
- Pill-shaped label (12px font, uppercase)
- Available states: Success, Warning, Error, Info, Primary
- Padding: 2px 8px
- Border-radius: 9999px (full)

#### Status Display
- Color-coded circle or icon
- Text label describing status
- Used in list items and summary cards

### Progress Indicators

#### Progress Bar
- Width: 100%
- Height: 8px
- Background: Tertiary background
- Fill: Primary blue
- Border-radius: Full

#### Timeline
- Vertical list of steps
- Circular markers: 40px diameter
- States: Completed (green), Active (blue with pulse), Pending (gray)
- Connected by vertical line on left
- Content area: Title, description, timestamp

### Alerts & Messages

#### Alert Box
- Full-width message container
- Background: Semantic color (light)
- Left border: 4px solid semantic color
- Padding: 12px 16px
- Available variants: Success, Warning, Error, Info

#### Info Box
- Light background (info color)
- Used for helpful information
- Icon + text layout
- Subtle styling, not intrusive

### Navigation

#### Header/Navbar
- Sticky top, white background
- Dark bottom border
- Logo on left
- Navigation menu in center (desktop)
- User menu on right
- Mobile: Hamburger menu (implementation detail)

#### Breadcrumb/Back Link
- Linked text with arrow icon
- Primary blue color
- Used for navigation hierarchy

---

## Module Descriptions

### 1. Identity Portal
**Purpose**: User authentication and registration
**Key Features**:
- Split layout (hero on left, form on right)
- Tab interface: Sign In / Create Account
- Language toggle: English / Kinyarwanda
- Social login options (Google, LinkedIn)
- Form validation with helpful hints
- Password strength indicator
- Remember me checkbox

**UI Patterns**:
- Large form fields (44px minimum)
- Clear error messaging
- Link to forgotten password recovery
- Prominent call-to-action button

### 2. Eligibility Dashboard
**Purpose**: Display loan qualification and eligibility assessment
**Key Features**:
- Hero header with user info and welcome message
- Key metrics cards showing:
  - Eligible loan amount (highlighted)
  - Eligibility score (percentage)
  - Expected decision time
  - Tax verification status
- Detailed assessment breakdown
- Loan calculation transparency
- Next steps section with actionable items
- Business details grid

**UI Patterns**:
- Color-coded status indicators
- Stat cards with large numbers
- Expandable sections for details
- Info boxes explaining how calculations work
- Action buttons for next steps

### 3. Real-Time Tracker
**Purpose**: Live application status tracking
**Key Features**:
- Status overview cards (4 cards showing different aspects)
- Timeline of application steps
- Animated active step marker
- Step descriptions and timestamps
- Application ID and metadata
- Contact information for support
- Notification preferences
- Expected timeline display

**UI Patterns**:
- Animated pulse on active step
- Visual progress through stages
- Completed steps marked with checkmarks
- Clear stage descriptions
- Support contact information prominently displayed

### 4. Early-Stage Narrative Form
**Purpose**: Collect business description and loan purpose from early-stage founders
**Key Features**:
- Multi-section form:
  - About Your Business (name, type, stage)
  - Market & Revenue (customer description, projections)
  - Loan Purpose (detailed use explanation, timeline)
  - Repayment Plan (confidence, risk assessment)
  - Declaration & Agreement (checkboxes)
- Character counters on textarea fields
- Auto-save functionality
- Progress indicator
- Form validation
- Next steps guidance
- Bilingual support (English/Kinyarwanda)

**UI Patterns**:
- Section-based organization
- Clear labeling of required fields
- Helpful hints and examples
- Character counters for feedback
- Success messages for auto-save
- Save draft button
- Progress bar at top

### 5. Loan Purpose Module
**Purpose**: Detailed loan configuration and final review before submission
**Key Features**:
- Step indicator (4 steps)
- Amount selection with slider
- Quick amount buttons ($3k, $5k, $8k, $12.5k max)
- Purpose category selection (5 options)
- Repayment timeline options (6/12/24 months)
- Estimated monthly payment display
- Final review summary
- Confirmation checklist
- Next steps timeline
- Application review process explanation

**UI Patterns**:
- Slider for amount selection with visual feedback
- Category cards with radio selection
- Real-time calculation updates
- Summary card with confirmation
- Multi-step visual indicator
- Informational timeline of what happens next

---

## Responsive Design

### Breakpoints

- **Mobile**: 320px - 767px
- **Tablet**: 768px - 1024px
- **Desktop**: 1025px+

### Key Responsive Behaviors

#### Mobile (320px - 767px)
- Single column layouts
- Full-width buttons and inputs
- Stacked navigation (no horizontal menu)
- Larger touch targets (min 44px)
- Simplified layouts, no sidebars
- Increased padding and spacing
- Font size: Base 14px for readability

#### Tablet (768px - 1024px)
- Two-column grids where appropriate
- Tabbed navigation
- Horizontal buttons in moderation
- Mix of primary and secondary elements visible

#### Desktop (1025px+)
- Multi-column layouts
- Full navigation displayed
- Sidebar elements introduced
- More compact spacing utilized

### Mobile-First Implementation
All styles start mobile, then progressively enhanced:
```css
/* Mobile first */
.grid { grid-template-columns: 1fr; }

/* Tablet and up */
@media (min-width: 768px) {
  .grid { grid-template-columns: repeat(2, 1fr); }
}

/* Desktop and up */
@media (min-width: 1025px) {
  .grid { grid-template-columns: repeat(3, 1fr); }
}
```

---

## Accessibility Guidelines

### WCAG 2.1 AA Compliance

#### Color Contrast
- Normal text: 4.5:1 contrast ratio
- Large text: 3:1 contrast ratio
- Interactive components: 3:1 contrast ratio

#### Keyboard Navigation
- All interactive elements accessible via Tab key
- Tab order follows logical document flow
- Focus indicators clearly visible (blue outline)
- Escape key closes modals and dropdowns

#### Screen Reader Support
- Semantic HTML structure
- ARIA labels for icon-only buttons
- Form labels properly associated
- Landmarks defined (header, main, footer)
- Skip to main content link
- Descriptive link text (not "click here")

#### Form Accessibility
- Labels visually and programmatically associated
- Required fields marked and announced
- Error messages linked to form fields
- Helpful hints provided
- Success/validation messages announced

#### Images & Icons
- All meaningful images have alt text
- Icon-only buttons have aria-labels
- Decorative images marked as decorative

---

## Usage Guidelines

### When to Use Each Module

| Module | User Type | Use Case |
|--------|-----------|----------|
| Identity Portal | New/Existing Users | Authentication, Registration, Profile Management |
| Eligibility Dashboard | Running Businesses | View qualification based on tax history |
| Real-Time Tracker | All Applicants | Monitor application progress in real-time |
| Narrative Form | Early-Stage Founders | Submit business description and loan purpose |
| Loan Purpose | All Applicants | Configure loan amount, purpose, and timeline |

### Design Patterns Across Modules

#### Consistency
- Same button styles across all modules
- Consistent color coding for status
- Same form styling for inputs
- Unified header and footer

#### Progressive Disclosure
- Hide advanced options until needed
- Show hints and helpers contextually
- Expandable sections for details

#### Feedback
- Clear success messages
- Helpful error messages with remediation
- Progress indicators for multi-step processes
- Status updates and confirmations

---

## Color Usage Examples

### Running Business (Tax-Based Path)
- **Hero Background**: Primary Blue (represents official, verified data)
- **Eligibility Card**: Success Green (qualified based on tax records)
- **Status**: Success indicators throughout

### Early-Stage Founder (Narrative Path)
- **Hero Background**: Primary Blue
- **Form Sections**: Organized with clear visual hierarchy
- **Pending Status**: Warning Yellow (waiting for BRD assessment)

### Application Status
- **Submitted**: Primary Blue (in progress)
- **Verified**: Success Green (data confirmed)
- **Under Review**: Warning Yellow (human assessment)
- **Approved**: Success Green (positive decision)
- **Rejected**: Error Red (decline)
- **More Info Needed**: Info Cyan (additional documentation)

---

## Interactive Elements

### Hover States
- Buttons: Slight background color shift
- Cards: Subtle shadow increase
- Links: Underline appears
- Form inputs: Border color change

### Active States
- Buttons: Darker background
- Tab buttons: Underline indicator
- Selected options: Blue background + checkmark

### Disabled States
- Reduced opacity (50%)
- Cursor: not-allowed
- No hover effects

### Focus States
- Clear visible outline (3px blue border)
- Sufficient contrast
- Applied to all interactive elements

---

## Data Visualization

### Numbers and Amounts
- Dollar amounts: Large, bold, primary blue
- Percentages: Secondary size, muted color
- Calculations: Breakdown with transparency

### Status Progression
- Timeline format for multi-stage processes
- Visual progress bars for completion percentage
- Badges for stage labels

### Business Data
- Cards for key metrics
- Tables for detailed breakdowns (on desktop)
- Summary panels for quick reference

---

## Performance Considerations

### CSS
- Use CSS variables for theming
- Minimal animations (only where purposeful)
- No unnecessary hover effects on mobile
- Efficient media queries

### Images
- SVG for icons (scales perfectly)
- Optimized PNG/WebP for graphics
- Responsive images with srcset
- Lazy loading for below-fold content

### Interactions
- Hardware acceleration for animations
- Touch-friendly targets (min 44x44px)
- Debounced inputs and scroll handlers
- Progressive enhancement

---

## Implementation Notes

### CSS Framework
This design system uses custom CSS with CSS Variables (no external framework required).

### Browser Support
- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Android)

### Dark Mode
Future consideration: Design system extensible to support dark mode using CSS variables.

### Localization
- All text strings should be externalized
- Form hints support both English and Kinyarwanda
- RTL text support: Not required initially, but structure allows for future addition
- Date/number formatting: Locale-specific

---

## File Structure

```
ui-design/
├── index.html                    # Design system overview
├── styles.css                    # Complete design system
├── pages/
│   ├── identity-portal.html      # Module 1
│   ├── eligibility-dashboard.html # Module 2
│   ├── real-time-tracker.html    # Module 3
│   ├── narrative-form.html       # Module 4
│   └── loan-purpose.html         # Module 5
└── README.md                     # This documentation
```

---

## Next Steps for Implementation

1. **Convert to React/Next.js**: Use these mockups as basis for component development
2. **Accessibility Testing**: Test with screen readers and keyboard navigation
3. **Performance Optimization**: Measure and optimize Lighthouse scores
4. **Usability Testing**: Conduct user testing with real entrepreneurs
5. **Localization**: Implement full Kinyarwanda translation
6. **API Integration**: Connect to RRA, RDB, and BRD backends
7. **Mobile App**: Consider native iOS/Android versions
8. **Analytics**: Track user flows and conversion metrics

---

## Questions or Suggestions?

This design system is a living document. As the platform evolves, update these guidelines to reflect new patterns, components, and best practices.

**Created**: May 2026
**For**: REACH Platform - Development Bank of Rwanda
**By**: Design Team
