import React from 'react';
import { motion } from 'framer-motion';
import { streakData } from './userData';

// XP Chart renderer using div heights
export const XPChart = ({ learningHistory }) => {
  const maxXP = Math.max(...learningHistory.map(item => item.xp));
  
  return (
    <div className="flex items-end h-40 gap-2 mt-4">
      {learningHistory.map((day, index) => {
        const height = (day.xp / maxXP) * 100;
        const date = new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' });
        
        return (
          <motion.div 
            key={index} 
            className="flex flex-col items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <div className="text-xs text-gray-500">{day.xp}</div>
            <motion.div 
              style={{ height: `${height}%` }} 
              className="w-8 bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t-md"
              initial={{ height: 0 }}
              animate={{ height: `${height}%` }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            ></motion.div>
            <div className="text-xs mt-1">{date}</div>
          </motion.div>
        );
      })}
    </div>
  );
};

// Daily challenge streak visualization (GitHub-style)
export const StreakGraph = () => {
  const weeks = [];
  let currentWeek = [];
  
  streakData.forEach((day, index) => {
    currentWeek.push(day);
    if ((index + 1) % 7 === 0 || index === streakData.length - 1) {
      weeks.push([...currentWeek]);
      currentWeek = [];
    }
  });
  
  return (
    <div className="mt-2">
      <div className="flex space-x-1">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="flex flex-col space-y-1">
            {week.map((day, dayIndex) => (
              <motion.div 
                key={`${weekIndex}-${dayIndex}`} 
                className={`w-3 h-3 rounded-sm ${day.completed ? 'bg-emerald-400' : 'bg-gray-200'}`}
                title={`${day.date}: ${day.completed ? 'Completed' : 'Missed'}`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: (weekIndex * 0.1) + (dayIndex * 0.02) }}
              ></motion.div>
            ))}
          </div>
        ))}
      </div>
      <div className="text-xs text-gray-500 mt-1">Your contribution history</div>
    </div>
  );
};

// Progress bars for topics
export const TopicProgress = ({ topicProgress }) => {
  return (
    <div className="space-y-3 mt-3">
      {topicProgress.map((topic, index) => (
        <div key={index} className="space-y-1">
          <div className="flex justify-between text-sm">
            <span>{topic.topic}</span>
            <span>{topic.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div 
              className="bg-gradient-to-r from-indigo-500 to-purple-400 rounded-full h-2" 
              style={{ width: `${topic.progress}%` }}
              initial={{ width: 0 }}
              animate={{ width: `${topic.progress}%` }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
            ></motion.div>
          </div>
        </div>
      ))}
    </div>
  );
}; 