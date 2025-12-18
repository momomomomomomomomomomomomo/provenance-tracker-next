# Provenance Tracker

A full-stack supply chain provenance tracking system built with **Next.js 16 (TypeScript)** frontend and **.NET backend**, enabling transparent product lifecycle tracking from manufacturing to end consumer.

## 🎯 Project Overview

Provenance Tracker provides a comprehensive platform for tracking product history through the supply chain. The system supports multiple user roles (Admin, Participant) and enables product provenance verification via unique product IDs and QR codes.

## 🏗️ Architecture

### Frontend (This Repository)
- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Authentication**: NextAuth.js (Credentials + OAuth: Google, GitHub)
- **UI Components**: Shadcn-inspired primitives, Radix UI, Tailwind CSS v4
- **Animations**: Motion/React (Framer Motion)
- **QR Code**: qrcode.react (generation), html5-qrcode (scanning)
- **Notifications**: Sonner

### Backend (Collaboration with .NET Developer)
- **Framework**: .NET (ASP.NET Core Web API)
- **Deployment**: Azure App Services
- **Default URL**: `https://app-mu4hacfqsezwm.azurewebsites.net`
- **Authentication**: JWT-based token authentication
- **Role Management**: Admin and Participant roles with approval workflow

### Integration Points

The frontend communicates with the .NET backend through RESTful APIs:

```typescript
// Backend URL Configuration (lib/config.ts)
BACKEND_URL = process.env.NEXT_PUBLIC_DOTNET_API_URL || "https://app-mu4hacfqsezwm.azurewebsites.net"
```

**Key API Endpoints:**
- Authentication: `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/external-login`
- Transactions: `GET /api/transaction/{productId}`, `POST /api/participant`, `GET /api/participant`
- Admin Operations: `GET /api/admin/pending-users`, `POST /api/admin/confirm-user/{email}`, `GET /api/admin/pending-transactions`, `POST /api/admin/confirm-transaction/{id}`, `POST /api/admin/cancel-transaction/{id}`
- User Management: `POST /api/user/participant-approve`

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn/pnpm
- Access to the .NET backend API (or run it locally)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd provenancetracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   # Backend API URL
   NEXT_PUBLIC_DOTNET_API_URL=http://localhost:5199
   # or for production: https://app-mu4hacfqsezwm.azurewebsites.net
   
   # Frontend URL
   NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000
   
   # NextAuth Configuration
   NEXTAUTH_SECRET=your-secret-key-here
   NEXTAUTH_URL=http://localhost:3000
   
   # OAuth Providers (Optional)
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   GITHUB_CLIENT_ID=your-github-client-id
   GITHUB_CLIENT_SECRET=your-github-client-secret
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open the application**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Create production build
- `npm run start` - Run production build
- `npm run lint` - Run ESLint

## 👥 User Roles & Flows

### 1. Public User (Anonymous)

**Purpose**: Track product provenance without authentication

**User Flow:**
```
Landing Page (/) 
  └─> Enter Product ID or Scan QR Code
      └─> View Product History Timeline
          ├─> See all confirmed transactions
          ├─> View participant details
          └─> Generate QR Code for sharing
```

**Key Features:**
- Search products by unique Product ID
- QR code scanning via camera
- View complete provenance chain as visual timeline
- No authentication required

---

### 2. Participant (Registered User)

**Purpose**: Create and manage supply chain transactions

**Registration & Onboarding Flow:**
```
/login 
  └─> Sign Up (Credentials or OAuth)
      └─> Account Created (Status: Pending)
          └─> Wait for Admin Approval
              └─> Status Changed to "Approved"
                  └─> Access Granted to Participant Features
```

**Transaction Creation Flow:**
```
/create-transaction
  ├─> First Transaction (New Product)
  │     ├─> Toggle "First Transaction" switch
  │     ├─> Fill transaction details (description, location, etc.)
  │     ├─> System auto-generates Product ID
  │     └─> Submit → Status: Pending Admin Confirmation
  │
  └─> Subsequent Transaction (Existing Product)
        ├─> Enter existing Product ID
        ├─> Fill transaction details
        └─> Submit → Status: Pending Admin Confirmation
```

**Monitoring Flow:**
```
/transactions
  └─> View Personal Transaction History
      ├─> Filter by Status (Pending/Confirmed/Cancelled)
      ├─> View Transaction Details
      └─> Track Approval Status
```

