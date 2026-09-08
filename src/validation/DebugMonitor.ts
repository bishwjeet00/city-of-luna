import { SimulationState } from '@/types';
import { ValidationEngine, ValidationResult } from './ValidationEngine';

export interface DebugLog {
  timestamp: number;
  tick: number;
  validationResult: ValidationResult;
  systemHealth: number; // 0-100
  correctionAttempts: number;
  blockageStatus: 'clear' | 'minor' | 'major' | 'critical';
  notes: string[];
}

export class DebugMonitor {
  private logs: DebugLog[] = [];
  private maxLogs: number = 1000;
  private validationEngine: ValidationEngine;

  constructor(validationEngine: ValidationEngine) {
    this.validationEngine = validationEngine;
  }

  performDiagnostics(state: SimulationState): DebugLog {
    const validationResult = this.validationEngine.validateState(state);
    
    // Calculate system health
    const criticalCount = validationResult.errors.filter((e) => e.severity === 'critical').length;
    const highCount = validationResult.errors.filter((e) => e.severity === 'high').length;
    const mediumCount = validationResult.warnings.filter((w) => w.severity === 'medium').length;
    
    let systemHealth = 100;
    systemHealth -= criticalCount * 50;
    systemHealth -= highCount * 20;
    systemHealth -= mediumCount * 5;
    systemHealth = Math.max(0, Math.min(100, systemHealth));

    // Determine blockage status
    let blockageStatus: 'clear' | 'minor' | 'major' | 'critical';
    if (criticalCount > 0) {
      blockageStatus = 'critical';
    } else if (highCount > 2 || mediumCount > 5) {
      blockageStatus = 'major';
    } else if (highCount > 0 || mediumCount > 0) {
      blockageStatus = 'minor';
    } else {
      blockageStatus = 'clear';
    }

    const log: DebugLog = {
      timestamp: Date.now(),
      tick: state.tick,
      validationResult,
      systemHealth,
      correctionAttempts: validationResult.correctionLoops,
      blockageStatus,
      notes: this.generateNotes(validationResult, blockageStatus),
    };

    this.logs.push(log);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    return log;
  }

  private generateNotes(result: ValidationResult, blockageStatus: string): string[] {
    const notes: string[] = [];

    notes.push(`Status: ${blockageStatus}`);
    
    if (result.errors.length > 0) {
      notes.push(`Critical Issues: ${result.errors.length}`);
      notes.push(`- ${result.errors.map((e) => e.message).join('; ')}`);
    }

    if (result.correctionsMade.length > 0) {
      notes.push(`Auto-Corrections: ${result.correctionsMade.length}`);
      notes.push(`- ${result.correctionsMade.join('; ')}`);
    }

    if (result.isValid) {
      notes.push('✓ All critical validations passed');
    }

    return notes;
  }

  getLatestLogs(count: number = 10): DebugLog[] {
    return this.logs.slice(-count);
  }

  getSystemHealthTrend(): number[] {
    return this.logs.slice(-50).map((log) => log.systemHealth);
  }

  exportDiagnosticsReport(): string {
    const latestLog = this.logs[this.logs.length - 1];
    if (!latestLog) return 'No diagnostic data available';

    return `
=== CITY OF LUNA DIAGNOSTICS REPORT ===
Timestamp: ${new Date(latestLog.timestamp).toISOString()}
Simulation Tick: ${latestLog.tick}

System Health: ${latestLog.systemHealth}%
Blockage Status: ${latestLog.blockageStatus}
Correction Attempts: ${latestLog.correctionAttempts}

Validation Results:
- Errors: ${latestLog.validationResult.errors.length}
- Warnings: ${latestLog.validationResult.warnings.length}
- Corrections Made: ${latestLog.validationResult.correctionsMade.length}

Notes:
${latestLog.notes.map((n) => `  - ${n}`).join('\n')}

Validation Layers:
- UI/Component: ${latestLog.validationResult.errors.filter((e) => e.layer === 'ui').length} issues
- State Management: ${latestLog.validationResult.errors.filter((e) => e.layer === 'state').length} issues
- Simulation Engine: ${latestLog.validationResult.errors.filter((e) => e.layer === 'simulation').length} issues
- Agent Decisions: ${latestLog.validationResult.errors.filter((e) => e.layer === 'agent_decision').length} issues
- Economy: ${latestLog.validationResult.errors.filter((e) => e.layer === 'economy').length} issues
- Hiring/Employment: ${latestLog.validationResult.errors.filter((e) => e.layer === 'hiring').length} issues
- Buildings: ${latestLog.validationResult.errors.filter((e) => e.layer === 'building').length} issues
- Agent Spawning: ${latestLog.validationResult.errors.filter((e) => e.layer === 'spawning').length} issues
- Taboo Index: ${latestLog.validationResult.errors.filter((e) => e.layer === 'taboo').length} issues
- Performance: ${latestLog.validationResult.errors.filter((e) => e.layer === 'performance').length} issues
    `;
  }

  reset(): void {
    this.logs = [];
  }
}
