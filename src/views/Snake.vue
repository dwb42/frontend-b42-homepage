<template>
  <v-app-bar color="black" density="compact" app elevation="4">
    <v-app-bar-title>
      <router-link :to="{ name: 'Home' }" class="text-decoration-none text-teal wavering">
        <span class="mdi mdi-dots-hexagon"></span>
        B42 Capital
      </router-link>
    </v-app-bar-title>
  </v-app-bar>

  <!-- Hero Section with Snake game overlay -->
  <v-container class="hero-container" fluid>
    <!-- The canvas for the snake game is absolutely positioned so it fills the container.
         It has pointer-events disabled so that any underlying controls remain clickable. -->
    <canvas ref="canvasRef" class="snake-canvas"></canvas>

    <!-- Your hero content remains visible on top of (or “over”) the snake game background. -->
    <div class="hero-content text-center">
      <h1 class="text-h4 text-md-h2 font-weight-bold my-6">
        We <span class="wavering">invest</span> in companies that can
        <span class="wavering">10x their efficiency</span> by integrating
        <span class="wavering">technology</span> into their operations.
      </h1>
      <div class="text-body-1 text-medium-emphasis mb-10">
        <p class="text-grey-lighten-5">
          B42 Capital is a hands-on investor that works with founders to scale their business.
          We provide know how and capital to improve strategy and product with the goal of fostering growth and profitability.
        </p>
      </div>
    </div>

    <!-- Game Over Overlay: shown when gameEnded is true -->
    <div v-if="gameEnded" class="game-over-overlay">
      <div class="game-over-content">
        <h2>Game Over!</h2>
        <v-btn color="teal" @click="replayGame">Play Again</v-btn>
      </div>
    </div>

    <!-- Snake Controls: two buttons for turning left or right -->
    <div class="snake-controls">
      <v-btn color="teal" @click="moveLeft">Left</v-btn>
      <v-btn color="teal" @click="moveRight">Right</v-btn>
    </div>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';

// --- Unmodified Code for Other Page Elements ---
const whomWeInvest = ref(null);
function scrollToSection() {
  if (whomWeInvest.value) {
    const elementPosition = whomWeInvest.value.getBoundingClientRect().top + window.scrollY;
    const offsetPosition = elementPosition - 70;
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  } else {
    console.log('whomWeInvest ref is not set');
  }
}
const src = computed(() => `https://images.unsplash.com/photo-1533892743580-890e5b193113?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`);
const features = [
  {
    title: 'Hungry Entrepreneurs',
    subtitle:
      'You must be an entrepreneur who is passionate about his/her customers and product.',
    icon: 'mdi-rocket',
  },
  {
    title: 'Strong Demand',
    subtitle:
      'You must be able to show that there is a strong demand for what you are offering.',
    icon: 'mdi-trending-up',
  },
  {
    title: 'Existing Revenue',
    subtitle:
      'You must be able to show first revenue from the product that you want to scale with.',
    icon: 'mdi-cash',
  },
  {
    title: 'SaaS Business Models',
    subtitle:
      'We like SaaS businesses with an asset light recurring revenue model.',
    icon: 'mdi-server-network',
  },
  {
    title: 'Traditional Businesses',
    subtitle:
      'We are also very interested in companies that want to use technology to gain a competitive advantage in a more traditional industry.',
    icon: 'mdi-domain',
  },
  {
    title: 'Based in Europe',
    subtitle:
      'We mainly invest in businesses that are based in the European Union.',
    icon: 'mdi-earth',
  },
];
const encodedEmail = ref('ZHdAYjQyLmlv');
function decodeEmail(encoded) {
  return atob(encoded); 
}
const dialog = ref(false)
const currentContent = ref('') // 'imprint' or 'privacy'
function showDialog(content) {
  currentContent.value = content
  dialog.value = true
}
const closeDialog = () => {
  dialog.value = false;
  console.log('closeDialog')
};

// --- Snake Game Implementation ---
const canvasRef = ref(null);
let ctx = null;
let gameInterval = null;
const cellSize = 20; // Each cell will be 20x20 pixels
let cols = 0;
let rows = 0;
let snake = [];
let food = null;
// Initial direction: moving right
let dx = 1, dy = 0;
const gameSpeed = 150;
const gameEnded = ref(false);

