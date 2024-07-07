import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { HistoryService } from './history.service';
import { UserGuard } from 'src/common/guards/user.guard';
import { Role } from 'src/common/decorators/roles.decorator';
import { Roles } from 'src/users/entities/user.entity';

@Controller('')
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @Role(Roles.ADMIN)
  @Get('logs')
  getAllLogs() {
    return this.historyService.getAllLogs();
  }

  @UseGuards(UserGuard)
  @Role(Roles.CUSTOMER)
  @Get('users/:userId/logs')
  getLogsByUser(@Param('userId') userId: string) {
    return this.historyService.getLogsByUser(userId);
  }
}
