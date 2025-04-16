
// Simple utility functions to get formatted dates

export const getGregorianDate = (): string => {
  const now = new Date();
  return now.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const getHijriDate = (): string => {
  // In a real app, this would use a proper Hijri calendar library
  // For this demo, we'll return a mock Hijri date
  return "Shawwal 15, 1446 AH";
};

export const getCurrentTime = (): string => {
  const now = new Date();
  return now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};
