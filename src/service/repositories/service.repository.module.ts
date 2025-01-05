import { Global, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Service, ServiceSchema } from "../schemas/service.schema";
import { ServiceRepository } from ".";

@Global()
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
  controllers: [],
  providers: [ServiceRepository],
  exports: [ServiceRepository],
})
export class ServiceRepositoryModule {}
