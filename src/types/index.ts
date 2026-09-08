// Types and interfaces for City of Luna

export type Personality = 'ambitious' | 'creative' | 'analytical' | 'empathetic' | 'pragmatic' | 'cautious' | 'spontaneous' | 'collaborative' | 'independent' | 'visionary';

export type JobType = 'unemployed' | 'worker' | 'specialist' | 'manager' | 'executive' | 'entrepreneur' | 'researcher';

export type SkillType = 'programming' | 'marketing' | 'management' | 'finance' | 'design' | 'sales' | 'research' | 'leadership' | 'negotiation' | 'innovation';

export type BuildingType = 'office' | 'shop' | 'factory' | 'research_center' | 'housing' | 'tech_hub' | 'bank';

export type EventType = 
  | 'skill_learned'
  | 'job_applied'
  | 'job_hired'
  | 'job_fired'
  | 'job_promotion'
  | 'company_founded'
  | 'agent_hired'
  | 'agent_fired'
  | 'building_constructed'
  | 'agent_spawned'
  | 'taboo_violated'
  | 'salary_negotiated'
  | 'business_closed'
  | 'investment_made'
  | 'relationship_formed'
  | 'relationship_broken';

export type TabooSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface Skill {
  type: SkillType;
  level: number; // 0-100
  experiencePoints: number;
  lastUpdated: number;
}

export interface Agent {
  id: string;
  name: string;
  personality: Personality;
  age: number; // in simulation ticks
  mood: number; // 0-100
  energy: number; // 0-100
  wealth: number;
  savings: number;
  skills: Skill[];
  jobId: string | null;
  companyId: string | null;
  employeesManaged: string[];
  relationships: Record<string, number>; // agentId -> relationship strength (-100 to 100)
  memory: AgentMemory[];
  goals: Goal[];
  position: { x: number; y: number };
  createdAt: number;
  reputation: number; // 0-100
  isAlive: boolean;
  spawnedBy?: string; // agentId of the creator
  decision?: {
    action: string;
    reasoning: string;
    timestamp: number;
  };
}

export interface AgentMemory {
  event: string;
  timestamp: number;
  significance: number; // 0-100
}

export interface Goal {
  id: string;
  type: string;
  description: string;
  progress: number; // 0-100
  priority: number; // 0-100
  dueAt?: number;
  completed: boolean;
}

export interface Job {
  id: string;
  title: string;
  companyId: string;
  salaryPerTick: number;
  requiredSkills: { type: SkillType; minLevel: number }[];
  openPositions: number;
  description: string;
}

export interface Company {
  id: string;
  name: string;
  founderId: string;
  revenue: number;
  expenses: number;
  employees: string[];
  managers: string[];
  buildingIds: string[];
  founded: number;
  closed?: number;
  isActive: boolean;
  reputation: number;
}

export interface Building {
  id: string;
  type: BuildingType;
  name: string;
  position: { x: number; y: number };
  ownerId: string; // agentId or companyId
  constructedAt: number;
  agentsInBuilding: string[];
  productionCapacity?: number;
  storageCapacity?: number;
}

export interface CityEvent {
  id: string;
  type: EventType;
  timestamp: number;
  agent?: string;
  company?: string;
  building?: string;
  description: string;
  metadata?: Record<string, any>;
}

export interface TabooAction {
  id: string;
  action: string;
  description: string;
  severity: TabooSeverity;
  consequences: string[];
}

export interface BlockedAction {
  id: string;
  timestamp: number;
  agentId: string;
  action: string;
  reason: string;
  severity: TabooSeverity;
}

export interface TabooIndex {
  actions: TabooAction[];
  blockedActions: BlockedAction[];
  agentComplianceScore: Record<string, number>; // agentId -> compliance %
  governanceStatus: 'active' | 'alert' | 'lockdown';
}

export interface SimulationState {
  tick: number;
  paused: boolean;
  speed: number; // 1x, 2x, 4x, etc.
  agents: Agent[];
  jobs: Job[];
  companies: Company[];
  buildings: Building[];
  events: CityEvent[];
  tabooIndex: TabooIndex;
  economy: EconomyState;
  population: PopulationStats;
}

export interface EconomyState {
  totalWealth: number;
  totalRevenue: number;
  totalExpenses: number;
  averageSalary: number;
  unemploymentRate: number;
  gdp: number;
  inflation: number;
}

export interface PopulationStats {
  totalAgents: number;
  activeAgents: number;
  unemployed: number;
  entrepreneurs: number;
  totalCompanies: number;
  totalBuildings: number;
}
