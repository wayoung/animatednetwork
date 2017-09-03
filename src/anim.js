"use strict"

class NetworkNode {
    
    constructor(ctx, x, y, vx, vy, r, color) {
      this.ctx = ctx
      this.x = x
      this.y = y
      this.vx = vx
      this.vy = vy
      this.r = r
      this.color = color
    }

    move() {
      if (this.x + this.vx < 0 || this.x + this.vx > this.ctx.canvas.width) {
        this.vx = -this.vx
      }
      if (this.y + this.vy < 0 || this.y + this.vy > this.ctx.canvas.height) {
        this.vy = -this.vy
      }
      this.x = this.x + this.vx
      this.y = this.y + this.vy
    }

    draw() {
      this.ctx.beginPath()
      this.ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, true)
      this.ctx.closePath()
      this.ctx.fillStyle = this.color
      this.ctx.fill()
    }

  }

class AnimatedNetwork {

  constructor(numNodes, nodeRadius, nodeSpeed, threads, color) {
    this.canvas = document.getElementById('canvas')
    this.ctx = canvas.getContext('2d')
    this.numNodes = numNodes
    this.nodeRadius = nodeRadius
    this.nodeSpeed = nodeSpeed
    this.threads = threads
    this.color = color
    this.networkNodes = []
    for (let i = 0; i < this.numNodes; i++) {
      const x = Math.random() * this.canvas.width
      const y = Math.random() * this.canvas.height
      const vx = Math.random() * this.nodeSpeed
      const vy = Math.random() * this.nodeSpeed
      const nn = new NetworkNode(this.ctx, x, y, vx, vy, this.nodeRadius, this.color)
      this.networkNodes.push(nn)
    }
    window.requestAnimationFrame(() => this.draw())
  }

  draw() {
    
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    for (let i = 0; i < this.numNodes; i++) {
      this.networkNodes[i].move()
      this.networkNodes[i].draw()
    }
    for (let i = 0; i < this.numNodes; i++) {
      const thisNN = this.networkNodes[i]
      const nodesByDistance = []
      const distances = []
      for (let j = 0; j < this.numNodes; j++) {
        if (j != i) {
          const otherNN = this.networkNodes[j]
          const dist = Math.sqrt(Math.pow(otherNN.y - thisNN.y, 2) + Math.pow(otherNN.x - thisNN.x, 2))
          let sz = nodesByDistance.length
          for (let k = 0; k < nodesByDistance.length; k++) {
            if (dist < distances[k]) {
              nodesByDistance.splice(k, 0, otherNN)
              distances.splice(k, 0, dist)
              break
            }
          }
          if (nodesByDistance.length == sz) {
            nodesByDistance.push(otherNN)
            distances.push(dist)
          }
        }
      }
      for (let j = 0; j < this.threads; j++) {
        const otherNN = nodesByDistance[j]
        this.ctx.beginPath()
        this.ctx.moveTo(thisNN.x, thisNN.y)
        this.ctx.lineTo(otherNN.x, otherNN.y)
        this.ctx.strokeStyle = this.color
        this.ctx.stroke()
      }
    }
    window.requestAnimationFrame(() => this.draw())

  }

}

window.onload = function () {
  const animatedNetwork = new AnimatedNetwork(100, 2, 2, 8, 'orange')
}