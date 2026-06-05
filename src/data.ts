/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Project, LabItem, NavSection, ExperienceItem } from './types';

export const SECTIONS: NavSection[] = [
  { index: 0, label: 'INTRO', tag: 'Hi, I\'m Miad' },
  { index: 1, label: 'THE_VOID', tag: 'Selected Work' },
  { index: 2, label: 'SYS_PLUGINS', tag: 'Currently Installed' },
  { index: 3, label: 'BIO', tag: 'About' },
  { index: 4, label: 'CONNECT', tag: 'Say hi (or don\'t)' },
];

export const PROJECTS: Project[] = [
  {
    id: 'something-probably',
    index: '01',
    category: 'PROCASTINATION / TBD',
    title: 'Something, probably',
    year: 'COMING SOON',
    role: 'Lead Dreamer',
    tags: ['Dreaming', 'Thinking', 'Snacks', 'Vibes'],
    description: 'This project is currently a spark of imagination. It has no code, no mockups, and absolutely no documentation.',
    challenge: 'Actually starting it. There are too many movies to watch, snacks to eat, and interesting articles to read.',
    solution: 'Add it to the portfolio to make it look like I\'m doing something, then never think about it again.',
    metrics: [
      '0 lines of code written',
      '100% chance of postponement',
      '12 browser tabs dedicated to it'
    ]
  },
  {
    id: 'untitled-idea',
    index: '02',
    category: 'OVERTHINKING / LATE NIGHT',
    title: 'Untitled idea #47',
    year: 'IN MY HEAD',
    role: 'Sleep Deprived Explorer',
    tags: ['Coffee', 'Napkins', '2 AM Ideas'],
    description: 'An idea that occurred to me at 2 AM. It felt revolutionary at the time. The next morning, it made absolutely no sense.',
    challenge: 'Remembering what the idea actually was. The notepad scribble just says \'like Uber but for squirrels\'.',
    solution: 'Let it simmer in the back of my mind until it is replaced by Untitled idea #48.',
    metrics: [
      '3 cups of coffee consumed',
      '1 scribble on a napkin',
      '100% regret'
    ]
  },
  {
    id: 'ask-future',
    index: '03',
    category: 'FUTURE WORK / TBD',
    title: 'Ask me in 6 months',
    year: 'TBD',
    role: 'Future Professional',
    tags: ['Hopeful', 'Under Construction', 'Procrastination'],
    description: 'I am confident that in six months, I will have a stunning project to show you. Please set a calendar reminder.',
    challenge: 'Finding the motivation to actually build it between now and then.',
    solution: 'Procrastinate for 5 months and 3 weeks, then build a basic React app the night before you check.',
    metrics: [
      '6 months of anticipation',
      '100% trust in my future self',
      '0% progress today'
    ]
  }
];

export const LAB_ITEMS: LabItem[] = [
  {
    id: 'shaders',
    index: '01',
    title: 'WAVE SHADERS',
    tech: 'HTML5 Canvas / Math',
    description: 'Procedural particles reacting to coordinate drag vectors. Also known as: moving dots around to look busy.',
    interactiveKey: 'shaders',
  },
  {
    id: 'threejs',
    index: '02',
    title: 'VECTOR SPHERE',
    tech: '2D Canvas / 3D Projection',
    description: 'Simulated spatial mathematics utilizing linear rendering. In other words, a spinning cage of math.',
    interactiveKey: 'threejs',
  },
  {
    id: 'figma-plugins',
    index: '03',
    title: 'CONTRAST AUDITOR',
    tech: 'Vanilla JS / WCAG Form',
    description: 'Checking if my color choices are legally compliant, so the contrast police don\'t arrest me.',
    interactiveKey: 'figma',
  },
  {
    id: 'raw-code',
    index: '04',
    title: 'WAVE ASSEMBLER',
    tech: 'Fourier Series / Canvas',
    description: 'Interlinked radial sines synthesizing mathematical waveforms. Generating waves because it looks cool.',
    interactiveKey: 'rawcode',
  },
];

export const EXPERIENCE: ExperienceItem[] = [
  {
    year: '2024 — PRES.',
    role: 'Professional Beginner & Tab Hoarder',
    institution: 'The Internet',
    description: 'Accumulating hundreds of bookmarks, downloading open-source libraries I will never use, and nodding during tech talks.'
  },
  {
    year: '2023 — 2024',
    role: 'Snack Specialist & Code Breaker',
    institution: 'Kitchen Lab',
    description: 'Researched optimal cookie-to-milk ratios while waiting for npm install to finish. Successfully broke local environments 14 times.'
  },
  {
    year: '2021 — 2025',
    role: 'Full-Time Googler & Explorer',
    institution: 'University of Copy-Paste',
    description: 'Majoring in \'how to center a div\' and minoring in \'stack overflow copy-pasting\'. Thesis on why CSS is hard.'
  }
];
