import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import { HttpModule } from '@angular/http';
import { HTTP } from '@ionic-native/http';
import { IonicStorageModule } from '@ionic/storage'
import { Geolocation } from '@ionic-native/geolocation';
import { LaunchNavigator } from '@ionic-native/launch-navigator';

import { MyApp } from './app.component';
import { LoginPage } from '../pages/login/login';
import { HomePage } from '../pages/home/home';
import { TransfersPage } from '../pages/transfers/transfers';
import { TransferDetailPage } from '../pages/transferdetail/transferdetail';
import { ItineraryPage } from '../pages/itinerary/itinerary';
import { InTransitPage } from '../pages/intransit/intransit';
import { LogAStopPage } from '../pages/logastop/logastop';
import { TransferOwnerPage } from '../pages/transferowner/transferowner';
import { LogoutPage } from '../pages/logout/logout';

import { LoadingService } from '../providers/loading';
import { EmployeeService } from '../providers/employee';
import { OpportunityService } from '../providers/opportunity';
import { TransferLogService } from '../providers/transferlog';
import { TransferGPSService } from '../providers/transfergps';
import { HelperService } from '../providers/helper';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';


@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    HomePage,
    TransfersPage,
    TransferDetailPage,
    ItineraryPage,
    InTransitPage,
    LogAStopPage,
    TransferOwnerPage,
    LogoutPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    HomePage,
    TransfersPage,
    TransferDetailPage,
    ItineraryPage,
    InTransitPage,
    LogAStopPage,
    TransferOwnerPage,
    LogoutPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    LoadingService,
    EmployeeService,
    OpportunityService,
    TransferLogService,
    TransferGPSService,
    HelperService,
    Geolocation,
    LaunchNavigator,
    HTTP,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
