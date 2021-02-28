export const FormatRequest = (
	data,
	required = ['username', 'password'],
	optional = []
) => {
	const values = new Object(data);
	let fieldErrors = [];

	required.forEach(field => {
		if (!Object.keys(data).includes(field)) {
			let error = { path: '', message: '' };
			error.path = field;
			error.message = ` ${field} is required`;
			fieldErrors.push(error);
		} else {
			if (typeof data[field] === 'string' && !data[field]) {
				let error = { path: '', message: '' };
				error.path = field;
				error.message = `${field} is not allowed to be empty`;
				fieldErrors.push(error);
			}
			if (
				field == 'username' &&
				!new RegExp(/^[a-zA-Z]+/i).test(data['username'])
			) {
				let error = { path: '', message: '' };
				error.path = field;
				error.message = `${field} should start with a letter`;
				fieldErrors.push(error);
			}
			if (
				field == 'reciever' &&
				!new RegExp(/^[a-zA-Z]+/i).test(data['reciever'])
			) {
				let error = { path: '', message: '' };
				error.path = field;
				error.message = `${field} should start with a letter`;
				fieldErrors.push(error);
			}
		}
	});

	Object.keys(data).forEach(field => {
		if (!required.includes(field) && !optional.includes(field)) {
			let error = { path: '', message: '' };
			error.path = field;
			error.message = `This field  is not allowed to be a part of this request`;
			fieldErrors.push(error);
		}
	});
	if (fieldErrors.length)
		throw {
			message: 'Invalid request format',
			status: 400,
			errors: fieldErrors,
		};
	return values;
};
