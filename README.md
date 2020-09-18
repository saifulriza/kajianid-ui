# Sistem Informasi Kajian Islami (kajianid)

Sistem Informasi Masjid, Ustadz dan Kajian Rutin

<p align="center">
  <img src="https://github.com/saifulriza/kajianid-ui/workflows/InfoKajian%20CI/badge.svg" alt="InfoKajian CI"/>
</p>

## Install the dependencies
```bash
npm install
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)
```bash
quasar dev
```


### Build the app for production
```bash
quasar build
```

### Build tha app for android
use this 4 following command to generate key

```bash
keytool -genkey -v -keystore quasar-release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias quasar-release
keytool -importkeystore -srckeystore quasar-release-key.jks -destkeystore quasar-release-key.jks -deststoretype pkcs12
keytool -genkey -v -keystore quasar-debug-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias quasar-debug
keytool -importkeystore -srckeystore quasar-debug-key.jks -destkeystore quasar-debug-key.jks -deststoretype pkcs12

```
Create configuration file 
```bash
cp build.cordova.json.example build.cordova.json
```
Open build.cordova.json and replace ****** with your key password

And then build the app for development
```bash
npm run cordova:dev
```

Or build the app for development
```bash
npm run cordova:build
```

### Customize the configuration
See [Configuring quasar.conf.js](https://quasar.dev/quasar-cli/quasar-conf-js).
