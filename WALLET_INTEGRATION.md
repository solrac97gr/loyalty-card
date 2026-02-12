# Apple Wallet and Google Wallet Integration Guide

This guide provides instructions for integrating Apple Wallet (.pkpass) and Google Wallet passes with the loyalty card application.

## Overview

Both Apple Wallet and Google Wallet allow users to store digital loyalty cards on their mobile devices. This enables:
- Easy access to loyalty cards from the phone's lock screen
- Automatic updates when points change
- Push notifications for rewards and promotions
- Barcode/QR code scanning at point of sale

## Apple Wallet Integration

### Prerequisites

1. Apple Developer Account ($99/year)
2. Pass Type ID certificate from Apple Developer Portal
3. Private key for signing passes
4. WWDR (Apple Worldwide Developer Relations) certificate

### Implementation Steps

#### 1. Set Up Pass Type ID

1. Go to [Apple Developer Portal](https://developer.apple.com/)
2. Navigate to Certificates, Identifiers & Profiles
3. Create a new Pass Type ID (e.g., `pass.com.yourcompany.loyalty`)
4. Generate a certificate for the Pass Type ID
5. Download and install the certificate

#### 2. Create Pass Package

Apple Wallet passes are `.pkpass` files containing:
- `pass.json` - Pass data and styling
- Images (icon, logo, strip)
- Signature files

Example `pass.json`:
```json
{
  "formatVersion": 1,
  "passTypeIdentifier": "pass.com.yourcompany.loyalty",
  "serialNumber": "UNIQUE-CARD-ID",
  "teamIdentifier": "YOUR-TEAM-ID",
  "organizationName": "Your Coffee Shop",
  "description": "Coffee Loyalty Card",
  "backgroundColor": "rgb(209, 140, 69)",
  "foregroundColor": "rgb(255, 255, 255)",
  "labelColor": "rgb(255, 255, 255)",
  "logoText": "Coffee Loyalty",
  "barcodes": [
    {
      "message": "CARD-ID-HERE",
      "format": "PKBarcodeFormatQR",
      "messageEncoding": "iso-8859-1"
    }
  ],
  "storeCard": {
    "primaryFields": [
      {
        "key": "points",
        "label": "Points",
        "value": 150
      }
    ],
    "secondaryFields": [
      {
        "key": "coffees",
        "label": "Coffees",
        "value": 15
      }
    ],
    "backFields": [
      {
        "key": "email",
        "label": "Email",
        "value": "customer@example.com"
      }
    ]
  }
}
```

#### 3. Add Required Images

- `icon.png` (29x29, 58x58, 87x87)
- `logo.png` (160x50, 320x100, 480x150)
- `strip.png` (375x123, 750x246, 1125x369) - optional

#### 4. Sign and Package

Use the `passkit` npm package or similar:

```bash
npm install passkit-generator
```

Example code:
```typescript
import { PKPass } from 'passkit-generator';

async function createAppleWalletPass(cardData: any) {
  const pass = await PKPass.from({
    model: './models/loyaltyCard.pass',
    certificates: {
      wwdr: process.env.APPLE_WWDR_CERT,
      signerCert: process.env.APPLE_SIGNER_CERT,
      signerKey: process.env.APPLE_SIGNER_KEY,
      signerKeyPassphrase: process.env.APPLE_KEY_PASSPHRASE,
    },
  });

  pass.serialNumber = cardData.id;
  pass.barcodes = [{
    format: 'PKBarcodeFormatQR',
    message: cardData.qrCode,
    messageEncoding: 'iso-8859-1',
  }];

  pass.primaryFields.push({
    key: 'points',
    label: 'Points',
    value: cardData.points,
  });

  pass.secondaryFields.push({
    key: 'coffees',
    label: 'Coffees',
    value: cardData.coffeeCount,
  });

  return pass.getAsBuffer();
}
```

#### 5. Create API Endpoint

Add to `app/api/wallet/apple/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get('email');
  
  // Fetch card data
  // Generate pass
  // Return .pkpass file
  
  return new NextResponse(passBuffer, {
    headers: {
      'Content-Type': 'application/vnd.apple.pkpass',
      'Content-Disposition': 'attachment; filename="loyalty-card.pkpass"',
    },
  });
}
```

#### 6. Update Pass Data

To push updates to users' passes:

1. Implement web service endpoints per Apple's spec
2. Register device tokens
3. Send push notifications when data changes

Required endpoints:
- `POST /v1/devices/{deviceID}/registrations/{passTypeID}/{serialNumber}`
- `GET /v1/devices/{deviceID}/registrations/{passTypeID}`
- `DELETE /v1/devices/{deviceID}/registrations/{passTypeID}/{serialNumber}`
- `GET /v1/passes/{passTypeID}/{serialNumber}`
- `POST /v1/log`

### Testing

1. Use iPhone Simulator or physical device
2. Email .pkpass file or provide download link
3. Tap to add to Apple Wallet
4. Test QR code scanning

## Google Wallet Integration

### Prerequisites

1. Google Cloud Project
2. Google Wallet API enabled
3. Service Account with Google Wallet API permissions
4. Google Pay API for Passes Issuer ID

### Implementation Steps

#### 1. Set Up Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google Wallet API
4. Create Service Account
5. Download service account JSON key

#### 2. Register as Issuer

1. Go to [Google Pay & Wallet Console](https://pay.google.com/business/console)
2. Sign up as an issuer
3. Get your Issuer ID (format: `1234567890123456789`)

#### 3. Define Pass Class

```typescript
const loyaltyClass = {
  id: `${ISSUER_ID}.loyalty-card-class`,
  issuerName: 'Your Coffee Shop',
  reviewStatus: 'UNDER_REVIEW',
  programName: 'Coffee Loyalty Program',
  programLogo: {
    sourceUri: {
      uri: 'https://your-domain.com/logo.png'
    }
  },
  hexBackgroundColor: '#d18c45',
  heroImage: {
    sourceUri: {
      uri: 'https://your-domain.com/hero.png'
    }
  }
};
```

#### 4. Create Pass Object

```typescript
const loyaltyObject = {
  id: `${ISSUER_ID}.${cardId}`,
  classId: `${ISSUER_ID}.loyalty-card-class`,
  state: 'ACTIVE',
  barcode: {
    type: 'QR_CODE',
    value: cardData.qrCode,
  },
  accountName: cardData.email,
  accountId: cardData.id,
  loyaltyPoints: {
    label: 'Points',
    balance: {
      int: cardData.points
    }
  },
  secondaryLoyaltyPoints: {
    label: 'Coffees',
    balance: {
      int: cardData.coffeeCount
    }
  }
};
```

#### 5. Generate JWT for Add to Wallet Button

```typescript
import { GoogleAuth } from 'google-auth-library';
import jwt from 'jsonwebtoken';

async function createGoogleWalletJWT(loyaltyObject: any) {
  const credentials = JSON.parse(process.env.GOOGLE_WALLET_CREDENTIALS!);
  
  const claims = {
    iss: credentials.client_email,
    aud: 'google',
    origins: ['https://your-domain.com'],
    typ: 'savetowallet',
    payload: {
      loyaltyObjects: [loyaltyObject]
    }
  };

  const token = jwt.sign(claims, credentials.private_key, {
    algorithm: 'RS256'
  });

  return token;
}
```

#### 6. Add "Add to Google Wallet" Button

In your client component:
```tsx
const googleWalletUrl = `https://pay.google.com/gp/v/save/${jwtToken}`;

<a href={googleWalletUrl}>
  <img 
    src="https://pay.google.com/gp/p/generate_pass_save_badge" 
    alt="Add to Google Wallet"
  />
</a>
```

#### 7. Update Pass Data

Use Google Wallet API to update passes:

```typescript
import { google } from 'googleapis';

async function updateGoogleWalletPass(cardId: string, updates: any) {
  const auth = new google.auth.GoogleAuth({
    credentials: JSON.parse(process.env.GOOGLE_WALLET_CREDENTIALS!),
    scopes: ['https://www.googleapis.com/auth/wallet_object.issuer']
  });

  const client = await auth.getClient();
  const walletobjects = google.walletobjects({
    version: 'v1',
    auth: client
  });

  const objectId = `${ISSUER_ID}.${cardId}`;
  
  await walletobjects.loyaltyobject.patch({
    resourceId: objectId,
    requestBody: updates
  });
}
```

### Testing

1. Use Android device or emulator
2. Click "Add to Google Wallet" button
3. Sign in with Google account
4. Test QR code in Google Wallet app

## Implementation Recommendations

### Phase 1: Basic Implementation
1. Generate static passes on demand
2. Manual refresh required by user

### Phase 2: Push Updates
1. Implement web service endpoints
2. Push updates when points change
3. Send notifications for rewards

### Phase 3: Advanced Features
1. Location-based notifications
2. Expiration dates
3. Special offers and coupons
4. Multiple card designs

## Required NPM Packages

```bash
npm install passkit-generator google-auth-library googleapis jsonwebtoken
```

## Environment Variables

Add to `.env.local`:
```env
# Apple Wallet
APPLE_PASS_TYPE_ID=pass.com.yourcompany.loyalty
APPLE_TEAM_ID=YOUR_TEAM_ID
APPLE_WWDR_CERT=path/to/wwdr.pem
APPLE_SIGNER_CERT=path/to/signerCert.pem
APPLE_SIGNER_KEY=path/to/signerKey.pem
APPLE_KEY_PASSPHRASE=your-passphrase

# Google Wallet
GOOGLE_WALLET_CREDENTIALS={"type":"service_account",...}
GOOGLE_WALLET_ISSUER_ID=1234567890123456789
```

## Resources

### Apple Wallet
- [Apple Wallet Developer Guide](https://developer.apple.com/wallet/)
- [PassKit Programming Guide](https://developer.apple.com/library/archive/documentation/UserExperience/Conceptual/PassKit_PG/)
- [Pass Design Guidelines](https://developer.apple.com/design/human-interface-guidelines/wallet)

### Google Wallet
- [Google Wallet API Documentation](https://developers.google.com/wallet)
- [Loyalty Pass Implementation Guide](https://developers.google.com/wallet/generic/resources/use-cases/loyalty)
- [Google Wallet Console](https://pay.google.com/business/console)

## Cost Considerations

- **Apple Developer Account**: $99/year
- **Google Wallet API**: Free (pay only for Google Cloud usage)
- **Push Notifications**: Minimal cost with Firebase Cloud Messaging

## Security Best Practices

1. Store certificates and keys securely (use environment variables)
2. Never commit credentials to version control
3. Use HTTPS for all pass endpoints
4. Implement rate limiting on pass generation
5. Validate all incoming requests
6. Rotate credentials regularly

## Support

For implementation assistance, refer to:
- Apple Developer Forums
- Google Wallet Developer Support
- Stack Overflow tags: `passkit`, `google-wallet`
