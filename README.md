# Apple TV Test App

This project produces an Apple TV client/server application using TVMLKit.  There is a main Swift application managed in
the `native` folder/Xcode project.  The `web` folder contains the JavaScript application that powers the majority
of the application functionality.

## How it works

The `TestApp/AppDelegate.swift` file represents the entry point for the native AppleTV app that a user will install from
the App Store.  When the app boots, it will load the JS application from a URL.  As long as we don't need to tie into any
additional native functionality, we can deploy new versions of Apple TV functionality by simply redeploying the JS application,
there is no need to republish a new version of the native app.

## Local Testing

The JS Application needs to be running before we can start the native app in the simulator.

To setup the app:

* cd web
* npm install

### Start the JS application

In the web folder, run `npm run serve`, this will launch the JS application at [http://localhost:9001](http://localhost:9001)

### Run the native app

In XCode run the application in the tvOS simulator.  This should start the Simulator included with Xcode and
boot the native app, which will then load the TVMLKit JS application and start you on your way.

## Debugging

When the simulator is running, open Safari and select Develop > Simulator - Apple TV > com.phase2.TestApp.  This
will launch the Safari Devtools console where you can see console log messages and inspect the various elements of the
TVMLKit JS Application.  Sweet stuff.

We make use of a logging library called `debug`. By default all logging (except Redux state change logging) is disabled.
To enable logging bring up the Safari Devtools Console and input the following: 

  App.debug.enable('*')

This will turn on logging for the entire application. If you want to add logging for just a feature or subfeature you can
do something like any one of these to enable some namespaces:

  // Choose one of these to enable logging for a namespace
  App.debug.enable('journal:*')

  // Choose one of these to enable logging on a subnamespace
  App.debug.enable('journal:Journal')

See the docs for [debug](https://www.npmjs.com/package/debug) for enabling multiple namespaces or other features of the library.
