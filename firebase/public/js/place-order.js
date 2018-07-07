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

  const orderInfo = db.collection('orders').orderBy("orderID", "desc").limit(5);
  orderInfo.onSnapshot(querySnapshot=>{
    var orders = [];
    querySnapshot.forEach(doc =>{
      orders.push(doc.data())
    })

  console.log('orders: ', orders)
  console.log('latest: ', orders[0].orderID);
  localStorage.setItem("latest_orderID",  orders[0].orderID)
  showOrders(true, orders);
  });

  const doneOrderInfo = db.collection('done_orders').orderBy("orderID", "desc").limit(5);
  doneOrderInfo.onSnapshot(querySnapshot=>{
    var doneOrders = [];
    querySnapshot.forEach(doc =>{
      doneOrders.push(doc.data())
    })
    showOrders(false, doneOrders);
  });



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
        } else {
            $('#doneOrderTable').empty();
            var head = '<thead>' +
                '<tr><th>' + "OrderID" +
                '</th><th>' + "Dish" +
                '</th><th>' + "Adjustment" +
                '</th><th>' + "Leftover (grams)" +
                '</th><th>' + "Time" +
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
