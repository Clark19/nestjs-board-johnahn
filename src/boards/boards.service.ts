import { Injectable, NotFoundException } from '@nestjs/common';
import { BoardStatus } from './board-status.enum';
import { CreateBoardDto } from './dto/create-board.dto';
import { v1 as uuid } from 'uuid';
import { BoardRepository } from './board.repository';
import { Board } from './board.entity';

@Injectable()
export class BoardsService {
  constructor(private readonly boardRepository: BoardRepository) {}

  async createBoard(data: CreateBoardDto): Promise<Board> {
    const board = this.boardRepository.create({
      ...data,
      status: BoardStatus.PUBLIC,
    });
    // const board = await this.boardRepository.save({
    //   ...data,
    //   status: BoardStatus.PUBLIC,
    // });
    await this.boardRepository.save(board);
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

  // updateBoardStatus(id: string, status: BoardStatus): Board {
  //   const board = this.getBoardById(id);
  //   board.status = status;
  //   return board;
  // }

  // deleteBoard(id: string): boolean {
  //   const found = this.getBoardById(id);
  //   this.boards = this.boardRepository.filter((board) => board.id !== found.id);
  //   if (found) return true;
  //   return false;
  // }
}
