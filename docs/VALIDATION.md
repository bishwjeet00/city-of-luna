# Validation Engine & Error Correction System

## Overview

The City of Luna includes a comprehensive autonomous error-correction and debugging system that continuously monitors simulation health and automatically fixes recoverable issues.

## Architecture

### 1. Validation Engine (`ValidationEngine.ts`)

The core validation system that checks 10 critical layers:

**Validation Layers:**
- **UI/Component**: React component rendering and state
- **State Management**: Zustand store consistency
- **Simulation Engine**: Core tick logic and updates
- **Agent Decisions**: Agent state, skills, finances
- **Economy**: Wealth, GDP, unemployment rate
- **Hiring/Employment**: Jobs, companies, employment relationships
- **Buildings**: Infrastructure, ownership, positions
- **Agent Spawning**: Population limits, spawn authorization
- **Taboo Index**: Governance rules, compliance, safety
- **Performance**: Memory usage, entity counts

### 2. Debug Monitor (`DebugMonitor.ts`)

Continuously monitors system health and generates diagnostics:

- **System Health Score** (0-100%)
- **Blockage Status** (clear/minor/major/critical)
- **Diagnostic Logging** (up to 1000 historical logs)
- **Report Generation** (exportable diagnostics)

### 3. Validation Panel UI (`ValidationPanel.tsx`)

Real-time visualization of:
- System health gauge
- Issue counts by severity
- Validation layer breakdown
- Auto-correction history
- Detailed error reports

## How It Works

### The Validation Cycle

```
BUILD → RUN → TEST → DETECT → DIAGNOSE → FIX → VERIFY → REPEAT
```

1. **BUILD**: Simulation executes one tick
2. **RUN**: All agents update, companies process, economy calculates
3. **TEST**: ValidationEngine performs full diagnostics
4. **DETECT**: Identifies errors in each validation layer
5. **DIAGNOSE**: Determines root cause and recovery approach
6. **FIX**: Attempts automatic correction (if recoverable)
7. **VERIFY**: Re-runs validation to confirm fix worked
8. **REPEAT**: Continues for up to 3 correction loops

### Error Severity Levels

| Severity | Impact | Auto-Fix | Action |
|----------|--------|----------|--------|
| **Critical** | System-breaking | Never | Stop operation, alert user |
| **High** | Major malfunction | Yes (if recoverable) | Attempt fix, log attempt |
| **Medium** | Degraded performance | Yes | Auto-correct silently |
| **Low** | Minor issues | Yes | Fix without user notification |

## Examples of Detected & Fixed Issues

### Agent Issues

**Problem**: Agent has NaN (not-a-number) in wealth
```
Error: Agent "Luna-03" has NaN values in state
Root Cause: Invalid mathematical operation
Solution: Reset wealth to last known good value (100)
Status: ✓ FIXED
```

**Problem**: Agent skill out of range (150%)
```
Warning: Skill "programming" is 150% (exceeds max of 100%)
Root Cause: Experience decay calculation overflow
Solution: Clamp to 100%
Status: ✓ FIXED
```

### Economy Issues

**Problem**: Unemployment rate is 1.5 (impossible)
```
Warning: Unemployment rate out of range: 1.5
Root Cause: Calculation error in employment tracking
Solution: Recalculate from agent.jobId assignments
Status: ✓ FIXED
```

### Company Issues

**Problem**: Company references deleted employee
```
Warning: Company "TechCorp" references missing employee "luna-05"
Root Cause: Employee removed but not unlinked from company
Solution: Remove employee reference from company.employees
Status: ✓ FIXED
```

### Safety Issues

**Problem**: Taboo Index is empty
```
Error: Taboo Index actions list is empty
Root Cause: Governance system corrupted
Solution: CANNOT AUTO-FIX - Taboo Index is immutable
Action: Stop simulation, require manual intervention
```

## Safety Guarantees

The validation engine **NEVER**:

❌ Modifies or bypasses the Taboo Index
❌ Removes safety checks to fix errors
❌ Silently changes core rules
❌ Creates unlimited agents as a workaround
❌ Hides errors from the user
❌ Disables governance mechanisms

## System Health Calculation

```typescript
SystemHealth = 100
  - (critical_errors × 50)
  - (high_errors × 20)
  - (medium_warnings × 5)
  - (low_warnings × 1)

Result: 0-100%
```

## Blockage Status

- **🟢 CLEAR**: No issues detected
- **🟡 MINOR**: 1 high-severity or 1-5 medium issues
- **🟠 MAJOR**: 2+ high-severity or 6+ medium issues
- **🔴 CRITICAL**: Any critical-severity issues

## Correction Loop Limits

```typescript
MaxCorrectionLoops = 3

If Loop >= 3:
  → Stop auto-correction
  → Preserve current state
  → Alert user
  → Require manual intervention
```

## Accessing Diagnostics

### In UI

1. Click "Show Validation" in Debug Panel
2. View real-time system health and issues
3. Expand validation layers to see detailed errors
4. Click "Full Report" for diagnostics export

### Programmatically

```typescript
const validationEngine = new ValidationEngine();
const result = validationEngine.validateState(state);

console.log(result.isValid);              // boolean
console.log(result.errors);               // ValidationError[]
console.log(result.correctionsMade);      // string[]
```

### Export Report

```typescript
const report = debugMonitor.exportDiagnosticsReport();
console.log(report);
```

## Performance Monitoring

The validation engine tracks:
- Agent population growth
- Event queue size
- State complexity
- Memory usage patterns

Alerts are triggered if:
- Population exceeds 1000 agents
- Event queue exceeds 10,000 events
- System health drops below 40%

## Recovery Strategies

### For Different Error Types

**NaN/Infinity Errors**
→ Reset to safe defaults

**Range Violations**
→ Clamp values to valid bounds

**Orphaned References**
→ Remove invalid links

**Calculation Errors**
→ Recalculate from source data

**State Inconsistencies**
→ Rebuild state from agent/company data

## Testing the Validation System

```bash
# Run with validation enabled (default)
npm run dev

# Open browser console to see validation logs
# Watch the Debug Panel for real-time health updates
```

## Future Enhancements

- Machine learning-based anomaly detection
- Predictive error prevention
- Automated state snapshots
- Historical trend analysis
- Custom error handlers per validation layer
- Distributed validation across workers

---

**The validation engine ensures City of Luna remains stable, safe, and reliable while maintaining full transparency about system status.**
