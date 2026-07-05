const FLOW_STORAGE_KEY = "auth_flow_state";
const HISTORY_STORAGE_KEY = "auth_route_history";

export const getFlowState = () => {
  try {
    return JSON.parse(sessionStorage.getItem(FLOW_STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
};

export const setFlowState = (updates = {}) => {
  const current = getFlowState();
  const nextState = {
    ...current,
    ...updates,
  };

  sessionStorage.setItem(FLOW_STORAGE_KEY, JSON.stringify(nextState));
  return nextState;
};

export const getNavigationHistory = () => {
  try {
    return JSON.parse(sessionStorage.getItem(HISTORY_STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
};

export const pushNavigationHistory = (pathname, options = {}) => {
  const { skipPaths = [] } = options;
  const shouldSkip = skipPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );

  if (shouldSkip) {
    return getNavigationHistory();
  }

  const history = getNavigationHistory();
  const lastRoute = history[history.length - 1];
  if (lastRoute === pathname) {
    return history;
  }

  const nextHistory = [...history, pathname];
  sessionStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(nextHistory));
  return nextHistory;
};

export const clearNavigationHistory = () => {
  sessionStorage.removeItem(HISTORY_STORAGE_KEY);
};

export const getPreviousRoute = (currentPath, options = {}) => {
  const { skipPaths = [] } = options;
  const history = getNavigationHistory();
  let index = history.length - 1;

  if (history[index] === currentPath) {
    index -= 1;
  }

  for (; index >= 0; index -= 1) {
    const route = history[index];
    const isSkipped = skipPaths.some(
      (path) => route === path || route.startsWith(`${path}/`),
    );

    if (!isSkipped && route !== currentPath) {
      return route;
    }
  }

  return null;
};

export const clearFlowState = () => {
  sessionStorage.removeItem(FLOW_STORAGE_KEY);
  clearNavigationHistory();
};

export const canAccessRoute = (pathname) => {
  const state = getFlowState();

  switch (pathname) {
    case "/profile-setup":
      return Boolean(state.createAccountCompleted);
    case "/verify-email":
      return Boolean(state.profileSetupCompleted);
    case "/verify-email-otp":
      return Boolean(state.verificationEmailRequested);
    case "/email-verification-success":
      return Boolean(state.emailVerified);
    case "/review-info":
      return (
        Boolean(state.profileSetupCompleted) &&
        Boolean(
          state.verificationSkipped ||
          state.verificationEmailRequested ||
          state.emailVerified,
        )
      );
    case "/registration-success":
      return Boolean(state.registrationCompleted);
    case "/verify-otp":
      return Boolean(state.forgotPasswordRequested);
    case "/reset-password":
      return Boolean(state.passwordResetOtpVerified);
    case "/reset-success":
      return Boolean(state.passwordResetSuccess);
    default:
      return true;
  }
};

export const getFallbackRoute = (pathname) => {
  switch (pathname) {
    case "/profile-setup":
      return "/create-account";
    case "/verify-email":
      return "/profile-setup";
    case "/verify-email-otp":
      return "/verify-email";
    case "/email-verification-success":
      return "/verify-email-otp";
    case "/review-info":
      return "/verify-email";
    case "/registration-success":
      return "/review-info";
    case "/verify-otp":
      return "/forgot-password";
    case "/reset-password":
      return "/verify-otp";
    case "/reset-success":
      return "/reset-password";
    default:
      return "/login";
  }
};
