import { create } from 'zustand';
import { SimulationState, Agent, Company, Building, CityEvent, TabooIndex, Job, PopulationStats, EconomyState } from '@/types';
import { createInitialState } from './simulation';

interface SimulationStore {
  state: SimulationState;
  // Core actions
  tick: () => void;
  togglePause: () => void;
  setSpeed: (speed: number) => void;
  reset: () => void;
  // Queries
  getAgent: (id: string) => Agent | undefined;
  getCompany: (id: string) => Company | undefined;
  getBuilding: (id: string) => Building | undefined;
  getEmployeesByCompany: (companyId: string) => Agent[];
  getJobsByCompany: (companyId: string) => Job[];
  // Mutations
  updateAgent: (agent: Agent) => void;
  updateCompany: (company: Company) => void;
  addEvent: (event: CityEvent) => void;
}

const useSimulationStore = create<SimulationStore>((set, get) => ({
  state: createInitialState(),

  tick: () => {
    set((store) => {
      if (store.state.paused) return store;

      const newState = { ...store.state };
      newState.tick += store.state.speed; // FIX: Account for simulation speed

      // Update each agent
      newState.agents = newState.agents.map((agent) => {
        if (!agent.isAlive) return agent;

        const updatedAgent = { ...agent };

        // Restore energy slightly
        updatedAgent.energy = Math.min(100, updatedAgent.energy + 3);

        // If employed, receive salary
        if (updatedAgent.jobId) {
          const job = newState.jobs.find((j) => j.id === updatedAgent.jobId);
          if (job) {
            updatedAgent.wealth += job.salaryPerTick;
            updatedAgent.mood = Math.min(100, updatedAgent.mood + 2);
          }
        }

        // Skill experience decay slightly (encourages continuous learning)
        updatedAgent.skills = updatedAgent.skills.map((skill) => {
          if (skill.level < 100) {
            skill.experiencePoints = Math.max(0, skill.experiencePoints - 1);
          }
          return skill;
        });

        return updatedAgent;
      });

      // Update companies
      newState.companies = newState.companies.map((company) => {
        if (!company.isActive) return company;

        const updatedCompany = { ...company };

        // Calculate revenue based on employees and buildings
        const employeeCount = company.employees.length;
        const buildingCount = company.buildingIds.length;
        updatedCompany.revenue = employeeCount * 50 + buildingCount * 30;

        // Calculate expenses (salaries)
        const salaries = newState.jobs
          .filter((j) => j.companyId === company.id)
          .reduce((sum, j) => sum + j.salaryPerTick * j.openPositions, 0);
        updatedCompany.expenses = salaries + buildingCount * 10;

        return updatedCompany;
      });

      // Update economy stats
      const totalWealth = newState.agents.reduce((sum, a) => sum + a.wealth, 0);
      const totalRevenue = newState.companies.reduce((sum, c) => sum + c.revenue, 0);
      const totalExpenses = newState.companies.reduce((sum, c) => sum + c.expenses, 0);
      const employedCount = newState.agents.filter((a) => a.jobId !== null).length;

      newState.economy = {
        totalWealth,
        totalRevenue,
        totalExpenses,
        averageSalary: newState.jobs.length > 0 ? newState.jobs.reduce((sum, j) => sum + j.salaryPerTick, 0) / newState.jobs.length : 0,
        unemploymentRate: (newState.agents.length - employedCount) / newState.agents.length,
        gdp: totalRevenue,
        inflation: 0.02,
      };

      newState.population = {
        totalAgents: newState.agents.length,
        activeAgents: newState.agents.filter((a) => a.isAlive).length,
        unemployed: newState.agents.length - employedCount,
        entrepreneurs: newState.companies.filter((c) => c.isActive).length,
        totalCompanies: newState.companies.filter((c) => c.isActive).length,
        totalBuildings: newState.buildings.length,
      };

      // FIX: Properly return updated state
      return {
        ...store,
        state: newState,
      };
    });
  },

  togglePause: () => {
    set((store) => ({
      ...store,
      state: { ...store.state, paused: !store.state.paused },
    }));
  },

  setSpeed: (speed: number) => {
    set((store) => ({
      ...store,
      state: { ...store.state, speed: Math.max(0.5, Math.min(8, speed)) },
    }));
  },

  reset: () => {
    set(() => ({
      state: createInitialState(),
    }));
  },

  getAgent: (id: string) => {
    return get().state.agents.find((a) => a.id === id);
  },

  getCompany: (id: string) => {
    return get().state.companies.find((c) => c.id === id);
  },

  getBuilding: (id: string) => {
    return get().state.buildings.find((b) => b.id === id);
  },

  getEmployeesByCompany: (companyId: string) => {
    const company = get().getCompany(companyId);
    if (!company) return [];
    return get().state.agents.filter((a) => company.employees.includes(a.id));
  },

  getJobsByCompany: (companyId: string) => {
    return get().state.jobs.filter((j) => j.companyId === companyId);
  },

  updateAgent: (agent: Agent) => {
    set((store) => ({
      ...store,
      state: {
        ...store.state,
        agents: store.state.agents.map((a) => (a.id === agent.id ? agent : a)),
      },
    }));
  },

  updateCompany: (company: Company) => {
    set((store) => ({
      ...store,
      state: {
        ...store.state,
        companies: store.state.companies.map((c) => (c.id === company.id ? company : c)),
      },
    }));
  },

  addEvent: (event: CityEvent) => {
    set((store) => ({
      ...store,
      state: {
        ...store.state,
        events: [...store.state.events.slice(-99), event],
      },
    }));
  },
}));

export default useSimulationStore;
