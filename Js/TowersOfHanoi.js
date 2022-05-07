let counter = -1;
let startTower = 0;
let endTower = 0;
let movesRecord = [];

let sticks = document.getElementsByClassName("stick");
let dragPicBlank = document.createElement("img"); //Evita que se distorciones los discos al moverlos
let reiniciarArrastre = () => {
  for (var x of sticks) {
    for (var y = 0; y < x.children.length; y++) {
      if (y === 0) {
        x.children[y].setAttribute("draggable", "true");
      }
      else {
        x.children[y].setAttribute("draggable", "false");
      }
    }
  }
}

//ganar
let ganador = () => {
  for (var x of sticks) {
    var winCheckArray = [];
    for (var y = 0; y < x.children.length; y++) {
      winCheckArray.push(x.children[y].id);
    }
    if (winCheckArray.join("") === "disk1disk2disk3disk4disk5") {
      alert("Felicidades has ganado");
    }
  }
}

reiniciarArrastre();

let iniciarArrastre = (event) => {
  event.dataTransfer.setData("text", event.target.id);
  event.dataTransfer.setDragImage(dragPicBlank, 0, 0);
  var startStickEl = event.target.parentElement;
  for (var x = 0; x < sticks.length; x++) {
    if (sticks[x] === startStickEl) {
      startTower = x;
    }
  }
}

let soltarDisco = (event) => {
  var sourceID = event.dataTransfer.getData("text");
  event.preventDefault();
  if (event.target.classList[0].match(/disk/) !== null) {
    return;
  }

  if (event.target.children.length === 0) {
    for (var x = 0; x < sticks.length; x++) {
      if (sticks[x] === event.target) {
        endTower = x;
        movesRecord.push({ "disk": sourceID, "from": startTower, "to": endTower, "move": counter + 1 });
      }
    }
    var xCoord = ((event.pageY - event.target.getBoundingClientRect().top) / event.target.getBoundingClientRect().height) * 100;
    event.target.appendChild(document.getElementById(sourceID));
    document.getElementById(sourceID).style.position = "absolute";
    var fallingRing = setInterval(() => {
      document.getElementById(sourceID).style.top = `${xCoord}%`;
      xCoord += 1;
      if (xCoord >= 90) {
        document.getElementById(sourceID).style.position = "relative";
        document.getElementById(sourceID).style.top = "";
        clearInterval(fallingRing);
      }
    }, 1);
    reiniciarArrastre();
    ganador();
  }
  else {
    for (var x = 0; x < sticks.length; x++) {
      if (sticks[x] === event.target && sourceID.length > 0) {
        endTower = x;
        movesRecord.push({ "disk": sourceID, "from": startTower, "to": endTower, "move": counter + 1 });
      }
    }
    var sourceIDNum = Number(sourceID[4]);
    var destID = event.target.children[0].id;
    var destIDNum = Number(destID[4]);
    if (sourceIDNum < destIDNum) {
      var xCoord = ((event.pageY - event.target.getBoundingClientRect().top) / event.target.getBoundingClientRect().height) * 100;
      event.target.insertBefore(document.getElementById(sourceID), event.target.children[0]);
      document.getElementById(sourceID).style.position = "absolute";
      var xCoordLimit = 90 - (10 * (event.target.children.length - 1));
      var fallingRing = setInterval(() => {
        document.getElementById(sourceID).style.top = `${xCoord}%`;
        xCoord += 1;
        if (xCoord >= xCoordLimit) {
          document.getElementById(sourceID).style.position = "relative";
          document.getElementById(sourceID).style.top = "";
          clearInterval(fallingRing);
        }
      }, 1);
      reiniciarArrastre();
      ganador();
    } else {
      alert("Movimiento no válido");
    }
  }
}
let dragDiscOver = (event) => {
  event.preventDefault();
}
