import type { PassportStamp } from '../../core/models/passport';

export interface Achievement {
  date: string;
  stamp: string;
  stampAlt: string;
  skill: string;
  type: string;
  learningLabel: string;
  description: string;
  earnedThrough: string;
}

export function passportStampToAchievement(stamp: PassportStamp): Achievement {
  const stampAssets = {
    'AI Skill': '/assets/Artboard%203%20(2).png',
    'AI Applied Skill': '/assets/Artboard%204%20(1).png',
    'AI Advanced Skill': '/assets/Artboard%205%20(1).png',
  };
  const learningLabels = {
    'AI Skill': 'FOCUSED LEARNING',
    'AI Applied Skill': 'APPLIED LEARNING',
    'AI Advanced Skill': 'EXTENDED ACADEMIC LEARNING',
  };

  return {
    date: new Date(`${stamp.issuedAt}T00:00:00`).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }),
    stamp: stampAssets[stamp.type],
    stampAlt: `${stamp.type} achievement stamp`,
    skill: stamp.skillName.toUpperCase(),
    type: stamp.type.toUpperCase(),
    learningLabel: learningLabels[stamp.type],
    description: stamp.description,
    earnedThrough: stamp.earnedThrough,
  };
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    date: '12 Mar 2026',
    stamp: '/assets/Artboard%203%20(2).png',
    stampAlt: 'AI focused learning stamp',
    skill: 'PROMPT ENGINEERING',
    type: 'AI SKILL',
    learningLabel: 'FOCUSED LEARNING',
    description: 'Design effective prompts and evaluate responses for reliable AI-assisted work.',
    earnedThrough: 'Prompt Engineering Workshop',
  },
  {
    date: '08 Apr 2026',
    stamp: '/assets/Artboard%204%20(1).png',
    stampAlt: 'AI applied learning stamp',
    skill: 'AI WORKFLOW AUTOMATION',
    type: 'AI APPLIED SKILL',
    learningLabel: 'APPLIED LEARNING',
    description: 'Build an end-to-end automated workflow with AI tools and structured outputs.',
    earnedThrough: 'AI Automation Bootcamp',
  },
  {
    date: '21 May 2026',
    stamp: '/assets/Artboard%205%20(1).png',
    stampAlt: 'AI advanced learning stamp',
    skill: 'DATA ANALYSIS WITH AI',
    type: 'AI ADVANCED SKILL',
    learningLabel: 'ADVANCED LEARNING',
    description: 'Analyze datasets, validate findings, and communicate insights using AI.',
    earnedThrough: 'Data Analytics Certificate',
  },
  {
    date: '04 Jun 2026',
    stamp: '/assets/Artboard%203%20(2).png',
    stampAlt: 'AI focused learning stamp',
    skill: 'AI ETHICS & RESPONSIBLE USE',
    type: 'AI SKILL',
    learningLabel: 'FOCUSED LEARNING',
    description: 'Identify bias, protect privacy, and apply responsible AI principles.',
    earnedThrough: 'Responsible AI Masterclass',
  },
  {
    date: '18 Sep 2026',
    stamp: '/assets/Artboard%204%20(1).png',
    stampAlt: 'AI applied learning stamp',
    skill: 'AI AGENTS',
    type: 'AI APPLIED SKILL',
    learningLabel: 'APPLIED LEARNING',
    description: 'Build and evaluate task-oriented AI agents with tools and safeguards.',
    earnedThrough: 'AI Agent Challenge',
  },
];
