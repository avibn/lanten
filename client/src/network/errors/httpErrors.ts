/**
 * Represents an HTTP error.
 */
export class HttpError extends Error {
    /**
     * Constructs a new instance of the HttpError class.
     * @param message - Optional error message.
     */
    constructor(message?: string) {
        super(message);
        this.name = this.constructor.name;
    }
}

/**
 * Status code: 400
 */
export class BadRequestError extends HttpError {}

/**
 * Status code: 401
 */
export class UnauthorizedError extends HttpError {}

/**
 * Status code: 403
 */
export class ForbiddenError extends HttpError {}

/**
 * Status code: 404
 */
export class NotFoundError extends HttpError {}

/**
 * Status code: 409
 */
export class ConflictError extends HttpError {}

// Map HTTP status code to error class
export const statusCodeErrorMap: {
    [key: number]: new (message?: string) => HttpError;
} = {
    400: BadRequestError,
    401: UnauthorizedError,
    403: ForbiddenError,
    404: NotFoundError,
    409: ConflictError,
};
