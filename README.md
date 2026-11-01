# NagrikLens

> **Civic Technology Platform for a 48-Hour Hackathon**  
> Bridging citizens with public entitlements, clear procedural navigation, and plain-language policy analysis.

---

## 🏛️ Overview of the Four Modules

1. **SchemeGraph**: Discovery engine and knowledge graph for government welfare eligibility, linking citizen criteria to public schemes and co-benefits.
2. **ClaimCraft**: Entitlement claim assistant providing required document checklists, prerequisite validations, and application readiness checks.
3. **CivicRoute**: Navigational directory mapping administrative departments, Citizen Charter SLAs, and multi-tier grievance escalation pathways.
4. **PolicyMirror**: Plain-language civic policy analysis and impact reflection tool powered by the Gemini AI API.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Lucide React
- **Backend**: Python 3.10+, FastAPI, Uvicorn, Pydantic v2
- **Database & ORM**: SQLite 3, SQLAlchemy 2.0
- **Testing**: Pytest, HTTPX
- **AI Engine**: Google Gemini API (`gemini-1.5-flash`)

---

## 📂 Repository Structure

```text
nagrik-lens/
├── .gitignore               # Git ignore rules for Python, Node, DB & secrets
├── .env.example             # Master environment template
├── README.md                # Project documentation and execution instructions
├── docs/
│   ├── API_CONTRACT.md      # API endpoint contracts and payloads
│   └── ARCHITECTURE.md      # System architecture, data flow & module design
├── backend/
│   ├── .env.example         # Backend environment template
│   ├── requirements.txt     # Python production and development dependencies
│   ├── pytest.ini           # Pytest runner configuration
│   ├── app/
│   │   ├── main.py          # FastAPI application entrypoint & middleware
│   │   ├── core/
│   │   │   ├── config.py    # Pydantic Settings configuration
│   │   │   └── database.py  # SQLAlchemy engine & SQLite session maker
│   │   ├── schemas/
│   │   │   └── health.py    # Health check Pydantic schemas
│   │   ├── api/
│   │   │   └── v1/
│   │   │       ├── router.py # API v1 router mounting
│   │   │       └── endpoints/
│   │   │           └── health.py # GET /api/v1/health handler
│   │   ├── models/          # SQLAlchemy database models
│   │   └── modules/         # Domain module packages
│   │       ├── schemegraph/ # SchemeGraph domain package
│   │       ├── claimcraft/  # ClaimCraft domain package
│   │       ├── civicroute/  # CivicRoute domain package
│   │       └── policymirror/# PolicyMirror domain package
│   └── tests/
│       ├── conftest.py      # In-memory SQLite fixtures & TestClient
│       └── test_health.py   # Health endpoint integration tests
└── frontend/
    ├── .env.example         # Frontend environment template
    ├── package.json         # Scripts and dependencies
    ├── tsconfig.json        # TypeScript configuration
    ├── vite.config.ts       # Vite bundler & backend dev proxy
    ├── tailwind.config.js   # Tailwind theme configuration
    ├── postcss.config.js    # PostCSS plugins
    ├── index.html           # HTML template
    └── src/
        ├── index.css        # Tailwind directives
        ├── main.tsx         # React root mounting
        ├── App.tsx          # NagrikLens dashboard with live health monitor
        ├── api/
        │   └── client.ts    # Fetch client for backend API communication
        ├── components/
        │   ├── Header.tsx   # Top navigation header
        │   ├── Footer.tsx   # Architecture and documentation footer
        │   ├── StatusBadge.tsx # Semantic status pill badge
        │   └── ModuleCard.tsx  # Modular capability showcase card
        └── types/
            └── api.ts       # TypeScript API response definitions
```

---

## 🚀 Quickstart & Execution Instructions

### Prerequisites
- **Python 3.10+**
- **Node.js 18+** & **npm 9+**

---

### 1. Backend Setup

1. Open a terminal and navigate to the `backend/` directory:
   ```powershell
   cd "D:\nagrik lens\backend"
   ```

2. Create and activate a Python virtual environment:
   ```powershell
   python -m venv venv
   .\venv\Scripts\activate
   ```

3. Install dependencies:
   ```powershell
   pip install -r requirements.txt
   ```

4. Create your local environment configuration:
   ```powershell
   copy .env.example .env
   ```

5. Run the test suite:
   ```powershell
   pytest
   ```

6. Start the FastAPI backend server:
   ```powershell
   uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
   ```

   - **Health Endpoint**: [http://127.0.0.1:8000/api/v1/health](http://127.0.0.1:8000/api/v1/health)
   - **Interactive API Docs (Swagger)**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
   - **Alternative API Docs (ReDoc)**: [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)

---

### 2. Frontend Setup

1. Open a second terminal and navigate to the `frontend/` directory:
   ```powershell
   cd "D:\nagrik lens\frontend"
   ```

2. Install npm dependencies:
   ```powershell
   npm install
   ```

3. Create your local environment configuration (optional in dev, proxy handles it):
   ```powershell
   copy .env.example .env
   ```

4. Run the Vite development server:
   ```powershell
   npm run dev
   ```

5. Open your browser and navigate to:
   ```text
   http://127.0.0.1:5173
   ```

6. To verify production compilation:
   ```powershell
   npm run build
   ```

---

## 🧪 Testing Backend Health Manually

You can test the health endpoint using `curl` or PowerShell:

```powershell
Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/v1/health" | ConvertTo-Json
```

Expected JSON response:
```json
{
  "status": "healthy",
  "app_name": "NagrikLens API",
  "version": "0.1.0",
  "environment": "development",
  "timestamp": "2026-11-01T10:55:00.000000Z",
  "database": "connected",
  "modules": {
    "schemegraph": {
      "name": "SchemeGraph",
      "status": "initialized",
      "description": "Civic welfare scheme eligibility and relationship discovery graph."
    },
    "claimcraft": {
      "name": "ClaimCraft",
      "status": "initialized",
      "description": "Citizen entitlement claim verification and document guidance engine."
    },
    "civicroute": {
      "name": "CivicRoute",
      "status": "initialized",
      "description": "Administrative grievance escalation and department routing navigator."
    },
    "policymirror": {
      "name": "PolicyMirror",
      "status": "initialized",
      "description": "Plain-language civic policy analysis and impact reflection tool."
    }
  }
}
```

---

## 🔒 Security & Hackathon Principles

- **Zero Mock Fabrications**: No mock API responses are disguised as real government feeds.
- **Environment Isolation**: No secrets or API keys are placed in source control.
- **Modularity**: All 4 modules have dedicated routers and schemas prepared for incremental development during the 48-hour sprint.
