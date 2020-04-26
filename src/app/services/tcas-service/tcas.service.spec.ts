import { TestBed } from '@angular/core/testing';

import { TcasService } from './tcas.service';

describe('TcasService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TcasService = TestBed.get(TcasService);
    expect(service).toBeTruthy();
  });
});
