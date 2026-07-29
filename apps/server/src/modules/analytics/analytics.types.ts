export type AnalyticsDayDto = {
  date: string;
  views: number;
  visitors: number;
};

export type AnalyticsTopPageDto = {
  path: string;
  views: number;
  visitors: number;
};

export type AnalyticsDto = {
  visitorsToday: number;
  visitors7d: number;
  totalVisitors: number;
  pageViews7d: number;
  enquiries7d: number;
  totalEnquiries: number;
  totalProjects: number;
  conversionRate: number;
  viewsByDay: AnalyticsDayDto[];
  topPages: AnalyticsTopPageDto[];
};
