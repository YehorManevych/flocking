const HISTORY_L = 30

function updateHistory(birds){
  let points = []
  for(let i = 0; i<birds.length; i++){
    points.push(birds[i].pos)
  }
  history.push(points)
  if(history.length > HISTORY_L){
    history = history.slice(-HISTORY_L, -1)
  }
}

function drawHistory(){
  let prevPoints = history[0]
  for(let i = 1; i<history.length; i++){
    let c = color(0,0,0);
    c.setAlpha(i/(history.length-1)*255)
    let points = history[i]
    for(let j = 0; j <points.length; j++){
      let prevPoint = prevPoints[j]
      let point = points[j]
      drawLine(prevPoint, point, c)
    }
    prevPoints= points
  }
}
