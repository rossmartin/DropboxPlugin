//start the Dropbox authentication process, "link" this app to your Dropbox account
function linkDropbox(){
  cordova.exec(linkDropboxCB, linkDropboxFail, "PhoneGapDropBox", "link", [""]);
  //exec(<successFunction>, <failFunction>, <service>, <action>, [<args>]);
  //This will marshall a request from the WebView to the Android native side, more or less boiling down to 
  //calling the action method on the service class, with the arguments passed in the args Array.
}
 
var dropBoxAuthAttempt = false; // set this global var so authDropbox() is only called once
function linkDropboxCB(){ // this callback is only ran if the native Java call in linkDropbox() was successful
  console.log("linkDropBoxCB() callback successful after cordova.exec to native Java");
  dropBoxAuthAttempt = true; // user succesfully linked dropbox, need to set this to true to fire authDropbox in onResume from exiting dropbox linking authentication
}
 
function linkDropboxFail(err){
  console.log("linkDropboxFail callback is firing and error message is below");
  console.log(err);
}
 
document.addEventListener("resume", onResume, false); // global onResume event
 
function onResume() { 
  // this onResume event fires always when resuming to the app, but won't run the code to 
  // finish dropbox auth unless dropBoxAuthAttempt is set to true after successfully linking dropbox
  if (dropBoxAuthAttempt){ // if the app was paused to start the link process with dropbox
      console.log("resume event just triggered after returning from Dropbox authentication");
      dropBoxAuthAttempt = false; // set this var to false so the code in this onResume runs only once
      authDropbox(); // this will only run once if the user resumes from successfully linking dropbox
  }
}
 
//finish the authentication, this is executed only once after the onresume event happens when successfully resuming from entering Dropbox credentials and linking.
function authDropbox(){
  cordova.exec(authDropboxCB, authDropboxFail, "PhoneGapDropBox", "finishAuth", [""]);
}
 
function authDropboxCB(){
  console.log("app successfully linked and authenticated with dropbox");
  // At this point you can start making Dropbox API calls - you can the methods in PhoneGapDropbox.java to upload/download
  window.localStorage.setItem("authDropbox", "true"); // setting local storage variable noting this App has linked with Dropbox
}
 
function authDropboxFail(err){
  console.log("authDropboxFail callback is firing, user may have canceled out of link process");
  console.log(err);
}
 
function unlinkDropbox(){
  cordova.exec(unlinkDropboxCB, unlinkDropboxFail, "PhoneGapDropBox", "unlink", [""]);
}
 
function unlinkDropboxCB(){
  console.log("unlinkDropboxCB callback successful after cordova.exec to native Java");
  window.localStorage.setItem("authDropbox", "false");
}
 
function unlinkDropboxFail(err){
  console.log("unlinkDropboxFail callback is firing and error message is below");
  console.log(err);
}
