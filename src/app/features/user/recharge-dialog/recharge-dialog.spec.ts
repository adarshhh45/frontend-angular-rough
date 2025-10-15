import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RechargeDialog } from './recharge-dialog';

describe('RechargeDialog', () => {
  let component: RechargeDialog;
  let fixture: ComponentFixture<RechargeDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RechargeDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RechargeDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
