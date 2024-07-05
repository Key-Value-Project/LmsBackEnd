class HttpException extends Error {
    public status: number;
    public errors: {};

	constructor(status: number, message: string, errors?: {}) {
		super(message);
        this.status = status;
        this.errors = errors;
	}
}

export default HttpException;
