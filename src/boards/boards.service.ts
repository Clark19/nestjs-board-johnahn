import { Injectable, NotFoundException } from '@nestjs/common';
import { BoardStatus } from './board-status.enum';
import { CreateBoardDto } from './dto/create-board.dto';
import { v1 as uuid } from 'uuid';
import { BoardRepository } from './board.repository';
import { Board } from './board.entity';

@Injectable()
export class BoardsService {
  constructor(private readonly boardRepository: BoardRepository) {}

  async createBoard(createBoardDto: CreateBoardDto): Promise<Board> {
    const board = await this.boardRepository.createBoard(createBoardDto);

    return board;
  }

  getAllBoards(): Promise<Board[]> {
    return this.boardRepository.find(); //{ order: { id: 'DESC' } }
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

  async deleteBoard(id: number): Promise<boolean> {
    // this.boards = this.boardRepository.filter((board) => board.id !== found.id);
    // .indexof() & .splice(index, 1) 두개 연합해서 지우는거랑 차이는 ?
    const isDeleted = await this.boardRepository.delete(id);
    console.log('isDeleted:', isDeleted);
    if (isDeleted.affected === 0)
      throw new NotFoundException(`Can't find Board with id: ${id}`);
    return isDeleted.affected > 0;
  }
}
