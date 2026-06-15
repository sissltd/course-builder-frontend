# Course Builder Frontend 🚀

A premium, state-of-the-art Next.js web application designed for course creators. This frontend application provides an intuitive and responsive dashboard for building courses, tracking student learning journeys, managing transactions, and analyzing overall creator performance.

## ✨ Features

- 🔐 **Secure & Modern Auth Flow**: Sleek onboarding, registration, and login interfaces.
- 📊 **Creator Analytics & Overview**: Visualized statistics for revenue, active courses, and overall enrollments.
- 📚 **Course Management System**: Interactive list view and status tracking for all published and draft courses.
- 👣 **Student Journey Tracking**: Monitor individual student progress and engagement levels dynamically.
- 💳 **Transaction History**: Seamless and transparent financial tables tracking earnings.

## 🛠️ Technology Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **UI Library**: [React 19](https://react.dev/) & [Radix UI](https://www.radix-ui.com/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **State Management**: [Redux Toolkit (RTK)](https://redux-toolkit.js.org/)
- **Iconography**: [Iconsax React](https://github.com/lusaxweb/iconsax) & [Lucide React](https://lucide.dev/)
- **Form Management**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)
- **Table System**: [Tanstack React Table](https://tanstack.com/table)

## 🚀 Getting Started

### Prerequisites

Ensure you have Node.js (v18.x or later recommended) and npm installed.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/sissltd/course-builder-frontend.git
   cd course-builder-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📁 Project Structure

```text
src/
├── app/          # Next.js App Router (Layouts, Pages, Routes)
├── components/   # Shared UI components (shadcn/radix primitives)
├── lib/          # External library configurations
├── modules/      # Feature-specific modules (auth, dashboard, etc.)
├── redux/        # Redux store, slices, and hooks
└── utils/        # Helper functions, cookies, and network utilities
```

## 📜 Development Conventions

- **Iconsax Standard**: Always add the `variant` and `color` props (e.g. `<Home2 variant="Linear" color="#202020" size={24} />`).
- **Responsive Layouts**: Design mobile-first using Tailwind grid and flex systems.
