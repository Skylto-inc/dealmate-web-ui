import { NextRequest, NextResponse } from 'next/server';
import { UserActivity } from '@/types/recommendations';

// In-memory storage for demo purposes
// In production, this would be stored in a database
const activityStore = new Map<string, UserActivity[]>();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, productId, action, metadata, timestamp } = body;

    if (!userId || !productId || !action) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const activity: UserActivity = {
      userId,
      productId,
      action,
      timestamp: new Date(timestamp),
      metadata,
    };

    // Store activity
    const userActivities = activityStore.get(userId) || [];
    userActivities.push(activity);
    
    // Keep only last 100 activities per user for demo
    if (userActivities.length > 100) {
      userActivities.shift();
    }
    
    activityStore.set(userId, userActivities);

    // In production, this would:
    // 1. Store in database
    // 2. Update recommendation model
    // 3. Trigger real-time processing
    // 4. Update user profile

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error tracking activity:', error);
    return NextResponse.json(
      { error: 'Failed to track activity' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing userId parameter' },
        { status: 400 }
      );
    }

    const activities = activityStore.get(userId) || [];
    
    return NextResponse.json({
      activities,
      total: activities.length,
    });
  } catch (error) {
    console.error('Error fetching activities:', error);
    return NextResponse.json(
      { error: 'Failed to fetch activities' },
      { status: 500 }
    );
  }
}
