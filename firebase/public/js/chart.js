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
//aaa
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
        console.log("doc.data(): ", doc.data())
        if (doc.data().weight){
            var allweights = doc.data().weight;
            if (allweights.length > 100){
              var weights = allweights.slice(allweights.length - 10, allweights.length)
            } else {
              var weights = allweights
            }
            var weightLables = Array.apply(null, {length: weights.length}).map(Number.call, Number);
            drawChart(weights, weightLables);
      }
        showOrderDetails(doc.data())
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
      options: {
        animation: {
            duration: 0, // general animation time
        },
        hover: {
            animationDuration: 0, // duration of animations when hovering an item
        },
        responsiveAnimationDuration: 0, // animation duration after a resize
      scales: {
          yAxes : [{
            display: true,
            ticks: {
              suggestedMin: 50,
              suggestedMax: 130
            }
          }]
        }
      }
    }
    let weightChart = new Chart(weightChartelem, chartData);
  }

  function showOrderDetails(od){
    document.getElementById('dishTime').innerHTML = od.time.toDate();
    $('#orderDetails').empty();
    console.log("orderDetails: ", od);
        var $tablebody = $(`
          <tbody>
          <tr><td>  Order ID </td><td>  ${od.orderID} </tr>
          <tr><td>  Mat ID </td><td>  ${od.mat.id} </tr>
          </tbody>`)
        $('#orderDetails').append($tablebody);
    }
