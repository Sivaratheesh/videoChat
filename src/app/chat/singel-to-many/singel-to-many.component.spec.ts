import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingelToManyComponent } from './singel-to-many.component';

describe('SingelToManyComponent', () => {
  let component: SingelToManyComponent;
  let fixture: ComponentFixture<SingelToManyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SingelToManyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SingelToManyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
