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

  // db.collection('shops/PVIRTZ9n1a7q7YVXJqAB/menu').get().then(function(collection) {
  //   $('#menuTable').empty();
  //     console.log("Document data:", collection.docs);
  //      collection.docs.forEach((i, index)=>{
  //        console.log("Document data 2:", i.ref.path);
  //        db.doc(i.ref.path).get().then(function(doc) {
  //          console.log(doc.data());
  //          o = doc.data();
  //


  const orderInfo = db.collection('orders').orderBy("orderID", "desc").limit(5);
  orderInfo.onSnapshot(querySnapshot=>{
    var orders = [];
    querySnapshot.forEach((doc) =>{
      console.log("doc: ", doc);
      console.log("doc.data(): ", doc.data());
      var orderData = doc.data();
      var dishPath = doc.data().dish[0].ref.path;
      var getDish = db.doc(dishPath).get().then(dishDoc =>{
        orderData.dish=dishDoc.data().name
        orders.push(orderData)
        localStorage.setItem("latest_orderID",  orders[0].orderID)
        showOrders(true, orders);
      })

    })
  });

  const doneOrderInfo = db.collection('done_orders').orderBy("orderID", "desc").limit(5);
  doneOrderInfo.onSnapshot(querySnapshot=>{
    var doneOrders = [];
    querySnapshot.forEach((doc) =>{
      console.log("doc: ", doc);
      console.log("doc.data(): ", doc.data());
      var orderData = doc.data();
      var dishPath = doc.data().dish[0].ref.path;
      var getDish = db.doc(dishPath).get().then(dishDoc =>{
        console.log("dishDoc: ", dishDoc.data());
        console.log("orderData: ", orderData)
        console.log("orders push: ", doneOrders )
        console.log(doneOrders.length);
        orderData.dish=dishDoc.data().name
        doneOrders.push(orderData)
        showOrders(false, doneOrders);
      })
    })
  });


  function emptyDone(){
    var doneID = localStorage.getItem('doneOrderID')
    console.log('doneID: ', doneID)
    // Delete from newOrders
    db.collection("done_orders").doc(doneID.toString()).delete().then(function() {
        console.log("Document successfully deleted!");
    }).catch(function(error) {
        console.error("Error removing document: ", error);
    });
  }

  function addOrder(){

    var date = new Date();
    var old_orderID = parseInt(localStorage.getItem('latest_orderID'));
    var new_orderID = old_orderID+1;
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
    localStorage.setItem('doneOrderID', orderID)
    var date = new Date();

    // Get from orders
    var new_doneOrder = db.collection('orders').doc(orderID.toString());
    new_doneOrder.get().then(function(doc) {
        if (doc.exists) {
          var new_data = doc.data();

          console.log("Document data 1:", doc.data());


    // Create new object to store to done data

          var additional_data = {
            "leftover":100
          }
          new_data.time = date;
          Object.assign(new_data, additional_data);

          // Move to doneOrder collection
          db.collection('done_orders').doc(orderID.toString()).set(new_data)
            .then(function() {
                console.log("Document successfully written!");
                // Delete from newOrders
                db.collection("orders").doc(orderID.toString()).delete().then(function() {
                    console.log("Document successfully deleted!");
                }).catch(function(error) {
                    console.error("Error removing document: ", error);
                });
            })
            .catch(function(error) {
                console.error("Error writing document: ", error);
            });

          console.log("Document data 2:", additional_data);
          console.log("Document data: 3 ", new_data);



        } else {
            console.log("No such document!");
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });


  }

  function showOrders(status, orders){
    if (status){

            $('#orderTable').empty();
            var head = '<thead>' +
                '<tr><th>' + "OrderID" +
                '</th><th>' + "Mat number" +
                '</th><th>' + "Dish" +
                '</th><th>' + "Adjustment" +
                '</th><th>' + "Time of Order" +
                '</th></tr>' +
                '</thead>' +
                '<tbody class="no-border">' +
                '</tbody>';
            $('#orderTable').append(head);
            orders.forEach((o, index)=>{
                var $tablebody = $(`
                    <tr><td>  ${o.orderID}
                    </td><td>  ${o.mat.id}
                    </td><td>  ${o.dish}
                    </td><td>  ${o.adjustment}
                    </td><td>  ${o.time.toDate()}
                    </td></tr>;
                    `)
                $tablebody.on('click',_=>{doneOrder(o.orderID)});
                $('#orderTable').find('tbody').append($tablebody);
            })
        } else {
            $('#doneOrderTable').empty();
            var head = '<thead>' +
                '<tr><th>' + "OrderID" +
                '</th><th>' + "Dish" +
                '</th><th>' + "Adjustment" +
                '</th><th>' + "Leftover (grams)" +
                '</th><th>' + "Time Delievered" +
                '</th></tr>' +
                '</thead>' +
                '<tbody class="no-border">' +
                '</tbody>';
            $('#doneOrderTable').append(head);
            orders.forEach((o, index)=>{
                var $tablebody = $(`
                    <tr><td>  ${o.orderID}
                    </td><td>  ${o.dish}
                    </td><td>  ${o.adjustment}
                    </td><td>  ${o.leftover}
                    </td><td>  ${o.time.toDate()}
                    </td></tr>;
                    `)
                $tablebody.on('click',_=>{
                  window.location.href= '/chart.html#'+ o.orderID;
                });
                $('#doneOrderTable').find('tbody').append($tablebody);
            })
        }
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
