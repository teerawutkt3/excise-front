import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Int12070101Component } from './int12070101.component';

describe('Int12070101Component', () => {
  let component: Int12070101Component;
  let fixture: ComponentFixture<Int12070101Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Int12070101Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Int12070101Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
