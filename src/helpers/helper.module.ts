import { Module, Global } from '@nestjs/common';
import { AdminAuthFilter, API_AuthFilter, MailerService, UtilsService } from '.';

@Global()
@Module({
    imports: [],
    controllers: [],
    providers: [MailerService, UtilsService, AdminAuthFilter, API_AuthFilter],
    exports: [MailerService, UtilsService, AdminAuthFilter, API_AuthFilter],
})
export class HelperModule { }
