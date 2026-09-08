import React from 'react';
import { SimulationState } from '@/types';
import { AlertCircle, ShieldAlert, Info } from 'lucide-react';

interface DebugPanelProps {
  state: SimulationState;
}

const DebugPanel: React.FC<DebugPanelProps> = ({ state }) => {
  const blockedActions = state.tabooIndex.blockedActions.slice(-5);
  const avgCompliance =
    Object.values(state.tabooIndex.agentComplianceScore).reduce((a, b) => a + b, 0) /
    Object.keys(state.tabooIndex.agentComplianceScore).length;

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-red-400';
      case 'high':
        return 'text-orange-400';
      case 'medium':
        return 'text-yellow-400';
      default:
        return 'text-blue-400';
    }
  };

  return (
    <div className="p-4 bg-luna-900 border-t border-luna-800 space-y-4">
      <h3 className="text-lg font-bold text-cyberpunk-primary flex items-center gap-2">
        <Info size={20} />
        Governance Status
      </h3>

      {/* Taboo Index Status */}
      <div className="bg-luna-800 p-3 rounded space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-luna-300 text-sm">Governance Status</span>
          <span
            className={`text-sm font-semibold uppercase ${
              state.tabooIndex.governanceStatus === 'active'
                ? 'text-green-400'
                : state.tabooIndex.governanceStatus === 'alert'
                ? 'text-yellow-400'
                : 'text-red-400'
            }`}
          >
            {state.tabooIndex.governanceStatus}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-luna-300 text-sm">Avg Compliance</span>
          <span className="text-sm font-semibold text-cyberpunk-primary">{avgCompliance.toFixed(0)}%</span>
        </div>
      </div>

      {/* Blocked Actions */}
      <div>
        <h4 className="text-sm font-semibold text-cyberpunk-primary flex items-center gap-2 mb-2">
          <ShieldAlert size={16} />
          Recent Blocks ({state.tabooIndex.blockedActions.length})
        </h4>
        <div className="space-y-1 text-xs">
          {blockedActions.length === 0 ? (
            <p className="text-luna-400">No violations detected</p>
          ) : (
            blockedActions.map((action) => (
              <div key={action.id} className="bg-luna-800 p-2 rounded">
                <div className="flex justify-between items-start">
                  <span className="text-luna-200 flex-1">{action.agentId}: {action.action}</span>
                  <span className={`text-xs font-semibold ${getSeverityColor(action.severity)}`}>
                    {action.severity}
                  </span>
                </div>
                <p className="text-luna-400 text-xs mt-1">{action.reason}</p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Taboo Rules */}
      <div>
        <h4 className="text-sm font-semibold text-cyberpunk-primary flex items-center gap-2 mb-2">
          <AlertCircle size={16} />
          Taboo Rules ({state.tabooIndex.actions.length})
        </h4>
        <div className="space-y-1 text-xs max-h-40 overflow-y-auto">
          {state.tabooIndex.actions.map((action) => (
            <div key={action.id} className="bg-luna-800 p-2 rounded">
              <div className="flex justify-between">
                <span className="text-luna-200 font-semibold">{action.action}</span>
                <span className={`text-xs font-semibold ${getSeverityColor(action.severity)}`}>
                  {action.severity}
                </span>
              </div>
              <p className="text-luna-400 mt-1">{action.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DebugPanel;
