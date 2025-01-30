class ApiError extends Error {
  status: number;
  data: any;
  errors: { message?: string }[] | null;

  constructor({
    status = 500,
    message = "Something went wrong",
    data = null,
    errors = null,
  }: {
    status?: number;
    message?: string;
    data?: any;
    errors?: { message: string }[] | null;
  }) {
    super(message);
    this.status = status;
    this.data = data;
    this.errors = errors;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default ApiError;
