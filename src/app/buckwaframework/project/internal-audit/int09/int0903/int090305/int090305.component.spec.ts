import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Int090305Component } from './int090305.component';

describe('Int090305Component', () => {
  let component: Int090305Component;
  let fixture: ComponentFixture<Int090305Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Int090305Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Int090305Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
