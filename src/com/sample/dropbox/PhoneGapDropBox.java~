package com.sample.dropbox;

import org.apache.cordova.api.Plugin;
import org.apache.cordova.api.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

// import everything needed for Dropbox functionality
import android.content.Context;
import android.content.SharedPreferences;
import android.content.SharedPreferences.Editor;
import android.util.Log;

import com.dropbox.client2.DropboxAPI;
import com.dropbox.client2.DropboxAPI.DropboxFileInfo;
import com.dropbox.client2.DropboxAPI.Entry;
import com.dropbox.client2.DropboxAPI.UploadRequest;
import com.dropbox.client2.android.AndroidAuthSession;
import com.dropbox.client2.android.AuthActivity;
import com.dropbox.client2.exception.DropboxException;
import com.dropbox.client2.exception.DropboxUnlinkedException;
import com.dropbox.client2.session.AccessTokenPair;
import com.dropbox.client2.session.AppKeyPair;
import com.dropbox.client2.session.Session.AccessType;
import com.dropbox.client2.session.TokenPair;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;

/**
 * This class echoes a string called from JavaScript.
 */
public class PhoneGapDropBox extends Plugin {
	private static final String TAG = "PhoneGapDropBox";
	
    final static private String APP_KEY = "INSERT_APP_KEY_HERE";
    final static private String APP_SECRET = "INSERT_SECRET_HERE";

    // If you'd like to change the access type to the full Dropbox instead of
    // an app folder, change this value.
    final static private AccessType ACCESS_TYPE = AccessType.APP_FOLDER; // app will have access to $dropboxRoot/Apps/YourAppNameHere
    // this declartion below must be in the class declaration section:
    private DropboxAPI<AndroidAuthSession> mDBApi;
    
