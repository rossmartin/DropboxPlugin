PhoneGap Dropbox Plugin for Android
==================

__Update 9/7/13 - My [Dropbox Sync Plugin](https://github.com/rossmartin/phonegap-dropbox-sync) is much better than the old one here.__

This quick sample project will show you how to link your app with Dropbox using PhoneGap.  It will also show how to upload and download a file from Dropbox.

I have already included the Android Dropbox SDK in this project.

First you will need to get your Dropbox App Key and Secret.

You will need to put your Dropbox App Key in AndroidManifest.xml @ Line 67

<!-- Change this to be db- followed by your app key -->
<data android:scheme="db-INSERT-APP-KEY-HERE" />

You also need to put your Dropbox App Key and Secret in PhoneGapDropBox.java @ line 40 and 41.

This tutorial here below can help you integrate this plugin into your own project - 

http://rossmartindev.blogspot.com/2012/12/using-dropbox-sdk-with-phonegap-aka.html

Updated by : 
       Ujjwal Relan (email: ujjwal@seeta.in) 
       Tusshar Singh (email: tusshar@seeta.in)

       Issue in the file src/com/sample/dropbox/PhoneGapDropBox.java 
line 107:       Initial Statement
       
       Entry newEntry = mDBApi.putFileOverwrite("some-file.txt", inputStream, // putFileOverwrite method overwrites IF the new file is different than the current backup on Dropbox 
       file.length(), null); 
       
       This statement throws DropboxException e , Something went wrong while uploading. This issue is fixed below.

Reference: http://stackoverflow.com/a/9832865

