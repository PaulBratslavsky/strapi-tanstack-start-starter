# Strapi TanStack Start Starter

A full-stack starter project combining [Strapi](https://strapi.io/) headless CMS with [TanStack Start](https://tanstack.com/start) for building modern web applications.

## 🚀 Project Structure

```
tan-start/
├── client/          # TanStack Start frontend application
├── server/          # Strapi CMS backend
├── seed-data.tar.gz # Sample data for seeding
└── package.json     # Root package with setup scripts
```

## 📋 Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [Yarn](https://yarnpkg.com/) package manager

## 🛠️ Quick Start

### 1. Setup Project

Install dependencies and configure environment files for both client and server:

```bash
yarn setup
```

This command will:
- Install root dependencies
- Install client dependencies
- Install server dependencies
- Copy `.env.example` to `.env` files where they exist

### 2. Seed Database (Optional)

Populate the Strapi database with sample data:

```bash
yarn seed
```

### 3. Start Development

Run both client and server in development mode:

```bash
yarn dev
```

This will start:
- **Strapi server** at http://localhost:1337
- **TanStack Start client** at http://localhost:3000

The client will automatically wait for the server to be ready before starting.

## 📝 Available Scripts

### Root Level Commands

- `yarn setup` - Complete project setup (dependencies + env files)
- `yarn dev` - Start both client and server in development mode
- `yarn seed` - Import sample data into Strapi
- `yarn export` - Export current Strapi data
- `yarn client` - Run client development server only
- `yarn server` - Run server development server only

### Individual Setup Commands

- `yarn setup:client` - Setup client only
- `yarn setup:server` - Setup server only

## 🏗️ Tech Stack

### Frontend (Client)
- **TanStack Start** - Full-stack React framework
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server

### Backend (Server)
- **Strapi** - Headless CMS
- **Node.js** - Runtime environment
- **SQLite** - Default database (configurable)

## 🔧 Development Workflow

1. **First time setup**: Run `yarn setup` to install everything
2. **Add sample data**: Run `yarn seed` to populate with demo content
3. **Start development**: Run `yarn dev` to work on both frontend and backend
4. **Access admin panel**: Visit http://localhost:1337/admin to manage content
5. **View frontend**: Visit http://localhost:3000 to see your application

## 📊 Environment Configuration

The setup script automatically copies `.env.example` files to `.env` where they exist. Check the server directory for Strapi configuration options.

## 🔄 Data Management

- **Export data**: `yarn export` creates a backup of your current data
- **Import data**: `yarn seed` imports the included sample data
- Data is stored in `seed-data.tar.gz` in the root directory

## 🚦 Getting Started Tips

1. After running `yarn setup`, check that both client and server directories have their dependencies installed
2. The development server automatically handles the startup sequence (server first, then client)
3. Make sure port 1337 (Strapi) and 3000 (client) are available
4. Visit the Strapi admin panel first to create your admin user

## 📚 Documentation

- [Strapi Documentation](https://docs.strapi.io/)
- [TanStack Start Documentation](https://tanstack.com/start/latest)

## 🆘 Troubleshooting

- If setup fails, ensure you have Node.js v18+ and Yarn installed
- If ports are in use, check for other running applications
- If database issues occur, try deleting the server's SQLite file and re-seeding
# strapi-tanstack-start-starter
