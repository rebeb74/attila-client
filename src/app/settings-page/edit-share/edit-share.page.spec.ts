import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EditSharePage } from './edit-share.page';

describe('EditSharePage', () => {
  let component: EditSharePage;
  let fixture: ComponentFixture<EditSharePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditSharePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EditSharePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
