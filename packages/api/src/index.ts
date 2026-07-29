import { initContract } from "@ts-rest/core";
import { z } from "zod";

const c = initContract();

const projectStatus = z.union([z.literal("Open"), z.literal("Few Left"), z.literal("Sold Out")]);

const project = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  location: z.string(),
  tagline: z.string(),
  description: z.string(),
  features: z.array(z.string()),
  image: z.string(),
  priceFrom: z.string(),
  size: z.string(),
  status: projectStatus,
  createdAt: z.string(),
  updatedAt: z.string(),
});

const upsertProject = z.object({
  slug: z.string().optional(),
  name: z.string().trim().min(1).max(200),
  location: z.string().trim().min(1).max(200),
  tagline: z.string().optional(),
  description: z.string().optional(),
  features: z.array(z.string()).optional(),
  image: z.string().optional(),
  priceFrom: z.string().optional(),
  size: z.string().optional(),
  status: projectStatus.optional(),
});

const enquiry = z.object({
  id: z.string(),
  name: z.string(),
  mobile: z.string(),
  location: z.string(),
  message: z.string(),
  createdAt: z.string(),
});

const createEnquiry = z.object({
  name: z.string().optional(),
  mobile: z.string().trim().min(1).max(32),
  location: z.string().optional(),
  message: z.string().optional(),
});

const dashboard = z.object({
  totalProjects: z.number().int().nonnegative(),
  totalEnquiries: z.number().int().nonnegative(),
  visitors7d: z.number().int().nonnegative(),
  conversionRate: z.number().nonnegative(),
  recentProjects: z.array(project),
});

const trackPageView = z.object({
  path: z.string().trim().min(1).max(500),
  visitorId: z.string().trim().min(1).max(128),
  referrer: z.string().max(1000).optional(),
});

const analyticsDay = z.object({
  date: z.string(),
  views: z.number().int().nonnegative(),
  visitors: z.number().int().nonnegative(),
});

const analyticsTopPage = z.object({
  path: z.string(),
  views: z.number().int().nonnegative(),
  visitors: z.number().int().nonnegative(),
});

const analytics = z.object({
  visitorsToday: z.number().int().nonnegative(),
  visitors7d: z.number().int().nonnegative(),
  totalVisitors: z.number().int().nonnegative(),
  pageViews7d: z.number().int().nonnegative(),
  enquiries7d: z.number().int().nonnegative(),
  totalEnquiries: z.number().int().nonnegative(),
  totalProjects: z.number().int().nonnegative(),
  conversionRate: z.number().nonnegative(),
  viewsByDay: z.array(analyticsDay),
  topPages: z.array(analyticsTopPage),
});

const authUser = z.object({
  id: z.string(),
  username: z.string(),
});

const loginBody = z.object({
  username: z.string().trim().min(1),
  password: z.string().min(1),
});

const loginResponse = z.object({
  token: z.string(),
  user: authUser,
});

export const contract = c.router({
  healthCheck: {
    method: "GET",
    path: "/health",
    responses: {
      200: z.literal("OK"),
    },
  },
  getDashboard: {
    method: "GET",
    path: "/admin/dashboard",
    responses: {
      200: dashboard,
    },
  },
  getAnalytics: {
    method: "GET",
    path: "/admin/analytics",
    responses: {
      200: analytics,
    },
  },
  trackPageView: {
    method: "POST",
    path: "/analytics/pageview",
    body: trackPageView,
    responses: {
      200: z.object({ ok: z.literal(true) }),
    },
  },
  listProjects: {
    method: "GET",
    path: "/projects",
    responses: {
      200: z.array(project),
    },
  },
  getProject: {
    method: "GET",
    path: "/projects/:slug",
    responses: {
      200: project,
      404: z.object({ message: z.string() }),
    },
  },
  createProject: {
    method: "POST",
    path: "/projects",
    body: upsertProject,
    responses: {
      200: project,
    },
  },
  updateProject: {
    method: "PUT",
    path: "/projects/:slug",
    body: upsertProject,
    responses: {
      200: project,
      404: z.object({ message: z.string() }),
    },
  },
  deleteProject: {
    method: "DELETE",
    path: "/projects/:slug",
    responses: {
      200: z.object({ ok: z.literal(true) }),
      404: z.object({ message: z.string() }),
    },
  },
  listLeads: {
    method: "GET",
    path: "/leads",
    responses: {
      200: z.array(enquiry),
    },
  },
  createLead: {
    method: "POST",
    path: "/leads",
    body: createEnquiry,
    responses: {
      200: enquiry,
    },
  },
  deleteLead: {
    method: "DELETE",
    path: "/leads/:id",
    responses: {
      200: z.object({ ok: z.literal(true) }),
      404: z.object({ message: z.string() }),
    },
  },
  login: {
    method: "POST",
    path: "/auth/login",
    body: loginBody,
    responses: {
      200: loginResponse,
      401: z.object({ message: z.string() }),
    },
  },
});

export type AppContract = typeof contract;

export type ProjectStatus = z.infer<typeof projectStatus>;
export type Project = z.infer<typeof project>;
export type UpsertProject = z.infer<typeof upsertProject>;
export type Enquiry = z.infer<typeof enquiry>;
export type CreateEnquiry = z.infer<typeof createEnquiry>;
export type Dashboard = z.infer<typeof dashboard>;
export type TrackPageView = z.infer<typeof trackPageView>;
export type Analytics = z.infer<typeof analytics>;
export type AnalyticsDay = z.infer<typeof analyticsDay>;
export type AnalyticsTopPage = z.infer<typeof analyticsTopPage>;
export type AuthUser = z.infer<typeof authUser>;
export type LoginBody = z.infer<typeof loginBody>;
export type LoginResponse = z.infer<typeof loginResponse>;
