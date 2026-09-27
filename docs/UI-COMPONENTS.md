# Reusable UI Component System Specification & Documentation

**Platform:** Oakridge International Academy School Management Platform  
**Package:** `@school/web` (`apps/web/src/components/ui/`)  
**Design Standard:** Modern Regal Academics (Navy `#0F172A`, Gold `#F59E0B`, Crimson `#DC2626`, Emerald `#10B981`)  
**Accessibility:** WCAG 2.1 AA Compliant with Full Keyboard Navigation, Focus Rings, and W3C ARIA Semantics

---

## 1. Overview & Architecture

All components in the Oakridge UI library adhere to four core engineering standards:
1. **Fully Typed Props**: Strict TypeScript interfaces extending standard HTML elements with sensible defaults.
2. **Accessible Interaction**: W3C ARIA roles (`dialog`, `alertdialog`, `tablist`, `tab`, `radiogroup`, `switch`, `alert`, `status`), keyboard shortcuts (`Escape`, `ArrowLeft`/`ArrowRight`, `Tab`, `Enter`, `Space`), and focus traps.
3. **Four Universal States**:
   - **Default & Hover**: Subtle micro-transitions, active scale damping (`active:scale-[0.98]`).
   - **Focus States**: High-contrast outline offset rings (`focus-visible:ring-2 focus-visible:ring-crest-600 focus-visible:ring-offset-2`).
   - **Loading States**: Spinners with `aria-busy="true"` and pointer-event deactivation.
   - **Disabled States**: Explicit opacity degradation (`disabled:opacity-50 disabled:cursor-not-allowed`).
   - **Error States**: Dynamic `aria-invalid="true"`, semantic red borders (`border-danger-400`), and linked error alerts via `aria-describedby`.
4. **Zero Unnecessary Duplication**: Centralized Tailwind utility tokens and composable class names.

---

## 2. Component Catalog & API Reference

### 2.1. Button (`Button.tsx`)
Action trigger supporting 6 semantic variants and 3 sizes.
- **Props**:
  - `variant`: `'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'gold'`
  - `size`: `'sm' | 'md' | 'lg'`
  - `isLoading`: `boolean` (displays `Loader2` animation and sets `aria-busy="true"`)
  - `leftIcon`, `rightIcon`: `React.ReactNode`
  - All standard `React.ButtonHTMLAttributes<HTMLButtonElement>`
- **Keyboard**: Native button Enter/Space activation; focus ring on Tab.

```tsx
<Button variant="primary" size="md" isLoading={submitting} leftIcon={<Sparkles className="w-4 h-4" />}>
  Publish Syllabus
</Button>
```

---

### 2.2. Input (`Input.tsx`)
Single-line text entry with integrated label, icon slots, error feedback, and helper descriptions.
- **Props**:
  - `label`: `string`
  - `error`: `string` (renders `AlertCircle` icon, red border, and `role="alert"` text)
  - `helperText`: `string`
  - `leftIcon`, `rightIcon`: `React.ReactNode`
  - All standard `React.InputHTMLAttributes<HTMLInputElement>`
- **Accessibility**: Automatically links `aria-describedby` to `${inputId}-error` or `${inputId}-helper`.

```tsx
<Input
  label="Student Admission Number"
  placeholder="e.g. OAK-2026-908"
  error={errors.admissionNumber}
  helperText="Located on official enrollment letter"
  required
/>
```

---

### 2.3. Textarea (`Textarea.tsx`)
Multi-line text input with auto-resize support and error styling.
- **Props**:
  - `label`, `error`, `helperText`: `string`
  - `rows`: `number` (default: 4)
  - All standard `React.TextareaHTMLAttributes<HTMLTextAreaElement>`

---

### 2.4. Select (`Select.tsx`)
Custom styled dropdown selection matching platform design tokens.
- **Props**:
  - `options`: `{ label: string; value: string | number }[]`
  - `placeholder`: `string`
  - `label`, `error`, `helperText`: `string`
  - All standard `React.SelectHTMLAttributes<HTMLSelectElement>`

---

### 2.5. Checkbox (`Checkbox.tsx`)
Custom styled, keyboard-navigable checkbox using CSS peer selectors.
- **Props**:
  - `label`: `React.ReactNode`
  - `description`: `string`
  - `error`: `string`
  - `checked`: `boolean`
  - `onChange`: `(e: React.ChangeEvent<HTMLInputElement>) => void`
- **Accessibility**: Real `<input type="checkbox">` under the hood for Tab focus and Spacebar toggling.

---

### 2.6. Radio & RadioGroup (`Radio.tsx`)
Accessible radio group with keyboard navigation and rich card layout.
- **Props**:
  - `name`: `string`
  - `options`: `{ label: string; value: string | number; description?: string; disabled?: boolean }[]`
  - `selectedValue`: `string | number`
  - `onChange`: `(value: any) => void`
  - `error`: `string`
  - `disabled`: `boolean`
- **Accessibility**: Sets `role="radiogroup"` with focus ring on active element.

---

### 2.7. Switch (`Switch.tsx`)
Accessible toggle switch control.
- **Props**:
  - `label`: `string`
  - `description`: `string`
  - `checked`: `boolean`
  - `onChange`: `(checked: boolean) => void`
  - `disabled`: `boolean`
- **Accessibility**: Uses `role="switch"` and `aria-checked={checked}`.

---

