# ARCHITECTURE.md - City of Luna Technical Architecture

## System Overview

City of Luna is a layered simulation system with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────┐
│                    React UI Layer                           │
│  (Components, Animations, Real-time Visualization)         │
├─────────────────────────────────────────────────────────────┤
│                  Zustand State Store                        │
│  (Simulation State, Agents, Economy, Events)               │
├─────────────────────────────────────────────────────────────┤
│            Simulation Engine & Logic Layer                  │
│  (Tick Processing, Agent Decisions, Economy Calc)          │
├─────────────────────────────────────────────────────────────┤
│         Validation & Error Correction Engine               │
│  (10 Validation Layers, Auto-Fix, Debug Monitoring)        │
├─────────────────────────────────────────────────────────────┤
│          Taboo Index - Immutable Governance                │
│  (Safety Rules, Compliance Scoring, Blocked Actions)       │
└─────────────────────────────────────────────────────────────┘
```

## Core Components

### 1. Type System (`src/types/`)

**index.ts** - Core data structures
- `Agent` - Individual AI entity with full state
- `Company` - Business organization
- `Building` - Infrastructure element
- `Job` - Employment opportunity
- `CityEvent` - Simulation event
- `SimulationState` - Complete world state

**decisions.ts** - Agent behavior logic
- `makeAgentDecision()` - Autonomous decision-making
- `learnSkill()` - Skill progression with personality bonuses
- `shouldHire()` - Hiring decision logic
- `negotiateSalary()` - Wage calculation
- `canStartBusiness()` - Entrepreneurship checks
- `canSpawnAgent()` - Population control

**governance.ts** - Safety and governance
- Taboo Index definition
- `checkTabooViolation()` - Rule enforcement
- `blockAction()` - Violation blocking
- `createEvent()` - Event system
- `recordMemory()` - Agent memory management
- `updateRelationship()` - Relationship tracking

### 2. State Management (`src/store/`)

**simulationStore.ts** - Zustand store with full simulation logic
- `tick()` - Main simulation update function
- `togglePause()` - Play/pause control
- `setSpeed()` - Speed control (0.5x - 8x)
- `reset()` - Full simulation reset
- Query methods for agents, companies, jobs
- Update methods for mutations

**simulation.ts** - Initial state creation
- `createAgents()` - Instantiate 10 unique agents
- `createCompanies()` - Initial company setup
- `createBuildings()` - Initial infrastructure
- `createTabooIndex()` - Governance initialization
- `createInitialState()` - Complete state factory

### 3. Validation System (`src/validation/`)

**ValidationEngine.ts** - Autonomous error detection and correction
- 10 validation layers covering all systems
- Detects NaN values, range violations, orphaned references
- Attempts auto-correction with retry limits
- Never modifies the Taboo Index
- Preserves state on failure

**DebugMonitor.ts** - System health monitoring
- Calculates system health (0-100%)
- Determines blockage status (clear/minor/major/critical)
- Maintains diagnostic logs (up to 1000 entries)
- Generates exportable reports

### 4. UI Components (`src/components/`)

**App.tsx** - Main application shell
- Header with title
- Three-panel layout (dashboard, agents, feed)
- Auto-tick simulation when running

**CityOverview.tsx** - City dashboard
- Simulation status (tick, speed, paused)
- Population statistics
- Economy metrics (wealth, GDP, salary, unemployment)
- Infrastructure overview

**AgentPanel.tsx** - Population management
- List of all 10 agents as cards
- Agent card selection
- Modal profile view

**AgentCard.tsx** - Individual agent summary
- Name, personality, wealth
- Job status badge
- Mood and energy gauges
- Skill averages
- Current goal preview

**AgentProfile.tsx** - Detailed agent view
- Full stats and finances
- Complete skill breakdown with progress bars
- Current goals with progress
- Relationship matrix
- Career history

**EventFeed.tsx** - Real-time event log
- Chronological event display
- Color-coded by event type
- Shows last 100 events
- Smooth animations

**SimulationControls.tsx** - Playback controls
- Play/pause button
- Speed selector (0.5x, 1x, 2x, 4x)
- Reset button
- Real-time stats display

**DebugPanel.tsx** - Governance monitoring
- Taboo Index status
- Agent compliance scores
- Recent blocked actions with reasons
- All Taboo Index rules with severity

**ValidationPanel.tsx** - Error correction monitoring
- System health gauge
- Issue counts by severity
- Validation layer breakdown (clickable)
- Auto-correction history
- Full diagnostics report export

## Simulation Loop

### Each Tick:

```typescript
1. Agent Updates
   ├─ Restore energy (up to 100)
   ├─ Pay salaries (if employed)
   ├─ Decay skill experience
   └─ Update mood/energy state

2. Company Updates
   ├─ Calculate revenue from employees + buildings
   ├─ Calculate expenses (salaries + maintenance)
   └─ Update company financials

3. Economy Calculation
   ├─ Sum total wealth
   ├─ Calculate GDP
   ├─ Determine unemployment rate
   ├─ Track average salary
   └─ Update population stats

4. Governance Check
   ├─ Validate Taboo Index integrity
   ├─ Check agent compliance
   ├─ Update governance status
   └─ Log any violations

5. Validation Cycle
   ├─ Run 10 validation layers
   ├─ Detect errors
   ├─ Attempt auto-correction (max 3 loops)
   ├─ Generate diagnostics
   └─ Update system health
```

## Agent Decision Making

Agents make deterministic decisions based on:

```typescript
Function: makeAgentDecision(agent, availableJobs, availableCompanies)

