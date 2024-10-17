const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 600;
canvas.height = 800;

let circles = [];
let score = 0;
let currentCircleIndex = 0; // Index des aktuellen Kreises
let timer = 0; // Timer für den Ansatzkreis
const maxTimer = 150; // Maximale Dauer des Ansatzkreises in Frames

// Star image
const starImage = new Image();
starImage.src = 'https://img.icons8.com/emoji/48/star-emoji.png'; // Use a star icon URL

// Circle class
class Circle {
    constructor(x, y, radius, number) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.approachRadius = radius + 75; // Initial approach circle radius
        this.number = number;
        this.starCollected = false;
        this.active = false; // Zustand, ob der Ansatzkreis aktiv ist
    }

    draw() {
        // Draw approach circle only if active
        if (this.active) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.approachRadius, 0, Math.PI * 2);
            ctx.strokeStyle = '#999';
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.closePath();

            // Shrink approach circle
            if (this.approachRadius > this.radius) {
                this.approachRadius -= 1;
            }
        }

        // Draw main circle
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.fill();
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.closePath();

        // Draw number inside circle
        ctx.fillStyle = '#000';
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.number, this.x, this.y);

        // Draw star if not collected
        if (!this.starCollected) {
            ctx.drawImage(starImage, this.x - 15, this.y - 15, 30, 30);
        }
    }

    checkClick(x, y) {
        const distance = Math.sqrt((x - this.x) ** 2 + (y - this.y) ** 2);
        if (distance < this.radius) {
            this.starCollected = true;
            return true;
        }
        return false;
    }
}

// Create circles with path lines
function createCircles() {
    let positions = [
        { x: 150, y: 700 }, { x: 300, y: 600 }, { x: 150, y: 500 },
        { x: 300, y: 400 }, { x: 150, y: 300 }, { x: 450, y: 200 }, { x: 150, y: 100}
    ];
    
    positions.forEach((pos, index) => {
        circles.push(new Circle(pos.x, pos.y, 30, index + 1));
    });
    circles[currentCircleIndex].active = true; // Aktiviere den ersten Ansatzkreis
}

// Draw path lines between circles
function drawPathLines() {
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    for (let i = 0; i < circles.length - 1; i++) {
        ctx.beginPath();
        ctx.moveTo(circles[i].x, circles[i].y);
        ctx.lineTo(circles[i + 1].x, circles[i + 1].y);
        ctx.stroke();
        ctx.closePath();
    }
}

// Game loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw path lines
    drawPathLines();

    // Draw circles
    circles.forEach(circle => circle.draw());

    // Manage timer for approach circle
    if (circles[currentCircleIndex].active) {
        timer++;
        if (timer > maxTimer) {
            // Timeout für den Ansatzkreis
            circles[currentCircleIndex].active = false;
            currentCircleIndex++; // Gehe zum nächsten circle
            if (currentCircleIndex < circles.length) {
                circles[currentCircleIndex].active = true; // Aktiviere den nächsten approachcircles
                timer = 0; // Reset Timer
            } else {
                
                alert("Das Spiel ist beendet! Punkte: " + score);
                resetGame();
            }
        }
    }

    requestAnimationFrame(gameLoop);
}

// Handle clicks
canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (circles[currentCircleIndex].checkClick(x, y) && !circles[currentCircleIndex].starCollected) {
        score++;
        document.getElementById('score').textContent = score;
        circles[currentCircleIndex].active = false; // Deaktivieren des Ansatzkreises
        currentCircleIndex++; // Gehe zum nächsten Kreis
        timer = 0; // Reset Timer

        if (currentCircleIndex < circles.length) {
            circles[currentCircleIndex].active = true; // Aktiviere den nächsten Ansatzkreis
        }
    }
});

// Reset game
function resetGame() {
    score = 0;
    document.getElementById('score').textContent = score;
    currentCircleIndex = 0;
    timer = 0;
    circles.forEach(circle => {
        circle.starCollected = false;
        circle.approachRadius = circle.radius + 75; // Reset Ansatzkreisradius
    });
    circles[currentCircleIndex].active = true; // Aktiviere den ersten Ansatzkreis
}

// Initialize game
createCircles();
gameLoop();
