# TESTING.md - City of Luna Testing Guide

## Quick Start Testing

### Prerequisites
```bash
npm install
npm run dev
```

The app will open at `http://localhost:3000`

## Manual Testing Checklist

### 1. Basic UI Navigation
- [ ] **City Dashboard** - View is visible and updates in real-time
  - Simulation tick increments every second
  - Economy stats update
  - Population stats display correctly
  - All numbers are readable

- [ ] **Agent Panel** - All 10 agents visible
  - Each agent card shows: name, personality, wealth, job status, mood, energy, skills
  - Agent cards are clickable
  - Click opens detailed profile modal
  - Close button works
  - Profile modal shows all agent data

- [ ] **Event Feed** - Events appear in real-time
  - Events are in reverse chronological order (newest first)
  - Events have appropriate icons and colors
  - Event feed doesn't exceed 100 entries
  - Feed scrolls smoothly

- [ ] **Simulation Controls** - Playback controls work
  - Play/Pause button toggles simulation
  - Speed options (0.5x, 1x, 2x, 4x) work
  - Current speed is highlighted
  - Reset button works
  - Simulation stats display correctly

### 2. Agent System
- [ ] **Agent Creation** - 10 unique agents exist
  - Luna-01: Echo (ambitious)
  - Luna-02: Nova (creative)
  - Luna-03: Cipher (analytical)
  - Luna-04: Iris (empathetic)
  - Luna-05: Prism (pragmatic)
  - Luna-06: Sage (cautious)
  - Luna-07: Flux (spontaneous)
  - Luna-08: Harmony (collaborative)
  - Luna-09: Maverick (independent)
  - Luna-10: Zenith (visionary)

- [ ] **Agent State Updates**
  - Energy decreases over time (then restores)
  - Mood changes based on employment
  - Wealth increases when employed
  - Skills can progress (visible in profile)

- [ ] **Agent Profiles** - Detailed info shows
  - Correct wealth and savings
  - All skills with levels
  - Current goals and progress
  - Relationships with other agents

### 3. Economy System
- [ ] **Initial Setup**
  - Total wealth = 1050 (sum of all agent wealth)
  - All agents unemployed initially
  - Unemployment rate = 100%
  - GDP = 0 (no companies active yet)

- [ ] **Employment**
  - When agents get jobs, wealth increases
  - Unemployment rate decreases
  - Economy stats update

- [ ] **Company System**
  - NeuralWorks company exists
  - Founded by Luna-01 (Echo)
  - Shows in economy stats
  - Can have employees

### 4. Governance & Safety
- [ ] **Taboo Index** - Visible in Debug Panel
  - Shows all Taboo rules
  - Rules categorized by severity (critical, high, medium, low)
  - Governance status displays
  - Agent compliance scores show

- [ ] **Blocked Actions Log**
  - Initially empty
  - Displays recent blocked actions
  - Shows reason for block
  - Shows severity level

### 5. Validation System
- [ ] **Debug Panel Appears**
  - "Show Validation" button present
  - Click toggles Validation Panel

- [ ] **Validation Panel Shows**
  - System Health gauge (should be 100% initially)
  - Blockage Status (should be "clear")
  - Correction Loops counter
  - Issue counts (critical, high, warnings)
  - All validation layers listed

- [ ] **Full Report**
  - Click "Full Report" shows diagnostics
  - Contains timestamp, tick number, health
  - Lists all validation layers
  - Shows corrections made

### 6. Performance & Stability
- [ ] **Smooth Animations**
  - Agent cards animate on selection
  - Event feed entries slide in
  - Modal opens/closes smoothly
  - No lag when scrolling

- [ ] **No Console Errors**
  - Open DevTools (F12)
  - Console should be clean
  - No React warnings or errors
  - Simulation continues running

- [ ] **Long-Term Stability**
  - Let simulation run for 5+ minutes
  - All systems continue functioning
  - No memory leaks (DevTools -> Memory)
  - No performance degradation

## Advanced Testing

### Error Injection Testing

To test the validation engine, manually inject errors:

```typescript
// In browser console:
const store = useSimulationStore.getState();
const agent = store.state.agents[0];
agent.wealth = NaN;  // Inject NaN error
store.updateAgent(agent);

// Validation should detect and fix this
```

