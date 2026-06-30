import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { contract } from "@Veershree-portfolio/api/index";

const __dirname = dirname(fileURLToPath(import.meta.url));
const BRUNO_DIR = join(__dirname, "..", "bruno");

type ContractKey = keyof typeof contract;

type EndpointMeta = {
  name: string;
  folder: string;
  seq: number;
  admin: boolean;
  sampleBody?: Record<string, unknown>;
  pathParams?: Record<string, string>;
};

const ENDPOINT_META: Record<ContractKey, EndpointMeta> = {
  healthCheck: { name: "Health Check", folder: "Health", seq: 1, admin: false },
  listProjects: { name: "List Projects", folder: "Projects", seq: 1, admin: false },
  getProject: {
    name: "Get Project",
    folder: "Projects",
    seq: 2,
    admin: false,
    pathParams: { slug: "{{projectSlug}}" },
  },
  createProject: {
    name: "Create Project",
    folder: "Projects",
    seq: 3,
    admin: true,
    sampleBody: {
      slug: "green-valley-estate",
      name: "Green Valley Estate",
      location: "Pune, Maharashtra",
      tagline: "Premium living surrounded by nature",
      description: "A thoughtfully planned residential community with modern amenities.",
      features: ["Clubhouse", "Swimming Pool", "24/7 Security"],
      image: "/assets/project-1.jpg",
      priceFrom: "45 Lakhs",
      size: "1200 sq.ft",
      status: "Open",
    },
  },
  updateProject: {
    name: "Update Project",
    folder: "Projects",
    seq: 4,
    admin: true,
    pathParams: { slug: "{{projectSlug}}" },
    sampleBody: {
      name: "Green Valley Estate",
      location: "Pune, Maharashtra",
      tagline: "Updated tagline",
      status: "Few Left",
    },
  },
  deleteProject: {
    name: "Delete Project",
    folder: "Projects",
    seq: 5,
    admin: true,
    pathParams: { slug: "{{projectSlug}}" },
  },
  listLeads: { name: "List Leads", folder: "Leads", seq: 1, admin: true },
  createLead: {
    name: "Create Lead",
    folder: "Leads",
    seq: 2,
    admin: false,
    sampleBody: {
      name: "John Doe",
      mobile: "9876543210",
      location: "Pune",
      message: "Interested in Green Valley Estate",
    },
  },
  deleteLead: {
    name: "Delete Lead",
    folder: "Leads",
    seq: 3,
    admin: true,
    pathParams: { id: "{{leadId}}" },
  },
  getDashboard: { name: "Get Dashboard", folder: "Admin", seq: 1, admin: true },
  login: {
    name: "Login",
    folder: "Auth",
    seq: 1,
    admin: false,
    sampleBody: { username: "admin", password: "Veershree@123" },
  },
};

const FOLDER_SEQ: Record<string, number> = {
  Health: 1,
  Projects: 2,
  Leads: 3,
  Admin: 4,
  Auth: 5,
};

function writeFile(relativePath: string, content: string) {
  const fullPath = join(BRUNO_DIR, relativePath);
  mkdirSync(dirname(fullPath), { recursive: true });
  writeFileSync(fullPath, content, "utf8");
}

function renderPathParams(params?: Record<string, string>): string {
  if (!params) return "";
  const lines = Object.entries(params)
    .map(([key, value]) => `  ${key}: ${value}`)
    .join("\n");
  return `\n\nparams:path {\n${lines}\n}`;
}

function renderAdminHeaders(admin: boolean): string {
  if (!admin) return "";
  return `\n\nheaders {\n  Authorization: Bearer {{adminToken}}\n}`;
}

function renderBody(method: string, sampleBody?: Record<string, unknown>): string {
  if (!sampleBody || method === "GET" || method === "DELETE") {
    return "  body: none\n  auth: none";
  }
  const json = JSON.stringify(sampleBody, null, 2)
    .split("\n")
    .map((line) => `  ${line}`)
    .join("\n");
  return `  body: json\n  auth: none\n}\n\nbody:json {\n${json}\n}`;
}

function renderRequest(key: ContractKey): string {
  const route = contract[key];
  const meta = ENDPOINT_META[key];
  const method = route.method.toLowerCase();

  const bodyBlock =
    method === "get" || method === "delete"
      ? `  body: none\n  auth: none`
      : renderBody(route.method, meta.sampleBody);

  const methodBlock =
    method === "get" || method === "delete"
      ? `${method} {\n  url: {{baseUrl}}${route.path}\n${bodyBlock}\n}`
      : `${method} {\n  url: {{baseUrl}}${route.path}\n${bodyBlock}`;

  return `meta {
  name: ${meta.name}
  type: http
  seq: ${meta.seq}
}

${methodBlock}${renderPathParams(meta.pathParams)}${renderAdminHeaders(meta.admin)}
`;
}

function generateCollection() {
  writeFile(
    "bruno.json",
    `${JSON.stringify(
      {
        version: "1",
        name: "Veershree Portfolio API",
        type: "collection",
        ignore: ["node_modules", ".git"],
      },
      null,
      2,
    )}\n`,
  );

  writeFile(
    "collection.bru",
    `meta {
  name: Veershree Portfolio API
}

docs {
  NestJS REST API collection for Veershree Portfolio.
  Base path: /rest on port 3000.
  Regenerate with: pnpm bruno:generate
}
`,
  );

  writeFile(
    "environments/Local.bru",
    `vars {
  baseUrl: http://localhost:3000/rest
  adminToken: your-admin-token-here
  projectSlug: green-valley-estate
  leadId: replace-with-lead-id
}
`,
  );

  for (const folder of Object.keys(FOLDER_SEQ)) {
    writeFile(
      `${folder}/folder.bru`,
      `meta {
  name: ${folder}
  seq: ${FOLDER_SEQ[folder]}
}
`,
    );
  }

  for (const key of Object.keys(contract) as ContractKey[]) {
    const meta = ENDPOINT_META[key];
    writeFile(`${meta.folder}/${meta.name}.bru`, renderRequest(key));
  }

  console.log(`Generated Bruno collection at ${BRUNO_DIR}`);
  console.log(`Endpoints: ${Object.keys(contract).length}`);
}

generateCollection();
