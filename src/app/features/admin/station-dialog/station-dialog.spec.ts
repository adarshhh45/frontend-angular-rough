import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StationDialog } from './station-dialog';

describe('StationDialog', () => {
  let component: StationDialog;
  let fixture: ComponentFixture<StationDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StationDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StationDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
