import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';
import { BoardStatus } from '../board-status.enum';

export class BoardStatusValidationPipe implements PipeTransform {
  readonly StatusOption = [BoardStatus.PRIVATE, BoardStatus.PUBLIC];

  transform(value: any, metadata: ArgumentMetadata) {
    console.log('value:', value);
    console.log('metadata', metadata);

    value = value.toUpperCase();

    if (!this.isStatusValid(value))
      throw new BadRequestException(`${value} isn't in the status options`);
    return value;
  }

  private isStatusValid(status: any) {
    const index = this.StatusOption.indexOf(status);
    return index !== -1;
  }
}
