import React from 'react';
import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';

const ProfileVersusComponent = () => {
  // Dummy data with consistent win/loss statistics and added topics
  const battlesData = [
    {
      user: {
        name: "Alex",
        wins: 8,
        losses: 6,
      },
      friend: {
        name: "Betty",
        wins: 6,
        losses: 8,
      },
      totalBattles: 14,
      topic: "Algebra"
    },
    {
      user: {
        name: "Alex",
        wins: 5,
        losses: 7,
      },
      friend: {
        name: "Carlos",
        wins: 7,
        losses: 5,
      },
      totalBattles: 12,
      topic: "Geometry"
    },
    {
      user: {
        name: "Alex",
        wins: 10,
        losses: 5,
      },
      friend: {
        name: "Diana",
        wins: 5,
        losses: 10,
      },
      totalBattles: 15,
      topic: "Calculus"
    }
  ];

  return (
    <div className="p-6 bg-gray-50">
      <h2 className="text-2xl font-bold mb-6 flex items-center">
        <Trophy className="mr-2 text-amber-500" />
        Battle Records
      </h2>
      
      <div className="space-y-6">
        {battlesData.map((battle, index) => (
          <motion.div 
            key={index} 
            className="bg-white rounded-xl shadow-md overflow-hidden"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 * index }}
            whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
          >
            {/* Topic header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 py-2 px-4">
              <h3 className="text-white font-medium">Topic: {battle.topic}</h3>
            </div>
            
            <div className="p-6">
              <div className="flex items-center justify-between">
                {/* Left Profile (User) */}
                <motion.div 
                  className="flex flex-col items-center space-y-3 w-1/3"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                    {battle.user.name.charAt(0)}
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-lg">{battle.user.name}</p>
                    <div className="flex justify-center mt-2 space-x-2">
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                        W: {battle.user.wins}
                      </span>
                      <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                        L: {battle.user.losses}
                      </span>
                    </div>
                  </div>
                </motion.div>
                
                {/* Middle VS Section */}
                <div className="flex flex-col items-center w-1/3">
                  {/* Score visualization */}
                  <div className="w-full h-2 bg-gray-200 rounded-full mb-4">
                    <div 
                      className="h-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full" 
                      style={{ width: `${(battle.user.wins / battle.totalBattles) * 100}%` }}
                    ></div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-full p-2 px-6 shadow-md transform -rotate-12">
                    <span className="text-xl font-bold text-white">VS</span>
                  </div>
                  
                  <p className="text-gray-500 mt-2 text-sm">Total Battles: {battle.totalBattles}</p>
                </div>
                
                {/* Right Profile (Friend) */}
                <motion.div 
                  className="flex flex-col items-center space-y-3 w-1/3"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                    {battle.friend.name.charAt(0)}
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-lg">{battle.friend.name}</p>
                    <div className="flex justify-center mt-2 space-x-2">
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                        W: {battle.friend.wins}
                      </span>
                      <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                        L: {battle.friend.losses}
                      </span>
                    </div>
                  </div>
                </motion.div>
              </div>
              
              {/* Battle actions */}
              <div className="mt-6 flex justify-center">
                <motion.button
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded-lg font-medium shadow-md hover:shadow-lg transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Challenge to Rematch
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const BattlesContent = ({ userData }) => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Quiz Battles</h2>
      <p className="text-gray-600 mb-8">Challenge your friends to quiz battles and track your performance.</p>
      
      {/* Profile Versus Component */}
      <ProfileVersusComponent />
      
      <h2 className="text-2xl font-bold my-6">Active Battles</h2>
      <div className="space-y-4">
        {userData.quizBattles.map((battle, index) => (
          <motion.div 
            key={index} 
            className="bg-white rounded-xl p-4 shadow-sm"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 * index }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <img src={battle.avatar} alt={battle.opponent} className="w-10 h-10 rounded-full mr-3" />
                <div>
                  <h3 className="font-bold">{battle.opponent}</h3>
                  <p className="text-sm text-gray-600">Topic: {battle.topic}</p>
                </div>
              </div>
              <div className="text-right">
                <span className={`px-3 py-1 rounded-full text-sm ${
                  battle.status === 'Your Turn' ? 'bg-green-100 text-green-700' :
                  battle.status === 'Waiting' ? 'bg-amber-100 text-amber-700' :
                  battle.status === 'Won' ? 'bg-blue-100 text-blue-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {battle.status}
                </span>
                <p className="text-sm text-gray-600 mt-1">
                  {battle.score ? `Score: ${battle.score}` : `Time left: ${battle.timeLeft}`}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default BattlesContent;