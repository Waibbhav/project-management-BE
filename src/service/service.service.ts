import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import * as bcrypt from "bcrypt-nodejs";
import { CreateServiceDTO } from "./dto";
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
    private serviceRepo: ServiceRepository,
    private mailerService: MailerService,
    private utilsService: UtilsService
  ) {}

  async createService(body: CreateServiceDTO, files: any): Promise<any> {
    try {
      const saveService = await this.serviceRepo.save(body);
      if (saveService && saveService._id) {
        return {
          success: true,
          type: "success",
          data: saveService,
          message: "Service Request created successfully!",
          status:200
        };
      } else {
        return {
          success: false,
          type: "error",
          message: "Something went wrong",
          status:204
        };
      }
    } catch (error) {
      console.error(error);
      return { success: false, type: "error", message: error.message };
    }
  }
}
