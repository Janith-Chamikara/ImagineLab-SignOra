import { Test, TestingModule } from '@nestjs/testing';
import { TimeslotController } from './timeslot.controller';

describe('TimeslotController', () => {
  let controller: TimeslotController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TimeslotController],
    }).compile();

    controller = module.get<TimeslotController>(TimeslotController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
