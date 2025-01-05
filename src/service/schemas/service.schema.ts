import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose";
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate-v2");

export type ServiceDocument = mongoose.HydratedDocument<Service>;

@Schema({ timestamps: true, versionKey: false })
export class Service {
  // Service request specific fields
  @Prop({ type: String, required: true })
  taskDescription: string; // Task description field

  @Prop({
    type: String,
    enum: ["Single", "Multi", "Team"],
    default: "Single",
  })
  requestType: string; // Type of request (Single, Multi, or Team)

  @Prop({ type: String, required: true })
  project: string; // Project for which the task is required

  @Prop({ type: Date, required: true })
  beginDate: Date; // Start date

  @Prop({ type: Date, required: true })
  endDate: Date; // End date

  @Prop({ type: Number, required: true })
  manDays: number; // Amount of man days (total)

  @Prop({ type: String, required: true })
  location: string; // City/town for the location

  // Provider manager information
  @Prop({ type: Number, default: 1 })
  specialistsRequired: number; // Number of specialists required (max 1)

  @Prop({ type: Number, default: 1 })
  offersRequired: number; // Number of offers from each provider wanted

  @Prop({ type: String, required: true })
  consumerFirstName: string; // Consumer's first name

  @Prop({ type: String, required: true })
  consumerLastName: string; // Consumer's last name

  @Prop({ type: String, default: "" })
  representatives: string; // Optional representative contact

  // Master Agreement and Role-specific details
  @Prop({ type: mongoose.Types.ObjectId, required: true })
  masterAgreementId: mongoose.Types.ObjectId; // Master agreement ID

  @Prop({
    type: String,
    enum: ["Consulting and Development", "Operations", "Data", "IT Security"],
    required: true,
  })
  domain: string; // Domain for the service request

  @Prop({
    type: String,
    enum: ["Junior", "Senior", "Intermediate", "Principal"],
    required: true,
  })
  experienceLevel: string; // Experience level for the role

  @Prop({ type: String, required: true })
  role: string; // Role (e.g., Developer, Project Manager)

  @Prop({ type: String, default: "Common" })
  technologyLevel: string; // Technology expertise level (Common, Uncommon, Rare)

  @Prop({ type: String, required: true })
  technology: string; // Technology (e.g., Java, AWS, Python)

  @Prop({ type: String, required: true })
  locationType: string; // Location type (Onshore, Nearshore, Farshore)

  @Prop({ type: String, default: "" })
  document: string; // Document (PDF/Word) with further descriptions
}

export const ServiceSchema = SchemaFactory.createForClass(Service);
ServiceSchema.plugin(mongooseAggregatePaginate);
