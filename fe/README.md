# Hisaab Kitaab

A comprehensive financial and inventory management application built with Next.js, designed to help businesses track inventory, manage orders, handle transactions, and interact with an AI-powered chatbot for assistance.

## Features

### 🏪 Inventory Management

- Add multiple products with details (name, price, quantity, unit, seller info)
- Support for file attachments and image previews
- Bulk product addition with shared seller details option
- Real-time inventory tracking

### 📦 Order Management

- Create and manage orders
- Order templates and tracking
- Integration with inventory for stock updates

### 💰 Financial Tracking

- Pocket management for different financial categories
- Transaction logging (earnings and spendings)
- Dashboard metrics with visual charts (daily, monthly, quarterly, yearly views)
- Earnings vs spendings analysis with stacked bar charts

### 🤖 AI Chatbot

- Integrated chatbot for user assistance
- Real-time messaging with socket.io
- File upload support in chat
- Markdown rendering and code block support

### 🎨 User Experience

- Dark/Light theme toggle with persistent storage
- Responsive design for mobile and desktop
- Modern UI with Tailwind CSS
- Notification system

### 🔐 Authentication

- User signup/signin
- JWT-based authentication
- Protected routes

## Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS with dark mode support
- **Charts**: Recharts for data visualization
- **Forms**: Formik with Yup validation
- **Real-time**: Socket.io for chatbot
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Date Handling**: Day.js

## Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Athar-Naveed/hisaab-kitaab.git
   cd hisaab-kitaab
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:

   ```env
   # Add your environment variables here
   # Example:
   # NEXT_PUBLIC_API_URL=your_api_url
   # JWT_SECRET=your_jwt_secret
   ```

4. **Run the development server**

   ```bash
   pnpm dev
   ```

5. **Build for production**
   ```bash
   pnpm build
   pnpm start
   ```

## Usage

1. **Sign up/Login** to access the application
2. **Dashboard**: View metrics and charts for inventory, orders, and finances
3. **Inventory**: Add products with details and attachments
4. **Orders**: Create and manage orders
5. **Pockets**: Manage financial pockets and transactions
6. **Chatbot**: Get assistance from the AI chatbot
7. **Theme Toggle**: Switch between light and dark modes

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── globals.css         # Global styles and CSS variables
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Home page
├── components/             # Reusable components
│   ├── auth/               # Authentication components
│   ├── chatbot/            # Chatbot related components
│   ├── common/             # Shared components (buttons, toggles)
│   ├── dashboard/          # Dashboard components
│   ├── inventory/          # Inventory management
│   ├── orders/             # Order management
│   ├── pockets/            # Financial pockets
│   └── ui/                 # UI components
├── context/                # React contexts (Theme, Sidebar)
├── handlers/               # API handlers
├── hooks/                  # Custom hooks
├── layout/                 # Layout components (Header, Sidebar)
├── models/                 # Data models
├── socket/                 # Socket.io client
├── store/                  # Zustand stores
├── types/                  # TypeScript type definitions
└── utils/                  # Utility functions
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

Athar Naveed - [GitHub](https://github.com/Athar-Naveed)

Project Link: [https://github.com/Athar-Naveed/hisaab-kitaab](https://github.com/Athar-Naveed/hisaab-kitaab)
