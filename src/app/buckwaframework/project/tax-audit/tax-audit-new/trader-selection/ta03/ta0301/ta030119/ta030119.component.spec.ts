import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Ta030119Component } from './ta030119.component';

describe('Ta030119Component', () => {
  let component: Ta030119Component;
  let fixture: ComponentFixture<Ta030119Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Ta030119Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Ta030119Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
