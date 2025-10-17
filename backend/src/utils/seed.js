/**
 * Database Seed Script
 * Populates database with demo data for hackathon
 */

import bcrypt from 'bcryptjs';
import prisma from '../config/database.js';
import { scoreIdea } from '../services/aiService.js';

const DEMO_USERS = [
  { name: 'Sarah Chen', email: 'sarah@campus.edu', role: 'user' },
  { name: 'Marcus Johnson', email: 'marcus@campus.edu', role: 'user' },
  { name: 'Emma Williams', email: 'emma@campus.edu', role: 'user' },
  { name: 'David Park', email: 'david@campus.edu', role: 'user' },
  { name: 'Lisa Anderson', email: 'lisa@campus.edu', role: 'user' },
  { name: 'Ryan Thompson', email: 'ryan@campus.edu', role: 'user' },
  { name: 'Dr. Smith (Mentor)', email: 'smith@campus.edu', role: 'mentor' },
];

const DEMO_IDEAS = [
  {
    title: 'AI-Powered Study Assistant',
    description: 'A personalized AI tutor that adapts to each student\'s learning style and provides 24/7 homework help. The system will use machine learning to identify weak areas and suggest targeted practice materials. It integrates with campus LMS for seamless access to course materials.',
    category: 'IT',
    imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80',
  },
  {
    title: 'Sustainable Campus Cafeteria',
    description: 'Transform campus dining with locally sourced ingredients, zero-waste packaging, and composting programs. Partner with local farms to reduce transportation costs and carbon footprint. Implement reusable container system with deposit returns.',
    category: 'Science',
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80',
  },
  {
    title: 'Virtual Career Fair Platform',
    description: 'An immersive VR platform connecting students with employers for networking and interviews. Features include virtual booths, one-on-one meeting rooms, resume drop zones, and real-time chat. Accessible via web browser or VR headset.',
    category: 'Business',
    imageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80',
  },
  {
    title: 'Mental Health Chatbot',
    description: 'Anonymous peer support chatbot providing resources and connecting students with counseling services. Uses NLP to detect crisis situations and escalate appropriately. Available 24/7 with multilingual support. Fully HIPAA compliant.',
    category: 'Humanities',
    imageUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&q=80',
  },
  {
    title: 'Campus Innovation Lab',
    description: 'A physical makerspace with 3D printers, laser cutters, and tools for students to prototype their ideas. Include workshop sessions, mentorship programs, and equipment training. Open to all students regardless of major.',
    category: 'Design',
    imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80',
  },
  {
    title: 'Smart Parking System',
    description: 'IoT sensors and mobile app to find available parking spots in real-time across campus. Reduce time spent searching for parking, lower emissions, and improve traffic flow. Integration with campus payment systems for seamless parking fees.',
    category: 'IT',
    imageUrl: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=800&q=80',
  },
];

async function seed() {
  console.log('🌱 Starting database seed...\n');

  try {
    // Clear existing data
    console.log('Clearing existing data...');
    await prisma.comment.deleteMany();
    await prisma.vote.deleteMany();
    await prisma.idea.deleteMany();
    await prisma.user.deleteMany();
    await prisma.analytics.deleteMany();

    // Create users
    console.log('Creating users...');
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const users = await Promise.all(
      DEMO_USERS.map(user =>
        prisma.user.create({
          data: {
            ...user,
            password: hashedPassword,
            points: Math.floor(Math.random() * 500) + 100
          }
        })
      )
    );
    console.log(`✅ Created ${users.length} users`);

    // Create ideas with AI scoring
    console.log('\nCreating ideas with AI scoring...');
    const ideas = [];
    
    for (let i = 0; i < DEMO_IDEAS.length; i++) {
      const ideaData = DEMO_IDEAS[i];
      const author = users[i % users.length];
      
      // Run AI scoring
      const aiResults = scoreIdea(ideaData);
      
      const idea = await prisma.idea.create({
        data: {
          ...ideaData,
          ...aiResults,
          authorId: author.id,
          voteCount: Math.floor(Math.random() * 50) + 10,
          commentCount: Math.floor(Math.random() * 15) + 3,
          mentorPick: Math.random() > 0.6
        }
      });
      
      ideas.push(idea);
      console.log(`  ✅ ${idea.title} - AI Score: ${idea.aiScore} - Status: ${idea.status}`);
    }
    console.log(`\n✅ Created ${ideas.length} ideas`);

    // Create votes
    console.log('\nCreating votes...');
    let voteCount = 0;
    
    for (const idea of ideas) {
      const numVotes = Math.floor(Math.random() * 20) + 5;
      const voters = users
        .filter(user => user.id !== idea.authorId)
        .sort(() => Math.random() - 0.5)
        .slice(0, numVotes);
      
      for (const voter of voters) {
        await prisma.vote.create({
          data: {
            userId: voter.id,
            ideaId: idea.id
          }
        });
        voteCount++;
      }
    }
    console.log(`✅ Created ${voteCount} votes`);

    // Create comments
    console.log('\nCreating comments...');
    const SAMPLE_COMMENTS = [
      'This is a fantastic idea! I would definitely use this.',
      'Have you considered the implementation challenges?',
      'Great concept, but needs more detail on the budget.',
      'I love this! How can I help make it happen?',
      'Similar ideas have been tried before. What makes this different?',
      'This could really benefit our campus community!',
      'Impressive proposal. Looking forward to seeing this develop.',
      'What\'s the timeline for implementing this?',
    ];
    
    let commentCount = 0;
    for (const idea of ideas) {
      const numComments = Math.floor(Math.random() * 8) + 2;
      
      for (let i = 0; i < numComments; i++) {
        const commenter = users[Math.floor(Math.random() * users.length)];
        await prisma.comment.create({
          data: {
            content: SAMPLE_COMMENTS[Math.floor(Math.random() * SAMPLE_COMMENTS.length)],
            userId: commenter.id,
            ideaId: idea.id
          }
        });
        commentCount++;
      }
    }
    console.log(`✅ Created ${commentCount} comments`);

    // Create analytics record
    console.log('\nCreating analytics...');
    await prisma.analytics.create({
      data: {
        totalIdeas: ideas.length,
        totalUsers: users.length,
        totalVotes: voteCount,
        totalComments: commentCount,
        ideasThisWeek: Math.floor(ideas.length * 0.4)
      }
    });
    console.log('✅ Analytics created');

    // Update user points and badges based on activity
    console.log('\nUpdating user points and badges...');
    for (const user of users) {
      const userIdeas = ideas.filter(idea => idea.authorId === user.id);
      const points = user.points + (userIdeas.length * 50);
      
      const badges = [];
      if (userIdeas.length >= 3) badges.push('Top Pitcher');
      if (userIdeas.some(idea => idea.aiScore >= 85)) badges.push('Rising Star');
      if (userIdeas.some(idea => idea.mentorPick)) badges.push('Mentor Magnet');
      
      await prisma.user.update({
        where: { id: user.id },
        data: {
          points,
          badges: JSON.stringify(badges)
        }
      });
    }
    console.log('✅ User points and badges updated');

    console.log('\n✨ Seed completed successfully!\n');
    console.log('Demo accounts:');
    console.log('  Email: sarah@campus.edu | Password: password123 (Regular User)');
    console.log('  Email: marcus@campus.edu | Password: password123 (Regular User)');
    console.log('  Email: smith@campus.edu | Password: password123 (Mentor)\n');

  } catch (error) {
    console.error('❌ Seed failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seed();

