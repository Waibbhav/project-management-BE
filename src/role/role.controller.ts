import { Controller } from '@nestjs/common';
import { RoleService } from './role.service';

@Controller()
export class RoleController {
  constructor(private roleService: RoleService) {
    // this.roleService.getAllByField({ isDeleted: false }).then((val) => {
    //   console.log(val);
    // });
  }
}
