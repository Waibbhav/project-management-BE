import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Service, ServiceSchema } from "src/service/schemas/service.schema";
import { ServiceController } from "./service.controller";
import { ServiceService } from "./service.service";
import { ServiceApiController } from "./service.api.controller";

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Service.name,
        useFactory: () => {
          const schema = ServiceSchema;
          return schema;
        },
      },
    ]),
  ],
  controllers: [ServiceController, ServiceApiController],
  providers: [ServiceService],
  exports: [ServiceService],
})
export class ServiceModule {}
