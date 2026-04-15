import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Order from '@/models/Order';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

const verifyUser = (req) => {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  const token = authHeader.split(' ')[1];
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
};

export async function GET(req) {
  try {
    const user = verifyUser(req);
    if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    await connectToDatabase();
    let orders;
    
    // Admin sees all orders, users see only theirs
    if (user.role === 'admin') {
      orders = await Order.find({}).populate('user', 'name email').populate('items.product', 'name price').sort({ createdAt: -1 });
    } else {
      orders = await Order.find({ user: user.userId }).populate('items.product', 'name price').sort({ createdAt: -1 });
    }

    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching orders', error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const user = verifyUser(req);
    if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    await connectToDatabase();
    const body = await req.json();
    
    const newOrder = await Order.create({
      ...body,
      user: user.userId
    });

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Error creating order', error: error.message }, { status: 500 });
  }
}
