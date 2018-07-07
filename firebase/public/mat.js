document.addEventListener('DOMContentLoaded', function() {
  // // 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥
  // // The Firebase SDK is initialized and available here!
  //
  // firebase.auth().onAuthStateChanged(user => { });
  // firebase.database().ref('/path/to/ref').on('value', snapshot => { });
  // firebase.messaging().requestPermission().then(() => { });
  // firebase.storage().ref('/path/to/ref').getDownloadURL().then(() => { });
  //
  // // 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥

  try {
    let app = firebase.app();
    let features = ['auth', 'database', 'messaging', 'storage'].filter(feature => typeof app[feature] === 'function');
    // checkLogin().then(displayName=>{
    //   getUserinfo(displayName)
    // })
  } catch (e) {
    console.error(e);
  }
});

// // 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥 DATABASE 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥

  const db = firebase.firestore();
  const settings = {/* your settings... */ timestampsInSnapshots: true};
  db.settings(settings);
//  mats/3JpQC7HWhxTf8ZVIqj71
//  consumers/xGNSubolzxb2lmqJoOu2
  var matRef = db.collection('mats').doc("3JpQC7HWhxTf8ZVIqj71");
  var consumerRef = db.collection('mats').doc("xGNSubolzxb2lmqJoOu2");
  matRef.get().then(function(doc) {
    if (doc.exists) {
        console.log("Document data:", doc.data());
        matRef.set({'consumer': consumerRef, "done_order" : null});
        $("div#status").html("Success")
        setTimeout(function() {
          window.location.replace('place-order.html');
        }, 1000);
    } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
    }
}).catch(function(error) {
    console.log("Error getting document:", error);
});




// // 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥 AUTHENTICATION 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥


function checkLogin(){
  return new Promise((res, rej) =>{

  const user = firebase.auth().onAuthStateChanged(user=>{
    console.log("checking user: ", JSON.stringify(user))
    if (!user){
      googleLogin()
    }
    else{
      console.log("Username: ", user.displayName)
      res(user.displayName)
    }
  });
})
}

function googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
      .then(result => {
          const user = result.user;
          console.log("user: ", user)
      })
      .catch(console.log)
}


function getUserinfo(displayName){
  const db = firebase.firestore();
  db.collection.get().then(querySnapshot=>{
    querySnapshot.forEach(query =>{
      console.log("query: ", query)
    })
  })
}
