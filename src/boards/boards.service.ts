import { Injectable, NotFoundException } from '@nestjs/common';
import { BoardStatus } from './board-status.enum';
import { CreateBoardDto } from './dto/create-board.dto';
import { BoardRepository } from './board.repository';
import { Board } from './board.entity';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class BoardsService {
  constructor(private readonly boardRepository: BoardRepository) {}

  async createBoard(
    createBoardDto: CreateBoardDto,
    user: User,
  ): Promise<Board> {
    const board = await this.boardRepository.createBoard(createBoardDto, user);

    return board;
  }

  async getAllBoards(user: User): Promise<Board[]> {
    // return this.boardRepository.find(); //{ order: { id: 'DESC' } }
    return this.boardRepository
      .createQueryBuilder('board')
      .where('board.userId = :userId', { userId: user.id })
      .getMany();
  }

  async getBoardById(id: number): Promise<Board> {
    const found = await this.boardRepository.findOne({ where: { id } });
    if (!found) throw new NotFoundException(`${id} 게시물을 찾을 수 없습니다 `);
    return found;
  }

  async updateBoardStatus(id: number, status: BoardStatus): Promise<Board> {
    const board = await this.getBoardById(id);
    board.status = status;
    await this.boardRepository.save(board);
    return board;
  }

  async deleteBoard(id: number, user: User): Promise<boolean> {
    // this.boards = this.boardRepository.filter((board) => board.id !== found.id);
    // .indexof() & .splice(index, 1) 두개 연합해서 지우는거랑 차이는 ?
    const isDeleted = await this.boardRepository.delete({ id, user });
    console.log('isDeleted:', isDeleted);
    if (isDeleted.affected === 0)
      throw new NotFoundException(`Can't find Board with id: ${id}`);
    return isDeleted.affected > 0;
  }
}
