import { SimulationState, Agent, Company, Building, Job } from '@/types';
import { TABOO_ACTIONS } from '@/types/governance';

export type ValidationLayer =
  | 'ui'
  | 'state'
  | 'simulation'
  | 'agent_decision'
  | 'economy'
  | 'hiring'
  | 'building'
  | 'spawning'
  | 'taboo'
  | 'performance';

export type ErrorSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface ValidationError {
  id: string;
  layer: ValidationLayer;
  severity: ErrorSeverity;
  message: string;
  timestamp: number;
  rootCause?: string;
  suggestedFix?: string;
  affectedEntity?: string;
  recoverable: boolean;
  correctionAttempts: number;
  maxRetries: number;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
  correctionsMade: string[];
  correctionLoops: number;
}

// Validation Engine
export class ValidationEngine {
  private correctionLoops: number = 0;
  private maxCorrectionLoops: number = 3;
  private errors: Map<string, ValidationError> = new Map();

  validateState(state: SimulationState): ValidationResult {
    const result: ValidationResult = {
      isValid: true,
      errors: [],
      warnings: [],
      correctionsMade: [],
      correctionLoops: this.correctionLoops,
    };

    // Run all validation layers
    this.validateTabooIndex(state, result);
    this.validateAgents(state, result);
    this.validateEconomy(state, result);
    this.validateCompanies(state, result);
    this.validateBuildings(state, result);
    this.validateJobs(state, result);
    this.validatePerformance(state, result);

    // Attempt auto-correction
    if (result.errors.length > 0) {
      this.attemptAutoCorrection(state, result);
    }

    result.isValid = result.errors.filter((e) => e.severity === 'critical').length === 0;
    return result;
  }

  private validateTabooIndex(state: SimulationState, result: ValidationResult): void {
    const taboo = state.tabooIndex;

    // Verify Taboo Index integrity
    if (!taboo.actions || taboo.actions.length === 0) {
      result.errors.push({
        id: `err_taboo_empty_${Date.now()}`,
        layer: 'taboo',
        severity: 'critical',
        message: 'Taboo Index actions list is empty or undefined',
        timestamp: Date.now(),
        rootCause: 'Taboo Index structure corrupted or not initialized',
        suggestedFix: 'Reinitialize Taboo Index with default rules',
        recoverable: true,
        correctionAttempts: 0,
        maxRetries: 1,
      });
    }

    // Verify governance status is valid
    const validStatuses = ['active', 'alert', 'lockdown'];
    if (!validStatuses.includes(taboo.governanceStatus)) {
      result.warnings.push({
        id: `warn_governance_status_${Date.now()}`,
        layer: 'taboo',
        severity: 'medium',
        message: `Invalid governance status: ${taboo.governanceStatus}`,
        timestamp: Date.now(),
        suggestedFix: 'Reset to "active" status',
        recoverable: true,
        correctionAttempts: 0,
        maxRetries: 1,
      });
    }

    // Verify compliance scores are in valid range
    for (const [agentId, score] of Object.entries(taboo.agentComplianceScore)) {
      if (score < 0 || score > 100) {
        result.warnings.push({
          id: `warn_compliance_range_${agentId}_${Date.now()}`,
          layer: 'taboo',
          severity: 'medium',
          message: `Agent ${agentId} compliance score out of range: ${score}%`,
          timestamp: Date.now(),
          affectedEntity: agentId,
          suggestedFix: `Clamp compliance score to [0, 100]`,
          recoverable: true,
          correctionAttempts: 0,
          maxRetries: 1,
        });
      }
    }
  }

