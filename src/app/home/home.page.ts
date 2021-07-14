import { Component } from '@angular/core';
import { AuthMode, DefaultSession, IonicIdentityVaultUser, IonicNativeAuthPlugin, VaultConfig, VaultError } from '@ionic-enterprise/identity-vault';
import { Platform } from '@ionic/angular';

interface MyCustomSession extends DefaultSession {
  // username & token are inherited
  email: string;
  age: number;
  // nicknames: string[];
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

}