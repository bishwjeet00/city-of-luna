import React from 'react';
import useSimulationStore from '@/store/simulationStore';
import { Play, Pause, RotateCcw, Zap } from 'lucide-react';

const SimulationControls: React.FC = () => {
  const { state, togglePause, setSpeed, reset } = useSimulationStore();

  const speedOptions = [0.5, 1, 2, 4];

  return (
    <div className="p-6 bg-luna-900 border-t border-luna-800 space-y-4">
      <h3 className="text-lg font-bold text-cyberpunk-primary flex items-center gap-2">
        <Zap size={20} />
        Simulation Controls
      </h3>

      {/* Play/Pause */}
      <div className="flex gap-3">
        <button
          onClick={togglePause}
          className={`btn flex-1 flex items-center justify-center gap-2 ${
            state.paused ? 'btn-primary' : 'btn-secondary'
          }`}
        >
          {state.paused ? (
            <>
              <Play size={18} />
              Resume
            </>
          ) : (
            <>
              <Pause size={18} />
              Pause
            </>
          )}
        </button>

        <button onClick={reset} className="btn btn-secondary flex items-center justify-center gap-2">
          <RotateCcw size={18} />
          Reset
        </button>
      </div>

      {/* Speed Control */}
      <div>
        <label className="block text-sm text-luna-300 mb-2">Simulation Speed</label>
        <div className="grid grid-cols-4 gap-2">
          {speedOptions.map((speed) => (
            <button
              key={speed}
              onClick={() => setSpeed(speed)}
              className={`btn text-sm ${
                state.speed === speed ? 'btn-primary' : 'btn-secondary'
              }`}
            >
              {speed}x
            </button>
          ))}
        </div>
      </div>

      {/* Status Info */}
      <div className="bg-luna-800 p-3 rounded text-sm space-y-1">
        <div className="flex justify-between">
          <span className="text-luna-400">Current Tick:</span>
          <span className="text-cyberpunk-primary font-semibold">{state.tick}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-luna-400">Active Agents:</span>
          <span className="text-green-400 font-semibold">{state.population.activeAgents}/{state.population.totalAgents}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-luna-400">Total Economy:</span>
          <span className="text-cyberpunk-accent font-semibold">${state.economy.totalWealth.toFixed(0)}</span>
        </div>
      </div>
    </div>
  );
};

export default SimulationControls;
