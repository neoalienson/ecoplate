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
    var orderIDhash = window.location.hash;
    var orderID = orderIDhash.slice(1, orderIDhash.length);
    console.log("can I get hash? ", orderID);
    getWeights(orderID)
  } catch (e) {
    console.error(e);
  }
});


// // 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥 DATABASE 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥


  function getWeights(orderID){
    const db = firebase.firestore();
    const settings = {/* your settings... */ timestampsInSnapshots: true};
    db.settings(settings);
    const doneOrderInfo = db.collection('done_orders').doc(orderID);
      doneOrderInfo.onSnapshot(doc=>{
        console.log("doc: ", doc.data().weights);
        var weights = doc.data().weights;
        var weightLables = Array.apply(null, {length: weights.length}).map(Number.call, Number);
        drawChart(weights, weightLables);
      })
  }

  // // 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥 CHARTS 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥

    function drawChart(weights, weightLables){

    let weightChartelem = document.getElementById('weight-chart').getContext('2d');

    var chartData = {
      type : 'line', // bar, horizontalBar, doughnut, radar, polarArea
      data : {
        labels : weightLables, // time, 3 seconds for each data point
        datasets:[{
          label: 'Weight',
          data :weights
        }]
      },
    }
    console.log("chartData: ", chartData);
    let weightChart = new Chart(weightChartelem, chartData);

    
  }
