import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { MongoError } from 'mongodb';
import { Error as MongooseError } from 'mongoose';
import { isObject } from '@nestjs/common/utils/shared.utils';

@Catch(MongoError, MongooseError.ValidationError)
export class MongoExceptionFilter implements ExceptionFilter {
  catch(
    exception: MongoError | MongooseError.ValidationError,
    host: ArgumentsHost,
  ) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Default error response
    const errorResponse = {
      statusCode: HttpStatus.BAD_REQUEST, // Default to 400 for validation errors
      timestamp: new Date().toISOString(),
      path: request.url,
      message: 'Database validation error',
      errors: [],
    };

    // Handle Mongoose ValidationError
    if (exception.name === 'ValidationError') {
      const validationError = exception as MongooseError.ValidationError;
      errorResponse.message = 'Validation failed';
      errorResponse.errors = this.formatValidationErrors(validationError);
      response.status(errorResponse.statusCode).json(errorResponse);
      return;
    }

    // Handle MongoDB errors (original logic)
    const mongoError = exception as MongoError;
    switch (mongoError.code) {
      case 11000:
        errorResponse.statusCode = HttpStatus.CONFLICT;
        errorResponse.message = 'Duplicate key error';
        if (isObject(mongoError['keyValue'])) {
          errorResponse.errors = [
            {
              field: Object.keys(mongoError['keyValue'])[0],
              message: `Value must be unique`,
            },
          ];
        }
        break;
      // ... other cases
    }

    response.status(errorResponse.statusCode).json(errorResponse);
  }

  private formatValidationErrors(
    validationError: MongooseError.ValidationError,
  ) {
    return Object.values(validationError.errors).map((err) => ({
      field: err.path,
      message: err.message,
      type: err.kind,
    }));
  }
}
