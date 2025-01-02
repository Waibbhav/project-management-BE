import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { UnauthorizedException, NotFoundException } from '@nestjs/common';

// For Admin Panel
@Catch(UnauthorizedException)
export class AdminAuthFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const status = exception.getStatus();
        
        response.status(status).redirect('/');
    }
}

// For Webservices
@Catch(UnauthorizedException)
export class API_AuthFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const status = exception.getStatus();

        response.status(status).send({ status: status, data: null, message: "Unauthorised access request!" });
    }
}

@Catch(NotFoundException, Error)
export class EntityNotFoundExceptionFilter implements ExceptionFilter {
    public catch(exception: NotFoundException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception.getStatus();
        if (request.path.includes('api')) {
            return response.status(status).send({ status: status, error: 'Not Found', data: null, message: exception.message })
        }
        return response.status(status).render("error/404.ejs", {
            page_name: 'error-management',
            page_title: 'Error 404 - Page Not Found',
        });
    }
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const status = exception.getStatus();

        response
            .status(status)
            .json({
                status: status,
                data: null,
                message: exception.message,
            });
    }
}