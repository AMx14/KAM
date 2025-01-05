class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ValidationError';
        this.status = 400;
    }
}

class AuthorizationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'AuthorizationError';
        this.status = 403;
    }
}

class ResourceNotFoundError extends Error {
    constructor(resource) {
        super(`${resource} not found`);
        this.name = 'ResourceNotFoundError';
        this.status = 404;
    }
}

class DuplicateResourceError extends Error {
    constructor(message) {
        super(message);
        this.name = 'DuplicateResourceError';
        this.status = 409;
    }
}

module.exports = {
    ValidationError,
    AuthorizationError,
    ResourceNotFoundError,
    DuplicateResourceError
}; 