export const formatError = (error) => {
  switch (error.message) {
    case 'Invalid request format':
      return {
        code: 400,
        body: {
          message: 'Invalid request format',
          errors: error.errors,
        },
      };
  }

  return {
    code: 500,
    body: {
      message: 'Internal server error',
      errors: [],
    },
  };
};
