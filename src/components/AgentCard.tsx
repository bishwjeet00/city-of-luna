import React from 'react';
import { motion } from 'framer-motion';
import { Agent } from '@/types';
import { Zap, Briefcase, TrendingUp, Heart } from 'lucide-react';

interface AgentCardProps {
  agent: Agent;
  isSelected: boolean;
  onSelect: () => void;
}

const AgentCard: React.FC<AgentCardProps> = ({ agent, isSelected, onSelect }) => {
  const avgSkillLevel = agent.skills.reduce((sum, s) => sum + s.level, 0) / Math.max(agent.skills.length, 1);
  const moodColor = agent.mood > 70 ? 'text-green-400' : agent.mood > 40 ? 'text-yellow-400' : 'text-red-400';

  return (
    <motion.div
      onClick={onSelect}
      whileHover={{ scale: 1.02 }}
      className={`card cursor-pointer transition-all ${
        isSelected ? 'border-cyberpunk-primary border-2 glow-primary' : 'border-luna-700'
      }`}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-bold text-cyberpunk-primary">{agent.name}</h3>
          <p className="text-xs text-luna-400 capitalize">{agent.personality}</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-cyberpunk-accent">${agent.wealth.toFixed(0)}</div>
          <div className="text-xs text-luna-400">Net Worth</div>
        </div>
      </div>

      <div className="space-y-2 text-sm">
        {/* Job Status */}
        <div className="flex items-center gap-2">
          <Briefcase size={16} className="text-luna-400" />
          <span>
            {agent.jobId ? (
              <span>
                <span className="text-cyberpunk-primary font-semibold">Employed</span>
                <span className="text-luna-400 ml-1">• Specialist</span>
              </span>
            ) : (
              <span className="text-yellow-400 font-semibold">Unemployed</span>
            )}
          </span>
        </div>

        {/* Mood */}
        <div className="flex items-center gap-2">
          <Heart size={16} className={moodColor} />
          <div className="flex-1 bg-luna-800 rounded-full h-2">
            <div
              className="h-full bg-gradient-to-r from-red-500 to-green-500 rounded-full"
              style={{ width: `${agent.mood}%` }}
            />
          </div>
          <span className="text-xs text-luna-300">{agent.mood.toFixed(0)}%</span>
        </div>

        {/* Energy */}
        <div className="flex items-center gap-2">
          <Zap size={16} className="text-cyberpunk-accent" />
          <div className="flex-1 bg-luna-800 rounded-full h-2">
            <div
              className="h-full bg-gradient-to-r from-cyberpunk-accent to-cyberpunk-primary rounded-full"
              style={{ width: `${agent.energy}%` }}
            />
          </div>
          <span className="text-xs text-luna-300">{agent.energy.toFixed(0)}%</span>
        </div>

        {/* Skills */}
        <div className="flex items-center gap-2">
          <TrendingUp size={16} className="text-cyberpunk-primary" />
          <div className="flex-1">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-luna-300">Avg Skill</span>
              <span className="text-cyberpunk-primary font-semibold">{avgSkillLevel.toFixed(0)}%</span>
            </div>
            <div className="bg-luna-800 rounded-full h-2">
              <div
                className="h-full bg-gradient-to-r from-luna-500 to-cyberpunk-primary rounded-full"
                style={{ width: `${avgSkillLevel}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Goal Preview */}
      {agent.goals.length > 0 && (
        <div className="mt-3 pt-3 border-t border-luna-700">
          <p className="text-xs text-luna-400 line-clamp-1">
            Goal: <span className="text-luna-200">{agent.goals[0].description}</span>
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default AgentCard;