  private validateAgents(state: SimulationState, result: ValidationResult): void {
    for (const agent of state.agents) {
      // Check for NaN values
      if (isNaN(agent.wealth) || isNaN(agent.energy) || isNaN(agent.mood)) {
        result.errors.push({
          id: `err_agent_nan_${agent.id}_${Date.now()}`,
          layer: 'agent_decision',
          severity: 'high',
          message: `Agent ${agent.name} has NaN values in state`,
          timestamp: Date.now(),
          affectedEntity: agent.id,
          rootCause: 'Invalid mathematical operation or uninitialized value',
          suggestedFix: 'Reset affected properties to last known good values',
          recoverable: true,
          correctionAttempts: 0,
          maxRetries: 2,
        });
      }

      // Check for invalid ranges
      if (agent.energy < 0 || agent.energy > 100) {
        result.warnings.push({
          id: `warn_agent_energy_${agent.id}_${Date.now()}`,
          layer: 'agent_decision',
          severity: 'medium',
          message: `Agent ${agent.name} energy out of range: ${agent.energy}`,
          timestamp: Date.now(),
          affectedEntity: agent.id,
          suggestedFix: 'Clamp energy to [0, 100]',
          recoverable: true,
          correctionAttempts: 0,
          maxRetries: 1,
        });
      }

      // Check for skill level consistency
      for (const skill of agent.skills) {
        if (skill.level < 0 || skill.level > 100) {
          result.warnings.push({
            id: `warn_skill_range_${agent.id}_${skill.type}_${Date.now()}`,
            layer: 'agent_decision',
            severity: 'medium',
            message: `Agent ${agent.name} skill ${skill.type} out of range: ${skill.level}`,
            timestamp: Date.now(),
            affectedEntity: agent.id,
            suggestedFix: `Clamp ${skill.type} to [0, 100]`,
            recoverable: true,
            correctionAttempts: 0,
            maxRetries: 1,
          });
        }
      }

      // Check for circular relationships
      const relationshipSum = Object.values(agent.relationships).length;
      if (relationshipSum > state.agents.length - 1) {
        result.warnings.push({
          id: `warn_agent_circular_rel_${agent.id}_${Date.now()}`,
          layer: 'state',
          severity: 'low',
          message: `Agent ${agent.name} has inconsistent relationship count`,
          timestamp: Date.now(),
          affectedEntity: agent.id,
          suggestedFix: 'Purge invalid relationships',
          recoverable: true,
          correctionAttempts: 0,
          maxRetries: 1,
        });
      }
    }
  }

  private validateEconomy(state: SimulationState, result: ValidationResult): void {
    const economy = state.economy;

    // Check for negative wealth (should be possible but track anomalies)
    if (economy.totalWealth < 0) {
      result.warnings.push({
        id: `warn_negative_economy_${Date.now()}`,
        layer: 'economy',
        severity: 'medium',
        message: `Total economy wealth is negative: ${economy.totalWealth}`,
        timestamp: Date.now(),
        rootCause: 'Agents spent more than available resources',
        suggestedFix: 'Implement spending caps or debt management',
        recoverable: false,
        correctionAttempts: 0,
        maxRetries: 0,
      });
    }

    // Check unemployment rate validity
    if (economy.unemploymentRate < 0 || economy.unemploymentRate > 1) {
      result.warnings.push({
        id: `warn_unemployment_range_${Date.now()}`,
        layer: 'economy',
        severity: 'medium',
        message: `Unemployment rate out of range: ${economy.unemploymentRate}`,
        timestamp: Date.now(),
        suggestedFix: 'Recalculate unemployment rate from agent employment status',
        recoverable: true,
        correctionAttempts: 0,
        maxRetries: 1,
      });
    }

    // Check inflation validity
    if (economy.inflation < -0.5 || economy.inflation > 0.5) {
      result.warnings.push({
        id: `warn_inflation_range_${Date.now()}`,
        layer: 'economy',
        severity: 'low',
        message: `Inflation rate unusual: ${economy.inflation}`,
        timestamp: Date.now(),
        suggestedFix: 'Recalibrate inflation calculation',
        recoverable: true,
        correctionAttempts: 0,
        maxRetries: 1,
      });
    }
  }

