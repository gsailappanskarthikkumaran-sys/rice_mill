<<<<<<< HEAD
# Multi-Tenant & Multi-Branch Rice Mill Management System

A production-level SaaS ERP application built with the MERN stack, designed for rice mill businesses to manage paddy procurement, production (milling), stock isolation, and sales tracking across multiple branches and tenants.

## 🚀 Features
- **Multi-Tenancy**: Isolated database records per company using `tenantId`.
- **Multi-Branch**: Separate stock and transaction tracking for each branch under a tenant.
- **RBAC**: Role-based access (SuperAdmin, TenantAdmin, BranchManager, Staff, Accountant).
- **Core Modules**: Paddy Purchase, Production (Conversion), Stock Management, Sales, and Analytics.
- **Advanced Dashboard**: Visual insights using Chart.js.

## 🛠 Tech Stack
- **Backend**: Node.js, Express, MongoDB (Mongoose)
- **Frontend**: React (Vite), Tailwind CSS, Chart.js, Lucide-React
- **Auth**: JWT, BcryptJS

## 📦 Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB Atlas or Local Instance

### Backend Setup
1. `cd backend`
2. `npm install`
3. Create `.env` (use `.env.example` as reference)
4. `npm run dev`

### Frontend Setup
1. `cd frontend`
2. `npm install`
3. `npm run dev`

## 🏗 Architecture Explanation (Interview Level)
This project follows a **Shared Database, Shared Schema** multi-tenant architecture. 
- **Isolation**: Every document includes a `tenantId`. The `auth` middleware automatically injects this ID into the request object from the JWT, ensuring users only see their own company's data.
- **Scalability**: Controllers are designed with aggregation pipelines to handle complex reporting across branches without performance bottlenecks.
- **Stock Integrity**: Production and Sales modules use atomic Mongoose operations (`findOneAndUpdate` with `$inc`) to ensure stock levels are always accurate even with concurrent requests.

## 📄 Database Collections
- `Tenants`: Company profiles.
- `Users`: Auth and RBAC.
- `Branches`: Physical locations.
- `Stocks`: Real-time inventory (branch-wise).
- `Production`: Conversion records (Paddy -> Rice).
- `Sales`: Invoices and revenue tracking.
=======
# rice_mill
>>>>>>> ed239dbb326c9172614464f28ef7bed5fce4ce07