function initGame() {
  const canvas = canvasRef.value;
  // Set canvas size to match the container dimensions
  canvas.width = canvas.parentElement.clientWidth;
  canvas.height = canvas.parentElement.clientHeight;
  ctx = canvas.getContext('2d');
  // Calculate grid dimensions based on cell size
  cols = Math.floor(canvas.width / cellSize);
  rows = Math.floor(canvas.height / cellSize);
  // Initialize snake in the center with three segments
  const startX = Math.floor(cols / 2);
  const startY = Math.floor(rows / 2);
  snake = [
    { x: startX,     y: startY },
    { x: startX - 1, y: startY },
    { x: startX - 2, y: startY }
  ];
  // Reset initial direction (right)
  dx = 1;
  dy = 0;
  // Spawn the first food item
  food = generateFood();
  gameEnded.value = false;
  // Clear any existing game loop, then start a new one
  if (gameInterval) clearInterval(gameInterval);
  gameInterval = setInterval(gameLoop, gameSpeed);
}

function generateFood() {
  let newFood;
  while (true) {
    newFood = {
      x: Math.floor(Math.random() * cols),
      y: Math.floor(Math.random() * rows)
    };
    if (!snake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
      return newFood;
    }
  }
}

function gameLoop() {
  // Compute the new head position based on current direction
  const head = snake[0];
  const newHead = { x: head.x + dx, y: head.y + dy };

  // Check for collision with walls
  if (newHead.x < 0 || newHead.x >= cols || newHead.y < 0 || newHead.y >= rows) {
    return gameOver();
  }
  // Check for collision with self
  if (snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
    return gameOver();
  }
  // Add the new head to the snake’s body
  snake.unshift(newHead);
  // Check if food is eaten
  if (newHead.x === food.x && newHead.y === food.y) {
    food = generateFood();
  } else {
    // Remove tail segment to simulate movement
    snake.pop();
  }
  drawGame();
}

function drawGame() {
  // Clear the canvas (transparent so that the hero content shows through)
  ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height);
  // Draw the snake in teal
  ctx.fillStyle = '#00CED1';
  snake.forEach(segment => {
    ctx.fillRect(segment.x * cellSize, segment.y * cellSize, cellSize, cellSize);
  });
  // Draw the food in pink
  ctx.fillStyle = '#FFC0CB';
  ctx.fillRect(food.x * cellSize, food.y * cellSize, cellSize, cellSize);
}

function gameOver() {
  clearInterval(gameInterval);
  gameEnded.value = true;
}

function moveLeft() {
  // For a left turn in the canvas coordinate system (y increases downward),
  // new direction is (dy, -dx)
  const newDx = dy;
  const newDy = -dx;
  dx = newDx;
  dy = newDy;
}

function moveRight() {
  // For a right turn, new direction is (-dy, dx)
  const newDx = -dy;
  const newDy = dx;
  dx = newDx;
  dy = newDy;
}

function replayGame() {
  initGame();
}

onMounted(() => {
  initGame();
});

onBeforeUnmount(() => {
  if (gameInterval) clearInterval(gameInterval);
});
</script>

<style scoped>
  .responsive-image {
    max-width: 70%;
    height: auto;
    border-radius: 20px;
  }

  /* Hero Container Styling */
  .hero-container {
    position: relative;
    overflow: hidden; 
    background-color: black;
    z-index: 0;
    height: 70vh;
    min-height: 500px;
  }

  .hero-container h1 {
    position: relative;
    z-index: 2;
    overflow: hidden;
    color: white;
  }

  .hero-content {
    position: relative;
    z-index: 3;
  }

  @keyframes animatedgradient {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  .wavering {
    text-align: center;
    margin: 0;
    padding: 5px 0;
    display: inline-block;
    background: linear-gradient(60deg, #5073b8, #1098ad, #07b39b, #6fba82);
    background-size: 300% 300%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: animatedgradient 6s ease infinite alternate;
    user-select: none;
  }

  /* The canvas covers the entire hero container.
     It is transparent so the underlying hero text remains visible.
     Pointer events are disabled to prevent blocking interactions. */
  .snake-canvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    pointer-events: none;
  }

  /* The snake control buttons are fixed at the bottom center of the hero section */
  .snake-controls {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 3;
    display: flex;
    gap: 1rem;
  }
  
  /* Game Over Overlay Styling */
  .game-over-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.7);
    z-index: 4;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    padding-bottom: 20px;
  }
  
  .game-over-content {
    text-align: center;
    color: white;
  }
  
  .about-b42-gradient {
    background: linear-gradient(to bottom, rgba(178, 223, 219, 0.7), rgba(224, 242, 241, 0.8));
  }
</style>
