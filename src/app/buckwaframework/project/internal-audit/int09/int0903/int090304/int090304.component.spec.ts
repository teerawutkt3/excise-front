import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Int090304Component } from './int090304.component';

describe('Int090304Component', () => {
  let component: Int090304Component;
  let fixture: ComponentFixture<Int090304Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Int090304Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Int090304Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
