import { TestBed } from '@angular/core/testing';

import { InitCalendarService } from './init-calendar.service';

describe('InitCalendarService', () => {
  let service: InitCalendarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InitCalendarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
