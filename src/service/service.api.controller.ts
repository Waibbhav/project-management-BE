import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  ForbiddenException,
} from "@nestjs/common";
import {
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common/decorators";
import { UseFilters } from "@nestjs/common/decorators/core/exception-filters.decorator";
import { AuthGuard } from "@nestjs/passport";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { ApiConsumes, ApiExcludeController } from "@nestjs/swagger";
import { Response, Request } from "express";
import { existsSync, mkdirSync } from "fs";
import { diskStorage } from "multer";

import { AdminAuthFilter } from "src/helpers";
import {
  CreateServiceDTO,
} from "./dto";
import { ServiceRepository } from "./repositories";
import { ServiceService } from "./service.service";

const fileFieldsInterceptor = FileFieldsInterceptor(
  [{ name: "document", maxCount: 1 }],
  {
    storage: diskStorage({
      destination(req, file, callback) {
        if (!existsSync("./public/uploads/user")) {
          mkdirSync("./public/uploads/user");
        }
        callback(null, "./public/uploads/user");
      },
      filename(req, file, callback) {
        callback(
          null,
          Date.now() + "_" + file.originalname.replace(/\s/g, "_")
        );
      },
    }),
  }
);

@Controller()
export class ServiceApiController {
  constructor(
    private serviceService: ServiceService,
    private serviceRepo: ServiceRepository
  ) {}

  @ApiConsumes("multipart/form-data")
  @Post("service/create")
  @UseInterceptors(fileFieldsInterceptor)
  async createService(
    @Body() dto: CreateServiceDTO,
    @Req() req: Request,
    @Res() res: Response
  ) {
    try {
      const result = await this.serviceService.createService(dto, req.body.files);
      if (result.success) {
        res.status(200).json({
          status: result.status,
          data: result.data,
          message: result.message,
        });
      } else {
        res.status(500).json({
          status: 500,
          data: result.data,
          message: result.message,
        });
      }
    } catch (error) {
      res.status(500).json({ status: 500, data: [], message: error.message });
    }
  }
}
