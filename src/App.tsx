import React, { useEffect } from 'react';
import useSimulationStore from '@/store/simulationStore';
import CityOverview from '@/components/CityOverview';
import AgentPanel from '@/components/AgentPanel';
import EventFeed from '@/components/EventFeed';
import DebugPanel from '@/components/DebugPanel';
import SimulationControls from '@/components/SimulationControls';
import './App.css';

function App() {
  const { state, tick } = useSimulationStore();

  useEffect(() => {
    if (!state.paused) {
      const interval = setInterval(() => {
        tick();
      }, 1000 / state.speed);
      return () => clearInterval(interval);
    }
  }, [state.paused, state.speed, tick]);

  return (
    <div className="app bg-cyberpunk-dark min-h-screen text-white font-sans">
      {/* Header */}
      <header className="bg-gradient-to-r from-luna-900 to-luna-800 border-b border-cyberpunk-primary shadow-2xl sticky top-0 z-40">
        <div className="px-6 py-4">
          <h1 className="text-4xl font-bold text-cyberpunk-primary drop-shadow-lg">
            ◆ CITY OF LUNA ◆
          </h1>
          <p className="text-cyberpunk-primary opacity-70 text-sm mt-1">A Simulated Digital Society</p>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex h-screen overflow-hidden" style={{ height: 'calc(100vh - 100px)' }}>
        {/* Left Panel */}
        <div className="flex-1 overflow-y-auto bg-luna-950 border-r border-luna-800">
          <CityOverview state={state} />
          <SimulationControls />
        </div>

        {/* Center Panel */}
        <div className="flex-1 overflow-y-auto bg-luna-950 border-r border-luna-800 p-4">
          <AgentPanel agents={state.agents} />
        </div>

        {/* Right Panel */}
        <div className="w-96 overflow-y-auto bg-luna-950 border-r border-luna-800 flex flex-col">
          <EventFeed events={state.events} />
          <DebugPanel state={state} />
        </div>
      </div>
    </div>
  );
}

export default App;