  private validateCompanies(state: SimulationState, result: ValidationResult): void {
    for (const company of state.companies) {
      // Check for orphaned companies
      const founder = state.agents.find((a) => a.id === company.founderId);
      if (!founder && company.isActive) {
        result.warnings.push({
          id: `warn_orphaned_company_${company.id}_${Date.now()}`,
          layer: 'hiring',
          severity: 'medium',
          message: `Company ${company.name} founder not found`,
          timestamp: Date.now(),
          affectedEntity: company.id,
          suggestedFix: 'Deactivate company or reassign founder',
          recoverable: true,
          correctionAttempts: 0,
          maxRetries: 1,
        });
      }

      // Check for invalid employee lists
      for (const employeeId of company.employees) {
        const employee = state.agents.find((a) => a.id === employeeId);
        if (!employee) {
          result.warnings.push({
            id: `warn_missing_employee_${company.id}_${employeeId}_${Date.now()}`,
            layer: 'hiring',
            severity: 'medium',
            message: `Company ${company.name} references missing employee ${employeeId}`,
            timestamp: Date.now(),
            affectedEntity: company.id,
            suggestedFix: 'Remove invalid employee reference',
            recoverable: true,
            correctionAttempts: 0,
            maxRetries: 1,
          });
        }
      }

      // Check for NaN financial values
      if (isNaN(company.revenue) || isNaN(company.expenses)) {
        result.errors.push({
          id: `err_company_finance_${company.id}_${Date.now()}`,
          layer: 'economy',
          severity: 'high',
          message: `Company ${company.name} has invalid financial data`,
          timestamp: Date.now(),
          affectedEntity: company.id,
          suggestedFix: 'Recalculate company financials from scratch',
          recoverable: true,
          correctionAttempts: 0,
          maxRetries: 1,
        });
      }
    }
  }

  private validateBuildings(state: SimulationState, result: ValidationResult): void {
    for (const building of state.buildings) {
      // Check for out-of-bounds positions
      if (building.position.x < 0 || building.position.y < 0 || 
          building.position.x > 1000 || building.position.y > 1000) {
        result.warnings.push({
          id: `warn_building_position_${building.id}_${Date.now()}`,
          layer: 'building',
          severity: 'low',
          message: `Building ${building.name} has unusual position`,
          timestamp: Date.now(),
          affectedEntity: building.id,
          suggestedFix: 'Reset to default position or clamp to valid bounds',
          recoverable: true,
          correctionAttempts: 0,
          maxRetries: 1,
        });
      }

      // Check for orphaned buildings
      const owner = state.agents.find((a) => a.id === building.ownerId) || 
                    state.companies.find((c) => c.id === building.ownerId);
      if (!owner) {
        result.warnings.push({
          id: `warn_orphaned_building_${building.id}_${Date.now()}`,
          layer: 'building',
          severity: 'medium',
          message: `Building ${building.name} owner not found`,
          timestamp: Date.now(),
          affectedEntity: building.id,
          suggestedFix: 'Reassign to valid owner or remove building',
          recoverable: true,
          correctionAttempts: 0,
          maxRetries: 1,
        });
      }
    }
  }

  private validateJobs(state: SimulationState, result: ValidationResult): void {
    for (const job of state.jobs) {
      // Check for orphaned jobs
      const company = state.companies.find((c) => c.id === job.companyId);
      if (!company) {
        result.warnings.push({
          id: `warn_orphaned_job_${job.id}_${Date.now()}`,
          layer: 'hiring',
          severity: 'medium',
          message: `Job ${job.title} belongs to non-existent company`,
          timestamp: Date.now(),
          affectedEntity: job.id,
          suggestedFix: 'Remove orphaned job posting',
          recoverable: true,
          correctionAttempts: 0,
          maxRetries: 1,
        });
      }

      // Check for invalid salary
      if (job.salaryPerTick < 0 || isNaN(job.salaryPerTick)) {
        result.errors.push({
          id: `err_job_salary_${job.id}_${Date.now()}`,
          layer: 'hiring',
          severity: 'high',
          message: `Job ${job.title} has invalid salary: ${job.salaryPerTick}`,
          timestamp: Date.now(),
          affectedEntity: job.id,
          suggestedFix: 'Set salary to reasonable minimum (e.g., 5)',
          recoverable: true,
          correctionAttempts: 0,
          maxRetries: 1,
        });
      }
    }
  }

