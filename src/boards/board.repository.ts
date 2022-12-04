import { CustomRepository } from 'src/db/typeorm-ex.decorator';
import { Repository } from 'typeorm';
import { BoardStatus } from './board-status.enum';
import { Board } from './board.entity';
import { CreateBoardDto } from './dto/create-board.dto';
import { User } from 'src/auth/entities/user.entity';

@CustomRepository(Board)
export class BoardRepository extends Repository<Board> {
  async createBoard(
    createBoardDto: CreateBoardDto,
    user: User,
  ): Promise<Board> {
    const board = await this.save({
      ...createBoardDto,
      status: BoardStatus.PUBLIC,
      user,
    });
    return board;
  }
}
