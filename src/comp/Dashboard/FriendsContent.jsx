import React from 'react';

const FriendsContent = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Your Friends</h2>
      <p className="text-gray-600 mb-8">Connect with friends and view their learning progress.</p>
      
      {/* Placeholder for friends */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <p className="text-center text-gray-500">Your friends will appear here.</p>
      </div>
    </div>
  );
};

export default FriendsContent;