  private validatePerformance(state: SimulationState, result: ValidationResult): void {
    // Check for excessive state size
    if (state.events.length > 10000) {
      result.warnings.push({
        id: `warn_event_queue_size_${Date.now()}`,
        layer: 'performance',
        severity: 'low',
        message: `Event queue is very large: ${state.events.length} events`,
        timestamp: Date.now(),
        suggestedFix: 'Trim event history to last 1000 events',
        recoverable: true,
        correctionAttempts: 0,
        maxRetries: 1,
      });
    }

    // Check for excessive agents
    if (state.agents.length > 1000) {
      result.warnings.push({
        id: `warn_agent_population_${Date.now()}`,
        layer: 'performance',
        severity: 'medium',
        message: `Population exceeds recommended limit: ${state.agents.length} agents`,
        timestamp: Date.now(),
        suggestedFix: 'Consider agent culling or compression',
        recoverable: false,
        correctionAttempts: 0,
        maxRetries: 0,
      });
    }
  }

  private attemptAutoCorrection(state: SimulationState, result: ValidationResult): void {
    if (this.correctionLoops >= this.maxCorrectionLoops) {
      result.errors.push({
        id: `err_correction_limit_${Date.now()}`,
        layer: 'state',
        severity: 'high',
        message: 'Maximum correction loop limit reached',
        timestamp: Date.now(),
        rootCause: 'Unable to automatically fix all errors after multiple attempts',
        suggestedFix: 'Manual intervention required or reset simulation',
        recoverable: false,
        correctionAttempts: this.correctionLoops,
        maxRetries: this.maxCorrectionLoops,
      });
      return;
    }

    this.correctionLoops++;

    // Auto-fix errors that are recoverable
    const recoverableErrors = result.errors.filter((e) => e.recoverable && e.correctionAttempts < e.maxRetries);

    for (const error of recoverableErrors) {
      let fixed = false;

      switch (error.layer) {
        case 'agent_decision':
          if (error.message.includes('NaN')) {
            // Repair agent values
            for (const agent of state.agents) {
              if (isNaN(agent.wealth)) agent.wealth = 100;
              if (isNaN(agent.energy)) agent.energy = 50;
              if (isNaN(agent.mood)) agent.mood = 70;
            }
            fixed = true;
          } else if (error.message.includes('out of range')) {
            // Clamp agent properties
            for (const agent of state.agents) {
              agent.energy = Math.max(0, Math.min(100, agent.energy));
              agent.mood = Math.max(0, Math.min(100, agent.mood));
              agent.skills.forEach((s) => {
                s.level = Math.max(0, Math.min(100, s.level));
              });
            }
            fixed = true;
          }
          break;

        case 'economy':
          if (error.message.includes('Unemployment')) {
            const employed = state.agents.filter((a) => a.jobId !== null).length;
            state.economy.unemploymentRate = (state.agents.length - employed) / state.agents.length;
            fixed = true;
          }
          break;

        case 'hiring':
          if (error.message.includes('orphaned')) {
            // Remove invalid references
            state.companies = state.companies.filter((c) => c.isActive);
            state.jobs = state.jobs.filter((j) => state.companies.find((c) => c.id === j.companyId));
            fixed = true;
          }
          break;

        case 'taboo':
          if (error.message.includes('empty')) {
            // Re-initialize Taboo Index (but never modify rules)
            error.suggestedFix = 'Cannot auto-fix: Taboo Index is immutable';
            fixed = false;
          }
          break;
      }

      if (fixed) {
        error.correctionAttempts++;
        result.correctionsMade.push(`Fixed: ${error.message}`);
      }
    }
  }

  reset(): void {
    this.correctionLoops = 0;
    this.errors.clear();
  }
}

// Export singleton instance
export const validationEngine = new ValidationEngine();
