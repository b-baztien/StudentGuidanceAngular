import { TestBed } from '@angular/core/testing';

import { CarrerService } from './carrer.service';

describe('CarrerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CarrerService = TestBed.get(CarrerService);
    expect(service).toBeTruthy();
  });
});
