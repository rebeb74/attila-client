import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EditUserAccountPage } from './edit-user-account.page';

describe('EditUserAccountPage', () => {
  let component: EditUserAccountPage;
  let fixture: ComponentFixture<EditUserAccountPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditUserAccountPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EditUserAccountPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
