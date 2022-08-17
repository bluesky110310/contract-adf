import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractNewDialogComponent } from './contract-new-dialog.component';

describe('ContractNewDialogComponent', () => {
  let component: ContractNewDialogComponent;
  let fixture: ComponentFixture<ContractNewDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContractNewDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractNewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
