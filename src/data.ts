/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Project, LabItem, NavSection, ExperienceItem } from './types';

export const SECTIONS: NavSection[] = [
  { index: 0, label: 'MANIFESTO', tag: 'Introduction' },
  { index: 1, label: 'SELECTED', tag: 'Selected Work' },
  { index: 2, label: 'RESEARCH', tag: 'Experimental Research' },
  { index: 3, label: 'STUDENT_BIO', tag: 'Student Bio' },
  { index: 4, label: 'CONNECT', tag: 'Inquiry' },
];

export const PROJECTS: Project[] = [
  {
    id: 'kinetica',
    index: '01',
    category: 'BRAND / GENERATIVE GRAPHICS',
    title: 'KINETICA',
    year: '2024',
    role: 'Lead Visual Technologist',
    tags: ['GLSL', 'SVG Engine', 'Houdini Pipeline', 'Generative Art'],
    description: 'A dynamic, kinetic identity system designed for interactive physical exhibition spaces. The identity reacts live to ambient audience sounds and proximity, morphing a static brand mark into an ambient visual entity.',
    challenge: 'Logos created for physical spaces are traditionally static. When digitized or placed on LED walls, they lack context. The brief was to create an identity that behaves like a living organism, responding directly to physical environment attributes without lagging.',
    solution: 'Designed a React + WebGL generator that deforms typography contours using curl noise vectors. It connects to ambient audio frequencies, generating high-contrast wireframe meshes that export clean SVG paths for high-fidelity print production live.',
    metrics: [
      'Interactive feed: steady 60 FPS under heavy crowd loads',
      'Over 40,000 unique SVGs generated and printed live',
      'Adopted as official brand suite for Zurich Biotech Pavilion 2025'
    ]
  },
  {
    id: 'agentic',
    index: '02',
    category: 'UX / INTUITIVE DESIGN',
    title: 'AGENTIC',
    year: '2025',
    role: 'Interface Architect & UX Designer',
    tags: ['React', 'Priority Rendering', 'Constraint Layouts', 'Cognitive Sync'],
    description: 'An experimental web dashboard that rejects rigid static widgets of the 2010s. Instead, it leverages a prioritize-to-expand grid that flows organically in response to the user’s cognitive attention path and real-time AI tool outputs.',
    challenge: 'Modern AI tools create unpredictable text chunks or custom objects that cause layouts to break or force users into scroll hell. AI outputs require flexible spatial prioritization.',
    solution: 'Engineered a variable CSS Grid engine with canvas-based attention tracking. Portions of the workspace expand or compress smoothly on interest tags. It uses visual hierarchy to emphasize critical user-facing outcomes first, rendering complex sub-grids only if requested.',
    metrics: [
      'Completed complex multi-agent workflows 42% faster',
      'Minimized eye-travel distance by 1700px per session',
      'Featured on multiple design networks as UI concept of the year'
    ]
  },
  {
    id: 'brutal-os',
    index: '03',
    category: 'WEB / ARCHITECTURE',
    title: 'BRUTAL.OS',
    year: '2024',
    role: 'Creative Developer',
    tags: ['TypeScript', 'Micro-kernel Sandbox', 'Monospaced UI', 'Vanilla CSS'],
    description: 'A highly functional monospaced web environment that replaces bloated operating systems. Designed to serve as a high-speed command terminal, text-editor, and document repository inside a minor 15KB package.',
    challenge: 'Modern workspace tools like Notion, Slack, and IDEs run heavy background tasks, slowing down low-power laptops and phones when we only need simple, focused notepad and terminal automation.',
    solution: 'Created an in-memory virtual filesystem with an interactive CSS Grid window manager. Features include single-click shell scripting, local storage syncing, custom micro-tools (JSON pretty-printer, ASCII converter, text expander) all styled in premium 2-color high-contrast ink.',
    metrics: [
      'Perfect 100/100 Lighthouse performance on all devices',
      'Loads fully interactive in under 120ms even on 2G connections',
      'Acquired over 15,000 active GitHub stars'
    ]
  }
];

export const LAB_ITEMS: LabItem[] = [
  {
    id: 'shaders',
    index: '01',
    title: 'WAVE SHADERS',
    tech: 'WebGL / Fragment code',
    description: 'An interactive mathematical liquid noise simulation that reactively deforms and repels on mouse hover.',
    interactiveKey: 'shaders',
  },
  {
    id: 'threejs',
    index: '02',
    title: '3D WIRE SPHERE',
    tech: 'React Three Fiber/Three.js',
    description: 'A spinning geometric wireframe cage with kinetic physics that responds to mouse inertia and click drags.',
    interactiveKey: 'threejs',
  },
  {
    id: 'figma-plugins',
    index: '03',
    title: 'AUTOMATION PLUGINS',
    tech: 'Figma API / Typography Helper',
    description: 'A handy tool for developers to analyze text color contrast on elements live for compliance and grid scaling.',
    interactiveKey: 'figma',
  },
  {
    id: 'raw-code',
    index: '04',
    title: 'RAW MATH EXERCISES',
    tech: 'Vanilla JavaScript',
    description: 'An interactive formula visualizer demonstrating real-time Fourier series and math wave assemblies.',
    interactiveKey: 'rawcode',
  },
];

export const EXPERIENCE: ExperienceItem[] = [
  {
    year: '2024 — PRES.',
    role: 'Interaction Designer & Creative Tech Fellow',
    institution: 'Google AI Studio & Laboratory Exploration',
    description: 'Working at the boundary of modern visual development. Prototyping next-generation interfaces for human-model collaboration, implementing custom React architectures, and research setups.'
  },
  {
    year: '2023 — 2024',
    role: 'Web Specialist & UI Contractor',
    institution: 'Substance Media Zurich',
    description: 'Authored stateful web animations and interactive graphic software for creative agencies, cultural websites, and scientific exhibitions. Built custom high-performance canvas frameworks.'
  },
  {
    year: '2021 — 2025',
    role: 'BFA Interaction Design Candidate',
    institution: 'Metro Academy of Art & Technology',
    description: 'Focusing on kinetic typography, reactive environments, data visualizations, and system architecture. Thesis on organic UI layouts designed to combat digital fatigue.'
  }
];
