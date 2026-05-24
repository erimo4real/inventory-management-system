export const formatResponse = (data, message = null) => {
  const response = { success: true };
  if (message) response.message = message;
  if (data !== undefined) response.data = data;
  return response;
};

export const formatError = (message, code = 'ERROR') => {
  return {
    success: false,
    error: { message, code }
  };
};

export const paginate = (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  return { skip, limit: parseInt(limit) };
};

export const formatDate = (date) => {
  return new Date(date).toISOString();
};

export const parseBoolean = (value) => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    return value.toLowerCase() === 'true';
  }
  return false;
};
