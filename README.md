# Secure Ballot - Nigeria's Digital Voting Platform

<div align="center">
  <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/a2ab155c-d9f2-4496-8348-6166795a6b83-ufZ6Y3SuWgCxad1rVS0orIIbndoZBK.webp" alt="Secure Ballot Logo" width="120" height="120">
  
  <h3>Nigeria's Most Secure and Transparent Voting Platform</h3>
  <p>Empowering democracy through secure, transparent, and accessible digital voting for the 2027 Nigerian General Elections.</p>

  [![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black?style=flat-square&logo=next.js)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.17-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
  [![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)
</div>

## 🌟 Features

### 🗳️ **Comprehensive Voting System**
- **Multi-Election Support**: Presidential, Gubernatorial, House of Representatives, and Senatorial elections
- **Secure Authentication**: NIN/VIN-based login with multi-factor authentication
- **Real-time Results**: Live election monitoring and result visualization
- **Vote Verification**: Tamper-proof vote receipts and verification system

### 🌍 **Accessibility & Internationalization**
- **Multi-language Support**: English, Hausa, Yoruba, Igbo, and Nigerian Pidgin
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Dark/Light Theme**: User preference-based theme switching
- **Accessibility**: WCAG compliant with proper ARIA labels

### 🔒 **Enterprise-Grade Security**
- **End-to-End Encryption**: AES-256 encryption for all sensitive data
- **Route Protection**: Middleware-based authentication and authorization
- **Secure Storage**: Cookie-based session management with security flags
- **Audit Trails**: Comprehensive logging and monitoring

### 📊 **Advanced Analytics**
- **Real-time Dashboards**: Live election statistics and monitoring
- **Interactive Charts**: Pie charts, bar charts, and trend analysis
- **Electoral Maps**: Geographic visualization of election results
- **Regional Analytics**: Geopolitical zone and state-level breakdowns

### 👨‍💼 **Administrative Controls**
- **Admin Dashboard**: Comprehensive election management interface
- **User Management**: Voter registration and profile management
- **System Monitoring**: Real-time system health and security alerts
- **Result Management**: Election result compilation and publication

## 🏗️ Technology Stack

### **Frontend Framework**
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe JavaScript development
- **React 19** - Latest React features and optimizations

### **Styling & UI**
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Framer Motion** - Animation and gesture library
- **Lucide React** - Beautiful icon library

### **State Management & Data**
- **Zustand** - Lightweight state management
- **Axios** - HTTP client for API communication
- **React Hook Form** - Performant form handling
- **Zod** - TypeScript-first schema validation

### **Development Tools**
- **ESLint** - Code linting and formatting
- **PostCSS** - CSS processing and optimization
- **Autoprefixer** - CSS vendor prefixing

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── admin/             # Admin dashboard and management
│   │   ├── dashboard/     # Admin overview and controls
│   │   ├── login/         # Admin authentication
│   │   ├── profile/       # Admin profile management
│   │   └── settings/      # System configuration
│   ├── dashboard/         # User dashboard
│   │   ├── profile/       # User profile management
│   │   └── settings/      # User preferences
│   ├── vote/              # Voting interface
│   ├── results/           # Election results display
│   ├── election-dashboard/ # Real-time election monitoring
│   ├── live-stats/        # Live statistics page
│   ├── login/             # User authentication
│   ├── about/             # About page
│   ├── contact/           # Contact information
│   ├── faq/               # Frequently asked questions
│   ├── privacy/           # Privacy policy
│   ├── terms/             # Terms of service
│   └── security/          # Security information
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components (Radix-based)
│   ├── admin/            # Admin-specific components
│   ├── providers/        # Context providers
│   └── [feature-components] # Feature-specific components
├── hooks/                # Custom React hooks (35+ hooks)
│   ├── useAuth.ts        # Authentication logic
│   ├── useElectionData.ts # Election data management
│   ├── useVote.ts        # Voting functionality
│   ├── useResults.ts     # Results fetching
│   └── [utility-hooks]   # Various utility hooks
├── lib/                  # Utilities and configurations
│   ├── i18n/            # Internationalization
│   │   ├── LanguageContext.tsx
│   │   └── translations/ # Language files
│   └── utils/           # Utility functions
├── services/             # API integration
│   └── api.ts           # Centralized API client
├── store/                # Zustand state management
│   └── useStore.ts      # Global state stores
└── styles/               # Global styles
    └── globals.css      # Global CSS styles
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.0 or later
- **npm** or **pnpm** package manager
- **Git** for version control

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Onyex101/secure_ballot_frontend.git
   cd secure_ballot_frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env.local
   ```
   
   Configure your environment variables:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   NODE_ENV=development
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
# Build the application
npm run build

# Start production server
npm run start
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API endpoint | `http://localhost:5000/api/v1` |
| `NEXT_PUBLIC_APP_URL` | Frontend application URL | `http://localhost:3000` |
| `NODE_ENV` | Environment mode | `development` |

### Internationalization

The application supports 5 languages:
- **English** (en) - Default
- **Hausa** (ha)
- **Yoruba** (yo)
- **Igbo** (ig)
- **Nigerian Pidgin** (pcm)

Language files are located in `src/lib/i18n/translations/`

## 🎯 Usage

### For Voters

1. **Registration/Login**
   - Enter your NIN (National Identification Number)
   - Provide your VIN (Voter Identification Number)
   - Complete multi-factor authentication

2. **Voting Process**
   - Select election type (Presidential, Gubernatorial, etc.)
   - Review candidates and their manifestos
   - Cast your vote securely
   - Receive vote confirmation receipt

3. **Result Monitoring**
   - View real-time election results
   - Track voting statistics
   - Access detailed analytics

### For Administrators

1. **Admin Access**
   - Login with admin credentials
   - Access comprehensive dashboard

2. **Election Management**
   - Monitor voting progress
   - Manage candidates and elections
   - View system analytics
   - Handle security alerts

## 🔒 Security Features

- **Multi-Factor Authentication**: NIN/VIN + OTP verification
- **End-to-End Encryption**: All sensitive data encrypted
- **Route Protection**: Middleware-based access control
- **Session Management**: Secure cookie-based sessions
- **Audit Logging**: Comprehensive activity tracking
- **CSRF Protection**: Cross-site request forgery prevention

## 📊 API Integration

The frontend integrates with a RESTful backend API:

### Authentication Endpoints
- `POST /auth/login` - User authentication
- `POST /auth/register` - User registration
- `POST /auth/verify-mfa` - Multi-factor authentication

### Election Endpoints
- `GET /elections` - Fetch elections
- `GET /elections/:id` - Get election details
- `POST /elections/:id/vote` - Cast vote

### Results Endpoints
- `GET /results/live/:id` - Live results
- `GET /results/statistics/:id` - Election statistics

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run integration tests
npm run test:integration

# Run end-to-end tests
npm run test:e2e

# Generate coverage report
npm run test:coverage
```

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository** to Vercel
2. **Configure environment variables** in Vercel dashboard
3. **Deploy** automatically on push to main branch

### Docker

```bash
# Build Docker image
docker build -t secure-ballot-frontend .

# Run container
docker run -p 3000:3000 secure-ballot-frontend
```

### Manual Deployment

```bash
# Build for production
npm run build

# Export static files (if needed)
npm run export

# Deploy build folder to your hosting provider
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Workflow

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Code Standards

- Follow TypeScript best practices
- Use ESLint and Prettier for code formatting
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Documentation
- [API Documentation](docs/api.md)
- [Component Library](docs/components.md)
- [Deployment Guide](docs/deployment.md)

### Community
- [GitHub Issues](https://github.com/your-username/secure-ballot-frontend/issues)
- [Discussions](https://github.com/your-username/secure-ballot-frontend/discussions)
- [Discord Community](https://discord.gg/secure-ballot)

### Contact
- **Email**: support@secureballot.ng
- **Website**: [https://secureballot.ng](https://secureballot.ng)
- **Twitter**: [@SecureBallotNG](https://twitter.com/SecureBallotNG)

## 🙏 Acknowledgments

- **INEC** - Independent National Electoral Commission of Nigeria
- **Open Source Community** - For the amazing tools and libraries
- **Contributors** - Everyone who has contributed to this project
- **Beta Testers** - For their valuable feedback and testing

## 📈 Roadmap

### Version 2.0 (Q2 2024)
- [ ] Blockchain integration for vote immutability
- [ ] Advanced biometric authentication
- [ ] Mobile application (React Native)
- [ ] Offline voting capability

### Version 2.1 (Q3 2024)
- [ ] AI-powered fraud detection
- [ ] Enhanced accessibility features
- [ ] Real-time notifications
- [ ] Advanced analytics dashboard

### Version 3.0 (Q4 2024)
- [ ] Multi-country support
- [ ] Advanced reporting tools
- [ ] Integration with national databases
- [ ] Enhanced security protocols

---

<div align="center">
  <p><strong>Secure Ballot</strong> - Empowering Democracy Through Technology</p>
  <p>Made with ❤️ for Nigeria's Democratic Future</p>
</div> 