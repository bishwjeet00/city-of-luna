import React, { useState, useEffect } from 'react';
import { SimulationState } from '@/types';
import { ValidationEngine, ValidationError, ValidationLayer } from '@/validation/ValidationEngine';
import { DebugMonitor, DebugLog } from '@/validation/DebugMonitor';
import { CheckCircle, AlertCircle, XCircle, Zap, BarChart3 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ValidationPanelProps {
  state: SimulationState;
}

const ValidationPanel: React.FC<ValidationPanelProps> = ({ state }) => {
  const [validationEngine] = useState(() => new ValidationEngine());
  const [debugMonitor] = useState(() => new DebugMonitor(validationEngine));
  const [latestDiagnostics, setLatestDiagnostics] = useState<DebugLog | null>(null);
  const [expandedLayer, setExpandedLayer] = useState<ValidationLayer | null>(null);
  const [showReport, setShowReport] = useState(false);

  useEffect(() => {
    const diagnostics = debugMonitor.performDiagnostics(state);
    setLatestDiagnostics(diagnostics);
  }, [state, debugMonitor]);

  if (!latestDiagnostics) return null;

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <XCircle size={16} className="text-red-500" />;
      case 'high':
        return <AlertCircle size={16} className="text-orange-500" />;
      case 'medium':
        return <AlertCircle size={16} className="text-yellow-500" />;
      default:
        return <CheckCircle size={16} className="text-blue-500" />;
    }
  };

  const layerCounts: Record<ValidationLayer, number> = {
    ui: 0,
    state: 0,
    simulation: 0,
    agent_decision: 0,
    economy: 0,
    hiring: 0,
    building: 0,
    spawning: 0,
    taboo: 0,
    performance: 0,
  };

  latestDiagnostics.validationResult.errors.forEach((e) => {
    layerCounts[e.layer]++;
  });

  const getHealthColor = () => {
    if (latestDiagnostics.systemHealth > 80) return 'text-green-400';
    if (latestDiagnostics.systemHealth > 60) return 'text-yellow-400';
    if (latestDiagnostics.systemHealth > 40) return 'text-orange-400';
    return 'text-red-500';
  };

  const getBlockageColor = () => {
    switch (latestDiagnostics.blockageStatus) {
      case 'clear':
        return 'text-green-400';
      case 'minor':
        return 'text-yellow-400';
      case 'major':
        return 'text-orange-400';
      case 'critical':
        return 'text-red-500';
    }
  };

  return (
    <div className="bg-luna-900 border-t border-luna-800 p-4 space-y-4">
      <h3 className="text-lg font-bold text-cyberpunk-primary flex items-center gap-2">
        <Zap size={20} />
        Validation & Error Correction
      </h3>

      {/* System Health Summary */}
      <motion.div className="bg-luna-800 p-4 rounded space-y-3" layout>
        <div className="flex justify-between items-center">
          <span className="text-luna-300 font-semibold">System Health</span>
          <div className="flex items-center gap-2">
            <div className="w-32 bg-luna-700 rounded-full h-3">
              <motion.div
                className={`h-full rounded-full bg-gradient-to-r from-green-500 to-red-500`}
                initial={{ width: 0 }}
                animate={{ width: `${latestDiagnostics.systemHealth}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <span className={`font-bold text-lg ${getHealthColor()}`}>
              {latestDiagnostics.systemHealth.toFixed(0)}%
            </span>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-luna-300 font-semibold">Blockage Status</span>
          <span className={`font-bold uppercase text-sm ${getBlockageColor()}`}>
            {latestDiagnostics.blockageStatus}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-luna-300 font-semibold">Correction Loops</span>
          <span className="font-bold text-cyberpunk-accent">{latestDiagnostics.correctionAttempts}</span>
        </div>
      </motion.div>

      {/* Issues Summary */}
      <div className="bg-luna-800 p-3 rounded space-y-2">
        <div className="flex justify-between items-center text-sm">
          <span className="text-luna-400">Critical Issues</span>
          <span className="font-bold text-red-500">
            {latestDiagnostics.validationResult.errors.filter((e) => e.severity === 'critical').length}
          </span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-luna-400">High Priority</span>
          <span className="font-bold text-orange-500">
            {latestDiagnostics.validationResult.errors.filter((e) => e.severity === 'high').length}
          </span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-luna-400">Warnings</span>
          <span className="font-bold text-yellow-500">
            {latestDiagnostics.validationResult.warnings.length}
          </span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-luna-400">Auto-Corrected</span>
          <span className="font-bold text-green-400">
            {latestDiagnostics.validationResult.correctionsMade.length}
          </span>
        </div>
      </div>

      {/* Validation Layers */}
      <div className="space-y-2">
        <h4 className="text-sm font-semibold text-cyberpunk-primary flex items-center gap-2">
          <BarChart3 size={16} />
          Validation Layers
        </h4>
        <div className="grid grid-cols-2 gap-2">
          {(Object.keys(layerCounts) as ValidationLayer[]).map((layer) => (
            <motion.button
              key={layer}
              onClick={() => setExpandedLayer(expandedLayer === layer ? null : layer)}
              className={`text-left p-2 rounded text-xs transition-all ${
                layerCounts[layer] > 0
                  ? 'bg-red-950 text-red-200 border border-red-900'
                  : 'bg-green-950 text-green-200 border border-green-900'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="font-semibold capitalize">{layer.replace('_', ' ')}</div>
              <div className="text-xs opacity-75">{layerCounts[layer]} issues</div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Expanded Layer Details */}
      <AnimatePresence>
        {expandedLayer && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-luna-800 p-3 rounded space-y-2 max-h-64 overflow-y-auto"
          >
            {latestDiagnostics.validationResult.errors
              .filter((e) => e.layer === expandedLayer)
              .map((error) => (
                <div key={error.id} className="bg-luna-700 p-2 rounded text-xs border-l-2 border-red-500">
                  <div className="flex gap-2 items-start">
                    {getSeverityIcon(error.severity)}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-luna-200">{error.message}</p>
                      {error.rootCause && (
                        <p className="text-luna-400 text-xs mt-1">Root: {error.rootCause}</p>
                      )}
                      {error.suggestedFix && (
                        <p className="text-green-400 text-xs mt-1">Fix: {error.suggestedFix}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => setShowReport(!showReport)}
          className="btn btn-secondary text-xs flex-1"
        >
          {showReport ? 'Hide Report' : 'Full Report'}
        </button>
      </div>

      {/* Full Diagnostics Report */}
      <AnimatePresence>
        {showReport && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-luna-800 p-3 rounded text-xs text-luna-300 font-mono max-h-48 overflow-y-auto whitespace-pre-wrap"
          >
            {debugMonitor.exportDiagnosticsReport()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ValidationPanel;
