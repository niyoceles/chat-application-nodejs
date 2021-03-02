export const formatError = error => {
	switch (error.message) {
		case 'Invalid request format':
			return {
				code: 400,
				body: { message: 'Invalid request format', errors: error.errors },
			};
		case 'not authenticated':
			return {
				code: 401,
				body: { message: 'Please, Authentication is required!' },
			};
		case 'no sent message to yourself':
			return {
				code: 401,
				body: { message: 'Sorry, you can not send a message to yourself' },
			};
		case 'password not match':
			return {
				code: 401,
				body: { error: 'Sorry, your username or password is incorrect' },
			};
		case 'user not found':
			return { code: 404, body: { error: 'user not found!' } };
		case 'receiver not found':
			return { code: 404, body: { error: 'receiver not found!' } };
		case 'no messages found':
			return { code: 404, body: { error: 'You have no message!' } };
	}

	switch (error.code) {
		case '23505':
			const field = error.detail.split(/[\W]+/i);
			return {
				code: 409,
				body: {
					message: `Sorry, this ${field[1]} already exists`,
					errors: [{ path: field[1] }],
				},
			};
	}

	return { code: 500, body: { message: 'Internal server error', errors: [] } };
};
