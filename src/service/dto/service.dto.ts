import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import {
  IsEnum,
  IsNumber,
  IsDate,
  IsMongoId,
} from "class-validator";

export class CreateServiceDTO {
  @ApiProperty({ description: "Task description for the service request" })
  @IsString()
  taskDescription: string; // Task description field

  @ApiProperty({
    description: "Type of request (Single, Multi, or Team)",
    enum: ["Single", "Multi", "Team"],
    default: "Single",
  })
  @IsEnum(["Single", "Multi", "Team"])
  requestType: string; // Type of request (Single, Multi, or Team)

  @ApiProperty({ description: "Project for which the task is required" })
  @IsString()
  project: string; // Project for which the task is required

  @ApiProperty({ description: "Start date of the service request" })
  @IsDate()
  beginDate: Date; // Start date

  @ApiProperty({ description: "End date of the service request" })
  @IsDate()
  endDate: Date; // End date

  @ApiProperty({ description: "Total amount of man days" })
  @IsNumber()
  manDays: number; // Amount of man days (total)

  @ApiProperty({ description: "City/town for the location of the service" })
  @IsString()
  location: string; // City/town for the location

  @ApiProperty({ description: "Number of specialists required" })
  @IsNumber()
  @IsOptional()
  specialistsRequired: number; // Number of specialists required (default 1)

  @ApiProperty({ description: "Number of offers from each provider required" })
  @IsNumber()
  @IsOptional()
  offersRequired: number; // Number of offers from each provider wanted

  @ApiProperty({
    description: "First name of the consumer (service request creator)",
  })
  @IsString()
  consumerFirstName: string; // Consumer's first name

  @ApiProperty({
    description: "Last name of the consumer (service request creator)",
  })
  @IsString()
  consumerLastName: string; // Consumer's last name

  @ApiProperty({ description: "Optional contact for representatives" })
  @IsString()
  @IsOptional()
  representatives: string; // Optional representative contact

  @ApiProperty({
    description: "Master Agreement ID associated with the service request",
  })
  @IsMongoId()
  masterAgreementId: string; // Master agreement ID

  @ApiProperty({
    description: "Domain for the service request",
    enum: ["Consulting and Development", "Operations", "Data", "IT Security"],
  })
  @IsEnum(["Consulting and Development", "Operations", "Data", "IT Security"])
  domain: string; // Domain for the service request

  @ApiProperty({
    description: "Experience level required for the role",
    enum: ["Junior", "Senior", "Intermediate", "Principal"],
  })
  @IsEnum(["Junior", "Senior", "Intermediate", "Principal"])
  experienceLevel: string; // Experience level for the role

  @ApiProperty({ description: "Role required for the service request" })
  @IsString()
  role: string; // Role (e.g., Developer, Project Manager)

  @ApiProperty({
    description: "Technology expertise level (Common, Uncommon, Rare)",
    enum: ["Common", "Uncommon", "Rare"],
    default: "Common",
  })
  @IsEnum(["Common", "Uncommon", "Rare"])
  technologyLevel: string; // Technology expertise level

  @ApiProperty({ description: "Technology for the service request" })
  @IsString()
  technology: string; // Technology (e.g., Java, AWS, Python)

  @ApiProperty({
    description: "Location type for the service request",
    enum: ["Onshore", "Nearshore", "Farshore"],
  })
  @IsEnum(["Onshore", "Nearshore", "Farshore"])
  locationType: string; // Location type (Onshore, Nearshore, Farshore)

  @ApiProperty({
    description: "Document (PDF/Word) with further details for the request",
  })
  @IsString()
  @IsOptional()
  document: string; // Document (PDF/Word) with further descriptions
}