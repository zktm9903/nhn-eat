import { Module } from '@nestjs/common';
import { BatchTaskService } from './batch-task.service';
import { CrawlingService } from 'src/crawling/crawling.service';
import { MenuService } from 'src/menus/menu.service';

@Module({
  providers: [BatchTaskService, CrawlingService, MenuService],
})
export class BatchTaskModule {}
