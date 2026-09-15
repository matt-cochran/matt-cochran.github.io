/**
 * Scale Readiness Snapshot — configurable URLs and outcome copy.
 * Change these to point to your booking, waitlist, or early-stage resource.
 */

const CALENDLY_BASE = 'https://calendly.com/matthew-cochranweb/scale-ready';

export const SNAPSHOT_CONFIG = {
  /** Calendly inline widget URL (with optional params). Used for embed and "open in new tab" link. */
  bookingUrl: CALENDLY_BASE,
  /** Full URL for the Calendly inline widget data-url (e.g. with hide_event_type_details, hide_gdpr_banner). */
  calendlyWidgetUrl: `${CALENDLY_BASE}?hide_event_type_details=1&hide_gdpr_banner=1`,

  /**
   * Optional: resource for disqualified prospects (e.g. a market-scale / PMF testing tool).
   * Leave empty to hide the link. Gives them a useful next step so they can get to the point where the diagnostic fits.
   */
  earlyStageResourceUrl: '' as string,
  earlyStageResourceLabel: 'a market-scale or PMF validation tool',

  /** Optional: page for manual-review prospects (e.g. waitlist or "learn more"). Leave empty for copy-only. */
  manualReviewCtaUrl: '' as string,
  manualReviewCtaLabel: 'Learn more about the diagnostic',

  /** Where non-qualified outcomes are invited to write. Leave empty to end those outcomes without a next step. */
  contactEmail: 'matthew@cochranweb.com' as string,
} as const;
