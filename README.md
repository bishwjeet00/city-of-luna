# City of Luna

**A Polished Interactive Web App Prototype of a Simulated AI Society**

## Overview

City of Luna is an advanced prototype that simulates a digital society containing 10 autonomous AI agents. Each agent has unique personalities, goals, skills, finances, careers, and decision-making behaviors. The simulation demonstrates how AI agents can autonomously interact within a governed ecosystem.

## Core Features

### 🤖 10 Unique AI Agents

Each agent has:
- **Unique Name & Personality**: Echo (ambitious), Nova (creative), Cipher (analytical), Iris (empathetic), Prism (pragmatic), Sage (cautious), Flux (spontaneous), Harmony (collaborative), Maverick (independent), Zenith (visionary)
- **Autonomous Decision-Making**: Based on personality, resources, relationships, and current state
- **Skills & Progression**: Each agent can learn and improve multiple skills
- **Finance Management**: Wealth, savings, income, and expenses
- **Career Paths**: Employment, job switching, entrepreneurship, management
- **Relationships**: Relationship tracking between agents
- **Memory System**: Agents remember significant events
- **Goals & Aspirations**: Personal objectives driving behavior

### 💼 Economy System

- **Currency & Transactions**: Agents earn salaries, make investments, and trade
- **Companies**: Agents can found and manage companies
- **Jobs & Employment**: Dynamic job market with hiring and firing
- **Hiring Decisions**: Managers make autonomous hiring decisions
- **Salary Negotiations**: Wage negotiations based on skills and personality
- **Revenue & Expenses**: Company financials track growth

### 🏢 Building System

- **Diverse Infrastructure**: Offices, shops, factories, research centers, housing
- **Economic Impact**: Buildings affect job availability and company revenue
- **City Growth**: Buildings expand as economy develops

### 🔒 Taboo Index / Governance System

**Hard Safety Layer** preventing agents from:
- Modifying the Taboo Index itself
- Disabling safety controls
- Escaping the simulation
- Creating uncontrolled agents
- Harming other agents
- Unauthorized system access

**Features:**
- Blocked action logging
- Agent compliance scoring
- Governance status tracking (active/alert/lockdown)
- Severity-based penalties

### 🎮 User Controls

- **Play/Pause**: Control simulation execution
- **Speed Control**: 0.5x, 1x, 2x, 4x simulation speeds
- **Reset**: Start a fresh simulation
- **Agent Inspection**: View detailed profiles and stats
- **Event Feed**: Real-time log of all major events
- **Governance Dashboard**: Monitor Taboo Index compliance

### 📊 Visualization

- **City Dashboard**: Real-time statistics (population, economy, infrastructure)
- **Agent Cards**: Quick-view agent status with mood, energy, skills
- **Agent Profiles**: Detailed view with all agent data
- **Event Feed**: Chronological log of simulation events
- **Debug Panel**: Governance status and blocked actions
- **Futuristic UI**: Cyberpunk-inspired design with smooth animations

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

```bash
git clone https://github.com/bishwjeet00/city-of-luna.git
cd city-of-luna
npm install
```

### Development

```bash
npm run dev
```

The app will open at `http://localhost:3000`

### Build

```bash
npm run build
```

## Architecture

### Technology Stack

- **Frontend**: React 18 + TypeScript
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Build Tool**: Vite

### Project Structure

```
src/
├── components/          # React UI components
│   ├── App.tsx         # Main app component
│   ├── CityOverview.tsx # Dashboard view
│   ├── AgentPanel.tsx  # Agent list and profiles
│   ├── AgentCard.tsx   # Individual agent card
│   ├── AgentProfile.tsx # Detailed agent profile
│   ├── EventFeed.tsx   # Event log display
│   ├── SimulationControls.tsx # Play/pause/speed controls
│   └── DebugPanel.tsx  # Governance monitor
├── store/
│   ├── simulationStore.ts # Zustand store with simulation logic
│   └── simulation.ts   # Initial state and agent creation
├── types/
│   ├── index.ts        # TypeScript type definitions
│   ├── decisions.ts    # Agent decision logic
│   └── governance.ts   # Taboo Index and governance
├── App.tsx            # Main app entry
├── App.css            # Global styles
├── main.tsx           # React root
└── index.css          # Base styles
```

## How It Works

### Simulation Loop

Each simulation tick:

1. **Agent Updates**
   - Energy recovery
   - Salary income (if employed)
   - Skill experience decay

2. **Company Updates**
   - Revenue calculation based on employees and buildings
   - Expense calculation (salaries, building maintenance)

3. **Economy Update**
   - Total wealth calculation
   - GDP and employment rate
   - Unemployment statistics

4. **Governance Check**
   - Taboo Index compliance verification
   - Blocked action logging
   - Governance status update

### Agent Decision Making

Agents make autonomous decisions based on:
- **Personality** (affects skill learning rates and preferences)
- **Current State** (wealth, energy, mood)
- **Skills** (determines job eligibility)
- **Goals** (drives behavior)
- **Relationships** (influences social decisions)
- **Available Opportunities** (jobs, business ideas)

Decisions are **deterministic and explainable**, not random.

### Example Decision Flow

```
Agent Status: Echo (Ambitious, Unemployed, Wealthy)
→ Has enough wealth? Yes
→ Has sufficient skills? Yes
→ Personality favors entrepreneurship? Yes (Ambitious)
→ Decision: Consider starting a business
```

## Safety & Governance

### Taboo Index

The Taboo Index is an immutable governance layer that:

1. **Defines Prohibited Actions**
   - Critical: Modifying the Taboo Index, disabling safety, escaping
   - High: Creating uncontrolled agents, harming others
   - Medium: Economic manipulation, coercion
   - Low: Minor rule violations

2. **Blocks Violations**
   - Blocks execution immediately
   - Records the attempt
   - Updates agent compliance score
   - Adjusts governance status

3. **Preserves Control**
   - Agents **cannot** modify the Taboo Index
   - Agents **cannot** disable safety checks
   - Simulation maintains safe operation at all times

### Compliance Scoring

- Each agent has a compliance score (0-100%)
- Violations deduct points based on severity
- Low compliance → governance alert → potential lockdown

## Future Enhancements

- Real AI models for decision-making
- Persistent database storage
- Advanced skill trees and specializations
- Dynamic event generation
- Inter-agent negotiations
- Market economics simulation
- Building construction mechanics
- Agent spawning system with resource costs
- Advanced relationship dynamics
- Visualization improvements (3D city map, graphs)

## License

MIT License - See LICENSE file for details

## Contributing

Contributions welcome! Please open an issue or submit a pull request.

## Author

Created as an advanced prototype demonstrating autonomous AI agent simulation with safety governance.
