import { TestBed } from '@angular/core/testing';

import { EntranceMajorService } from './entrance-major.service';

describe('EntranceMajorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EntranceMajorService = TestBed.get(EntranceMajorService);
    expect(service).toBeTruthy();
  });
});
