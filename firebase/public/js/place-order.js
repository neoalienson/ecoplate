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
  // PVIRTZ9n1a7q7YVXJqAB
  /*
  db.collection('shops/PVIRTZ9n1a7q7YVXJqAB/menu').onSnapshot(querySnapshot=>{
    querySnapshot.forEach(doc =>{
      console.log(doc.data);
    })
  });
*/
  db.collection('shops/PVIRTZ9n1a7q7YVXJqAB/menu').get().then(function(collection) {
    $('#menuTable').empty();
      console.log("Document data:", collection.docs);
       collection.docs.forEach((o, index)=>{
         console.log("Document data 2:", o.ref.path);
         db.doc(o.ref.path).get().then(function(doc) {
           console.log(doc.data());
           o = doc.data();
           var $tablebody = $(`
            <div class="col-lg-12">
              <div class="card">
                 <img class="card-img-top" src="images/bg-title-01.jpg" alt="Card image cap">
                 <div class="card-body">
                     <h4 class="card-title mb-3">${o.name}</h4>
                     <p class="card-text">${o.description}</p>
                     <p class="card-text">HKD ${o.price}</p>
                     <p class="cart-text">${o.price}</p>
                 </div>
             </div>
           </div>
              `)
          $('#menuTable').append($tablebody);
        })
      })
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
