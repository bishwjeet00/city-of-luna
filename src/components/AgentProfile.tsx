import React from 'react';
import { motion } from 'framer-motion';
import { Agent } from '@/types';
import { X, Briefcase, BookOpen, Users, Heart, Award } from 'lucide-react';

interface AgentProfileProps {
  agent: Agent;
  onClose: () => void;
}

const AgentProfile: React.FC<AgentProfileProps> = ({ agent, onClose }) => {
  return (
    <motion.div
      className="card border-2 border-cyberpunk-primary max-h-96 overflow-y-auto"
      initial={{ scale: 0.95 }}
      animate={{ scale: 1 }}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4 pb-3 border-b border-luna-700">
        <div>
          <h2 className="text-2xl font-bold text-cyberpunk-primary">{agent.name}</h2>
          <p className="text-luna-400 capitalize">{agent.personality} • {agent.age} ticks old</p>
        </div>
        <button
          onClick={onClose}
          className="text-luna-400 hover:text-cyberpunk-primary transition-colors"
        >
          <X size={24} />
        </button>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-luna-800 p-3 rounded">
          <div className="text-xs text-luna-400">Total Wealth</div>
          <div className="text-xl font-bold text-cyberpunk-primary">${agent.wealth.toFixed(0)}</div>
        </div>
        <div className="bg-luna-800 p-3 rounded">
          <div className="text-xs text-luna-400">Savings</div>
          <div className="text-xl font-bold text-cyberpunk-accent">${agent.savings.toFixed(0)}</div>
        </div>
        <div className="bg-luna-800 p-3 rounded">
          <div className="text-xs text-luna-400">Reputation</div>
          <div className="text-xl font-bold text-green-400">{agent.reputation.toFixed(0)}%</div>
        </div>
        <div className="bg-luna-800 p-3 rounded">
          <div className="text-xs text-luna-400">Mood/Energy</div>
          <div className="text-lg font-bold">
            <span className="text-yellow-400">{agent.mood.toFixed(0)}%</span>
            <span className="text-luna-400 mx-1">/</span>
            <span className="text-cyberpunk-accent">{agent.energy.toFixed(0)}%</span>
          </div>
        </div>
      </div>

      {/* Skills */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-cyberpunk-primary flex items-center gap-2 mb-2">
          <BookOpen size={18} />
          Skills
        </h3>
        <div className="space-y-2">
          {agent.skills.map((skill) => (
            <div key={skill.type}>
              <div className="flex justify-between items-center text-sm mb-1">
                <span className="text-luna-300 capitalize">{skill.type}</span>
                <span className="text-cyberpunk-primary font-semibold">{skill.level.toFixed(0)}</span>
              </div>
              <div className="bg-luna-800 rounded-full h-2">
                <div
                  className="h-full bg-gradient-to-r from-cyberpunk-primary to-cyberpunk-accent rounded-full"
                  style={{ width: `${skill.level}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Goals */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-cyberpunk-primary flex items-center gap-2 mb-2">
          <Award size={18} />
          Goals
        </h3>
        <div className="space-y-2">
          {agent.goals.map((goal) => (
            <div key={goal.id} className="bg-luna-800 p-2 rounded text-sm">
              <div className="flex justify-between mb-1">
                <span className="text-luna-300 font-medium">{goal.description}</span>
                <span className="text-cyberpunk-primary">{goal.progress.toFixed(0)}%</span>
              </div>
              <div className="bg-luna-700 rounded-full h-1.5">
                <div
                  className="h-full bg-cyberpunk-primary rounded-full"
                  style={{ width: `${goal.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Relationships */}
      {Object.keys(agent.relationships).length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-cyberpunk-primary flex items-center gap-2 mb-2">
            <Heart size={18} />
            Relationships
          </h3>
          <div className="space-y-1 text-sm">
            {Object.entries(agent.relationships).map(([agentId, strength]) => (
              <div key={agentId} className="flex justify-between text-luna-300">
                <span>{agentId}</span>
                <span className={strength > 50 ? 'text-green-400' : strength < -50 ? 'text-red-400' : 'text-yellow-400'}>
                  {strength > 0 ? '+' : ''}{strength.toFixed(0)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default AgentProfile;
