import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Int0609Component } from './int0609.component';

describe('Int0609Component', () => {
  let component: Int0609Component;
  let fixture: ComponentFixture<Int0609Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Int0609Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Int0609Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
