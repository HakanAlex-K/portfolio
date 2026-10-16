/* Screens for the UniTR viewer. Captured from the current app with the official 2026 YÖK Atlas
 * guide snapshot. The interface is in Turkish; the AI assistant is shown in the demo video instead. */
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
];

/* The assistant demo video. Chapters match the captions burned into the video (seconds),
 * so small screens, where those captions are too small to read, can show them as text. */
export const unitrDemo = {
  poster: '/video/unitr-assistant-poster.webp',
  sources: [
    { src: '/video/unitr-assistant-1080-v2.mp4', media: '(max-width: 900px)' },
    { src: '/video/unitr-assistant-v2.mp4' },
  ],
  chapters: [
    { start: 3, label: 'Question', text: '“My SAY rank is about 45,000. Where in Istanbul can I study computer or software engineering in English?”' },
    { start: 10.4, label: 'Tool use', text: 'Claude turns the question into searches over the official program catalog.' },
    { start: 13.7, label: 'Streaming', text: 'The answer streams in and cites programs by ID. The model never writes the numbers.' },
    { start: 20.7, label: 'Verified', text: 'The server checks every citation against the search results, then attaches the official records.' },
    { start: 23, end: 28.2, label: 'Official data', text: 'Cut-off ranks, scores, quotas and tuition, straight from the 2026 YÖK Atlas guide.' },
  ],
};
