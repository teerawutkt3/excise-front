import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Int120701Component } from './int120701.component';

describe('Int120701Component', () => {
  let component: Int120701Component;
  let fixture: ComponentFixture<Int120701Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Int120701Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Int120701Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
