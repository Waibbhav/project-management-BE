import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
export class SigninDTO {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class SignupDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  last_name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  companyName: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ type: "string", format: "binary" })
  @IsOptional()
  profile_image: any;
}

export class ForgetPwdDTO {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class ChangePwdDTO {
  @IsString()
  @IsNotEmpty()
  new_password: string;

  @IsString()
  @IsNotEmpty()
  confirm_password: string;

  @IsString()
  @IsNotEmpty()
  id: string;
}

export class AdminAccountDTO {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  first_name: string;

  @IsString()
  @IsNotEmpty()
  last_name: string;

  @IsString()
  @IsNotEmpty()
  id: string;
}

export class AdminChangePasswordDTO {
  @IsString()
  @IsNotEmpty()
  old_password: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  "confirm-new-password": string;

  @IsString()
  @IsNotEmpty()
  id: string;
}

export class UserCreateFromAdminDTO {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  phone: string;

  @IsString()
  countryCode: string;

  @IsString()
  business_type: string;

  id: string;
}
