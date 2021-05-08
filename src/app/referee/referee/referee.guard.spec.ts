import { TestBed } from '@angular/core/testing';

import { RefereeGuard } from './referee.guard';

describe('RefereeGuard', () => {
  let guard: RefereeGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(RefereeGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
