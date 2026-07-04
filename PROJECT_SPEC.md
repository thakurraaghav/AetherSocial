# **Project Specification Document: AetherSocial**

## **1\. Project Overview**

A full-stack web application designed to automate social media content creation and scheduling. Unlike generic AI wrappers, this platform captures specific business context during onboarding and uses it as persistent prompt-injection. This ensures the generated content is deeply grounded in the nuances of the user's specific company or business entity, rather than relying on a generic company profile alone. It features a dual-engine AI system (Text and Image) and an interactive calendar for scheduling and trend-based content ideation. 

## **2\. Technical Stack**

| Layer | Technology | Purpose |
| :---- | :---- | :---- |
| **Frontend UI** | React, Vite, TypeScript, Tailwind CSS, Framer Motion, Shadcn/ui, @dnd-kit | Type-safe UI, responsive calendar grids, accessible primitive components, and smooth drag-and-drop transitions. |
| **State & Routing** | Zustand, TanStack Query, React Router v6.4+ | Zustand for transient client state, TanStack Query for server-state caching, and React Router for modern data-driven navigation. |
| **Backend API** | Node.js, Express, TypeScript, Zod | High-throughput REST API layer for routing LLM requests and handling business logic, fortified with runtime structural validation. |
| **Database & ORM** | PostgreSQL \+ Prisma | Relational data integrity between Users, Business Profiles, and Scheduled Posts. |
| **Queue & Cache** | BullMQ \+ Redis | Handling asynchronous AI generation pipelines, robust API rate limiting, and exact timestamp scheduling for future posts. |
| **Text AI** | Groq API (Llama 3\) / Google Gemini | Ultra-fast generation of JSON-formatted content, hashtags, and image prompts. |
| **Image AI** | Pollinations.ai / Hugging Face | Free-tier generation of platform-specific images based on AI-written prompts. |
| **Ideation Data** | SerpAPI / Tavily | Fetching live web trends and holidays to feed into the idea-generation model. |

## **3\. Authentication & Security**

* **Strategy:** Custom JSON Web Tokens (JWT) integrated with HTTP-Only, Secure, SameSite=Strict cookies.  
* **Flow:** The Express backend handles password hashing via bcrypt and issues the HTTP-Only cookie. The React frontend strictly relies on a global /api/auth/me endpoint cached by TanStack Query to verify session validity, entirely avoiding localStorage vulnerabilities.

## **4\. Core Functional Requirements**

### **A. Business Onboarding & Memory**

* Users must complete a profile upon registration.  
* Data captured includes: Business Category (e.g., E-commerce, Local Service), Brand Name, Core Offering, Target Audience, and Brand Personality.  
* This profile acts as the "System Context" for all future AI interactions, ensuring brand consistency.

### **B. Content Generation Engine**

* **Platform-Aware Constraints:** The user selects a target platform (LinkedIn, Instagram, X). The backend applies specific constraints (character limits, hashtag counts, formatting).  
* **Text Output:** Generates captions, thread structures, or professional posts.  
* **Visual Output:** Requests the correct aspect ratio (1:1, 4:5, 16:9) based on the target platform.  
* **Strict JSON Enforcement:** The backend forces the LLM to return valid JSON so the React frontend can reliably map the data to UI components without parsing errors.

### **C. Calendar & Idea Generation**

* **Calendar UI:** A drag-and-drop monthly/weekly view showing scheduled posts.  
* **AI Idea Generator:** A sidebar tool that analyzes the business profile alongside the current date/season to suggest highly relevant content topics.  
* **Timezone Handling:** All schedules are stored in UTC in PostgreSQL and converted to local time on the React frontend.

## **5\. Backend Workflow: The Asynchronous Generation Pipeline**

When the React frontend requests a new post, the backend executes this specific sequence to ensure reliable data formatting and non-blocking performance:

1. **Receive Request:** The endpoint /api/content/generate receives the topic and targetPlatform from the frontend.  
2. **Enqueue Job:** The server immediately hands the workload to a BullMQ queue backed by Redis and returns a "Processing" status to the client.  
3. **Fetch Business Context:** The background worker queries Prisma for the user's Business Profile to retrieve their audience, offering, and personality.  
4. **Compile System Prompt:** The worker builds a prompt combining the business profile, platform rules (e.g., "Instagram needs 4:5 ratio and 15 hashtags"), and the requested topic.  
5. **Execute LLM Call:** The worker sends the request to Groq/Gemini with response\_format: { type: 'json\_object' } and a strict schema requirement.  
6. **Validation:** The payload is validated structurally against Zod.  
7. **Trigger Image API:** If an image is required, the server takes the suggestedImagePrompt from the LLM's JSON output and hits the Image Generation API with the platform-specific dimensions.  
8. **Return Payload:** The fully formatted JSON object (containing text, hashtags, and the image URL) is sent back to the client to be rendered or scheduled in the calendar.

## **6\. Database Schema (Prisma)**

Code snippet  
model User {  
  id               String           @id @default(uuid())  
  email            String           @unique  
  passwordHash     String  
  createdAt        DateTime         @default(now())  
  businessProfile  BusinessProfile?  
  posts            Post\[\]  
}

model BusinessProfile {  
  id               String   @id @default(uuid())  
  userId           String   @unique  
  user             User     @relation(fields: \[userId\], references: \[id\], onDelete: Cascade)  
  category         String   // e.g., "SaaS", "Local Retail"  
  brandName        String  
  coreOffering     String  
  targetAudience   String  
  brandPersonality String   // e.g., "Professional", "Quirky"  
}

model Post {  
  id               String   @id @default(uuid())  
  userId           String  
  user             User     @relation(fields: \[userId\], references: \[id\], onDelete: Cascade)  
  targetPlatform   String   // "INSTAGRAM", "LINKEDIN", "X"  
  textContent      String?  // Generated caption  
  imageUrl         String?  // URL from image generation API  
  scheduledAt      DateTime? // Stored in UTC  
  status           String   @default("DRAFT") // "DRAFT", "SCHEDULED", "PUBLISHED"  
  createdAt        DateTime @default(now())  
  updatedAt        DateTime @updatedAt  
}

## **7\. REST API Endpoints Map**

| Endpoint | Method | Purpose |
| :---- | :---- | :---- |
| /api/auth/me | GET | Validates the HTTP-Only cookie and returns current user session data. |
| /api/business-profile | POST/PUT | Create or update the user's business context. |
| /api/business-profile | GET | Retrieve current profile settings. |
| /api/content/generate | POST | The main AI generation route (handles text and image prompt logic). Enqueues jobs to BullMQ. |
| /api/calendar/posts | GET | Fetch all posts for the calendar (filtered by date range). |
| /api/calendar/schedule | PATCH | Update a post's scheduledAt timestamp (used during drag-and-drop). |
| /api/ideas/suggest | GET | Trigger the LLM \+ web search to generate 5 targeted content ideas. |

