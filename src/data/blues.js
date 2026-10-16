/* Screens for the Blues Yachting product viewer (the dashboard is the hero shot).
 * Production build, fictional customer data and figures. Shown with the owner's permission.
 * URLs are deliberately generic: never publish the real portal address. */
export const screens = [
  {
    id: 'pipeline',
    label: 'Pipeline',
    url: 'blues-portal.local/sales',
    caption: 'Drag-and-drop deals with stage age and quote-opened signals.',
    src: '/img/pipeline.webp', full: '/img/pipeline-full.webp',
  },
  {
    id: 'quote',
    label: 'Quote builder',
    url: 'blues-portal.local/quote/new',
    caption: 'Turkish tax rules and live FX, rendered to PDF.',
    src: '/img/quote-filled.webp', full: '/img/quote-filled-full.webp',
  },
  {
    id: 'share',
    label: 'Customer page',
    url: 'blues-portal.local/share/…',
    caption: 'A personal quote page customers open from WhatsApp.',
    src: '/img/share-2.webp', full: '/img/share-2-full.webp',
  },
  {
    id: 'nps',
    label: 'NPS & referrals',
    url: 'blues-portal.local/nps',
    caption: 'Automatic post-sale surveys with referral follow-ups.',
    src: '/img/nps.webp', full: '/img/nps-full.webp',
  },
  {
    id: 'cashflow',
    label: 'Cash flow',
    url: 'blues-portal.local/cashflow',
    caption: 'Receivables and expected inflows, tracked per quote.',
    src: '/img/cashflow.webp',
  },
];

export const phones = [
  { src: '/img/m-share-quote.webp', label: 'Customer', alt: 'Customer quote page on a phone.' },
  { src: '/img/m-pipeline.webp', label: 'Sales, on the dock', alt: 'Sales pipeline on a phone.' },
  { src: '/img/m-dashboard.webp', label: 'Owners', alt: 'Dashboard on a phone.' },
];

/* The portal demo video, recorded from the real app running on fictional demo data.
 * Chapters match the captions burned into the video (seconds). */
export const bluesDemo = {
  poster: '/video/blues-portal-poster-v2.webp',
  sources: [
    { src: '/video/blues-portal-1080-v2.mp4', media: '(max-width: 900px)' },
    { src: '/video/blues-portal-v2.mp4' },
  ],
  chapters: [
    { start: 3, label: 'Customers', text: 'Add a customer once. Every quote, deal and message links back to them.' },
    { start: 16.9, label: 'Inventory', text: 'Stock by location, units in transit, and inbound shipments tracked from supplier to arrival.' },
    { start: 32.4, label: 'Pipeline', text: 'Every deal by stage, with stage age and quote-opened signals.' },
    { start: 38.6, label: 'Quote', text: 'Prices, discounts, Turkish ÖTV and KDV, and live TCMB rates, then a branded PDF with an email and WhatsApp message ready.' },
    { start: 49.8, end: 55.6, label: 'Customer', text: 'Each customer gets a personal proposal page, opened from WhatsApp. Every view shows up in the pipeline.' },
  ],
};
