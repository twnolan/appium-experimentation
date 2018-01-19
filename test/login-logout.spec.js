const path = require('path');
const scriptName = path.basename(__filename);
const dirname = path.resolve(__dirname);
const wdio = require('webdriverio');
const pathToApk = dirname + '/app-debug.apk';
const data = require('../data/config.json');
const userDetails = data.USER;
const androidDetails = data.ANDROID_DETAILS;
const appiumDetails = data.APPIUM_DETAILS;

const options = {
  port: appiumDetails.port,
  logLevel: appiumDetails.logLevel,
  desiredCapabilities: {
    platformName: 'Android',
    platformVersion: androidDetails.platformVersion,
    deviceName: androidDetails.deviceName,
    app: pathToApk,
    chromeOptions: {
      distribution: {
        skip_first_run_ui: true,
        show_welcome_page: false,
        import_bookmarks: false,
        make_chrome_default: false,
        ignore_certificate_errors: true
      }
    }
  }
}

var client = wdio.remote(options);

describe(scriptName, () => {

  it('should log into and out of application', (done) => {
    try {
      client.init()
      .click("~Open navigation drawer")
      .pause(3000)
      .click("/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.support.v4.widget.DrawerLayout/android.widget.FrameLayout/android.support.v7.widget.RecyclerView/android.support.v7.widget.LinearLayoutCompat[2]")
      .pause(3000)
      .click("/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.support.v4.widget.DrawerLayout/android.view.ViewGroup/android.view.ViewGroup/android.widget.FrameLayout/android.widget.RelativeLayout/android.widget.Button")
      .pause(3000)
      .setValue('//android.webkit.WebView[@content-desc="Log in to secure-app"]/android.view.View[3]/android.view.View/android.view.View[1]/android.view.View/android.view.View[2]/android.widget.EditText', userDetails.username)
      .setValue('//android.webkit.WebView[@content-desc="Log in to secure-app"]/android.view.View[3]/android.view.View/android.view.View[1]/android.view.View/android.view.View[4]/android.widget.EditText', userDetails.password)
      .pause(3000)
      .click("~Log in")
      .pause(3000)
      .click('/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.support.v4.widget.DrawerLayout/android.view.ViewGroup/android.view.ViewGroup/android.widget.FrameLayout/android.widget.RelativeLayout/android.widget.RelativeLayout/android.widget.Button')
      .pause(3000)
      .end()
      .then(() => {
        done();
      });
    } catch(err) {
      done(err);
    }
  });
});