import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Users, Building2, TrendingUp, Zap } from 'lucide-react';
import { SimulationState } from '@/types';

interface CityOverviewProps {
  state: SimulationState;
}

const CityOverview: React.FC<CityOverviewProps> = ({ state }) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="p-6 bg-gradient-to-b from-luna-900 to-luna-950 border-b border-luna-800">
      <h2 className="text-2xl font-bold text-cyberpunk-primary mb-6 flex items-center gap-2">
        <BarChart3 size={24} />
        City Dashboard
      </h2>

      <motion.div
        className="grid grid-cols-1 gap-4"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {/* Simulation Info */}
        <motion.div className="card" variants={item}>
          <div className="card-header">
            <Zap size={20} />
            Simulation Status
          </div>
          <div className="card-content">
            <div className="stat">
              <span className="stat-label">Current Tick</span>
              <span className="stat-value text-2xl">{state.tick}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Simulation Speed</span>
              <span className="stat-value">{state.speed}x</span>
            </div>
            <div className="stat">
              <span className="stat-label">Status</span>
              <span className={`stat-value ${state.paused ? 'text-yellow-400' : 'text-green-400'}`}>
                {state.paused ? 'PAUSED' : 'RUNNING'}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Population */}
        <motion.div className="card" variants={item}>
          <div className="card-header">
            <Users size={20} />
            Population
          </div>
          <div className="card-content">
            <div className="stat">
              <span className="stat-label">Total Agents</span>
              <span className="stat-value">{state.population.totalAgents}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Active</span>
              <span className="stat-value text-green-400">{state.population.activeAgents}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Unemployed</span>
              <span className="stat-value text-yellow-400">{state.population.unemployed}</span>
            </div>
          </div>
        </motion.div>

        {/* Economy */}
        <motion.div className="card" variants={item}>
          <div className="card-header">
            <TrendingUp size={20} />
            Economy
          </div>
          <div className="card-content">
            <div className="stat">
              <span className="stat-label">Total Wealth</span>
              <span className="stat-value">${state.economy.totalWealth.toFixed(0)}</span>
            </div>
            <div className="stat">
              <span className="stat-label">GDP</span>
              <span className="stat-value">${state.economy.gdp.toFixed(0)}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Avg Salary</span>
              <span className="stat-value">${state.economy.averageSalary.toFixed(1)}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Unemployment Rate</span>
              <span className="stat-value">{(state.economy.unemploymentRate * 100).toFixed(1)}%</span>
            </div>
          </div>
        </motion.div>

        {/* Infrastructure */}
        <motion.div className="card" variants={item}>
          <div className="card-header">
            <Building2 size={20} />
            Infrastructure
          </div>
          <div className="card-content">
            <div className="stat">
              <span className="stat-label">Companies</span>
              <span className="stat-value">{state.population.totalCompanies}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Buildings</span>
              <span className="stat-value">{state.population.totalBuildings}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Open Jobs</span>
              <span className="stat-value">{state.jobs.length}</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default CityOverview;
