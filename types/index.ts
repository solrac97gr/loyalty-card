export interface LoyaltyCard {
  id: string;
  userId: string;
  email: string;
  points: number;
  coffeeCount: number;
  createdAt: Date;
  updatedAt: Date;
  qrCode: string;
}

export interface Transaction {
  id: string;
  userId: string;
  cardId: string;
  coffeeCount: number;
  pointsAdded: number;
  timestamp: Date;
  adminId: string;
}

export interface User {
  id: string;
  email: string;
  role: 'customer' | 'admin';
  createdAt: Date;
}
