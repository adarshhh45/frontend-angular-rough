import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FareManagement } from './fare-management';

describe('FareManagement', () => {
  let component: FareManagement;
  let fixture: ComponentFixture<FareManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FareManagement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FareManagement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
