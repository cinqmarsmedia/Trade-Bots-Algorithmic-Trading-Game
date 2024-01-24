importScripts("./brain.js")

onmessage = function (e) {
    let trainingData = e.data[0];
    let config = e.data[1];


    const net = new brain.NeuralNetwork(config);
    net.trainAsync(trainingData).then(res => {
        let trainingResults = res;
        let json = net.toJSON();
        postMessage({ trainingResults, json })
    });
}