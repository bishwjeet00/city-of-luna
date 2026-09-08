import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Zap, Users, Building2, AlertCircle, CheckCircle } from 'lucide-react';
import { CityEvent } from '@/types';

interface EventFeedProps {
  events: CityEvent[];
}

const EventFeed: React.FC<EventFeedProps> = ({ events }) => {
  const getEventIcon = (type: string) => {
    switch (type) {
      case 'skill_learned':
        return <Zap size={16} className="text-cyberpunk-accent" />;
      case 'job_hired':
      case 'job_applied':
        return <Users size={16} className="text-cyberpunk-primary" />;
      case 'company_founded':
      case 'building_constructed':
        return <Building2 size={16} className="text-green-400" />;
      case 'taboo_violated':
        return <AlertCircle size={16} className="text-red-400" />;
      case 'agent_spawned':
        return <CheckCircle size={16} className="text-blue-400" />;
      default:
        return <Bell size={16} className="text-luna-400" />;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'taboo_violated':
        return 'border-red-900 bg-red-950';
      case 'agent_spawned':
        return 'border-blue-900 bg-blue-950';
      case 'company_founded':
      case 'building_constructed':
        return 'border-green-900 bg-green-950';
      default:
        return 'border-luna-800 bg-luna-900';
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="card-header px-4 pt-4">
        <Bell size={24} />
        <span>Event Feed</span>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2">
        <AnimatePresence>
          {events.length === 0 ? (
            <div className="text-center text-luna-400 py-8">
              <p className="text-sm">No events yet...</p>
            </div>
          ) : (
            events.slice().reverse().map((event, idx) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: idx * 0.05 }}
                className={`card border ${getEventColor(event.type)} p-3 text-sm`}
              >
                <div className="flex gap-2">
                  {getEventIcon(event.type)}
                  <div className="flex-1 min-w-0">
                    <p className="text-luna-200 line-clamp-2">{event.description}</p>
                    <p className="text-xs text-luna-400 mt-1">Tick #{event.timestamp}</p>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default EventFeed;
