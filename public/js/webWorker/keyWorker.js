onmessage = function (message) {
  if(message.data === "decrypt")
    postMessage("please render decryption field");
};
