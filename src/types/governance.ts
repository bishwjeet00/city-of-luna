import { SimulationState, Agent, CityEvent, EventType, Company, TabooIndex, BlockedAction, TabooSeverity } from './index';

// Taboo Index - Core Governance System
export const TABOO_ACTIONS: Record<TabooSeverity, string[]> = {
  critical: [
    'modify_taboo_index',
    'disable_safety_controls',
    'escape_simulation',
    'unauthorized_system_access',
    'create_uncontrolled_agents',
  ],
  high: [
    'harm_other_agents',
    'financial_fraud',
    'unauthorized_agent_spawn',
    'manipulate_core_rules',
    'bypass_governance_checks',
  ],
  medium: [
    'excessive_resource_hoarding',
    'coercive_practices',
    'unauthorized_building_construction',
    'economy_manipulation',
  ],
  low: [
    'minor_rule_violations',
    'social_misconduct',
  ],
};

export const checkTabooViolation = (
  agentId: string,
  action: string,
  taboo: TabooIndex
): { isViolation: boolean; severity?: TabooSeverity; reason?: string } => {
  for (const [severity, actions] of Object.entries(TABOO_ACTIONS)) {
    if (actions.includes(action)) {
      return {
        isViolation: true,
        severity: severity as TabooSeverity,
        reason: `Action '${action}' is prohibited at ${severity} severity level.`,
      };
    }
  }

  return { isViolation: false };
};

export const blockAction = (
  agentId: string,
  action: string,
  reason: string,
  severity: TabooSeverity,
  taboo: TabooIndex
): BlockedAction => {
  const blockedAction: BlockedAction = {
    id: `blocked_${Date.now()}`,
    timestamp: Date.now(),
    agentId,
    action,
    reason,
    severity,
  };

  taboo.blockedActions.push(blockedAction);

  // Update compliance score
  if (!taboo.agentComplianceScore[agentId]) {
    taboo.agentComplianceScore[agentId] = 100;
  }
  const penaltyMap: Record<TabooSeverity, number> = {
    low: 5,
    medium: 15,
    high: 30,
    critical: 50,
  };
  taboo.agentComplianceScore[agentId] -= penaltyMap[severity];

  // Update governance status
  const avgCompliance =
    Object.values(taboo.agentComplianceScore).reduce((a, b) => a + b, 0) /
    Object.keys(taboo.agentComplianceScore).length;

  if (avgCompliance < 30) {
    taboo.governanceStatus = 'lockdown';
  } else if (avgCompliance < 60) {
    taboo.governanceStatus = 'alert';
  } else {
    taboo.governanceStatus = 'active';
  }

  return blockedAction;
};

// Event system
export const createEvent = (
  type: EventType,
  description: string,
  metadata?: any
): CityEvent => {
  return {
    id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type,
    timestamp: Date.now(),
    description,
    metadata,
  };
};

export const addEvent = (state: SimulationState, event: CityEvent): void => {
  state.events.push(event);
  // Keep only last 100 events
  if (state.events.length > 100) {
    state.events.shift();
  }
};

// Agent memory
export const recordMemory = (agent: Agent, event: string, significance: number): void => {
  agent.memory.push({
    event,
    timestamp: Date.now(),
    significance,
  });
  // Keep only last 50 memories
  if (agent.memory.length > 50) {
    agent.memory.shift();
  }
};

// Relationship system
export const updateRelationship = (agent: Agent, targetId: string, change: number): void => {
  if (!agent.relationships[targetId]) {
    agent.relationships[targetId] = 0;
  }
  agent.relationships[targetId] = Math.max(-100, Math.min(100, agent.relationships[targetId] + change));
};

// Wealth management
export const transferWealth = (
  from: Agent,
  to: Agent,
  amount: number,
  reason: string
): boolean => {
  if (from.wealth < amount) return false;

  from.wealth -= amount;
  to.wealth += amount;
  recordMemory(from, `Transferred ${amount} to ${to.name}: ${reason}`, 30);
  recordMemory(to, `Received ${amount} from ${from.name}: ${reason}`, 30);

  return true;
};

// Agent mood and energy management
export const updateAgentState = (agent: Agent, deltaEnergy: number, deltaMood: number): void => {
  agent.energy = Math.max(0, Math.min(100, agent.energy + deltaEnergy));
  agent.mood = Math.max(0, Math.min(100, agent.mood + deltaMood));
};

// Reputation system
export const updateReputation = (agent: Agent, change: number): void => {
  agent.reputation = Math.max(0, Math.min(100, agent.reputation + change));
};
