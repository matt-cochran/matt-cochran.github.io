# Extractable Components

## NavBar
- Source: `src/components/Nav.astro`
- Category: layout
- Description: Sticky personal-brand wordmark and global navigation.
- Extractable props: activeItem (string, default: "home")
- Hardcoded: Matthew Cochran wordmark, navigation labels, colors, spacing.

## Footer
- Source: `src/components/Footer.astro`
- Category: layout
- Description: Contact, location, web properties, personal wordmark, and LinkedIn.
- Extractable props: none
- Hardcoded: contact text, links, LinkedIn icon, styling.

## Section
- Source: `src/components/Section.astro`
- Category: basic
- Description: Reusable 30/70 editorial section with heading rail and slotted prose.
- Extractable props: heading (string), description (string), id (string)
- Hardcoded: responsive split proportions, typography and border styling.

