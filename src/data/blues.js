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
