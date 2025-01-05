import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import * as bcrypt from "bcrypt-nodejs";
import {
  AdminAccountDTO,
  AdminChangePasswordDTO,
} from "./dto";
import { ServiceRepository } from "./repositories";
import * as _ from "underscore";
import * as jwt from "jsonwebtoken";
import { existsSync, unlinkSync } from "fs";
import { Request } from "express";
const mongoose = require("mongoose");
import * as OTP from "otp-generator";
import { MailerService, UtilsService } from "src/helpers";
import * as moment from "moment";

@Injectable()
export class ServiceService {
  constructor(
    private userRepo: ServiceRepository,
    private mailerService: MailerService,
    private utilsService: UtilsService
  ) {}

}
