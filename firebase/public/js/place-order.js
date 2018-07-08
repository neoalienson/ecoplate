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
  db.collection('shops/PVIRTZ9n1a7q7YVXJqAB/menu').get().then(function(collection) {
    $('#menuTable').empty();
      console.log("Document data:", collection.docs);
       collection.docs.forEach((i, index)=>{
         console.log("Document data 2:", i.ref.path);
         db.doc(i.ref.path).get().then(function(doc) {
           console.log(doc.data());
           o = doc.data();
           var $tablebody = $(`
            <div class="col-lg-12">
              <div class="card">
                 <img class="card-img-top" src="images/foods/${o.image}" alt="Card image cap">
                 <div class="card-body">
                     <h4 class="card-title mb-3">${o.name}</h4>
                     <p class="card-text">${o.description}</p>
                     <p class="card-text">HKD ${o.price}</p>
                     <input type="hidden" class="menu-item-path" value="${i.ref.path}">
                     <input type="hidden" id="price-${i.ref.id}" value="${o.price}">
                     <input type="range" min="0" max="10" value="0" class="slider menu-item-qty" id="slider-${i.ref.id}"></input>
                     <p>Qty: <span id="qty-${i.ref.id}">0</span></p>
                     <p>Subtotal: HKD <span id="subtotal-${i.ref.id}">0</span></p>
                     <script>
                     document.getElementById("slider-${i.ref.id}").oninput = function() {
                       document.getElementById("qty-${i.ref.id}").innerHTML = this.value;
                       document.getElementById("subtotal-${i.ref.id}").innerHTML = this.value
                        * parseInt(document.getElementById("price-${i.ref.id}").value);
                     };
                     </script>
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

  const orderInfo = db.collection('orders').orderBy("orderID", "desc").limit(5);
    orderInfo.onSnapshot(querySnapshot=>{
      var orders = [];
      querySnapshot.forEach(doc =>{
        orders.push(doc.data())
      })

    console.log('orders: ', orders)
    console.log('latest: ', orders[0].orderID);
    localStorage.setItem("latest_orderID",  orders[0].orderID)
    });



function placeOrder() {
  var old_orderID = parseInt(localStorage.getItem('latest_orderID'));
  var new_orderID = old_orderID+1;

  paths = $('.menu-item-path')
  qtys = $('.menu-item-qty')
  items=[];
  for (i = 0; i < paths.length; i++) {
    if (qtys[i].value > 0) {
      items.push({ 'ref': db.doc(paths[i].value), 'qty': parseInt(qtys[i].value)});
    }
  }

  var newOrder = {
    "adjustment": parseInt(document.getElementById('adjustment').value) / 100,
    "mat": db.doc('/mats/3JpQC7HWhxTf8ZVIqj71'),
    "orderID":new_orderID,
    "consumer" : db.doc('/consumer/xGNSubolzxb2lmqJoOu2'),
    "time": new Date(),
    "dish": items
  };

  console.log("new: ", newOrder)

  db.collection('orders').doc(new_orderID.toString()).set(newOrder)
    .then(function() {
        console.log("Document successfully written!");
        window.location.replace('order-processing.html');
    })
    .catch(function(error) {
        console.error("Error writing document: ", error);
    });
}

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
