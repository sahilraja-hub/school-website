# Complete UI/UX Design System Specification
## Oakridge International Academy Design System

---

## 1. Design Philosophy & Aesthetic Core
The Oakridge Design System reflects the timeless prestige of world-class academic institutions blended with contemporary digital clarity. The system is built upon three foundational tenets:
1. **Academic Prestige & Elegance**: Deep institutional navy tones (`crest`), warm scholarly gold accents (`gold`), and distinguished editorial serif display headers (`Playfair Display`).
2. **Cognitive Clarity & Readability**: Modern, accessible sans-serif typography (`Outfit` & `Inter`), structured information cards, generous whitespace, and high-contrast data tables.
3. **Responsive Fluency & Accessibility**: Seamless fluidity across mobile, tablet, and ultra-wide displays with strict adherence to **WCAG 2.1 AA** color contrast and keyboard navigability standards.

---

## 2. Foundation Tokens

### 2.1 Color System

#### Primary Brand: Regal Crest Navy
Represents institutional stability, academic rigor, and scholastic authority.

| Token | Hex | Tailwind Class | Contrast on White | Primary Usage |
| :--- | :--- | :--- | :--- | :--- |
| `crest-50` | `#f0f7ff` | `bg-crest-50` | 1.1:1 | Subtle active container backgrounds |
| `crest-100` | `#e0effe` | `bg-crest-100` | 1.3:1 | Badge backgrounds, hover accents |
| `crest-200` | `#bae0fd` | `bg-crest-200` | 1.8:1 | Border highlights, selection indicators |
| `crest-500` | `#0e87ea` | `bg-crest-500` | 3.2:1 | Vibrant interactive accents, focus rings |
| `crest-600` | `#026bc9` | `bg-crest-600` | 4.8:1 (AA) | Primary links, secondary buttons |
| `crest-700` | `#0355a3` | `bg-crest-700` | 7.1:1 (AAA)| Primary brand button, active nav items |
| `crest-800` | `#074885` | `bg-crest-800` | 9.4:1 (AAA)| Headings, strong emphasis text |
| `crest-900` | `#0c3d6f` | `bg-crest-900` | 12.3:1 (AAA)| Dark panel headers, hero sections |
| `crest-950` | `#08274a` | `bg-crest-950` | 15.1:1 (AAA)| Deep footer & console backgrounds |

#### Secondary Brand: Heritage Gold & Amber
Represents scholarship honors, awards, student achievements, and calls to action.

| Token | Hex | Tailwind Class | Contrast on Crest-950 | Primary Usage |
| :--- | :--- | :--- | :--- | :--- |
| `gold-50` | `#fffbeb` | `bg-gold-50` | 1.1:1 | Warm alert & badge backgrounds |
| `gold-200` | `#fde68a` | `bg-gold-200` | 1.4:1 | Subtle dividers, badge borders |
| `gold-400` | `#fbbf24` | `bg-gold-400` | 9.8:1 (AAA)| Accent icons, star ratings |
| `gold-500` | `#f59e0b` | `bg-gold-500` | 8.2:1 (AAA)| High-conversion CTA buttons, admissions badges |
| `gold-600` | `#d97706` | `bg-gold-600` | 6.4:1 (AA) | Button hover gradients, prominent status pills |
| `gold-700` | `#b45309` | `bg-gold-700` | 4.6:1 (AA) | Dark mode gold text, high-contrast borders |

#### Semantic Feedback Palette

| Semantic Role | Token | Hex | Background Token | Usage Context |
| :--- | :--- | :--- | :--- | :--- |
| **Success** | `success-600` | `#059669` | `success-50` (`#ecfdf5`) | Present attendance, passing marks, accepted applications |
| **Warning** | `warning-500` | `#f59e0b` | `warning-50` (`#fffbeb`) | Tardy attendance, pending reviews, upcoming deadlines |
| **Danger** | `danger-600` | `#dc2626` | `danger-50` (`#fef2f2`) | Absent status, overdue fees, validation errors, destructive actions |
| **Info** | `info-600` | `#0284c7` | `info-50` (`#f0f9ff`) | System notifications, campus advisories, informational alerts |

---

### 2.2 Typography System

The platform combines three purposeful font families loaded via Google Fonts:
- **`font-sans` (`Outfit`, `Inter`)**: Clean, contemporary sans-serif for UI labels, forms, navigation, and body copy.
- **`font-serif` (`Playfair Display`, `Georgia`)**: Distinguished academic serif for editorial headlines, mottos, and card titles.
- **`font-mono` (`JetBrains Mono`, `monospace`)**: Monospaced font for application IDs (`ADM-2026-1042`), student codes, and GPA telemetry.

#### Type Scale

