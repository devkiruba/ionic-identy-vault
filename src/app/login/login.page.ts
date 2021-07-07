import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthMode, DefaultSession, IdentityVault } from '@ionic-enterprise/identity-vault';
import { VaultServiceService } from '../service/vault/vault-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  valutDefault: IdentityVault;
  defaultSession: DefaultSession = {
    username: "kiruba",
    token: "token"
  }

  deviceHardwares: string;
  bioMetricTypes: string;
  loggedUser:string;

  constructor(private router: Router, private vault: VaultServiceService) { }

  async ngOnInit(){
    // Get Hardware Modes available Faceid,TouchId,Passcode

    // "fingerprint" | "face" | "iris"
    this.deviceHardwares = (await this.vault.getAvailableHardware()).join(",");

    // "touchID" | "faceID" 
    this.bioMetricTypes = await this.vault.getBiometricType();
  }

  async ionViewDidEnter() {

    // Get Vault
    this.valutDefault = await this.vault.getVault();
    this.loggedUser = await this.valutDefault.getUsername();
  }

  async openBioMetric() {

    // Get Saved Session
    if (await this.vault.hasStoredSession()) {
      console.log("hasStoredSession : Yes")

      // Clear Session
      //this.clearSession()

      // Display User
      let user = await this.valutDefault.getUsername();
      console.log("User : " + user)

    } else {
      console.log("hasStoredSession : No")
      // Register Session with user credentials
      await this.vault.login(this.defaultSession)
    }

    // Check if vault Locked or Not
    
    // Ask for fingerprint
    if (await this.vault.isBiometricsAvailable()) {
      // this.vault.unlock()
      this.vault.getSession().then(
        resolve => {
          console.log("Access Granted")
          console.log(resolve)
          this.routeNextPage();
        },
        rejet => console.log("Access Denied")
      );
    }
  }

  async lockVault(){
    return await this.vault.lockOut();
  }

  async clearSession(){
    (await this.vault.getVault()).clear();
  }

  routeNextPage() {
    this.router.navigate(['/intro']);
  }
}
