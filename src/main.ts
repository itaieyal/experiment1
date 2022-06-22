import "./style.css";

const canvas = document.querySelector("canvas") as HTMLCanvasElement;
const c = canvas.getContext("2d") as CanvasRenderingContext2D;
let animating = false;
const mouse: {
  x?: number;
  y?: number;
} = {
  x: undefined,
  y: undefined,
};
canvas.addEventListener("mousemove", (e) => {
  mouse.x = e.x;
  mouse.y = e.y;
});

const canvasCenter = {
  x: window.innerWidth / 2,
  y: window.innerHeight / 2,
};

canvas.addEventListener("click", (e) => {
  currentColorPalletIndex =
    currentColorPalletIndex === colorPalletes.length - 1
      ? 0
      : currentColorPalletIndex + 1;
  setCanvasBackgroundColor();
});

window.addEventListener("resize", () => {
  setCanvasFullSize();
});

const backgroundColors = [
  "#706c61ff",
  "#899e8bff",
  "#99c5b5ff",
  "#afece7ff",
  "#81f499ff",
  "#92374dff",
  "#8c5383ff",
  "#4a5899ff",
  "#559cadff",
  "#c1b2abff",
];

function initCanvas() {
  setCanvasBackgroundColor();
  setCanvasFullSize();
}

initCanvas();

function setCanvasBackgroundColor() {
  canvas.style.backgroundColor = getRandomColor(backgroundColors);
}

function setCanvasFullSize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

const colorPalletes = [
  ["#d7f2baff", "#bde4a8ff", "#9cc69bff", "#79b4a9ff", "#676f54ff"],
  ["#c9cba3ff", "#ffe1a8ff", "#e26d5cff", "#723d46ff", "#472d30ff"],
  ["#b0f2b4ff", "#baf2e9ff", "#bad7f2ff", "#f2bac9ff", "#f2e2baff"],
];

function getRandomIndex(max: number) {
  return Math.floor(Math.random() * max);
}

let currentColorPalletIndex = getRandomIndex(colorPalletes.length);

class Circle {
  static maxLifetime = 2000;
  static radiusSpeed = 0.2;
  public x;
  public y;
  public dx;
  public dy;
  public radius;
  public opacity;
  public color;
  public lifetime;

  constructor({
    x,
    y,
    radius,
    color,
    dx,
    dy,
  }: {
    x: number;
    y: number;
    radius: number;
    color: string;
    dx: number;
    dy: number;
  }) {
    this.lifetime = Circle.maxLifetime;
    this.x = this.getInitialX(x, radius);
    this.y = this.getInitialY(y, radius);
    this.radius = radius;
    this.opacity = 1.0;
    this.color = color;
    this.dx = dx;
    this.dy = dy;
  }

  private getInitialX(x: number, radius: number) {
    if (x + radius > canvas.width) {
      return canvas.width - radius;
    }
    if (x - radius <= 0) {
      return radius;
    }
    return x;
  }

  private getInitialY(y: number, radius: number) {
    if (y + radius > canvas.height) {
      return canvas.height - radius;
    }
    if (y - radius <= 0) {
      return radius;
    }
    return y;
  }

  draw() {
    if (this.opacity < 0) {
      return;
    }

    c.beginPath();
    c.save();
    c.globalAlpha = this.opacity;
    c.fillStyle = this.color;
    c.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    c.fill();
    c.restore();
  }

  update() {
    this.draw();
    this.lifetime -= 1;
    this.radius += Circle.radiusSpeed;
    this.x += this.dx;
    this.y += this.dy;
    if (this.x + this.radius >= canvas.width || this.x - this.radius <= 0) {
      this.dx = -this.dx;
    }
    if (this.x + this.radius > canvas.width) {
      this.x = canvas.width - this.radius;
    }
    if (this.x - this.radius < 0) {
      this.x = this.radius;
    }
    if (this.y + this.radius >= canvas.height || this.y - this.radius <= 0) {
      this.dy = -this.dy;
    }
    if (this.y + this.radius > canvas.height) {
      this.y = canvas.height - this.radius;
    }
    if (this.y - this.radius < 0) {
      this.y = this.radius;
    }

    if (this.lifetime < Circle.maxLifetime / 2) {
      if (this.opacity > 0) {
        this.opacity -= 0.01;
      } else {
        this.opacity = 0;
      }
    }
  }
}

function clearRect() {
  c.clearRect(0, 0, canvas.width, canvas.height);
}

function getRandomColor(colorOptions: string[]) {
  const randIndex = Math.floor(Math.random() * colorOptions.length);
  return colorOptions[randIndex];
}

let circles: Circle[] = [];
let animationId: number;

// const leadingCirclePosition = {
//   x: canvas.width / 2,
//   y: canvas.height / 2,
// };

function animate() {
  animating = true;
  animationId = requestAnimationFrame(animate);
  clearRect();

  circles.push(
    new Circle({
      x: mouse.x || canvasCenter.x,
      y: mouse.y || canvasCenter.y,
      radius: 10,
      color: getRandomColor(colorPalletes[currentColorPalletIndex]),
      dx: Math.random() - 0.5,
      dy: Math.random() - 0.5,
    })
  );
  circles.forEach((circle) => {
    circle.update();
  });
  circles = circles.filter((circle) => {
    return circle.lifetime > 0;
  });
  const firstNameGradient = c.createLinearGradient(
    400,
    400,
    canvasCenter.x + 100,
    canvasCenter.y + 100
  );

  firstNameGradient.addColorStop(0, "red");
  // firstNameGradient.addColorStop(0.5, "blue");
  firstNameGradient.addColorStop(1, "white");

  c.fillStyle = firstNameGradient;
  c.font = "8vw 'Lobster'";
  const text = "Itai's canvas";
  const textWidth = c.measureText(text).width;
  c.fillText(text, canvasCenter.x - textWidth / 2, canvasCenter.y);
  c.strokeStyle = "black";
  c.lineWidth = 2;
  c.strokeText(text, canvasCenter.x - textWidth / 2, canvasCenter.y);
}

animate();

window.addEventListener("keydown", ({ key }) => {
  if (key === " ") {
    if (animating) {
      animating = false;
      cancelAnimationFrame(animationId);
    } else {
      animate();
    }
  }
});
