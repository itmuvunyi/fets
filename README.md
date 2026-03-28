# Food Expire Tracker System (FETS)

A professional web application designed to help users track food expiration dates, receive automated email notifications, and reduce food waste through efficient inventory management.

**Tech Stack:** Next.js (T3 Stack), Prisma ORM, Supabase (Postgres), Tailwind CSS, Nodemailer

## Folder Structure

Below is an overview of the key directories in the project:

- **`prisma/`**: Contains the Prisma schema (`schema.prisma`) which defines the database models and migrations for the application's data layer.
- **`public/`**: Stores static assets such as images, icons, and fonts that are served directly by the web server.
- **`src/app/`**: The core of the Next.js App Router. It contains all the pages, layouts, API routes, and Server Actions that handle the routing and server-side logic.
- **`src/components/`**: Reusable React components used throughout the application. It includes a `ui/` folder for base UI elements (like buttons and inputs) and feature-specific folders (like `food/` or `auth/`).
- **`src/hooks/`**: Custom React hooks that encapsulate reusable client-side logic and state management.
- **`src/lib/`**: Shared utility functions, configuration files, and third-party library initializations (e.g., Prisma client setup).
- **`src/server/`**: Backend-specific logic, including database access layer and tRPC router definitions for type-safe API communication.
- **`src/styles/`**: Global CSS styles and Tailwind configuration used for consistent styling across the application.
- **`src/trpc/`**: Configuration and boilerplate for tRPC, enabling end-to-end type safety between the frontend and backend.


---

## Setup Instructions

Follow these exact steps to set up and run the project on your local machine:

### 1. Prerequisites
Ensure you have the following installed on your system:
* **Node.js** (Version 18.0.0 or higher)
* **npm** (comes with Node.js)
* A **Supabase** account/project for the database and authentication.
* A **Gmail** account (for testing email notifications).

### 2. Clone the Repository
Open your terminal and run:
```bash
git clone https://github.com/your-username/fets.git
cd fets
```

### 3. Install Dependencies
Install all required packages:
```bash
npm install
```

### 4. Configure Environment Variables
Create a file named `.env` in the root of the project and copy the following template:

```env
# --- Database Connections (from Supabase Project Settings > Database) ---
DATABASE_URL="postgresql://postgres.[PROJ_ID]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[PROJ_ID]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"

# --- Supabase API Keys (from Supabase Project Settings > API) ---
NEXT_PUBLIC_SUPABASE_URL="https://[PROJ_ID].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your_anon_public_key"
SUPABASE_SERVICE_ROLE_KEY="your_service_role_secret_key"

# --- Email Settings (Nodemailer with Gmail) ---
SMTP_USER="your_email@gmail.com"
SMTP_PASS="your_gmail_app_password"

# --- App URL ---
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```
> **Note:** For `SMTP_PASS`, you must generate an **App Password** from your Google Account settings (Security > 2-Step Verification > App passwords).

### 5. Initialize the Database
Sync the Prisma schema with your Supabase database and generate the client:
```bash
# Push the schema to your database
npx prisma db push

# Generate the Prisma Client
npx prisma generate
```

### 6. Run the Application
Start the development server:
```bash
npm run dev
```

### 7. View the Project
Open your browser and navigate to:
[http://localhost:3000](http://localhost:3000)

---

## Live Application

The production version is available at: [https://fets-sigma.vercel.app/](https://fets-sigma.vercel.app/)

---

## Important Notes

* **Database Errors**: If you encounter connection issues, ensure your IP address is allowed in the Supabase Network Restrictions.
* **Barcode Scanner**: To use the barcode scanning feature, the application must be served over HTTPS (or localhost) and camera permissions must be granted.
* **Notifications**: Notifications are automatically checked when you visit the dashboard or notifications page.
