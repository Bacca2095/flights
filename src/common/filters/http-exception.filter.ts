import {
  ArgumentsHost,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { IExceptionResponse } from './interface/exception-response.dto';

export class AllExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionFilter.name);
  catch(exception: any, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const request = context.getRequest();
    const response = context.getResponse();

    const {
      getStatus: status = HttpStatus.INTERNAL_SERVER_ERROR,
      getResponse: message = exception,
    } = exception;

    this.logger.error(`Status: ${status} Error: ${JSON.stringify(message)}`);

    const exceptionResponse: IExceptionResponse = {
      date: new Date().toISOString(),
      path: request.url,
      message,
    };
    response.status(status).json(exceptionResponse);
  }
}
