import { Response } from "express";

class ApiResponse {
  status: number;
  message: string;
  data?: any;
  errors?: any;

  constructor({
    status = 200,
    message = "Success",
    data = undefined,
    errors = undefined,
  }: {
    status?: number;
    message?: string;
    data?: any;
    errors?: any;
  }) {
    this.status = status;
    this.message = message;
    if (data !== undefined) this.data = data;
    if (errors !== undefined) this.errors = errors;
  }

  send(res: Response): Response {
    return res.status(this.status).json(this);
  }
}

export default ApiResponse;
