import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  Logger,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { MyLogger } from '../interface/my-logger';

@Catch()
export class HttpErrorFilter implements ExceptionFilter {

  catch(exception: HttpException, host: ArgumentsHost) {
    const loggerContextName = this.constructor.name;
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const { url, method } = ctx.getRequest() ? ctx.getRequest() : { url: 'N/A', method: 'N/A' };
    const status = exception.getStatus
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorResponse = {
      code: status,
      timestamp: new Date().toISOString(),
      method,
      url,
      message: exception.message.error || exception.message || 'Internal server error',
    };

    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      Logger.error(
        `${method} ${url}`,
        exception.stack,
        loggerContextName,
        true,
      );
    } else {
      Logger.error(
        `${method} ${url}`,
        JSON.stringify(errorResponse),
        loggerContextName,
        true,
      );
    }

    /**
     * For GRAPHQL calls, response.status doesn't exists
     * and the exception returned by service is directly
     * returned as a result
     */
    if (response && response.status) {
      /**
       * response will always be returned from this line in case,
       * any where exception is occured and call is a REST call
       */
      response.status(status).json(errorResponse);
    }
  }
}