    // Don't mess with these String variables below
    final static private String ACCOUNT_PREFS_NAME = "prefs";
    final static private String ACCESS_KEY_NAME = "ACCESS_KEY";
    final static private String ACCESS_SECRET_NAME = "ACCESS_SECRET";
    /**
     * Executes the request and returns PluginResult.
     *
     * @param action        The action to execute.
     * @param args          JSONArry of arguments for the plugin.
     * @param callbackId    The callback id used when calling back into JavaScript.
     * @return              A PluginResult object with a status and message.
     */
    // start of method call from JavaScript
    public PluginResult execute(String action, JSONArray args, String callbackId) {
            if (action.equals("link")) { // start the Dropbox authentication process, "link" this app to your Dropbox account
            	Log.v(TAG, "in PluginResult running link action");

            	AppKeyPair appKeys = new AppKeyPair(APP_KEY, APP_SECRET);
            	AndroidAuthSession session = new AndroidAuthSession(appKeys, ACCESS_TYPE);
            	mDBApi = new DropboxAPI<AndroidAuthSession>(session);
            	
            	// MyActivity below should be your activity class name
            	//mDBApi.getSession().startAuthentication(MyActivity.this);
            	mDBApi.getSession().startAuthentication(cordova.getContext() );

            	return new PluginResult(PluginResult.Status.OK);
            } else if (action.equals("finishAuth")) { 
            	// finish the authentication, this is executed after the onresume event happens when successfully resuming from entering Dropbox credentials and linking.
            	Log.v(TAG, "in PluginResult running inside finishAuth action");
                if (mDBApi.getSession().authenticationSuccessful()) {
                    try {
                        // MANDATORY call to complete auth.
                        // Sets the access token on the session
                        mDBApi.getSession().finishAuthentication();

                        AccessTokenPair tokens = mDBApi.getSession().getAccessTokenPair();

                        // Provide your own storeKeys to persist the access token pair
                        // A typical way to store tokens is using SharedPreferences
                        storeKeys(tokens.key, tokens.secret);
                        Log.v(TAG, "logging after storeKeys(tokens.key, tokens.secret); ");
                    } catch (IllegalStateException e) {
                        Log.i("DbAuthLog", "Error authenticating", e);
                    }
                    return new PluginResult(PluginResult.Status.OK);
                } else {
                	return new PluginResult(PluginResult.Status.ERROR); 
                	// if we aren't authenticated, return error so the authDropboxCB() callback isn't called if you cancel the Dropbox authentication 
                	// returning no result will end up calling authDropboxFail() in dropbox.js instead
                }
            } else if (action.equals("upload")) { // upload some-file.txt to a dropBox account
            	// Uploading content.
            	FileInputStream inputStream = null;
            	try {
            	    File file = new File("/mnt/sdcard/some-file.txt");
            	    inputStream = new FileInputStream(file);
            	    //Entry newEntry = mDBApi.putFile("/PocketHealth-backup.bk", inputStream, // putFile method for DropboxAPI class creates new backup files some-file.txt(1), etc.
            	            //file.length(), null, null);
            	    Entry newEntry = mDBApi.putFileOverwrite("some-file.txt", inputStream, // putFileOverwrite method overwrites IF the new file is different than the current backup on Dropbox
            	            file.length(), null);
            	    Log.i("DbExampleLog", "The uploaded file's rev is: " + newEntry.rev);
            	} catch (DropboxUnlinkedException e) {
            	    // User has unlinked, ask them to link again here.
            	    Log.e("DbExampleLog", "User has unlinked.");
            	} catch (DropboxException e) {
            	    Log.e("DbExampleLog", "Something went wrong while uploading.");
            	} catch (FileNotFoundException e) {
            	    Log.e("DbExampleLog", "File not found.");
            	} finally {
            	    if (inputStream != null) {
            	        try {
            	            inputStream.close();
            	        } catch (IOException e) {}
            	    }
            	}
            	return new PluginResult(PluginResult.Status.OK);
            } else if (action.equals("checkAuth")){ 
            	// this is executed if window.localStorage.getItem("authDropbox", "true") is true when going 
            	// after the app has been started for the first time
                AppKeyPair appKeyPair = new AppKeyPair(APP_KEY, APP_SECRET);
                AndroidAuthSession session;

                String[] stored = getStoredKeys();
                if (stored != null) {
                    AccessTokenPair accessToken = new AccessTokenPair(stored[0], stored[1]);
                    session = new AndroidAuthSession(appKeyPair, ACCESS_TYPE, accessToken);
                    mDBApi = new DropboxAPI<AndroidAuthSession>(session);
                } else {
                    session = new AndroidAuthSession(appKeyPair, ACCESS_TYPE);
                    mDBApi = new DropboxAPI<AndroidAuthSession>(session);
                }
                
                return new PluginResult(PluginResult.Status.OK);
            } else if (action.equals("download")){ // Download some-file.txt from Dropbox 
            	Boolean fileExists = null; // create a boolean var to record if the backup file exists on dropbox
            	// Get file.
            	FileOutputStream outputStream = null;
            	try {
            	    File file = new File("/mnt/sdcard/some-file.txt");
            	    outputStream = new FileOutputStream(file);
            	    //DropboxFileInfo info = mDBApi.getFile("/PocketHealth-backup.bk", null, outputStream, null);
            	    //Log.i("DbExampleLog", "The file's rev is: " + info.getMetadata().rev);
            	    mDBApi.getFile("/some-file.txt", null, outputStream, null);
            	    // /path/to/new/file.txt now has stuff in it.
            	    fileExists = true;
            	} catch (DropboxException e) {
            	    Log.e("DbExampleLog", "Something went wrong while downloading.");
            	} catch (FileNotFoundException e) {
            	    Log.e("DbExampleLog", "File not found.");
            	} finally {
            	    if (outputStream != null) {
            	        try {
            	            outputStream.close();
            	        } catch (IOException e) {}
            	    }
            	}
            	if (fileExists == true){
            		return new PluginResult(PluginResult.Status.OK);
            	} else {
            		return new PluginResult(PluginResult.Status.NO_RESULT); 
            		// return no result if the backup file isn't in $dropboxroot/Apps/YourAppNameHere
            	}
            } else if (action.equals("unlink")){ 
            	clearKeys();
            	return new PluginResult(PluginResult.Status.OK);
            } else {
                return new PluginResult(PluginResult.Status.INVALID_ACTION);
            }
    } // end of PluginResult execute method call from JavaScript call
    
    private void storeKeys(String key, String secret) { // function needed to store Dropbox authentication keys
        // Save the access key for later
    	//SharedPreferences prefs = getSharedPreferences(ACCOUNT_PREFS_NAME, 0); // original code from Dropbox SDK example
        SharedPreferences prefs = cordova.getContext().getSharedPreferences(ACCOUNT_PREFS_NAME, 0);
        Editor edit = prefs.edit();
        edit.putString(ACCESS_KEY_NAME, key);
        edit.putString(ACCESS_SECRET_NAME, secret);
        edit.commit();
    }
    
    private String[] getStoredKeys() { // function needed to get Dropbox authentication keys
        //SharedPreferences prefs = getSharedPreferences(ACCOUNT_PREFS_NAME, 0); // original code from Dropbox SDK example
        SharedPreferences prefs = cordova.getContext().getSharedPreferences(ACCOUNT_PREFS_NAME, 0);
        String key = prefs.getString(ACCESS_KEY_NAME, null);
        String secret = prefs.getString(ACCESS_SECRET_NAME, null);
        if (key != null && secret != null) {
        	String[] ret = new String[2];
        	ret[0] = key;
        	ret[1] = secret;
        	return ret;
        } else {
        	return null;
        }
    }
    
    private void clearKeys() { // function needed to clear Dropbox authentication keys
        //SharedPreferences prefs = getSharedPreferences(ACCOUNT_PREFS_NAME, 0); // original code from Dropbox SDK example
    	SharedPreferences prefs = cordova.getContext().getSharedPreferences(ACCOUNT_PREFS_NAME, 0);
        Editor edit = prefs.edit();
        edit.clear();
        edit.commit();
    }
} // end of PhoneGapDropBox class