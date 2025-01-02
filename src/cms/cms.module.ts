import { Module } from '@nestjs/common';
import { CmsController } from './cms.controller';
import { CmsService } from './cms.service';
import { CmsApiController } from './cmsapi.controller';

@Module({
    imports: [],
    controllers: [CmsController, CmsApiController],
    providers: [CmsService],
    exports: [CmsService]
})
export class CmsModule {}
