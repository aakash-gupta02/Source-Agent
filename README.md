# Source Agent

> Talk to your database. Let an agent handle the SQL.

Source Agent is an AI-powered PostgreSQL assistant that lets you interact with your database using natural language.

Connect a PostgreSQL database, bring your own AI provider, and start asking questions about your data. The agent inspects the database through tools, generates SQL, executes queries, and streams the response back to you.

For write operations such as `INSERT`, `UPDATE`, and `DELETE`, execution pauses and waits for explicit human approval before continuing.

<p align="center">
  <a href="https://sourceagent.d3labs.tech">
    <strong>Try Source Agent →</strong>
  </a>
</p>

---

## Screenshots

### Talk to your database

<p align="center">
  <img src="https://github.com/user-attachments/assets/01d8e668-5517-40ef-8b02-c567a10b921f" alt="Source Agent chat" />
</p>

Ask questions about your PostgreSQL database in natural language and let the agent decide which tools it needs.

---

### Connect a PostgreSQL database

<p align="center">
  <img src="https://github.com/user-attachments/assets/4784bee5-a827-4398-b646-61d4eaf28634" alt="Source Agent database connection" />
</p>

Add a PostgreSQL connection and make it available to your conversations.

---

### Bring your own AI provider

<p align="center">
  <img src="https://github.com/user-attachments/assets/f5854b8d-fc03-4615-8cbe-391f7555c84e" alt="Source Agent AI provider" />
</p>

Configure your own AI provider and model instead of relying on a shared API key.

---

### Human-in-the-loop SQL approval

<p align="center">
  <img src="https://github.com/user-attachments/assets/e96eb055-7b09-4c03-9e51-f9edc75d7288" alt="Source Agent SQL approval" />
</p>

Write operations are paused before execution. The generated SQL is shown to the user and must be explicitly approved or rejected.

---

## Why Source Agent?

Working with databases through SQL is powerful, but it still requires knowing the schema, tables, relationships, and query syntax.

Source Agent adds an agent layer on top of PostgreSQL:

```text
Natural language
      ↓
   AI Agent
      ↓
   Tool calls
      ↓
Database inspection
      ↓
   SQL query
      ↓
PostgreSQL
      ↓
   Results
````

Instead of manually figuring out the schema and writing every query, you can ask:

```text
"Which customers signed up last month?"
```

The agent can inspect the database, generate the appropriate SQL, execute it, and return the result.

---

# Features

### Natural language database queries

Ask questions about your PostgreSQL database without manually writing SQL.

### Tool-calling agent

The agent can use database tools to understand the available schema and retrieve the information it needs.

Current tools include:

* `get_tables`
* `get_schema`
* `get_table_schema`
* `get_table_sample`
* `execute_sql`

### Human-in-the-loop SQL execution

Read queries can execute normally.

Write operations are interrupted before execution:

```text
INSERT
UPDATE
DELETE
```

The generated SQL is shown to the user:

```sql
UPDATE users
SET email = 'aakash@example.com'
WHERE name = 'Aakash';
```

The user can then:

```text
Approve → execute the query
Reject  → stop the operation
```

### Streaming responses

Agent responses are streamed to the frontend using Server-Sent Events (SSE).

Tool execution and assistant output can be displayed as they happen instead of waiting for the entire agent run to finish.

### Persistent conversations

Conversations and messages are persisted so previous interactions can be revisited.

### Bring Your Own AI Provider

Source Agent is designed around user-provided AI credentials.

Configure an AI provider and model from the dashboard rather than relying on a shared application-wide AI key.

### PostgreSQL connections

Connect a PostgreSQL database and use it as the data source for conversations.

### Encrypted credentials

Database and AI provider credentials are stored encrypted rather than being persisted as plain-text credentials.

---

# How It Works

Source Agent uses a LangGraph-based agent workflow.

```text
                         ┌──────────────────┐
                         │      User        │
                         └────────┬─────────┘
                                  │
                                  ▼
                         Natural language
                                  │
                                  ▼
                         ┌──────────────────┐
                         │   LangGraph      │
                         │     Agent        │
                         └────────┬─────────┘
                                  │
                    ┌─────────────┴─────────────┐
                    │                           │
                    ▼                           ▼
             Database tools              SQL generation
                    │                           │
        ┌───────────┼───────────┐               │
        ▼           ▼           ▼               │
    get_tables   get_schema   get_sample        │
                    │                           │
                    └─────────────┬─────────────┘
                                  ▼
                            execute_sql
                                  │
                         ┌────────┴────────┐
                         │                 │
                       READ              WRITE
                         │                 │
                         ▼                 ▼
                     Execute          HITL interrupt
                                           │
                                  ┌────────┴────────┐
                                  │                 │
                               Approve            Reject
                                  │                 │
                                  ▼                 ▼
                              Execute             Stop