| Level | Size | Line Height | Weight | Tailwind Class | Primary Usage |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Display 1** | 60px / 3.75rem | 1.1 | 700 Bold | `text-6xl font-serif` | Public Homepage Hero Headline |
| **Display 2** | 48px / 3.0rem | 1.16 | 700 Bold | `text-5xl font-serif` | Page Category Titles (About, Academics) |
| **Heading 1** | 36px / 2.25rem | 1.2 | 700 Bold | `text-4xl font-serif` | Section Headlines |
| **Heading 2** | 30px / 1.875rem| 1.25 | 600 SemiBold| `text-3xl font-serif` | Module Headers, Portal View Titles |
| **Heading 3** | 24px / 1.5rem | 1.3 | 600 SemiBold| `text-2xl font-serif` | Card Titles, Modal Headers |
| **Subheading**| 20px / 1.25rem | 1.4 | 600 SemiBold| `text-xl font-sans` | Subsection Headers |
| **Body Large**| 18px / 1.125rem| 1.5 | 400 Regular | `text-lg font-sans` | Hero Lead Paragraphs, Introductions |
| **Body Base** | 16px / 1.0rem | 1.5 | 400 Regular | `text-base font-sans` | Standard Paragraphs, Long-form Content |
| **Body Small**| 14px / 0.875rem| 1.4 | 400 / 500 | `text-sm font-sans` | Table Cells, Form Inputs, Card Descriptions |
| **Caption** | 12px / 0.75rem | 1.33 | 500 Med / 600 | `text-xs font-sans` | Helper Text, Badges, Nav Links, Meta Dates |
| **Micro** | 11px / 0.6875rem| 1.25 | 600 SemiBold| `text-2xs font-mono` | Reference IDs, Timestamp Tags |

---

### 2.3 Spacing Scale & Layout Grid

- **Base Unit**: 4px (`0.25rem` = `1` in Tailwind).
- **Scale Tokens**:
  - `space-1` = 4px (Tight micro-spacing between icons and text).
  - `space-2` = 8px (Form field gaps, badge padding).
  - `space-3` = 12px (Card inner padding, input vertical padding).
  - `space-4` = 16px (Standard component gaps, list item spacing).
  - `space-6` = 24px (Card padding, modal content padding, grid gaps).
  - `space-8` = 32px (Section inner spacing, dashboard container padding).
  - `space-12` = 48px (Major content block separation).
  - `space-16` / `space-20` = 64px / 80px (Page section padding on desktop).

#### Grid System & Container Widths
- **12-Column Responsive Grid**: Used for complex dashboards and multi-column public sections.
- **Max Container Widths**:
  - Standard Content: `max-w-content` (`1280px`).
  - Wide Dashboard: `max-w-wide` (`1440px`).
  - Form & Modal Wizards: `max-w-4xl` (`896px`), `max-w-md` (`448px`).

---

### 2.4 Border Radius Scale

| Token | Value | Tailwind Class | Component Mapping |
| :--- | :--- | :--- | :--- |
| `sm` | 4px / 0.25rem | `rounded-sm` | Code blocks, micro tags |
| `md` | 6px / 0.375rem | `rounded-md` | Checkboxes, tooltips, status dots |
| `lg` | 8px / 0.5rem | `rounded-lg` | Input elements, small buttons, submenus |
| `xl` | 12px / 0.75rem | `rounded-xl` | Standard buttons, select dropdowns, search bars |
| `2xl` | 16px / 1.0rem | `rounded-2xl` | Content cards, modals, alert banners |
| `3xl` | 24px / 1.5rem | `rounded-3xl` | Hero callout banners |
| `full` | 9999px | `rounded-full` | Badges, avatar circles, pills |

---

### 2.5 Shadows & Elevation Tokens

| Elevation Level | Tailwind Class | CSS Value | Usage |
| :--- | :--- | :--- | :--- |
| **Flat / Border** | `border border-slate-200` | None | Low-priority cards, table containers |
| **Subtle (Level 1)**| `shadow-subtle` | `0 1px 2px 0 rgba(0, 0, 0, 0.05)` | Buttons, table rows on hover |
| **Card (Level 2)** | `shadow-card` | `0 2px 8px -2px rgba(12, 61, 111, 0.08)` | Content cards, stat widgets |
| **Elevated (Level 3)**| `shadow-elevated`| `0 12px 24px -4px rgba(12, 61, 111, 0.1)` | Hovered cards, dropdown popovers |
| **Modal (Level 4)**| `shadow-modal` | `0 24px 48px -12px rgba(8, 39, 74, 0.25)` | Dialogs, modals, floating action bars |
| **Gold Glow** | `shadow-gold-glow`| `0 0 20px -3px rgba(245, 158, 11, 0.35)` | Primary admissions CTA button hover |

---

### 2.6 Breakpoints & Responsive Behavior

| Breakpoint | Minimum Width | Typical Devices | Layout Transformations |
| :--- | :--- | :--- | :--- |
| `xs` | 475px | Large Phones | Single column forms expand to 2-column micro-grids. |
| `sm` | 640px | Phablets / Small Tablets | Horizontal stat counters, multi-button toolbars. |
| `md` | 768px | Tablets (iPad Portrait) | Two-column cards, sidebar collides to mobile drawer. |
| `lg` | 1024px | Laptops / iPad Pro | Desktop persistent sidebar visible, full 3-column layouts. |
| `xl` | 1280px | Desktop Monitors | 4-column telemetry metric cards, expanded timetable matrices. |
| `2xl`| 1536px | Ultra-wide Screens | Centered max-width content container (`1440px`). |

