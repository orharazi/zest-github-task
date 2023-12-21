export type status = "idle" | "loading" | "succeeded" | "failed";

export const tabTitlesArr = ["repositories", "favorites"] as const;
export type tabTitles = (typeof tabTitlesArr)[number];
