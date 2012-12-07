PG-Dropbox-Android
==================

PhoneGap Dropbox Plugin for Android.  This quick sample project will show you how to link your app with Dropbox on Android using PhoneGap.  It will also show how to upload and download a file from Dropbox.

I have already included the Android Dropbox SDK in this project.

First you will need to get your Dropbox App Key and Secret.

You will need to put your Dropbox App Key in AndroidManifest.xml @ Line 67

<!-- Change this to be db- followed by your app key -->
<data android:scheme="db-INSERT-APP-KEY-HERE" />

You also need to put your Dropbox App Key and Secret in PhoneGapDropBox.java @ line 40 and 41.

final static private String APP_KEY = "INSERT_APP_KEY_HERE";
final static private String APP_SECRET = "INSERT_SECRET_HERE";