```

---

# Agent Tool Loop

The agent can inspect the database before generating a query.

A typical interaction can look like:

```text
User
  ↓
"What are the top 5 customers by revenue?"
  ↓
Agent
  ↓
get_table_schema
  ↓
Agent
  ↓
execute_sql
  ↓
PostgreSQL
  ↓
Results
  ↓
Assistant response
```

If the generated SQL is invalid, the agent can continue through the tool loop and retry.

The graph also tracks SQL attempts to prevent an uncontrolled query loop.

---

# Human-in-the-Loop

One of the core ideas behind Source Agent is that an AI agent should not silently perform database writes.

For potentially destructive operations, the SQL execution tool interrupts the graph.

For example:

```sql
DELETE FROM users
WHERE id = '...';
```

Instead of immediately executing the query:

```text
Agent
  ↓
execute_sql
  ↓
SQL requires approval
  ↓
interrupt()
  ↓
User
  ├── Approve
  └── Reject
```

If the user approves the operation, the graph resumes from the interrupted state.

This is implemented using LangGraph checkpointing and resume support.

---

# Streaming Architecture

The backend streams agent events to the frontend using SSE.

The stream can contain events such as:

```ts
type StreamEvent =
  | {
      type: "tool_start";
      tool: string;
    }
  | {
      type: "tool_end";
      tool: string;
    }
  | {
      type: "approval_required";
      approval: {
        type: "sql_approval";
        sql: string;
      };
    }
  | {
      type: "message";
      content: string;
    }
  | {
      type: "done";
    }
  | {
      type: "error";
      message: string;
    };
```

This allows the UI to display agent activity while the graph is running.

---

# AI Providers

Source Agent uses a BYOK model.

The application stores the selected:

```text
Provider
Model
API credentials
```

and creates the appropriate LangChain model at runtime.

The architecture is designed so additional model providers can be added without changing the conversation layer.

Current development/testing has included providers such as:

* Google Gemini
* Ollama

Additional providers can be integrated through the model abstraction.

---

# Database Safety

Source Agent intentionally limits what the SQL execution tool can perform.

The execution layer:

* validates SQL input
* prevents multiple statements
* blocks dangerous schema-level operations
* limits returned rows
* tracks SQL attempts
* interrupts write operations for approval

Currently blocked operations include commands such as:

```text
DROP
ALTER
TRUNCATE
CREATE
GRANT
REVOKE
```

Write operations such as:

```text
INSERT
UPDATE
DELETE
```

require explicit approval.

---

# Tech Stack

## Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS
* shadcn/ui
* TanStack Query
* React Hook Form
* Zod
* React Markdown

## Backend

* Node.js
* Express
* TypeScript
* Prisma
* PostgreSQL

## AI / Agent

* LangChain
* LangGraph
* Google Gemini
* Ollama
* Tool calling
* Structured agent state
* Human-in-the-loop interrupts
* LangGraph checkpointing

## Infrastructure

* Vercel
* Render
* Neon PostgreSQL
* Server-Sent Events (SSE)

---

# Project Structure

Source Agent is organized as a monorepo.

```text
Source-Agent/
│
├── apps/
│   ├── frontend/
│   │   └── Next.js application
│   │
│   └── backend/
│       └── Express API
│
├── packages/
│   ├── agent/
│   │   └── LangGraph agents and database tools
│   │
│   ├── db/
│   │   └── Prisma schema, migrations and database client
│   │
│   └── shared/
│       └── Shared types and utilities
│
├── turbo.json
├── package.json
└── README.md
```

The repository uses Turborepo to manage the applications and shared packages.

---

# Getting Started

## Prerequisites

Make sure you have:

* Node.js
* npm
* PostgreSQL
* An AI provider API key

Clone the repository:

```bash
git clone https://github.com/aakash-gupta02/Source-Agent.git

