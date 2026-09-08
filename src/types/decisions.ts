import { Agent, Job, Company, Building, CityEvent, TabooIndex, BlockedAction, TabooAction } from './index';

// Core agent decision logic
export const makeAgentDecision = (agent: Agent, availableJobs: Job[], availableCompanies: Company[]): string => {
  const personality = agent.personality;
  const wealth = agent.wealth;
  const avgSkillLevel = agent.skills.reduce((sum, s) => sum + s.level, 0) / Math.max(agent.skills.length, 1);
  const isEmployed = agent.jobId !== null;

  // Decision tree based on personality and state
  if (!isEmployed && wealth > 100) {
    // Consider entrepreneurship
    if (['ambitious', 'visionary', 'pragmatic'].includes(personality)) {
      return 'consider_starting_business';
    }
  }

  if (!isEmployed) {
    if (availableJobs.length > 0) {
      return 'apply_for_job';
    }
  }

  if (isEmployed && avgSkillLevel > 60) {
    if (['ambitious', 'visionary'].includes(personality)) {
      return 'seek_promotion';
    }
  }

  if (avgSkillLevel < 70 && agent.energy > 40) {
    if (['ambitious', 'analytical', 'creative'].includes(personality)) {
      return 'learn_skill';
    }
  }

  // Default: rest or maintain
  if (agent.energy < 50) {
    return 'rest';
  }

  return 'idle';
};

// Skill learning logic
export const learnSkill = (agent: Agent, skillType: string): number => {
  const personalitiesToSkillAffinities: Record<string, Record<string, number>> = {
    ambitious: { management: 0.9, leadership: 0.9, sales: 0.8 },
    creative: { design: 0.95, innovation: 0.9, marketing: 0.8 },
    analytical: { programming: 0.95, research: 0.9, finance: 0.85 },
    empathetic: { leadership: 0.9, negotiation: 0.9, management: 0.75 },
    pragmatic: { finance: 0.9, sales: 0.85, management: 0.85 },
    cautious: { research: 0.8, finance: 0.85, programming: 0.8 },
    spontaneous: { sales: 0.9, marketing: 0.9, innovation: 0.8 },
    collaborative: { leadership: 0.9, management: 0.85, negotiation: 0.85 },
    independent: { programming: 0.9, innovation: 0.9, entrepreneurship: 0.85 },
    visionary: { innovation: 0.95, leadership: 0.85, management: 0.8 },
  };

  const affinityMap = personalitiesToSkillAffinities[agent.personality] || {};
  const affinityBonus = affinityMap[skillType] || 0.5;
  const experienceGain = Math.floor(10 * affinityBonus);

  return experienceGain;
};

// Hiring decision logic
export const shouldHire = (manager: Agent, candidate: Agent, salary: number): boolean => {
  const avgSkillLevel = candidate.skills.reduce((sum, s) => sum + s.level, 0) / Math.max(candidate.skills.length, 1);

  if (manager.personality === 'ambitious' && avgSkillLevel > 50) {
    return true;
  }

  if (manager.personality === 'analytical' && avgSkillLevel > 60) {
    return true;
  }

  if (manager.personality === 'pragmatic' && avgSkillLevel > 45 && salary < manager.wealth * 0.1) {
    return true;
  }

  if (manager.personality === 'empathetic') {
    return true; // More likely to hire
  }

  return Math.random() > 0.7;
};

// Salary negotiation
export const negotiateSalary = (employer: Company, employee: Agent): number => {
  const avgSkillLevel = employee.skills.reduce((sum, s) => sum + s.level, 0) / Math.max(employee.skills.length, 1);
  const baseSalary = 10 + (avgSkillLevel / 100) * 40;
  const negotiationPower = employee.personality === 'pragmatic' ? 1.2 : 1.0;

  return Math.floor(baseSalary * negotiationPower);
};

// Business viability check
export const canStartBusiness = (agent: Agent, taboo: TabooIndex): boolean => {
  const avgSkillLevel = agent.skills.reduce((sum, s) => sum + s.level, 0) / Math.max(agent.skills.length, 1);
  const hasEnoughWealth = agent.wealth > 50;
  const hasSkill = avgSkillLevel > 40;
  const noTabooViolations = agent.id in taboo.agentComplianceScore && taboo.agentComplianceScore[agent.id] > 50;

  return hasEnoughWealth && hasSkill && noTabooViolations;
};

// Spawn decision - when can agents create new agents
export const canSpawnAgent = (
  creator: Agent,
  currentPopulation: number,
  maxPopulation: number,
  spawnCost: number
): boolean => {
  if (currentPopulation >= maxPopulation) return false;
  if (creator.wealth < spawnCost) return false;
  if (creator.personality !== 'ambitious' && creator.personality !== 'visionary') return false;

  return true;
};