**Participant Journey:**
1. **Sign Up**: Register via email/password or OAuth (Google/GitHub)
2. **Await Approval**: Admin reviews and approves account
3. **Create First Transaction**: 
   - Navigate to `/create-transaction`
   - Enable "First Transaction" switch
   - Fill form with product details
   - System generates unique Product ID
4. **Add Subsequent Transactions**: 
   - Reference existing Product ID
   - Add new transaction details
5. **Monitor Status**: View all transactions in `/transactions` page
6. **Share Product**: Generate QR codes for approved products

---

### 3. Admin

**Purpose**: Manage user approvals and validate transactions

**Admin Dashboard Flow:**
```
/admin
  ├─> Pending Users Tab
  │     ├─> View all pending user registrations
  │     ├─> Review user details
  │     └─> Confirm User → Grants Participant access
  │
  └─> Pending Transactions Tab
        ├─> View all pending transactions
        ├─> Review transaction details
        └─> Actions:
              ├─> Confirm Transaction → Makes visible to public
              └─> Cancel Transaction → Rejects transaction
```

**Admin Workflow:**
1. **Login**: Use admin credentials at `/login`
2. **Access Dashboard**: Navigate to `/admin`
3. **User Management**:
   - Switch to "Pending Users" tab
   - Review user registration requests
   - Approve legitimate users (grants Participant role)
4. **Transaction Validation**:
   - Switch to "Pending Transactions" tab
   - Verify transaction authenticity
   - Confirm valid transactions (makes them public)
   - Cancel fraudulent/invalid transactions
5. **Quality Control**: Ensure data integrity across the supply chain

---

## 📊 Data Flow Diagram

```
┌──────────────┐
│ Public User  │
└──────┬───────┘
       │ Search Product ID
       ▼
┌─────────────────────────────────────────────────┐
│          Landing Page (/)                       │
│  ┌─────────────────────────────────────┐       │
│  │  Provenance Carousel (Search)       │       │
│  │  → Fetch: GET /api/transaction/{id} │       │
│  └─────────────────────────────────────┘       │
│  ┌─────────────────────────────────────┐       │
│  │  Change Log Product (Timeline)      │       │
│  │  → Display confirmed transactions   │       │
│  └─────────────────────────────────────┘       │
└─────────────────────────────────────────────────┘
       │
       │ Frontend (Next.js)
       │ ↕
       │ RESTful API
       │ ↕
┌──────▼────────────────────────────────┐
│     .NET Backend API                  │
│  ┌──────────────────────────────┐    │
│  │  Transaction Service         │    │
│  │  Authentication Service      │    │
│  │  User Management Service     │    │
│  └──────────────────────────────┘    │
└───────────────┬───────────────────────┘
                │
                ▼
        ┌──────────────┐
        │   Database   │
        │  (SQL/NoSQL) │
        └──────────────┘

┌──────────────┐         ┌──────────────┐
│ Participant  │         │    Admin     │
└──────┬───────┘         └──────┬───────┘
       │                         │
       │ Create Transaction      │ Approve Users/Transactions
       ▼                         ▼
   /create-transaction        /admin
       │                         │
       │ POST /api/participant   │ POST /api/admin/confirm-*
       │                         │
       └─────────────────────────┘
                  │
                  ▼
          .NET Backend API
```

## 🗂️ Project Structure

```
provenancetracker/
├── app/                          # Next.js App Router pages
│   ├── page.tsx                  # Landing/search page (public)
│   ├── login/                    # Authentication pages
│   ├── admin/                    # Admin dashboard
│   ├── transactions/             # Participant transaction history
│   ├── create-transaction/       # Transaction creation form
│   └── api/auth/[...nextauth]/   # NextAuth configuration
├── components/                   # React components
│   ├── login-form.tsx            # Auth forms
│   ├── provenance-carousel.tsx   # Product search widget
│   ├── ChangeLogProduct.tsx      # Timeline display
│   ├── QRCodeGenerator.tsx       # QR code generation
│   ├── participant/              # Participant-specific components
│   ├── admmin/                   # Admin components
│   └── ui/                       # Reusable UI primitives
├── lib/                          # Utilities
│   ├── config.ts                 # API configuration
│   └── utils.ts                  # Helper functions
├── docs/                         # Documentation
├── .env.local                    # Environment configuration
└── package.json                  # Dependencies
```

