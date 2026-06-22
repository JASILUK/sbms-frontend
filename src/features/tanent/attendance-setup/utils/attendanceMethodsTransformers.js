export const transformMethodsApiResponse = (response) => {
  if (!response) return [];
  if (response.data && Array.isArray(response.data)) return response.data;
  if (Array.isArray(response)) return response;
  return [];
};