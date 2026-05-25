import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JuegosReflejos } from './juegos-reflejos';

describe('JuegosReflejos', () => {
  let component: JuegosReflejos;
  let fixture: ComponentFixture<JuegosReflejos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JuegosReflejos],
    }).compileComponents();

    fixture = TestBed.createComponent(JuegosReflejos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
