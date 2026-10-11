/* Screens for the UniTR viewer. Captured from the current app with the official 2026 YÖK Atlas
 * guide snapshot; the assistant answer is a real Claude Haiku response. The interface is in Turkish. */
export const unitrScreens = [
  {
    id: 'home',
    label: 'Rank search',
    url: 'UniTR · Keşfet',
    caption: 'Start from your exam rank and see which programs admitted it last year.',
    src: '/img/unitr-home.webp', full: '/img/unitr-home-full.webp',
  },
  {
    id: 'programs',
    label: 'Program search',
    url: 'UniTR · Programlar',
    caption: 'Official cut-off scores, ranks, quotas, and tuition, filtered by score type, city, language, and scholarship.',
    src: '/img/unitr-programs.webp',
  },
  {
    id: 'program',
    label: 'Program history',
    url: 'UniTR · Program',
    caption: 'Each program’s rank history for 2023–2026, linked to its official YÖK Atlas record.',
    src: '/img/unitr-program.webp',
  },
  {
    id: 'assistant',
    label: 'AI assistant',
    url: 'UniTR · Asistan',
    caption: 'Questions in plain Turkish become catalog searches; every cited program is checked on the server.',
    src: '/img/unitr-assistant.webp',
  },
];