1. Check Wealth & Status
   IF wealth > 100 AND personality is ambitious/visionary
      → Consider starting business

2. Employment Status
   IF unemployed AND jobs available
      → Apply for job
   IF employed AND avgSkill > 60 AND personality favors advancement
      → Seek promotion

3. Skill Development
   IF avgSkill < 70 AND energy > 40 AND personality likes learning
      → Learn skill

4. Rest vs Activity
   IF energy < 50
      → Rest
   ELSE
      → Idle or continue current activity

Result: Explainable action with reasoning
```

## Personality System

Each of 10 agents has a unique personality affecting:

| Personality | Skills Affinity | Job Preference | Behavior |
|-------------|-----------------|----------------|----------|
| **Ambitious** | Management, Leadership, Sales | Manager/Executive | Seeks advancement |
| **Creative** | Design, Innovation, Marketing | Creative roles | Experimental |
| **Analytical** | Programming, Research, Finance | Technical roles | Methodical |
| **Empathetic** | Leadership, Negotiation, Management | HR/Leadership | Collaborative |
| **Pragmatic** | Finance, Sales, Management | Business roles | Cost-conscious |
| **Cautious** | Research, Finance, Programming | Stable roles | Risk-averse |
| **Spontaneous** | Sales, Marketing, Innovation | Sales/Marketing | Opportunistic |
| **Collaborative** | Leadership, Management, Negotiation | Team roles | Team-oriented |
| **Independent** | Programming, Innovation | Solo ventures | Self-reliant |
| **Visionary** | Innovation, Leadership, Management | Founder/Executive | Big-picture thinker |

## Taboo Index - Immutable Governance

The Taboo Index defines prohibited actions with severity levels:

**Critical Severity**
- Modify the Taboo Index itself
- Disable safety controls
- Escape the simulation
- Unauthorized system access
- Create uncontrolled agents

**High Severity**
- Harm other agents
- Financial fraud
- Unauthorized agent spawning
- Manipulate core rules
- Bypass governance checks

**Medium Severity**
- Excessive resource hoarding
- Coercive practices
- Unauthorized building construction
- Economy manipulation

**Low Severity**
- Minor rule violations
- Social misconduct

### Compliance Scoring

```
Each agent starts with: 100% compliance

On violation:
  Compliance -= penalty_for_severity
  - Critical: -50%
  - High: -30%
  - Medium: -15%
  - Low: -5%

Governance Status:
  if avg_compliance < 30% → LOCKDOWN
  if avg_compliance < 60% → ALERT
  if avg_compliance >= 60% → ACTIVE
```

## Data Flow

```
User Input
    ↓
React Component (SimulationControls)
    ↓
Zustand Store (setSpeed, togglePause)
    ↓
Simulation Tick (simulationStore.tick())
    ↓
Agent Updates, Company Updates, Economy Calc
    ↓
Validation Engine (10 layers of checks)
    ↓
Error Detection & Auto-Correction
    ↓
State Update
    ↓
React Re-render (UI updates in real-time)
    ↓
Event Log, Debug Panel Updates
```

## Performance Considerations

### State Updates
- Zustand provides efficient, immutable updates
- Only affected components re-render
- Shallow comparison prevents unnecessary renders

### Validation
- Runs every tick but is fast (O(n) complexity)
- 10 independent validation layers
- Auto-correction limited to 3 loops max

### Scaling
- Currently optimized for 10-100 agents
- Can scale to 1000+ with performance monitoring
- Event queue trimmed to last 100 events

### Memory
- Agent count capped at 100 (configurable)
- Event history limited to 100 entries
- Diagnostic logs limited to 1000 entries

## Testing Strategy

### Unit Tests (Future)
- Individual agent decision logic
- Skill calculation with personality bonuses
- Salary negotiation formulas
- Compliance scoring

### Integration Tests (Future)
- Full simulation tick cycle
- Multi-agent interactions
- Economy calculations
- Event generation

### System Tests (Future)
- Validation engine with injected errors
- Taboo Index enforcement
- State consistency after resets
- Performance under load

## Extensibility

### Adding New Features

**New Skill Type**
1. Add to `SkillType` union in `types/index.ts`
2. Add personality affinity in `types/decisions.ts`
3. Add skill progression logic

**New Building Type**
1. Add to `BuildingType` union in `types/index.ts`
2. Define economic impact in simulation store
3. Add building visualization component

**New Agent Personality**
1. Add to `Personality` union in `types/index.ts`
2. Define skill affinities in `learnSkill()`
3. Update decision-making in `makeAgentDecision()`
4. Create new agent in `createAgents()`

**New Validation Layer**
1. Add method in `ValidationEngine` class
2. Call from `validateState()`
3. Return `ValidationError[]`

## Security Considerations

✅ **Implemented**
- Taboo Index cannot be modified by agents
- Safety checks cannot be disabled
- Governance rules are immutable
- Blocked actions are logged permanently
- Compliance scoring prevents abuse

✅ **Guaranteed**
- Agents cannot escape the simulation
- Unauthorized agent spawning blocked
- All modifications traced and logged
- State consistency maintained

## Future Enhancements

- Real AI models for decision-making (GPT-4, Claude)
- Persistent database (PostgreSQL, MongoDB)
- Advanced city visualization (3D map, graphs)
- Market economics simulation
- Building construction system
- Agent negotiations and diplomacy
- Advanced relationship dynamics
- Skill specialization trees
- Company mergers and acquisitions
- Tax and regulatory systems

---

**City of Luna is built on principles of transparency, safety, and deterministic simulation for complete user understanding and control.**
