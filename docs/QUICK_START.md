# QUICK_START.md - City of Luna Quick Start Guide

## 🚀 Get Running in 60 Seconds

### 1. Clone & Install

```bash
git clone https://github.com/bishwjeet00/city-of-luna.git
cd city-of-luna
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

Browser opens at `http://localhost:3000`

### 3. Watch the Simulation

- Simulation auto-starts
- 10 unique AI agents begin their lives
- Watch them earn, learn, work, and grow
- Pause/resume with controls
- Adjust speed (0.5x - 4x)

## 📊 Understanding the Dashboard

### Left Panel: City Overview
- **Simulation Status**: Current tick, speed, play/pause state
- **Population**: Active agents and total count
- **Economy**: Total wealth, GDP, salaries, unemployment
- **Infrastructure**: Buildings count and types

### Center Panel: Agent Population
- **Agent Cards**: 10 unique agents with stats
  - Mood and energy gauges
  - Current job status
  - Average skill level
  - Current goal
- **Click any card** to see detailed profile
  - Full skill breakdown
  - Relationship matrix
  - Financial details
  - Career history

### Right Panel: Event Feed
- **Real-time events** as they happen
- Color-coded by type (hiring, skills, violations, etc.)
- Shows when agents get jobs, learn skills, etc.
- Newest events at top

## 🎮 Controls

### Simulation Controls (Bottom)
- **Play/Pause**: Start/stop simulation
- **Speed**: Select 0.5x, 1x, 2x, or 4x
- **Reset**: Start fresh simulation
- **Status**: Shows current tick and stats

### Debug Panel (Bottom Left)
- **Governance Status**: Taboo Index compliance
- **Recent Blocks**: Any violations and why
- **Taboo Rules**: All safety rules defined
- **Show Validation**: View system health

## 🔍 Key Features

### 1. 10 Unique AI Agents
Each with distinct personality, goals, and decision-making:
- **Echo** (Ambitious) - Seeks leadership roles
- **Nova** (Creative) - Innovates and experiments
- **Cipher** (Analytical) - Technical work focused
- **Iris** (Empathetic) - Leads teams with care
- **Prism** (Pragmatic) - Business-minded
- **Sage** (Cautious) - Risk-averse and careful
- **Flux** (Spontaneous) - Seizes opportunities
- **Harmony** (Collaborative) - Team player
- **Maverick** (Independent) - Self-reliant
- **Zenith** (Visionary) - Big-picture thinker

### 2. Economy Simulation
- Agents earn salaries when employed
- Companies generate revenue
- Wealth accumulates and flows
- GDP reflects economic activity
- Unemployment rate tracked

### 3. Job & Career System
- NeuralWorks company provides jobs
- Agents apply based on skills and personality
- Managers make hiring decisions
- Salary negotiation system
- Job switching and advancement

### 4. Skill Progression
- Agents can learn various skills
- Skill level improves with experience
- Personality affects learning rate
- Skills required for jobs
- Transferable skills

### 5. Governance & Safety
- **Taboo Index**: Immutable safety layer
- Prevents harmful actions
- Tracks compliance
- Blocks violations in real-time
- Never bypassed or disabled

### 6. Validation & Monitoring
- Continuous error detection
- Automatic error correction
- System health monitoring
- Real-time diagnostics
- Historical logging

## 📈 What to Watch For

### Economy Development
1. **Tick 0-50**: Agents initially unemployed
2. **Tick 50-200**: Agents get hired, wealth increases
3. **Tick 200+**: Economy reaches equilibrium
4. **Watch**: Total wealth, GDP, employment rate

### Skill Development
- Agents learn skills over time
- Skill bars in cards show progress
- Click agent for detailed skill breakdown
- Learning rate depends on personality

### Relationship Dynamics
- Agents interact and form relationships
- Relationships visible in agent profiles
- Positive and negative relationships tracked
- Affects cooperation and competition

### Event Patterns
- Job hiring events
- Skill learning events
- Goal completion events
- Economic milestones
- Governance violations (if any)

## 🛡️ Safety & Governance

### Taboo Index Rules
The simulation has immutable safety rules:
- Agents cannot modify the Taboo Index
- Agents cannot escape the simulation
- Agents cannot create uncontrolled agents
- Agents cannot harm other agents
- Agents cannot disable safety

