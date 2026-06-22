export const transformBackendPayload = (response) => {
  if (!response) return null;
  if (response.data) return response.data;
  if (response.results) return response.results;
  return response;
};

export const prepareDefaultsPayload = (formData) => ({
  validation_mode: formData.validation_mode,
  allowed_methods: formData.allowed_methods,
  allowed_locations: formData.allowed_locations,
  is_active: formData.is_active
});