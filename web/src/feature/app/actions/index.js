// States
export const ACTIVE = 'active';
export const LOADING = 'loading';
export const SUSPENDED = 'suspended';

// Actions
export const APP_LAUNCH = 'APP_LAUNCH';
export const APP_RESUME = 'APP_RESUME';
export const APP_SUSPEND = 'APP_SUSPEND';

// Action Creators
export function launchApp(params) {
  return { type: APP_LAUNCH, params };
}

export function suspendApp() {
  return { type: APP_SUSPEND };
}

export function resumeApp() {
  return { type: APP_RESUME };
}
