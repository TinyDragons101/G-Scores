import { Controller, Get, Param } from '@nestjs/common';
import { ScoreService } from './score.service';

@Controller('scores')
export class ScoreController {
  constructor(private readonly scoreService: ScoreService) {}

  @Get('test')
  test(): string {
    return 'test';
  }

  @Get()
  async getAllScores() {
    console.log('Controller getAllScores called');
    return this.scoreService.findAll();
  }
}