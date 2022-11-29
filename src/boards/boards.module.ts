import { Module } from '@nestjs/common';
import { BoardsController } from './boards.controller';
import { BoardsService } from './boards.service';
// import { CreateUserDto } from './dto/create-user.dto';

@Module({
  // imports: [CreateUserDto[]],
  controllers: [BoardsController],
  providers: [BoardsService],
})
export class BoardsModule {}
