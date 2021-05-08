/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { RefereeHelperService } from './referee-helper.service';

describe('Service: RefereeHelper', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RefereeHelperService]
    });
  });

  it('should ...', inject([RefereeHelperService], (service: RefereeHelperService) => {
    expect(service).toBeTruthy();
  }));
});
