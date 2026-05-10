// Thin PostHog wrapper. No-ops when VITE_POSTHOG_KEY is unset, so dev/prod
// builds without the env var still run cleanly. Init is idempotent.

import posthog from 'posthog-js';

const KEY = import.meta.env.VITE_POSTHOG_KEY || '';
const HOST = import.meta.env.VITE_POSTHOG_HOST || 'https://us.i.posthog.com';

let initialized = false;

export function initAnalytics() {
  if (initialized || !KEY) return;
  posthog.init(KEY, {
    api_host: HOST,
    capture_pageview: true,
    capture_pageleave: true,
    person_profiles: 'identified_only',
    autocapture: false, // we instrument explicitly to keep events meaningful
  });
  initialized = true;
}

export function track(event, props = {}) {
  if (!initialized) return;
  posthog.capture(event, props);
}

export function isAnalyticsEnabled() {
  return initialized;
}
