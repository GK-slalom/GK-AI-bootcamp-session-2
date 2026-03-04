# UI Guidelines

## Overview

This document outlines the UI guidelines to be followed when building the ToDo application to ensure a consistent, accessible, and user-friendly experience.

## Guidelines

### 1. Use the Material Framework
- The application UI should be built using the Material Design framework (e.g., Material UI / MUI for React).

### 2. Accessibility (WCAG Compliance)
- The UI must be accessible and conform to the [Web Content Accessibility Guidelines (WCAG)](https://www.w3.org/WAI/standards-guidelines/wcag/).
- This includes proper use of ARIA labels, sufficient colour contrast, keyboard navigability, and screen reader support.

### 3. Internationalisation (i18n) / Language Support
- The UI should support changing the display language.
- All user-facing text should be externalised to support localisation.

### 4. Clearly Visible Buttons and Tiles
- Buttons and tiles should be clearly visible and distinguishable from surrounding content.
- Use appropriate sizing, spacing, and contrast to ensure they stand out.

### 5. Dismissible Modals
- Modals can be closed by clicking outside the modal box, in addition to any explicit close/cancel controls.

### 6. Visible Click Actions
- Interactive elements (buttons, links, icons) should have clearly visible active and hover states to indicate they are clickable.

### 7. Proper Page Alignment
- Page content should be properly aligned and laid out in a structured, readable manner.
- Use consistent grid and spacing systems throughout.

### 8. Consistent Design and Feel
- The overall design, colour scheme, typography, and feel should be consistent across all pages and views of the application.

### 9. Consistent Button Labels and Icons
- Buttons and icons must be consistent throughout the entire application.
  - If an icon is used for a particular action (e.g., a cancel button), the same icon must be used for that action everywhere in the app.
  - Button labels must be uniform across the app. For example, if a button is labelled **Save** to apply changes, it must be called **Save** everywhere — not **Apply**, **Submit**, or any other variation.
