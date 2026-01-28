import { TestBed } from '@angular/core/testing';

import { ApiContentList } from './api-content-list';

describe('ApiContentList', () => {
  let service: ApiContentList;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiContentList);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
