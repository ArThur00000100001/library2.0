import { TestBed } from '@angular/core/testing';

import { ApiAuth } from './api-auth';

describe('ApiAuth', () => {
  let service: ApiAuth;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiAuth);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
