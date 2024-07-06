import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { HistoryService } from './history.service';
import { UserGuard } from 'src/common/guards/user.guard';

@Controller('')
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @Get('logs')
  getAllLogs() {
    return this.historyService.getAllLogs();
  }

  @UseGuards(UserGuard)
  @Get('users/:userId/logs')
  getLogsByUser(@Param('userId') userId: string) {
    return this.historyService.getLogsByUser(userId);
  }
}
