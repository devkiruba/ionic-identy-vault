import { Component, OnInit } from '@angular/core';
import { AppLauncher, AppLauncherOptions } from '@ionic-native/app-launcher/ngx';
import { Platform } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Market } from '@ionic-native/market/ngx';
import { AppAvailability } from '@ionic-native/app-availability/ngx';
import { Router } from '@angular/router';

interface externalAppOptions extends AppLauncherOptions {
  appId;
}

enum platformType {
  ios,
  android
}

@Component({
  selector: 'app-intro',
  templateUrl: './intro.page.html',
  styleUrls: ['./intro.page.scss'],
})
export class IntroPage implements OnInit {

  constructor(private appLauncher: AppLauncher, private platform: Platform, private iab: InAppBrowser, private market: Market, private appAvailability: AppAvailability,private router: Router) { }

  vrOptions: externalAppOptions = {
    packageName: 'edu.waldenu.vr',
    appId: "id1551872376"
  }

  cpOptions: externalAppOptions = {
    packageName: 'edu.waldenu.companion',
    appId: "id1566084345"
  }

  fbOptions: externalAppOptions = {
    packageName: 'com.facebook.katana',
    uri: 'fb://',
    appId: "id1566084345"
  }

  appConfig: Array<externalAppOptions> = [
    this.cpOptions,
    this.vrOptions,
    this.fbOptions
  ]

  osType: platformType;

  ngOnInit() {
    this.osType = this.platform.is('android') ? platformType.android : platformType.ios;
  }

  canLaunch(options: externalAppOptions) {

    // Not working on muliple check and launch case
    this.appLauncher.canLaunch(options).then((canLaunch: boolean) => {
      if (canLaunch) { this.launchInstalledApp(options) }
    }).catch((error: any) => {
      this.launchAppStore(options);
    });
  }

  canCheckAndLaunch(options: externalAppOptions) {
    if (this.osType == platformType.android) {
      this.appAvailability.check(options.packageName).then((canLaunch: boolean) => {
        this.launchInstalledApp(options)
      }).catch((error: any) => {
        this.launchAppStore(options);
      });
    }
  }

  // Working fine not used anywhere
  // async checkappInstalled(options: externalAppOptions) {
  //   if (this.osType == platformType.android) {
  //     // let result = (await this.appAvailability.check(options.packageName)) ? "installed" : "";
  //     let result = await this.appAvailability.check(options.packageName);
  //     return result;
  //   }
  // }

  // check = async (config)  =>{
  //   let data = await this.checkappInstalled(config);
  //   return data;
  // }

  async launchInstalledApp(options: externalAppOptions) {
    await this.appLauncher.launch(options);
  }

  async launchAppStore(options: externalAppOptions) {
    if (this.osType == platformType.android) {
      // Use your app identifier for android.
      await this.market.open(options.packageName);
    } else {
      // Use the id found in the URL of the ios app store listing.
      await this.market.open(options.appId);
    }
  }

  routeNextPage() {
    this.router.navigate(['/login']);
  }

}

// App Availability : App Availability check on mobile

// App Launcher : Check App Availability and lauch them

// Market : Opens an app's page in the market place (Google Play, App Store)

// InAppBrowser : use this to open installed app

// https://stackoverflow.com/questions/54632621/how-to-launch-external-app-from-an-ionic4-app



// App availablitiy to check if installed > App launcher to launch app > Market used to access playstore or app store

