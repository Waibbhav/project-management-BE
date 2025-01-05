import * as mongoose from "mongoose";
export type ServiceDocument = mongoose.HydratedDocument<Service>;
export declare class Service {
    taskDescription: string;
    requestType: string;
    project: string;
    beginDate: Date;
    endDate: Date;
    manDays: number;
    location: string;
    specialistsRequired: number;
    offersRequired: number;
    consumerFirstName: string;
    consumerLastName: string;
    representatives: string;
    masterAgreementId: mongoose.Types.ObjectId;
    domain: string;
    experienceLevel: string;
    role: string;
    technologyLevel: string;
    technology: string;
    locationType: string;
    document: string;
}
export declare const ServiceSchema: mongoose.Schema<Service, mongoose.Model<Service, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Service>;
