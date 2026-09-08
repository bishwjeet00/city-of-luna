import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, ChevronDown, ChevronUp } from 'lucide-react';
import { Agent } from '@/types';
import AgentCard from './AgentCard';
import AgentProfile from './AgentProfile';

interface AgentPanelProps {
  agents: Agent[];
}

const AgentPanel: React.FC<AgentPanelProps> = ({ agents }) => {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [expandedAgentId, setExpandedAgentId] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <div className="card-header px-4 pt-4">
        <Users size={24} />
        <span>Population ({agents.length})</span>
      </div>

      <div className="px-4 grid grid-cols-1 gap-3 pb-4">
        <AnimatePresence>
          {agents.map((agent, idx) => (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: idx * 0.05 }}
            >
              <AgentCard
                agent={agent}
                isSelected={selectedAgent?.id === agent.id}
                onSelect={() => setSelectedAgent(agent)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Agent Profile Modal */}
      <AnimatePresence>
        {selectedAgent && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedAgent(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl max-h-96 overflow-y-auto"
            >
              <AgentProfile agent={selectedAgent} onClose={() => setSelectedAgent(null)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AgentPanel;
