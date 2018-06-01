const path = require('path');
const scriptName = path.basename(__filename);
const dirname = path.resolve(__dirname);
const wdio = require('webdriverio');
const pathToApk = dirname + '/app-debug.apk';
const data = require('../data/config.json');
const userDetails = data.USER;
const androidDetails = data.ANDROID_DETAILS;
const appiumDetails = data.APPIUM_DETAILS;
const MAX_WAIT = 5000;

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

const pageObjects = {
  "NAV_BAR": {
    "openNavMenu": "~Open navigation drawer"
  },
  "NAV_MENU": {
    "authenticate": "/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.support.v4.widget.DrawerLayout/android.widget.FrameLayout/android.support.v7.widget.RecyclerView/android.support.v7.widget.LinearLayoutCompat[2]"
  },
  "AUTHENTICATE_SCREEN": {
    "authenticate_button": "/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.support.v4.widget.DrawerLayout/android.view.ViewGroup/android.view.ViewGroup/android.widget.FrameLayout/android.widget.RelativeLayout/android.widget.Button"
  },
  "KEYCLOAK_LOGIN_SCREEN": {
    "username_text_area": '//android.webkit.WebView[@content-desc="Log in to secure-app"]/android.view.View[2]/android.view.View/android.view.View[2]/android.view.View/android.view.View[1]/android.view.View/android.view.View/android.view.View[2]/android.widget.EditText',
    "password_text_area": '//android.webkit.WebView[@content-desc="Log in to secure-app"]/android.view.View[2]/android.view.View/android.view.View[2]/android.view.View/android.view.View[1]/android.view.View/android.view.View/android.view.View[4]/android.widget.EditText',
    "login_button": "~Log in"
  },
  "LOGGED_IN_SCREEN": {
    "logout_button": '/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.support.v4.widget.DrawerLayout/android.view.ViewGroup/android.view.ViewGroup/android.widget.FrameLayout/android.widget.RelativeLayout/android.widget.RelativeLayout/android.widget.Button'
  }
}

var client = wdio.remote(options);
const chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
chai.should();
chaiAsPromised.transferPromiseness = client.transferPromiseness;

describe(scriptName, () => {

  it('should log into and out of application', (done) => {
    try {
      client.init()
      .click(pageObjects.NAV_BAR.openNavMenu)
      .waitForVisible(pageObjects.NAV_MENU.authenticate, MAX_WAIT)
      .click(pageObjects.NAV_MENU.authenticate)
      .waitForVisible(pageObjects.AUTHENTICATE_SCREEN.authenticate_button, MAX_WAIT)
      .waitForEnabled(pageObjects.AUTHENTICATE_SCREEN.authenticate_button, MAX_WAIT)
      .click(pageObjects.AUTHENTICATE_SCREEN.authenticate_button)
      .waitForVisible(pageObjects.KEYCLOAK_LOGIN_SCREEN.username_text_area, MAX_WAIT)
      .waitForVisible(pageObjects.KEYCLOAK_LOGIN_SCREEN.password_text_area, MAX_WAIT)
      .setValue(pageObjects.KEYCLOAK_LOGIN_SCREEN.username_text_area, userDetails.username)
      .setValue(pageObjects.KEYCLOAK_LOGIN_SCREEN.password_text_area, userDetails.password)
      .waitForVisible(pageObjects.KEYCLOAK_LOGIN_SCREEN.login_button, MAX_WAIT)
      .click(pageObjects.KEYCLOAK_LOGIN_SCREEN.login_button)
      .pause(MAX_WAIT)
      .waitForVisible(pageObjects.LOGGED_IN_SCREEN.logout_button, MAX_WAIT)
      .waitForEnabled(pageObjects.LOGGED_IN_SCREEN.logout_button, MAX_WAIT)
      .click(pageObjects.LOGGED_IN_SCREEN.logout_button)
      .waitForVisible(pageObjects.AUTHENTICATE_SCREEN.authenticate_button, MAX_WAIT)
      .end()
      .then(() => {
        done();
      });
    } catch(err) {
      done(err);
    }
  });

  it('should log into and out of application (transfer promisness)', () => {
    return client
      .init()
      .isVisible(pageObjects.NAV_BAR.openNavMenu).should.eventually.be.true
      .click(pageObjects.NAV_BAR.openNavMenu)
      .isVisible(pageObjects.NAV_MENU.authenticate).should.eventually.be.true
      .click(pageObjects.NAV_MENU.authenticate)
      .isEnabled(pageObjects.AUTHENTICATE_SCREEN.authenticate_button).should.eventually.be.true
      .click(pageObjects.AUTHENTICATE_SCREEN.authenticate_button)
      .pause(3000)
      .isVisible(pageObjects.KEYCLOAK_LOGIN_SCREEN.username_text_area).should.eventually.be.true
      .isVisible(pageObjects.KEYCLOAK_LOGIN_SCREEN.password_text_area).should.eventually.be.true
      .setValue(pageObjects.KEYCLOAK_LOGIN_SCREEN.username_text_area, userDetails.username)
      .setValue(pageObjects.KEYCLOAK_LOGIN_SCREEN.password_text_area, userDetails.password)
      .isVisible(pageObjects.KEYCLOAK_LOGIN_SCREEN.login_button).should.eventually.be.true
      .click(pageObjects.KEYCLOAK_LOGIN_SCREEN.login_button)
      .pause(3000)
      .isVisible(pageObjects.LOGGED_IN_SCREEN.logout_button).should.eventually.be.true
      .isEnabled(pageObjects.LOGGED_IN_SCREEN.logout_button).should.eventually.be.true
      .pause(3000)
      .click(pageObjects.LOGGED_IN_SCREEN.logout_button)
      .pause(3000)
      .isVisible(pageObjects.AUTHENTICATE_SCREEN.authenticate_button).should.eventually.be.true
      .end();
  })
});