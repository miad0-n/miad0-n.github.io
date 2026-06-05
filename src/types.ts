/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Project {
  id: string;
  index: string;
  category: string;
  title: string;
  year: string;
  role: string;
  tags: string[];
  description: string;
  challenge: string;
  solution: string;
  metrics: string[];
}

export interface LabItem {
  id: string;
  index: string;
  title: string;
  tech: string;
  description: string;
  interactiveKey: 'shaders' | 'threejs' | 'figma' | 'rawcode';
}

export interface NavSection {
  index: number;
  label: string;
  tag: string;
}

export interface ExperienceItem {
  year: string;
  role: string;
  institution: string;
  description: string;
}

export interface ContactFormModel {
  name: string;
  email: string;
  projectType: string;
  message: string;
}
