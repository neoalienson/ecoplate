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

  // const shopInfo = db.collection('shops').doc('PVIRTZ9n1a7q7YVXJqAB').collection('orders');
  const orderInfo = db.collection('orders').orderBy("orderID", "desc").limit(7);
  orderInfo.onSnapshot(querySnapshot=>{
    var orders = [];
    querySnapshot.forEach(doc =>{
      orders.push(doc.data())
    })
    console.log('orders: ', orders)
    console.log('orders length', orders.length);
    localStorage.setItem("latest_orderID", orders.length)
    showOrders(orders);

  })

  function addOrder(){

    var date = new Date();
    var old_orderID = parseInt(localStorage.getItem('latest_orderID'));
    var new_orderID = old_orderID;
    var newOrderData = {
      "adjustment":1,
      "mat":"dummy",
      "dish":"chicken rice",
      "time": date,
      "orderID":new_orderID
    };

    console.log("new: ", newOrderData)

    db.collection('orders').doc(new_orderID.toString()).set(newOrderData)
      .then(function() {
          console.log("Document successfully written!");
      })
      .catch(function(error) {
          console.error("Error writing document: ", error);
      });

  }

  function doneOrder(orderID){

    console.log("done: ", orderID)
    // Add a new document in collection "cities"
    // let shopDoc = db.collection("shops").doc("PVIRTZ9n1a7q7YVXJqAB");
    //
    // return db.runTransaction(function(transaction) {
    //
    //   // This code may get re-run multiple times if there are conflicts.
    //   return transaction.get(shopDoc).then(function(sDoc) {
    //       if (!sDoc.exists) {
    //           throw "Document does not exist!";
    //       }
    //
    //       var orders = sDoc.data().orders;
    //       console.log(orders)
    //       date = new Date();
    //       var newOrderData = {
    //         "adjustment":1,
    //         "mat":"dummy",
    //         "dish":"chicken rice",
    //         "time": date
    //       };
    //
    //       console.log("new order: ", newOrderData);
    //
    //       var newOrders = orders.push(newOrderData);
    //       console.log("newOrders: ", newOrders)
    //       transaction.update(shopDoc, { orders: orders});
    //     });
    // }).then(function() {
    //     console.log("Transaction successfully committed!");
    // }).catch(function(error) {
    //     console.log("Transaction failed: ", error);
    // });
  }

  function showOrders(orders){
            $('#orderTable').empty();
            var head = '<thead>' +
                '<tr><th>' + "OrderID" +
                '</th><th>' + "Mat number" +
                '</th><th>' + "Dish" +
                '</th><th>' + "Adjustment" +
                '</th><th>' + "Time" +
                '</th></tr>' +
                '</thead>' +
                '<tbody class="no-border">' +
                '</tbody>';
            $('#orderTable').append(head);
            orders.forEach((o, index)=>{
                var $tablebody = $(`
                    <tr><td>  ${o.orderID}
                    </td><td>  ${o.mat}
                    </td><td>  ${o.dish}
                    </td><td>  ${o.adjustment}
                    </td><td>  ${o.time.toDate()}
                    </td></tr>;
                    `)
                $tablebody.on('click',_=>{doneOrder(o.orderID)});
                $('#orderTable').find('tbody').append($tablebody);
            })
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
