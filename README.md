# ☕ Coffee Loyalty Card App

A modern loyalty card application built with Firebase and Next.js that works with Apple Wallet and Google Wallet. Customers can collect coffee stamps via QR codes and earn points, while shop owners have an admin dashboard to manage the loyalty program.

## Features

- **Customer Features:**
  - Email-based registration (no password required)
  - Personal QR code for scanning at checkout
  - Real-time points and coffee count tracking
  - Digital loyalty card accessible on any device
  - Compatible with Apple Wallet and Google Wallet (future enhancement)

- **Admin Features:**
  - QR code scanning interface
  - View all customer loyalty cards
  - Track transaction history
  - Add coffee purchases and points in real-time

- **Technical Stack:**
  - **Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS
  - **Backend:** Next.js API Routes, Firebase Admin SDK
  - **Database:** Firebase Firestore
  - **QR Codes:** qrcode library
  - **Authentication:** Firebase Auth (email-based)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Firebase project (free tier works fine)
- npm or yarn package manager

### Firebase Setup

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Firestore Database:
   - Go to Firestore Database
   - Click "Create database"
   - Start in production mode
   - Choose a location

3. Get your Firebase configuration:
   - Go to Project Settings > General
   - Under "Your apps", click the web icon (</>)
   - Copy the Firebase configuration values

4. Create a service account for admin access:
   - Go to Project Settings > Service Accounts
   - Click "Generate new private key"
   - Save the JSON file securely

### Installation

1. Clone the repository:
```bash
git clone https://github.com/solrac97gr/loyalty-card.git
cd loyalty-card
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory:
```bash
cp .env.example .env.local
```

4. Fill in your Firebase credentials in `.env.local`:
```env
# Firebase Client Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

# Firebase Admin Configuration
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account-email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour-private-key\n-----END PRIVATE KEY-----\n"
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### For Customers

1. Navigate to the homepage and click "Get Your Card"
2. Enter your email address
3. Your unique loyalty card with QR code will be generated
4. Show the QR code at the coffee shop counter to collect stamps

### For Shop Owners

1. Navigate to the homepage and click "Admin Dashboard"
2. Use the "Scan QR Code" tab to:
   - Enter or scan the customer's QR code
   - Specify the number of coffees purchased
   - Submit to add points to their account
3. View all customer cards in the "All Cards" tab
4. Track recent purchases in the "Recent Transactions" tab

## Project Structure

```
loyalty-card/
├── app/
│   ├── api/              # API routes
│   │   ├── admin/        # Admin endpoints
│   │   │   ├── cards/    # Get all cards
│   │   │   ├── scan/     # Scan QR code
│   │   │   └── transactions/  # Transaction history
│   │   └── cards/        # Card management
│   │       ├── create/   # Create new card
│   │       └── get/      # Get card by email
│   ├── admin/            # Admin dashboard page
│   ├── client/           # Customer loyalty card page
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Homepage
├── lib/
│   ├── firebase.ts       # Firebase client config
│   └── firebase-admin.ts # Firebase admin config
├── types/
│   └── index.ts          # TypeScript interfaces
└── public/               # Static assets
```

## Data Models

### Loyalty Card
```typescript
{
  id: string;           // Unique card ID
  userId: string;       // User's email
  email: string;        // User's email
  points: number;       // Total points earned
  coffeeCount: number;  // Total coffees purchased
  createdAt: Date;      // Card creation date
  updatedAt: Date;      // Last update date
  qrCode: string;       // QR code value
}
```

### Transaction
```typescript
{
  id: string;
  userId: string;
  cardId: string;
  coffeeCount: number;
  pointsAdded: number;
  timestamp: Date;
  adminId: string;
}
```

## Points System

- **10 points** are awarded per coffee purchase
- Points accumulate with each transaction
- Future enhancements can include reward tiers and redemption options

## Future Enhancements

- [ ] Apple Wallet pass generation (.pkpass files)
- [ ] Google Wallet pass generation
- [ ] QR code scanning via camera (using device camera)
- [ ] Push notifications for rewards
- [ ] Reward redemption system
- [ ] Admin authentication
- [ ] Analytics dashboard
- [ ] Email notifications
- [ ] Progressive Web App (PWA) support

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Add your environment variables in the Vercel dashboard
4. Deploy!

### Firestore Security Rules

Add these security rules to your Firestore:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /loyaltyCards/{cardId} {
      allow read: if true;
      allow write: if false;  // Only allow writes via Admin SDK
    }
    match /transactions/{transactionId} {
      allow read: if true;
      allow write: if false;  // Only allow writes via Admin SDK
    }
  }
}
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

For issues, questions, or contributions, please open an issue on GitHub.

