import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Ta03011701Component } from './ta03011701.component';

describe('Ta03011701Component', () => {
  let component: Ta03011701Component;
  let fixture: ComponentFixture<Ta03011701Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Ta03011701Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Ta03011701Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
