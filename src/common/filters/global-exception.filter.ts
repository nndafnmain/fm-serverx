// src/common/filters/global-exception.filter.ts
import {
	ExceptionFilter,
	Catch,
	ArgumentsHost,
	HttpException,
	HttpStatus,
} from "@nestjs/common";
import { Response } from "express";
import { Prisma } from "@prisma/client";
import { ValidationError } from "class-validator";

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
	catch(exception: unknown, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();

		let status = HttpStatus.INTERNAL_SERVER_ERROR;
		let message = "Internal server error";
		let error = "Internal Server Error";

		// Handle Prisma Errors
		if (exception instanceof Prisma.PrismaClientKnownRequestError) {
			switch (exception.code) {
				case "P2002":
					status = HttpStatus.CONFLICT;
					message = "Unique constraint violation";
					error = "Duplicate Entry";
					break;
				case "P2025":
					status = HttpStatus.NOT_FOUND;
					message = "Record not found";
					error = "Not Found";
					break;
				case "P2003":
					status = HttpStatus.BAD_REQUEST;
					message = "Foreign key constraint failed";
					error = "Invalid Reference";
					break;
				default:
					status = HttpStatus.BAD_REQUEST;
					message = "Database error";
					error = "Database Error";
			}
		}
		// Handle Class Validator Errors
		// biome-ignore lint/suspicious/useIsArray: <explanation>
		else if (
			// biome-ignore lint/suspicious/useIsArray: <explanation>
			exception instanceof Array &&
			exception[0] instanceof ValidationError
		) {
			status = HttpStatus.BAD_REQUEST;
			const validationErrors = exception as ValidationError[];
			message = this.formatValidationErrors(validationErrors);
			error = "Validation Error";
		}
		// Handle HTTP Exceptions
		else if (exception instanceof HttpException) {
			status = exception.getStatus();
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			const response = exception.getResponse() as any;
			message = response.message || exception.message;
			error = response.error || "HTTP Exception";
		}

		response.status(status).json({
			statusCode: status,
			timestamp: new Date().toISOString(),
			path: ctx.getRequest().url,
			error,
			message,
		});
	}

	private formatValidationErrors(errors: ValidationError[]): string {
		const messages = [];
		for (const error of errors) {
			if (error.constraints) {
				messages.push(...Object.values(error.constraints));
			}
			if (error.children?.length) {
				messages.push(this.formatValidationErrors(error.children));
			}
		}
		return messages.join(", ");
	}
}
