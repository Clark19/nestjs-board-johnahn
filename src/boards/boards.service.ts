import { Injectable, NotFoundException } from '@nestjs/common';
import { Board, BoardStatus } from './board.model';
import { CreateBoardDto } from './dto/create-board.dto';
import { v1 as uuid } from 'uuid';

@Injectable()
export class BoardsService {
  private boards: Board[] = [];

  // constructor() {
  //   this.boards = [];
  // }

  // constructor(private db: CreateUserDto[]) {}

  createBoard(data: CreateBoardDto) {
    this.boards.push({ id: uuid(), ...data, status: BoardStatus.PUBLIC });
    return this.boards.at(-1);
  }

  getAllBoards(): Board[] {
    return this.boards;
  }

  getBoardById(id: string) {
    const found = this.boards.find((board) => board.id === id);
    if (!found) throw new NotFoundException(`${id} 게시물을 찾을 수 없습니다 `);
    return found;
  }

  updateBoardStatus(id: string, status: BoardStatus): Board {
    const board = this.getBoardById(id);
    board.status = status;
    return board;
  }

  deleteBoard(id: string): boolean {
    const found = this.getBoardById(id);
    this.boards = this.boards.filter((board) => board.id !== found.id);
    if (found) return true;
    return false;
  }
}
