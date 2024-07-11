class ApiError extends Error {
    status: number;
    message: string;

    constructor(status: number, message: string) {
        super();
        this.status = status;
        this.message = message;
    }

    static badRequest(msg: string): ApiError {
        return new ApiError(400, msg);
    }

    static internal(msg: string): ApiError {
        return new ApiError(500, msg);
    }
}

export default ApiError;