### 2.8. Avatar (`Avatar.tsx`)
Identity avatar with automatic initials generator, image fallback, and status indicator.
- **Props**:
  - `src`: `string` (image URL with error fallback)
  - `alt`: `string`
  - `name`: `string` (e.g. "Liam Vance" -> auto-renders "LV")
  - `size`: `'xs' | 'sm' | 'md' | 'lg' | 'xl'`
  - `status`: `'online' | 'offline' | 'busy' | 'away'`
  - `shape`: `'circle' | 'rounded'`

```tsx
<Avatar name="Dr. Evelyn Wright" size="lg" status="online" />
```

---

### 2.9. Modal (`Modal.tsx`) & ConfirmationDialog (`ConfirmationDialog.tsx`)
Accessible overlay dialogs with backdrop blur and focus trap.
- **Props**:
  - `isOpen`: `boolean`
  - `onClose`: `() => void`
  - `title`, `description`, `footer`, `children`: `React.ReactNode`
  - `maxWidth`: `'sm' | 'md' | 'lg' | 'xl' | '2xl'`
  - `role`: `'dialog' | 'alertdialog'`
- **Keyboard**: Pressing `Escape` or clicking the backdrop triggers `onClose()`. Body scroll is automatically locked while open.

---

### 2.10. Drawer (`Drawer.tsx`)
Slide-out drawer modal from left or right viewport edge.
- **Props**:
  - `position`: `'left' | 'right'`
  - `isOpen`: `boolean`
  - `onClose`: `() => void`
  - `title`: `React.ReactNode`

---

### 2.11. Dropdown (`Dropdown.tsx`)
Accessible floating menu with trigger button and keyboard navigation.
- **Props**:
  - `trigger`: `React.ReactNode`
  - `items`: `{ label: React.ReactNode; icon?: React.ReactNode; onClick?: () => void; danger?: boolean; disabled?: boolean; divider?: boolean }[]`
  - `align`: `'left' | 'right'`
- **Keyboard**: Opens on `Enter`/`Space`/`ArrowDown`; closes on `Escape` or outside click.

---

### 2.12. Toast (`Toast.tsx`)
Context-based toast notification provider.
- **Usage**:
```tsx
const { toast } = useToast();
toast({
  type: 'success',
  title: 'Attendance Saved',
  message: 'All 32 student records marked present.',
  duration: 4000
});
```

---

### 2.13. Alert (`Alert.tsx`)
Inline contextual alert with dismiss support.
- **Props**:
  - `type`: `'info' | 'success' | 'warning' | 'danger'`
  - `title`: `string`
  - `onDismiss`: `() => void`
  - `children`: `React.ReactNode`
- **Accessibility**: Emits `role="alert"`.

---

### 2.14. Card (`Card.tsx`)
Modular card composition: `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`.

---

### 2.15. Table (`Table.tsx`)
Responsive data table primitives: `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHead`, `TableCell`.

---

### 2.16. Pagination (`Pagination.tsx`)
Accessible pagination navigator with boundary guards.
- **Props**:
  - `currentPage`: `number`
  - `totalPages`: `number`
  - `onPageChange`: `(page: number) => void`
  - `totalRecords`: `number`
  - `pageSize`: `number`
- **Accessibility**: Emits `nav` with `aria-label="Pagination"` and `aria-current="page"` on the active button.

---

### 2.17. Tabs (`Tabs.tsx`)
Accessible tab switchers in pill or underline styles.
- **Props**:
  - `tabs`: `{ id: string; label: React.ReactNode; icon?: React.ReactNode; badge?: React.ReactNode; disabled?: boolean }[]`
  - `activeTab`: `string`
  - `onChange`: `(id: string) => void`
  - `variant`: `'pills' | 'underline'`
- **Keyboard**: ArrowLeft and ArrowRight cycles through enabled tabs.

---

### 2.18. Accordion (`Accordion.tsx`)
Expandable FAQ and content sections.
- **Props**:
  - `items`: `{ id: string; title: React.ReactNode; content: React.ReactNode }[]`
  - `allowMultiple`: `boolean`
  - `defaultExpanded`: `string[]`
- **Accessibility**: W3C Accordion pattern with `aria-expanded`, `aria-controls`, and `role="region"`.

---

### 2.19. Breadcrumb (`Breadcrumb.tsx`)
Hierarchical navigation path with schema-friendly markup.
- **Accessibility**: `aria-label="Breadcrumb"` and `aria-current="page"`.

---

### 2.20. Badge (`Badge.tsx`)
Status indicators with 7 semantic variants and optional live pulse dot.
- **Variants**: `primary`, `secondary`, `success`, `warning`, `danger`, `gold`, `outline`.

---

### 2.21. FileUpload (`FileUpload.tsx`)
Drag-and-drop and click-to-upload zone with file size validation, progress preview, and keyboard alternative.
- **Props**:
  - `accept`: `string`
  - `maxSizeMB`: `number`
  - `multiple`: `boolean`
  - `onFilesSelected`: `(files: File[]) => void`

---

### 2.22. Feedback & Loading States
- **Skeleton (`Skeleton.tsx`)**: Text, circular, and rectangular shimmering placeholders.
- **Spinner (`Spinner.tsx`)**: Accessible spinning indicator with `role="status"` and screen reader text.
- **EmptyState (`EmptyState.tsx`)**: Centered empty feedback icon, title, description, and action CTA.
- **ErrorState (`ErrorState.tsx`)**: Network failure or loading error state with retry button.

---

## 3. Testing & Verification

Comprehensive component tests are implemented in `apps/web/src/tests/components.test.tsx`:
- **Total Test Cases**: 36 frontend tests passing + 6 backend tests passing = **42 Passing Tests**
- **Test Command**: `npm run test`
- **Linting Command**: `npm run lint`
- **Type Checking**: `npm run typecheck`
- **Build**: `npm run build`
