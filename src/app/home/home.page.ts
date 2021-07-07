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
export class HomePage extends IonicIdentityVaultUser<MyCustomSession> {

  constructor(platform: Platform) {
    super(platform, {
      authMode: AuthMode.BiometricOrPasscode, // Use biometrics auth with passcode fallback
      restoreSessionOnReady: false, // whether or not to immediately attempt to restore the session when the vault is ready
      unlockOnReady: false, // set true to auto prompt the user to unlock when vault is ready
      unlockOnAccess: true, // set to true to auto prompt the user to unlock on first read access
      lockAfter: 5000, // lock after 5 seconds in the background
      hideScreenOnBackground: true // when in app launcher mode hide the current screen and display the splashscreen
    });

    console.log("home");

    super.getBiometricType().then(data => {
      console.log("getBiometricType", data);
    }, error => {
      console.log(error);
    })

    super.getSession().then(data => {
      console.log("getSession", data);
    }, error => {
      console.log(error);
    })


    super.isPasscodeEnabled().then(data => {
      console.log("isPasscodeEnabled", data);
    }, error => {
      console.log(error);
    })

    super.isBiometricsEnabled().then(data => {
      console.log("isBiometricsEnabled", data);
    }, error => {
      console.log(error);
    })

    this.getPlugin().getVault(
      {
        username: 'gdh',
        vaultId: 'dfgh',
      }
    ).isPasscodeSetupNeeded().then(data => {
      console.log("isPasscodeSetupNeeded", data);
    });


    // console.log(this.getPlugin());

    // super.getPlugin().getVault( {
    //   username: 'gdh',
    //   vaultId: 'dfgh',
    // }).clear().then(data=>{
    //   console.log(data)
    //   console.log("clear")
    // })

    let session: MyCustomSession = {
      username: "kiruba",
      age: 20,
      email: "",
      token: "toke"
    }

    // super.login(session, AuthMode.BiometricOnly).then(data => {
    //   console.log("login")
    //   console.log(data)
    // }, err => {
    //   console.log("login error")
    // })

    // super.getVault().then(data => {
    //   console.log("getVault", data);
    // }, error => {
    //   console.log(error);
    // })

    super.getSession().then(data => {
      console.log("getSession", data);
    }, error => {
      console.log(error);
    })



  }


  onConfigChange(config: VaultConfig) {
    console.log("onConfigChange");
  }

  onSessionRestoreError(err: VaultError) {
    console.log("onSessionRestoreError");
  }

  onSessionRestored(session: MyCustomSession) {
    console.log("onSessionRestored");
  }

  onSetupError(err: VaultError) {
    console.log("onSetupError");
  }

  onUnlockOnReadyError(err: VaultError) {
    console.log("onUnlockOnReadyError");
  }

  onVaultLocked() {
    //Route to my login page
    console.log("onVaultLocked");
  }

  onVaultUnlocked(config: VaultConfig) {
    //Route to my home page
    console.log("onVaultUnlocked");
  }

  async onVaultReady(config: VaultConfig) {
    console.log("onVaultReady");
    console.log(config);
    if (await super.isBiometricsAvailable()) {
      super.unlock().then(data => {
        console.log("bio ulock mode")
        console.log(data)
      }, err => {
        console.log("bio eror ulock mode")
        console.log(err)
      })
    } else {
      super.setPasscode().then(data => {
        console.log("passcode ulock mode")
        console.log(data)
      }, err => {
        console.log(" pascode eror ulock mode")
        console.log(err)
      });
    }
  }

  async onPasscodeRequest(isPasscodeSetRequest: boolean): Promise<string> {
    // Display a custom Passcode prompt and return the passcode as a string
    // or return undefined to use the build in native prompts. isPasscodeSetRequest
    // is true when attempting to set a new passcode on the vault, you can use
    // it to do something like prompt the user twice for the pin.
    console.log("onPasscodeRequest")
    return "";
  }


  getPlugin(): IonicNativeAuthPlugin {
    return super.getPlugin();
  }
}
