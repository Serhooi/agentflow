# AgentFlow - AI-Powered Content for Mortgage Agents

AgentFlow is a SaaS platform designed for mortgage agents and brokers in Canada to generate AI-powered content for social media, stories, and video scripts.

## Features

- **AI-Powered Content Generation**: Create engaging social media posts, Instagram story ideas, video scripts, and call-to-action suggestions tailored for the mortgage industry.
- **Role-Based Access**: Different interfaces for agents, brokers, and administrators.
- **Team Management**: Brokers can manage teams of agents and customize branding.
- **Subscription Management**: Flexible pricing plans with Stripe integration.
- **PDF Export**: Export generated content as PDF for easy sharing and reference.

## Tech Stack

- **Frontend**: Next.js, TypeScript, TailwindCSS
- **Backend**: Next.js API Routes
- **Authentication**: Supabase Auth
- **Database**: Supabase PostgreSQL
- **AI Integration**: OpenAI API
- **Payment Processing**: Stripe
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- Supabase account
- OpenAI API key
- Stripe account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/agentflow.git
cd agentflow
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file based on `.env.example`:
```bash
cp .env.example .env.local
```

4. Fill in your environment variables in `.env.local`

5. Start the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
agentflow/
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── api/              # API Routes
│   │   ├── auth/             # Authentication pages
│   │   ├── dashboard/        # Agent dashboard
│   │   ├── broker/           # Broker dashboard
│   │   ├── admin/            # Admin dashboard
│   │   ├── billing/          # Billing pages
│   │   └── page.tsx          # Landing page
│   ├── components/           # React components
│   │   ├── auth/             # Authentication components
│   │   ├── layout/           # Layout components
│   │   └── ui/               # UI components
│   ├── lib/                  # Utility functions and libraries
│   │   ├── auth/             # Authentication utilities
│   │   ├── supabase/         # Supabase client
│   │   ├── stripe/           # Stripe client
│   │   └── openai/           # OpenAI client
│   └── types/                # TypeScript type definitions
├── public/                   # Static assets
├── DEPLOYMENT.md             # Deployment guide
├── TESTING.md                # Testing guide
└── README.md                 # Project documentation
```

## Authentication

AgentFlow uses Supabase Authentication for user management. There are three user roles:

- **Agent**: Individual mortgage agents who generate content
- **Broker**: Managers who oversee teams of agents
- **Admin**: System administrators with full access

## Content Generation

The content generation feature uses OpenAI's API to create:

1. Social media posts
2. Instagram story ideas
3. Video scripts
4. Call-to-action suggestions

Users can customize content by specifying:
- Region
- Target audience
- Content goal
- Tone

## Subscription Plans

AgentFlow offers several subscription plans:

- **Solo Plan**: For individual agents ($39/month)
- **Team 5**: For small brokerages with up to 5 agents ($149/month)
- **Team 15**: For medium brokerages with up to 15 agents ($299/month)
- **Custom**: For large brokerages with custom requirements (Contact sales)

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

## Testing

See [TESTING.md](TESTING.md) for testing procedures and checklists.

## License

This project is proprietary and confidential.

## Support

For support, please contact support@agentflow.com