## 🔐 Authentication Flow

### 1. Credential-Based Login
```
User enters email/password
  └─> Frontend: POST to backend /api/auth/register (if new user)
      └─> Frontend: signIn("credentials") via NextAuth
          └─> Backend: POST /api/auth/login
              └─> Returns: { id, username, email, roles[], token, isApproved }
                  └─> NextAuth JWT callback stores user data
                      └─> Session callback exposes user to frontend
```

### 2. OAuth Login (Google/GitHub)
```
User clicks "Sign in with Google"
  └─> NextAuth handles OAuth flow
      └─> Backend: POST /api/auth/external-login
          └─> Creates/retrieves user account
              └─> Returns: { id, username, email, roles[], token, isApproved }
                  └─> Stored in JWT and session
```

### 3. Session Management
```typescript
// Access session in components
const { data: session } = useSession();
session.user.roles // ["Admin"] or ["Participant"]
session.user.backendToken // JWT for backend API calls
session.user.isApproved // Approval status
```

## 🎨 UI/UX Features

- **Dark/Light Mode**: Theme toggle via next-themes
- **Responsive Design**: Mobile-first Tailwind CSS
- **Animations**: Smooth transitions with Framer Motion
- **QR Code Support**:
  - Generation: Download QR codes for products
  - Scanning: Camera-based QR scanning for quick lookup
- **Toast Notifications**: Real-time feedback via Sonner
- **Loading States**: Skeleton loaders and suspense boundaries

## 🔧 Backend Collaboration Notes

### For .NET Developer

**Expected API Contract:**

1. **Authentication Endpoints**
   - `POST /api/auth/register` - User registration
   - `POST /api/auth/login` - Credential login
   - `POST /api/auth/external-login` - OAuth login

2. **Transaction Endpoints**
   - `GET /api/transaction/{productId}` - Fetch product history
   - `POST /api/participant` - Create transaction
   - `GET /api/participant` - List user's transactions

3. **Admin Endpoints**
   - `GET /api/admin/pending-users` - List pending users
   - `POST /api/admin/confirm-user/{email}` - Approve user
   - `GET /api/admin/pending-transactions` - List pending transactions
   - `POST /api/admin/confirm-transaction/{id}` - Approve transaction
   - `POST /api/admin/cancel-transaction/{id}` - Reject transaction

**Response Format:**
```typescript
interface DotNetUser {
  id: string;
  username: string;
  email: string;
  roles: string[]; // ["Admin", "Participant", "User"]
  token: string; // JWT token
  isApproved: boolean;
}
```

**CORS Configuration Required:**
- Allow origin: Frontend URL (localhost:3000 or production domain)
- Allow methods: GET, POST, PUT, DELETE
- Allow headers: Content-Type, Authorization

## 📚 Additional Documentation

For detailed technical documentation, see:
- [docs/project-overview.md](docs/project-overview.md) - Comprehensive technical overview
- [docs/login-form.md](docs/login-form.md) - Authentication implementation details

## 🚢 Deployment

### Frontend (Next.js)
Deploy to Vercel, Netlify, or any Node.js hosting:
```bash
npm run build
npm run start
```

### Environment Variables for Production
```env
NEXT_PUBLIC_DOTNET_API_URL=https://your-backend-url.azurewebsites.net
NEXTAUTH_URL=https://your-frontend-domain.com
NEXTAUTH_SECRET=<generate-strong-secret>
```

### Backend (.NET)
Collaborate with backend developer to ensure:
- Azure App Service deployment
- Environment-specific configuration
- Database migrations
- CORS policies

## 🤝 Contributing

This is a collaborative project between frontend (Next.js) and backend (.NET) teams. Please coordinate API changes and maintain backward compatibility.

## 📄 License

[Your License Here]

## 🐛 Troubleshooting

**Backend Connection Issues:**
- Verify `NEXT_PUBLIC_DOTNET_API_URL` in `.env.local`
- Check backend is running and accessible
- Verify CORS configuration on backend

**Authentication Issues:**
- Ensure `NEXTAUTH_SECRET` is set
- Verify OAuth credentials (Google/GitHub)
- Check backend authentication endpoints

**Build Errors:**
- Clear `.next` folder: `rm -rf .next`
- Clear node_modules: `rm -rf node_modules && npm install`
- Verify Node.js version (18+)
