function extractValidationErrors(errorResponse: any): string[] {
	const errorMessages = errorResponse.map((error: any) => {
		if (error.constraints) {
			return Object.values(error.constraints);
		} else if (error.children && error.children.length) {
			return extractValidationErrors(error.children);
		}
	});
	return errorMessages.flat();
}

export default extractValidationErrors;