---

## 3. Reusable UI Component Library

All 29 atomic and compound components are implemented in `apps/client/src/components/ui/` with full TypeScript interfaces:

### Component Catalog Overview
1. **`Button`**: Supports `primary`, `secondary`, `outline`, `ghost`, `danger`, `gold` with loading spinner and icon slots.
2. **`IconButton`**: Square accessible icon trigger with mandatory `aria-label`.
3. **`Input`**: Text/number input with floating/top labels, validation error alerts, helper texts, and left/right icon slots.
4. **`Textarea`**: Auto-resizing textarea with character counter and error bounds.
5. **`Select`**: Custom styled native select with custom chevron and optgroup support.
6. **`Checkbox`**: Accessible toggle square with animated checkmark and description label.
7. **`RadioGroup`**: Card-style and list-style single-select radio button groups.
8. **`Switch`**: Smooth toggle switch for boolean settings and permissions.
9. **`Search`**: Search input with magnifying glass prefix and one-click clear button.
10. **`DatePicker`**: Accessible date selection input with calendar icon.
11. **`FileUpload`**: Drag-and-drop file upload zone with file size validation and preview removal chips.
12. **`Modal`**: Accessible dialog with background blur, focus trap, Escape key dismiss, and action footer.
13. **`Drawer`**: Slide-out panel (left or right) for mobile navigation and detailed student dossiers.
14. **`Dropdown`**: Popover menu for user profile actions and contextual item operations.
15. **`Tooltip`**: Hover/focus informative tooltip positioned top/bottom/left/right.
16. **`Toast`**: Context-driven notification system with auto-dismiss (`useToast()`).
17. **`Alert`**: Static contextual banners (`info`, `success`, `warning`, `danger`) with optional dismissal.
18. **`Badge`**: Pill tags with optional status dot indicators (`primary`, `success`, `warning`, `danger`, `gold`, `outline`).
19. **`Card`**: Compound component family (`Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`).
20. **`Table`**: Semantic data table family (`Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHead`, `TableCell`).
21. **`Pagination`**: Page navigation buttons with current range record counters.
22. **`Tabs`**: Tabbed switcher with `pills` and `underline` variants and badge counters.
23. **`Accordion`**: Expandable disclosure item list with animated chevron rotations.
24. **`Breadcrumb`**: Hierarchical location trail with home icon and chevron separators.
25. **`Skeleton`**: Shimmer gradient placeholder for loading content blocks.
26. **`Spinner`**: Circular SVG loading spinner with multiple sizes and brand colorways.
27. **`EmptyState`**: Empty queue placeholder with iconography, title, description, and call-to-action button.
28. **`ErrorState`**: Error panel with retry callback for failed API queries.
29. **`ConfirmationDialog`**: Destructive confirmation modal with cancel and confirm handlers.

---

## 4. Layout Architecture Specifications

### 4.1 Public Website Layout (`PublicLayout.tsx`)
```
+--------------------------------------------------------------+
| 1. Top Bar: Admissions Announcement Ticker & Hotline         |
+--------------------------------------------------------------+
| 2. Sticky Glassmorphic Navbar (Crest Logo, Nav Links, Login)  |
+--------------------------------------------------------------+
|                                                              |
| 3. Main Outlet Page Content (Hero, Academics, Notices)       |
|                                                              |
+--------------------------------------------------------------+
| 4. Comprehensive Institutional Footer & Accreditations        |
+--------------------------------------------------------------+
```

### 4.2 Role-Based Dashboard Layout (`DashboardLayout.tsx`)
```
+------------------+-------------------------------------------+
| Sidebar (Desktop)| Topbar: Breadcrumb, Global Search,        |
|                  | Notification Bell, Role Pill, User Avatar |
|                  +-------------------------------------------+
| - School Crest   |                                           |
| - Role Badge     | Main Dashboard Outlet                     |
| - Navigation     | (Telemetry KPIs, Data Tables, Forms)      |
| - Active Routes  |                                           |
| - Collapse Btn   |                                           |
+------------------+-------------------------------------------+
```

---

## 5. Responsive State Specifications

| Device Type | Viewport | Navbar / Sidebar State | Layout Adaptations |
| :--- | :--- | :--- | :--- |
| **Mobile** | `< 640px` | Navbar shows hamburger; Sidebar hidden, triggered via slide-out `Drawer`. | Single column cards, stacked form inputs, horizontally scrollable data tables. |
| **Tablet** | `640px - 1023px`| Navbar compact; Dashboard utilizes top hamburger drawer. | 2-column KPI grids, condensed navigation menus. |
| **Desktop**| `≥ 1024px` | Navbar fully expanded; Sidebar persistent and collapsible (`w-64` or `w-20`). | 4-column KPI cards, side-by-side forms, full data tables. |
