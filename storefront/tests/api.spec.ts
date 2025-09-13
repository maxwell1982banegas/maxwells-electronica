import { test, expect } from "@playwright/test";

test("/api/variants returns data", async ({ request }) => {
  const res = await request.get("/api/variants?first=3");
  expect(res.ok()).toBeTruthy();
  const json = await res.json();
  expect(Array.isArray(json.variants)).toBeTruthy();
  expect((json.variants || []).length).toBeGreaterThan(0);
});