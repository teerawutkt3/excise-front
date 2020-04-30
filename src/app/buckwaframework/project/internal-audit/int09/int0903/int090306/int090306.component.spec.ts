import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Int090306Component } from './int090306.component';

describe('Int090306Component', () => {
  let component: Int090306Component;
  let fixture: ComponentFixture<Int090306Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Int090306Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Int090306Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
