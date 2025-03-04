# Web3 Project

A modern Solana blockchain application built with Next.js, TypeScript, and Tailwind CSS.

## Overview

This project is a Web3 application that integrates with the Solana blockchain, allowing users to:

- Connect their Solana wallets
- View their SOL balance
- Add SOL to their wallet
- View recent transactions
- Authenticate using their wallet
- Stake PNG tokens

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI components
- **Blockchain**: Solana Web3.js, Wallet Adapter
- **Authentication**: Wallet-based authentication
- **Development**: ESLint, Prettier, TypeScript

## Getting Started

### Prerequisites

- Node.js (latest LTS version)
- Bun package manager

### Installation

```bash
# Install dependencies
bun install

# Start the development server
bun run dev
```

The application will be available at http://localhost:1444

## Features

- **Wallet Integration**: Seamless connection with popular Solana wallets
- **Balance Display**: Real-time SOL balance information
- **Transaction History**: View recent blockchain transactions
- **Token Staking**: Stake PNG tokens with customizable lock periods
- **Modern UI**: Beautiful interface with aurora background effects

## Project Structure

- `/app`: Next.js application routes and layouts
- `/components`: Reusable React components
- `/hooks`: Custom React hooks
- `/providers`: Context providers for the application
- `/utils`: Utility functions
- `/types`: TypeScript type definitions
