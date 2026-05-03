# 🥥 Coconut CRM - B2B Wholesale Management Frontend

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)

> **Live Frontend Deployment:** https://coconut-crm-frontend.vercel.app

> **Associated Backend API:** https://coconut-crm-api.onrender.com

## 📖 Overview (The Data Architect's View)
This is the client-side interface for Coconut CRM, built with Next.js. Rather than focusing solely on static UI/UX design, this frontend is architected to heavily emphasize **secure data flow, state hydration, and robust API integration**. It acts as a strict, role-aware gateway that intelligently consumes and renders data from the Flask/PostgreSQL backend ecosystem.

## ✨ Core Engineering Features
1. **Conditional Role-Based Rendering:** The UI dynamically morphs based on the authenticated user's role (`Admin` vs. `Seller`), ensuring users only access the dashboards and components they are authorized to see.
2. **Secure Token Management:** Implementation of Bearer Token authentication. The client securely stores and attaches JWTs (`jwt_required`) to every outgoing API request header to maintain stateful identity across a stateless backend.
3. **Optimized Data Hydration:** Efficiently fetching, caching, and hydrating complex datasets (like Outstanding Balances and Pivot Reports) from the backend APIs to ensure fast rendering and a seamless user experience.

## 💻 Tech Stack
* **Framework:** Next.js (React)
* **Authentication:** JWT (Client-Side Storage & Header Injection)
* **API Communication:** `fetch` / Axios
* **Styling Strategy:** Native CSS / CSS Modules (Scoped styling)

## 🚀 Local Installation & Setup

To run the frontend client locally and connect it to your backend:

**1. Clone the repository**
```bash
git clone https://github.com/nikhilprasad-data/coconut_crm_frontend.git
cd coconut_crm_frontend
```

**2. Install Node Dependencies**
This project relies on `package.json` for dependency management.
```bash
npm install
```

**3. Environment Configuration**
Create a `.env.local` file in the root directory to point to your backend API:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

**4. Start the Development Server**
Launch the Next.js development environment.
```bash
npm run dev
```
*Navigate to `http://localhost:3000` in your browser.*

---
*Architected for robust data flow and security by [Nikhil Prasad](https://github.com/nikhilprasad-data).*