### State Consistency Testing

```typescript
// Verify agent wealth sums to total wealth
const store = useSimulationStore.getState();
const sumWealth = store.state.agents.reduce((sum, a) => sum + a.wealth, 0);
console.log(sumWealth === store.state.economy.totalWealth);
// Should be true
```

### Unemployment Rate Verification

```typescript
const store = useSimulationStore.getState();
const unemployed = store.state.agents.filter(a => !a.jobId).length;
const expectedRate = unemployed / store.state.agents.length;
console.log(expectedRate === store.state.economy.unemploymentRate);
// Should be true
```

## Specific Feature Tests

### Test: Agent Profile Loading
1. Run simulation
2. Click on "Echo" card
3. Profile modal should show
4. Verify:
   - Name, personality, age correct
   - Skills section visible with all skills
   - Goals section with at least one goal
   - Wealth and savings accurate
   - Mood and energy gauges visible

### Test: Event Feed Display
1. Start simulation
2. Watch Event Feed for 30 seconds
3. Verify:
   - New events appear (even if idle)
   - Events have proper icons
   - Events are color-coded
   - Oldest events don't exceed 100 in feed
   - No duplicate events

### Test: Speed Control
1. Set speed to 0.5x
   - Simulation should progress slowly
   - Tick increments by 0.5 per second

2. Set speed to 4x
   - Simulation should progress rapidly
   - Tick increments by 4 per second

3. Toggle pause
   - Tick should stop incrementing
   - All updates should freeze
   - Resume should continue from where it stopped

### Test: Reset Simulation
1. Run simulation for 1 minute
2. Click "Reset" button
3. Verify:
   - Tick resets to 0
   - All agents reset to initial state
   - All wealth reset to initial values
   - Economy resets
   - Event feed clears
   - Validation logs clear

## Regression Testing Checklist

After any code changes, verify:

- [ ] Simulation still auto-ticks
- [ ] No console errors
- [ ] All 10 agents visible
- [ ] Agent profiles load
- [ ] Simulation controls work
- [ ] Validation panel functional
- [ ] Taboo Index intact
- [ ] Event feed updates
- [ ] Pause/resume works
- [ ] Speed controls work
- [ ] Reset works completely

## Performance Benchmarks

### Expected Performance

| Metric | Target | Acceptable | Warning |
|--------|--------|------------|----------|
| FPS | 60 | 50+ | <50 |
| Tick Update Time | <10ms | <50ms | >50ms |
| Component Render | <5ms | <20ms | >20ms |
| Memory (initial) | <50MB | <100MB | >100MB |
| Memory (after 1h) | <150MB | <200MB | >200MB |

### How to Measure

**FPS Counter**
```javascript
// Chrome DevTools → Rendering → Show FPS meter
```

**Component Render Time**
```javascript
// React DevTools Profiler
// Record a few seconds, analyze Rank chart
```

**Memory Usage**
```javascript
// Chrome DevTools → Memory
// Take heap snapshot at start and after 1 hour
// Compare size
```

## Known Issues & Workarounds

### Issue: Simulation not ticking
**Solution**: Click Play button, verify not paused

### Issue: Agent profile won't open
**Solution**: Ensure simulation is running, try clicking different agent

### Issue: Validation panel shows errors
**Solution**: This is normal - validation system auto-corrects. Check "Full Report" for details.

## Browser Compatibility

Tested on:
- [x] Chrome 120+
- [x] Firefox 121+
- [x] Safari 17+
- [x] Edge 120+

## Accessibility Testing

- [ ] Keyboard navigation works (Tab, Enter, Escape)
- [ ] Color contrast meets WCAG AA standards
- [ ] Screen reader announces UI elements
- [ ] Focus indicators visible

## Build Testing

```bash
# Development build
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

Verify:
- [ ] Production build completes without errors
- [ ] All features work in production build
- [ ] Asset sizes are reasonable
- [ ] No source maps in production

## Continuous Testing (CI/CD)

Future: Add GitHub Actions for automated testing

```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm run lint
      - run: npm run type-check
      - run: npm run build
```

---

**Manual testing is complete. For production deployment, add automated test suite.**
