import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FareDialog } from './fare-dialog';

describe('FareDialog', () => {
  let component: FareDialog;
  let fixture: ComponentFixture<FareDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FareDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FareDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
