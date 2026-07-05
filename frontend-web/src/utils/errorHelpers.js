export const getBackendErrorMessage = (
  error,
  fallback = "Something went wrong. Please try again.",
) => {
  const responseData = error?.response?.data;
  if (!responseData) {
    return fallback;
  }

  if (typeof responseData === "string") {
    return responseData;
  }

  if (Array.isArray(responseData)) {
    return responseData.filter(Boolean).join(" ") || fallback;
  }

  const getMessage = (message) => {
    if (!message) return null;
    if (typeof message === "string") return message;
    if (Array.isArray(message)) return message.filter(Boolean).join(" ");
    return null;
  };

  const candidates = [
    responseData.detail,
    responseData.message,
    responseData.error,
    responseData.non_field_errors,
  ];

  for (const candidate of candidates) {
    const message = getMessage(candidate);
    if (message) return message;
  }

  const firstValue = Object.values(responseData).find((value) => value != null);
  const firstMessage = getMessage(firstValue);
  if (firstMessage) return firstMessage;

  return fallback;
};
