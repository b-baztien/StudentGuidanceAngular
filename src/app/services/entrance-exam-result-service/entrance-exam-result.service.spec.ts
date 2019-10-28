import { TestBed } from '@angular/core/testing';

import { EntranceExamResultService } from './entrance-exam-result.service';

describe('EntranceExamResultService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EntranceExamResultService = TestBed.get(EntranceExamResultService);
    expect(service).toBeTruthy();
  });
});
