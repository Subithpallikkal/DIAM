# DIAM User Manual

**Digital Internal Audit Management**

This guide explains how to use DIAM day to day. It is written for **Admin**, **Manager**, and **Auditor** users — not for developers.

For technical setup and API reference, see the root [README.md](../README.md) and Swagger at `/docs` on the API server.

---

## Table of contents

1. [Getting started](#1-getting-started)
2. [Navigation](#2-navigation)
3. [Roles at a glance](#3-roles-at-a-glance)
4. [Admin walkthrough](#4-admin-walkthrough)
5. [Manager walkthrough](#5-manager-walkthrough)
6. [Auditor walkthrough](#6-auditor-walkthrough)
7. [Module guides](#7-module-guides)
8. [Common workflows](#8-common-workflows)
9. [Tips and troubleshooting](#9-tips-and-troubleshooting)

---

## 1. Getting started

### Access the application

| Environment | URL |
|-------------|-----|
| Production | [https://diam-roan.vercel.app/](https://diam-roan.vercel.app/) |
| Local dev | `http://localhost:5173` |

### Sign in

1. Open the login page.
2. Enter your **work email** and **password**.
3. Click **Sign in**.

You are redirected to the **Dashboard** after a successful login.

### Demo accounts (after database seed)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@gmail.com | Admin@123 |
| Manager | manager@gmail.com | Manager@123 |
| Auditor | auditor@gmail.com | Auditor@123 |

### Sign out

Click your **profile** in the sidebar (or header on mobile) and choose **Logout**.

---

## 2. Navigation

### Sidebar (desktop / tablet)

The left sidebar lists all modules you can access:

| Menu item | Purpose |
|-----------|---------|
| **Dashboard** | Overview of audit activity (content varies by role) |
| **Clients** | Client directory |
| **Engagements** | Audit engagements and scopes |
| **Documents** | Upload and manage audit files |
| **Risks** | Risk register and checklists |
| **Tasks** | Task tracking and assignments |
| **Issues** | Issue tracking, findings, and assignments |
| **Reports** | Audit reports and PDF/Excel export |
| **Users** | User management *(Admin & Manager only)* |
| **Role Permissions** | Permission grid *(Admin & Manager only)* |

### Mobile

On smaller screens, use the **bottom navigation bar** for quick access to main modules. Open the menu icon for the full sidebar.

### Detail drawer

On list pages (Clients, Engagements, Tasks, Issues, Risks), click the **eye icon** or the **row title** to open a **detail panel** on the right. Close it with the **X** button or by returning to the list URL.

### Search on list pages

Most list pages have a **search bar** on the same row as the create button. Type to filter results by name or title.

---

## 3. Roles at a glance

| Capability | Admin | Manager | Auditor |
|------------|:-----:|:-------:|:-------:|
| Org-wide dashboard (KPIs + team workload) | Yes | Yes | No |
| Personal **My Dashboard** (tasks, checklists, issues) | No | No | Yes |
| Create / edit clients | Yes | Yes | No |
| Create / edit engagements | Yes | Yes | No |
| Upload documents | Yes | Yes | Yes |
| Manage risks and checklists | Yes | Yes | View / complete assigned items |
| Assign tasks to users | Yes | Yes | No |
| Assign issues to users | Yes | Yes | No |
| Assign issues to clients | Yes | Yes | No |
| Update issue status / add findings | Yes | Yes | Yes |
| Export reports (PDF / Excel) | Yes | Yes | Yes |
| Manage users | Yes | Yes | No |
| Edit role permissions | Yes | No | No |

---

## 4. Admin walkthrough

Admins have full access to the system, including user and permission management.

### Recommended first-time setup

1. **Sign in** as Admin.
2. Go to **Users** → review demo users or create new accounts.
3. Go to **Role Permissions** → review what each role can do (only Admin can edit this grid).
4. Go to **Clients** → add your client organizations.
5. Go to **Engagements** → create an audit engagement for each client.
6. Assign **tasks**, **risks/checklists**, and **issues** to auditors as work is planned.

### Dashboard (Admin)

The Admin dashboard shows:

- **KPI strip** — total clients, engagements, open issues, pending tasks
- **Audit progress** — percentage of completed engagements
- **Spotlight cards** — attention needed, team capacity, resolved issues
- **Workload tables** — tasks and open checklists **by assignee**

Use KPI numbers as links to jump into the relevant module.

### User management

**Path:** Sidebar → **Users**

1. Click **Add User** (or equivalent create action).
2. Fill in name, email, password, and role (Admin / Manager / Auditor).
3. Save.

Only **Admin** can change the **Role Permissions** grid.

### Role permissions

**Path:** Sidebar → **Role Permissions**

Review or adjust which actions each role may perform across modules. Changes apply to all users with that role.

---

## 5. Manager walkthrough

Managers run audit operations: clients, engagements, team coordination, and reporting. They cannot edit the role permission grid (Admin only).

### Daily routine

1. Open **Dashboard** — check open issues, pending tasks, and team workload.
2. Review **Engagements** — confirm status and required documents.
3. Assign or reassign **Tasks**, **Risk checklists**, and **Issues** to auditors.
4. Use **Reports** to generate audit summaries for stakeholders.

### Creating an audit engagement

**Path:** Sidebar → **Engagements**

1. Click **New Engagement** (or **New engagement** from the dashboard).
2. Select a **client**, enter title, audit type, financial year, dates, and description.
3. Save.

Open the engagement detail drawer to:

- View engagement fields (client, status, dates, etc.)
- Manage **scopes**
- Track the **required documents checklist**

### Assigning work to the team

| Work type | Where to assign |
|-----------|-----------------|
| Tasks | **Tasks** → open task detail → assign user |
| Risk checklists | **Risks** → open risk detail → add checklist items → assign user |
| Issues (internal) | **Issues** → open issue detail → **Assign to user** |
| Issues (client) | **Issues** → open issue detail → **Assign to client** |

---

## 6. Auditor walkthrough

Auditors focus on executing assigned audit work. They see a **personal dashboard**, not the org-wide admin view.

### My Dashboard

**Path:** Sidebar → **Dashboard**

After login, auditors land on **My Dashboard**, which shows only **your** assigned work:

| Section | What it shows |
|---------|----------------|
| **My workload KPIs** | Pending tasks, in-progress tasks, open checklists, open issues |
| **My tasks** | Tasks assigned to you — click to open detail |
| **My checklists** | Open risk checklist items assigned to you |
| **My issues** | Open issues assigned to you |
| **Quick links** | Shortcuts to Tasks, Risks, Issues, Documents, Engagements |

### Completing your work

#### Tasks

1. Go to **Tasks** or click a task from My Dashboard.
2. Open the task detail drawer.
3. Update **status** (Pending → In Progress → Completed).
4. Add **comments** if needed.

#### Risk checklists

1. Go to **Risks** or click a checklist item from My Dashboard.
2. Open the risk detail drawer.
3. Mark checklist items **complete** when done.

#### Issues

1. Go to **Issues** or click an issue from My Dashboard.
2. Open the issue detail drawer.
3. Update **status** as the issue progresses.
4. Add **findings** with title and severity.
5. Review **status history** for the audit trail.

#### Documents

1. Go to **Documents**.
2. Upload files, set category, and link to client/engagement where required.
3. Download, preview, or review version history as needed.

### What auditors cannot do

- Create or edit clients and engagements
- Assign tasks, checklists, or issues to others
- Access **Users** or **Role Permissions** menus

---

## 7. Module guides

### Clients

**Path:** Sidebar → **Clients**

| Action | Who can do it |
|--------|----------------|
| View client list and details | All roles |
| Create / edit client | Admin, Manager |
| Deactivate client | Admin, Manager |

**Create a client**

1. Click **Add Client**.
2. Enter name, email, phone, GST number, code, address.
3. Save.

**View details:** Click the client name or eye icon. The detail drawer shows status, contact info, and address.

---

### Engagements

**Path:** Sidebar → **Engagements**

An **engagement** is an audit project tied to one client. It links risks, tasks, issues, documents, and scopes.

| Action | Who can do it |
|--------|----------------|
| View engagements | All roles |
| Create / edit engagement | Admin, Manager |
| Manage scopes & required documents | Admin, Manager |

**Detail drawer sections**

- **Details** — client, status, audit type, dates, description
- **Scopes** — audit scope areas
- **Required documents** — checklist of documents the client must provide

---

### Documents

**Path:** Sidebar → **Documents**

| Action | Who can do it |
|--------|----------------|
| Upload, download, preview | All roles |
| View versions and audit logs | All roles |
| Delete documents | Admin, Manager |

**Upload a document**

1. Click **Upload** (or use the upload form on the page).
2. Choose a file, category, and optional client/engagement link.
3. Submit.

Use filters to narrow by category, client, or engagement.

---

### Risks

**Path:** Sidebar → **Risks**

| Action | Who can do it |
|--------|----------------|
| View risks | All roles |
| Create / edit risks | Admin, Manager |
| Add checklist items & assign users | Admin, Manager |
| Mark checklist items complete | All (typically assignee) |

**Risk detail drawer**

- Priority, status, description
- **Checklist** — sub-items with user assignment and completion

---

### Tasks

**Path:** Sidebar → **Tasks**

| Action | Who can do it |
|--------|----------------|
| View tasks | All roles |
| Create / edit tasks | Admin, Manager |
| Assign to user | Admin, Manager |
| Update status & add comments | All (assignee updates status) |

---

### Issues

**Path:** Sidebar → **Issues**

| Action | Who can do it |
|--------|----------------|
| View issues | All roles |
| Create / report issue | All (via engagement) |
| Assign to **user** | Admin, Manager |
| Assign to **client** | Admin, Manager |
| Update status, add findings | All |

**Issue detail drawer fields**

| Field | Description |
|-------|-------------|
| Severity | HIGH / MEDIUM / LOW |
| Status | OPEN → IN_PROGRESS → RESOLVED → CLOSED |
| Assignee | Internal user responsible |
| Assigned Client | Client organization responsible for follow-up |
| Responsible Person | Free-text contact name (optional) |
| Findings | Sub-items logged against the issue |
| Status History | Full audit trail of status changes |

**Assign issue to a client (Admin / Manager)**

1. Open the issue detail drawer.
2. Under **Assign to client**, select a client from the dropdown.
3. Click **Assign client**.

The **Client** column on the issues list shows the assigned client.

---

### Reports

**Path:** Sidebar → **Reports**

1. Select an **engagement**.
2. Open a report tab:
   - **Audit Summary**
   - **Risk Report**
   - **Findings Report**
3. Preview data on screen.
4. Click **Export PDF** or **Export Excel** to download.

Reports are **engagement-scoped** — one engagement per export.

---

### Users *(Admin & Manager)*

**Path:** Sidebar → **Users**

Create and manage user accounts. Set each user’s role to control what they see in the app.

---

### Role Permissions *(Admin & Manager — edit: Admin only)*

**Path:** Sidebar → **Role Permissions**

View the permission matrix for Admin, Manager, and Auditor. Only **Admin** can save changes.

---

## 8. Common workflows

### Workflow A — Start a new client audit

1. **Admin/Manager:** Create **Client**.
2. **Admin/Manager:** Create **Engagement** for that client.
3. **Admin/Manager:** Add **scopes** and **required documents** on the engagement.
4. **Admin/Manager:** Create **Risks**, **Tasks**, and **Issues** as the audit plan is defined.
5. **Admin/Manager:** Assign tasks and checklists to **Auditors**.
6. **Auditor:** Work from **My Dashboard**; upload **Documents**; update tasks, checklists, and issues.
7. **Manager:** Run **Reports** and export PDF/Excel when the engagement milestone is reached.

### Workflow B — Track and close an issue

1. **Anyone:** Create or report an issue on an engagement.
2. **Admin/Manager:** Assign to an internal **user** and/or a **client**.
3. **Assignee:** Set status to **IN_PROGRESS**, add **findings**.
4. **Assignee:** Set status to **RESOLVED** or **CLOSED** when done.
5. **Manager:** Include issue in **Findings Report** export.

### Workflow C — Auditor morning check

1. Sign in → **My Dashboard**.
2. Review counts: pending tasks, open checklists, open issues.
3. Open each item from the lists and update progress.
4. Upload any new **Documents** received from the client.
5. Add **comments** or **findings** where needed.

---

## 9. Tips and troubleshooting

### “I don’t see Users or Role Permissions”

Those menus are only visible to **Admin** and **Manager**. Auditors do not have access.

### “My Dashboard is empty”

No tasks, checklists, or issues are currently **assigned to you**. Ask your Manager to assign work, or browse **Tasks**, **Risks**, and **Issues** from the sidebar.

### “I can’t create a client or engagement”

Only **Admin** and **Manager** can create clients and engagements. Auditors have read access through related modules.

### “Export button does nothing”

- Ensure an **engagement** is selected on the Reports page.
- Check that your browser allows file downloads.
- On production, the API may take ~30 seconds to respond if the server was idle (Render free tier).

### “Invalid email or password”

- Confirm credentials with your administrator.
- For demo: use the [demo accounts](#demo-accounts-after-database-seed) after running `npm run db:seed` on the backend.

### Session expired

Sign in again. JWT tokens expire based on server configuration (default: 1 day).

---

## Document information

| Item | Value |
|------|-------|
| Application | DIAM — Digital Internal Audit Management |
| Manual version | 1.0 |
| Last updated | June 2026 |
| Audience | Admin, Manager, Auditor end users |

For developer and API documentation, see [README.md](../README.md) and Swagger UI on the API server.
