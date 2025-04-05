// Dummy data to power the dashboard
export const userData = {
  name: "Karan",
  xp: 1200,
  rank: 5,
  quizAttempts: {
    completed: 8,
    pending: 2
  },
  progress: 70,
  streak: 5,
  dailyCompleted: true,
  learningHistory: [
    { date: "2025-03-28", xp: 950 },
    { date: "2025-03-29", xp: 1000 },
    { date: "2025-03-30", xp: 1050 },
    { date: "2025-03-31", xp: 1100 },
    { date: "2025-04-01", xp: 1150 },
    { date: "2025-04-02", xp: 1180 },
    { date: "2025-04-03", xp: 1200 }
  ],
  topicProgress: [
    { topic: "Algebra", progress: 85 },
    { topic: "Geometry", progress: 70 },
    { topic: "Calculus", progress: 45 },
    { topic: "Statistics", progress: 60 }
  ],
  upcomingQuizzes: [
    { id: 1, title: "Advanced Algebra", date: "2025-04-05", difficulty: "Hard" },
    { id: 2, title: "Geometry Basics", date: "2025-04-06", difficulty: "Medium" }
  ],
  recentAchievements: [
    { id: 1, title: "5-Day Streak", icon: "🔥", date: "2025-04-03" },
    { id: 2, title: "Quiz Master", icon: "🏆", date: "2025-03-30" },
    { id: 3, title: "Perfect Score", icon: "⭐", date: "2025-03-22" },
    { id: 4, title: "Fast Learner", icon: "⚡", date: "2025-03-15" }
  ],
  friendActivity: [
    { id: 1, name: "Priya", action: "completed a quiz", time: "2 hours ago", avatar: "https://www.pngfind.com/pngs/m/233-2334734_female-female-business-user-icon-hd-png-download.png" },
    { id: 2, name: "Raj", action: "earned 'Math Wizard' badge", time: "5 hours ago", avatar: "https://icons.veryicon.com/png/o/miscellaneous/user-avatar/user-avatar-male-5.png" },
    { id: 3, name: "Alex", action: "started a new topic", time: "Yesterday", avatar: "https://icons.veryicon.com/png/o/miscellaneous/user-avatar/user-avatar-male-5.png" },
    { id: 4, name: "Meera", action: "achieved 7-day streak", time: "2 days ago", avatar: "https://www.pngfind.com/pngs/m/233-2334734_female-female-business-user-icon-hd-png-download.png" }
  ],
  popularCourses: [
    { 
      id: 1, 
      title: "Learning to UI/UX as a Professional", 
      category: "Design", 
      // price: "$26", 
      students: "500+", 
      rating: 4.9,
      image: "https://img.freepik.com/free-vector/gradient-ui-ux-elements-background_23-2149056159.jpg?t=st=1743793262~exp=1743796862~hmac=880d251cf9b7f189d350593713e6e929ea234d25453a8e66d95feb4344f26bac&w=996"
    },
    { 
      id: 2, 
      title: "Advanced Mathematics", 
      category: "Science & Math", 
      // price: "$32", 
      students: "750+", 
      rating: 4.8,
      image: "https://media.istockphoto.com/id/1242139791/vector/abstract-open-schoolbook-with-icons-of-school-subjects.jpg?s=612x612&w=0&k=20&c=471L4qYzgwpdcvdFCW_Kc2KwWN3bxNUd-wVGQcUMLpQ="
    },
    { 
      id: 3, 
      title: "Introduction to Programming", 
      category: "Computer Science", 
      // price: "$29", 
      students: "1200+", 
      rating: 4.7,
      image: "https://wallpapers.com/images/hd/4k-programming-with-colorful-logos-5e6rsit6iitfdfxq.jpg"
    }
  ],
  subjects: [
    { id: 1, name: "Mathematics", progress: 75, lessons: 24, completed: 18, image: "/api/placeholder/80/80" },
    { id: 2, name: "Science", progress: 60, lessons: 32, completed: 19, image: "/api/placeholder/80/80" },
    { id: 3, name: "Computer Science", progress: 85, lessons: 28, completed: 24, image: "/api/placeholder/80/80" },
    { id: 4, name: "Languages", progress: 40, lessons: 30, completed: 12, image: "/api/placeholder/80/80" }
  ],
  quizBattles: [
    { id: 1, opponent: "Raj", status: "Your Turn", topic: "Algebra", timeLeft: "8 hours", avatar: "/api/placeholder/40/40" },
    { id: 2, opponent: "Priya", status: "Waiting", topic: "Physics", timeLeft: "2 days", avatar: "/api/placeholder/40/40" },
    { id: 3, opponent: "Alex", status: "Won", topic: "Chemistry", score: "5-3", avatar: "/api/placeholder/40/40" },
    { id: 4, opponent: "Meera", status: "Lost", topic: "Biology", score: "4-6", avatar: "/api/placeholder/40/40" }
  ],
  problems: [
    { id: 1, title: "Square root of complex numbers", difficulty: "Hard", solved: false, category: "Algebra" },
    { id: 2, title: "Newton's laws application", difficulty: "Medium", solved: true, category: "Physics" },
    { id: 3, title: "Balancing chemical equations", difficulty: "Easy", solved: true, category: "Chemistry" },
    { id: 4, title: "Binary search implementation", difficulty: "Medium", solved: false, category: "Programming" }
  ]
};

// Generate streak data
export const generateStreakData = () => {
  const today = new Date();
  const data = [];
  
  for (let i = 30; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    // Generate a random completion status, but ensure the last 5 days match the streak
    let completed = Math.random() > 0.4;
    if (i < 5) completed = true;
    
    data.push({
      date: dateStr,
      completed
    });
  }
  
  return data;
};

export const streakData = generateStreakData(); 