cd Source-Agent
```

Install dependencies:

```bash
npm install
```

---

# Environment Variables

Create the required environment files for the frontend and backend.

The backend requires configuration for:

```env
DATABASE_URL=
```

Authentication:

```env
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=
```

Application configuration:

```env
```

AI provider credentials are configured through the application rather than hard-coded into the environment.

> Never commit API keys, database credentials, OAuth secrets, or other sensitive values to the repository.

---

# Database Setup

Source Agent uses Prisma for database access and migrations.

Generate the Prisma client:

```bash
npm run db:gen --workspace=@repo/db
```

Create/apply a development migration:

```bash
npm run db:mig --workspace=@repo/db
```

Deploy existing migrations:

```bash
npm run db:mig:deploy --workspace=@repo/db
```

Open Prisma Studio:

```bash
npm run db:studio --workspace=@repo/db
```

---

# Development

Run the development environment from the repository root:

```bash
npm run dev
```

The frontend and backend can then be accessed through their respective development servers.

---

# Production Deployment

## Frontend

The frontend is deployed using Vercel.

Root directory:

```text
apps/frontend
```

Install command:

```bash
npm install --prefix=../..
```

Build command:

```bash
turbo run build --filter=frontend
```

---

## Backend

The backend is deployed using Render.

Root directory:

```text
apps/backend
```

Build command:

```bash
npm install --prefix=../.. --include=dev && npm run build:backend --prefix=../.. && npm run db:mig:deploy --prefix=../.. --workspace=@repo/db
```

Start command:

```bash
npm start
```

The production database currently uses Neon PostgreSQL.

---

# Architecture

At a high level, the system is divided into four layers:

```text
┌──────────────────────────────────────────┐
│                Frontend                  │
│              Next.js + UI                │
└────────────────────┬─────────────────────┘
                     │
                     │ HTTP / SSE
                     ▼
┌──────────────────────────────────────────┐
│                Backend                   │
│              Express API                 │
└───────────────┬──────────────────────────┘
                │
        ┌───────┴────────┐
        │                │
        ▼                ▼
┌───────────────┐  ┌─────────────────────┐
│   Database    │  │    Agent Package    │
│    Prisma     │  │     LangGraph      │
│  PostgreSQL   │  │     LangChain      │
└───────────────┘  └──────────┬──────────┘
                               │
                               ▼
                       ┌──────────────┐
                       │ AI Provider  │
                       └──────────────┘
```

---

# Conversation Flow

When a user sends a message:

### 1. Persist the user message

The message is stored against the conversation.

### 2. Create/load the agent

The backend loads:

* database connection
* AI provider
* model configuration

Credentials are decrypted at runtime.

### 3. Run the graph

The conversation is passed to the LangGraph agent.

### 4. Execute tools

The agent can inspect the database and execute SQL through the available tools.

### 5. Stream events

The backend streams tool activity and assistant output to the frontend.

### 6. Handle approval

If a write operation is requested, the graph interrupts.

### 7. Resume

After the user approves or rejects the query, the backend resumes the same LangGraph thread.

### 8. Persist the response

The assistant message and execution metadata are stored for the conversation.

---

# Roadmap

Source Agent V1 currently focuses on PostgreSQL and the core agent workflow.

Possible future directions include:

* [ ] Additional database adapters
* [ ] MongoDB support
* [ ] CSV / Excel sources
* [ ] JSON sources
* [ ] External API sources
* [ ] Multi-source conversations
* [ ] More AI providers
* [ ] Improved query visualization
* [ ] Query history
* [ ] Agent tracing
* [ ] Evaluation workflows
* [ ] More granular SQL permissions

The long-term goal is to move from a PostgreSQL-only agent toward a more general data agent that can reason across multiple sources.

---

# Design Principles

### Ask first, write later

AI-generated database mutations should not silently execute.

### The database remains the source of truth

The agent interacts with the database through explicit tools rather than receiving an unrestricted copy of the database.

### Bring your own model

Users provide their own AI provider credentials and choose the model they want to use.

### Stream the work

Agent activity should be visible as it happens rather than hidden behind a loading state.

### Keep the system modular

The agent, database layer, API, and frontend are separated so individual pieces can evolve independently.

---

# Current Limitations

Source Agent is an actively developed project.

Current limitations include:

* PostgreSQL is the primary supported database.
* AI provider/model availability depends on the provider configured by the user.
* SQL generation is model-dependent and should be reviewed before executing writes.
* The current tool layer intentionally restricts certain SQL operations.
* The project is currently focused on a single database source per conversation.

---

# Live Demo

**Source Agent:**
[https://sourceagent.d3labs.tech/](https://sourceagent.d3labs.tech)

---

# Author

**Aakash Gupta**

Backend-focused full-stack developer building with:

* TypeScript

* Node.js

* React / Next.js

* PostgreSQL

* AI agents

* LangChain

* LangGraph

* GitHub: [https://github.com/aakash-gupta02](https://github.com/aakash-gupta02)

* LinkedIn: [https://www.linkedin.com/in/aakashgupta02/](https://www.linkedin.com/in/aakashgupta02/)

* Portfolio: [https://aakashgupta.dev/](https://aakashgupta.app)