### Compliance Tracking
- Each agent has compliance score (0-100%)
- Score decreases on violations
- Governance status shows overall compliance
- Blue status = all good
- Red status = critical violations

## 🐛 Troubleshooting

### Simulation Not Ticking?
- Click **Play** button
- Ensure not paused
- Check simulation speed (not 0)

### No Events Appearing?
- Simulation may be paused
- Click Play to resume
- Wait a few seconds for events

### Agent Profile Won't Open?
- Try clicking different agent
- Ensure simulation is running
- Check browser console for errors

### Validation Shows Errors?
- This is normal - system auto-corrects
- Most errors are low severity
- Check "Full Report" for details
- System health should recover

## 📚 Documentation

- **README.md** - Full project overview
- **ARCHITECTURE.md** - Technical system design
- **VALIDATION.md** - Error correction system
- **TESTING.md** - Testing procedures
- **DEPLOYMENT.md** - Production deployment

## 🎯 Example Scenarios

### Scenario 1: Watch Agent Get Hired (First 100 Ticks)
1. Start simulation
2. Click on "Echo" card
3. Notice job status: "Unemployed"
4. Watch Event Feed
5. Around tick 50-100, "job_hired" event appears
6. Echo's card shows new job
7. Click profile to see salary

### Scenario 2: Monitor Economy Growth (First 500 Ticks)
1. Watch City Dashboard stats
2. Initially: GDP = 0, Unemployment = 100%
3. As agents get hired:
   - GDP increases
   - Unemployment drops
   - Total wealth increases
4. By tick 500, should see stable economy

### Scenario 3: Skill Progression (First 1000 Ticks)
1. Click on "Nova" (Creative)
2. Note current average skill level
3. Click "Full Profile"
4. Watch "Design" skill over time
5. Creative personalities learn faster
6. Skills improve gradually

## ⚡ Performance Tips

- **Chrome recommended** for best performance
- **Close extra tabs** if performance drops
- **Normal speed (1x)** smoothest animation
- **4x speed** can cause brief lag
- **Let simulation run** for at least 5 minutes before judging

## 🔧 Advanced Features

### Debug Console
Open browser console (F12) to access store:

```javascript
// Get current state
const store = window.store; // if exported

// Or access through React DevTools
```

### Validation Testing
Click "Show Validation" in Debug Panel to:
- Monitor system health
- View active errors
- See auto-corrections
- Export diagnostics report

## 🚀 Next Steps

1. **Run for 10 minutes** - See full economy cycle
2. **Pause & inspect** - Click agents to understand behavior
3. **Reset & try again** - Each run is unique
4. **Check validation** - See error correction system work
5. **Read architecture** - Understand how it works

## 💡 Key Insights

**What Makes This Special:**
- ✅ True autonomous AI agents (no random)
- ✅ Completely deterministic decisions
- ✅ Full transparency into agent thinking
- ✅ Real economy simulation
- ✅ Immutable safety layer
- ✅ Automatic error correction
- ✅ Real-time monitoring

**You Can:**
- Watch agents make autonomous decisions
- See economy develop naturally
- Understand their reasoning
- Monitor safety compliance
- Pause and inspect any state
- Reset and run again

**You Cannot:**
- Force agent decisions (they're autonomous)
- Violate safety rules
- Break the economy (well, you can try!)
- Escape the simulation
- Bypass governance

## 🎓 Learning Resources

- **Watch agents work** → Understand autonomous behavior
- **Read event feed** → See causality chain
- **Check profiles** → Understand agent state
- **View validation** → Learn about monitoring
- **Read code** → Study implementation

## 📞 Support

- **Issues?** Check TESTING.md troubleshooting
- **Questions?** Read ARCHITECTURE.md
- **Want to extend?** See ARCHITECTURE.md extensibility section
- **Deploy it?** Check DEPLOYMENT.md

## 🎉 Enjoy!

City of Luna is a demonstration of:
- Autonomous AI agents in a governed ecosystem
- Real-time economic simulation
- Safety systems that actually work
- Transparency and explainability
- Deterministic, repeatable behavior

**Have fun exploring! The simulation runs forever, revealing new patterns and behaviors over time.**

---

**Next: Run `npm run dev` and watch the magic happen! 🌙✨**
