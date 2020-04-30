import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Int12070102Component } from './int12070102.component';

describe('Int12070102Component', () => {
  let component: Int12070102Component;
  let fixture: ComponentFixture<Int12070102Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Int12070102Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Int12070102Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
