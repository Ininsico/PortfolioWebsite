import React, { useEffect, useRef, useCallback, useState } from "react";
import * as THREE from "three";

const CardScanner = () => {
  const cardStreamRef = useRef(null);
  const cardLineRef = useRef(null);
  const speedIndicatorRef = useRef(null);
  const particleCanvasRef = useRef(null);
  const scannerCanvasRef = useRef(null);
  
  const [speed, setSpeed] = useState(120);
  const [isAnimating, setIsAnimating] = useState(true);

  // Component styles - scoped to this component only
  const styles = {
    container: {
      position: 'relative',
      width: '100%',
      minHeight: '400px',
      backgroundColor: '#000000',
      overflow: 'hidden',
      margin: '0',
      padding: '0'
    },
    controls: {
      position: 'absolute',
      top: '20px',
      left: '20px',
      display: 'flex',
      gap: '10px',
      zIndex: 10
    },
    controlBtn: {
      padding: '10px 20px',
      background: 'rgba(255, 255, 255, 0.2)',
      border: 'none',
      borderRadius: '25px',
      color: 'white',
      fontWeight: 'bold',
      cursor: 'pointer',
      backdropFilter: 'blur(5px)',
      fontSize: '14px'
    },
    speedIndicator: {
      position: 'absolute',
      top: '20px',
      right: '20px',
      color: 'white',
      fontSize: '16px',
      background: 'rgba(0, 0, 0, 0.3)',
      padding: '8px 16px',
      borderRadius: '20px',
      backdropFilter: 'blur(5px)',
      zIndex: 10
    },
    cardStreamContainer: {
      position: 'relative',
      width: '100%',
      height: '300px',
      display: 'flex',
      alignItems: 'center',
      overflow: 'hidden'
    },
    cardStream: {
      position: 'absolute',
      width: '100%',
      height: '180px',
      display: 'flex',
      alignItems: 'center'
    },
    cardLine: {
      display: 'flex',
      alignItems: 'center',
      gap: '60px',
      whiteSpace: 'nowrap',
      cursor: 'grab',
      userSelect: 'none'
    },
    cardWrapper: {
      position: 'relative',
      width: '400px',
      height: '250px',
      flexShrink: 0
    },
    card: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '400px',
      height: '250px',
      borderRadius: '15px',
      overflow: 'hidden'
    },
    cardNormal: {
      background: 'transparent',
      boxShadow: '0 15px 40px rgba(0, 0, 0, 0.4)',
      zIndex: 2
    },
    cardImage: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      borderRadius: '15px'
    },
    cardAscii: {
      background: 'transparent',
      zIndex: 1
    },
    asciiContent: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      color: 'rgba(220, 210, 255, 0.6)',
      fontFamily: '"Courier New", monospace',
      fontSize: '11px',
      lineHeight: '13px',
      overflow: 'hidden',
      whiteSpace: 'pre',
      margin: 0,
      padding: 0
    },
    canvasContainer: {
      position: 'absolute',
      top: '50%',
      left: 0,
      width: '100%',
      transform: 'translateY(-50%)',
      pointerEvents: 'none'
    },
    particleCanvas: {
      width: '100%',
      height: '250px'
    },
    scannerCanvas: {
      width: '100%',
      height: '300px'
    },
    inspirationCredit: {
      position: 'absolute',
      bottom: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      fontFamily: '"Roboto Mono", monospace',
      fontSize: '12px',
      fontWeight: 900,
      color: '#ff9a9c',
      zIndex: 10
    }
  };

  // Core functionality - simplified and React-ified
  const initializeCardScanner = useCallback(() => {
    if (!cardStreamRef.current || !cardLineRef.current) return;

    class CardStreamController {
      constructor() {
        this.container = cardStreamRef.current;
        this.cardLine = cardLineRef.current;
        this.speedIndicator = speedIndicatorRef.current;

        this.position = 0;
        this.velocity = 120;
        this.direction = -1;
        this.isAnimating = true;
        this.isDragging = false;

        this.lastTime = 0;
        this.lastMouseX = 0;
        this.mouseVelocity = 0;
        this.friction = 0.95;
        this.minVelocity = 30;

        this.containerWidth = this.container.offsetWidth;
        this.cardLineWidth = 0;

        this.init();
      }

      init() {
        this.populateCardLine();
        this.calculateDimensions();
        this.setupEventListeners();
        this.animate();
        this.startPeriodicUpdates();
      }

      calculateDimensions() {
        this.containerWidth = this.container.offsetWidth;
        const cardWidth = 400;
        const cardGap = 60;
        const cardCount = this.cardLine.children.length;
        this.cardLineWidth = (cardWidth + cardGap) * cardCount;
      }

      setupEventListeners() {
        this.cardLine.addEventListener("mousedown", (e) => this.startDrag(e));
        document.addEventListener("mousemove", (e) => this.onDrag(e));
        document.addEventListener("mouseup", () => this.endDrag());

        this.cardLine.addEventListener("touchstart", (e) => this.startDrag(e.touches[0]));
        document.addEventListener("touchmove", (e) => this.onDrag(e.touches[0]));
        document.addEventListener("touchend", () => this.endDrag());

        this.cardLine.addEventListener("wheel", (e) => this.onWheel(e));
        
        window.addEventListener("resize", () => {
          this.calculateDimensions();
          this.updateCardPosition();
        });
      }

      startDrag(e) {
        e.preventDefault();
        this.isDragging = true;
        this.isAnimating = false;
        this.lastMouseX = e.clientX;
        this.mouseVelocity = 0;

        const transform = window.getComputedStyle(this.cardLine).transform;
        if (transform !== "none") {
          const matrix = new DOMMatrix(transform);
          this.position = matrix.m41;
        }
      }

      onDrag(e) {
        if (!this.isDragging) return;
        e.preventDefault();

        const deltaX = e.clientX - this.lastMouseX;
        this.position += deltaX;
        this.mouseVelocity = deltaX * 60;
        this.lastMouseX = e.clientX;

        this.cardLine.style.transform = `translateX(${this.position}px)`;
        this.updateCardClipping();
      }

      endDrag() {
        if (!this.isDragging) return;
        this.isDragging = false;

        if (Math.abs(this.mouseVelocity) > this.minVelocity) {
          this.velocity = Math.abs(this.mouseVelocity);
          this.direction = this.mouseVelocity > 0 ? 1 : -1;
        } else {
          this.velocity = 120;
        }

        this.isAnimating = true;
        setSpeed(Math.round(this.velocity));
      }

      animate() {
        const currentTime = performance.now();
        const deltaTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;

        if (this.isAnimating && !this.isDragging) {
          if (this.velocity > this.minVelocity) {
            this.velocity *= this.friction;
          } else {
            this.velocity = Math.max(this.minVelocity, this.velocity);
          }

          this.position += this.velocity * this.direction * deltaTime;
          this.updateCardPosition();
          setSpeed(Math.round(this.velocity));
        }

        requestAnimationFrame(() => this.animate());
      }

      updateCardPosition() {
        const containerWidth = this.containerWidth;
        const cardLineWidth = this.cardLineWidth;

        if (this.position < -cardLineWidth) {
          this.position = containerWidth;
        } else if (this.position > containerWidth) {
          this.position = -cardLineWidth;
        }

        this.cardLine.style.transform = `translateX(${this.position}px)`;
        this.updateCardClipping();
      }

      updateCardClipping() {
        const scannerX = window.innerWidth / 2;
        const scannerWidth = 8;
        const scannerLeft = scannerX - scannerWidth / 2;
        const scannerRight = scannerX + scannerWidth / 2;

        document.querySelectorAll(".card-wrapper").forEach((wrapper) => {
          const rect = wrapper.getBoundingClientRect();
          const cardLeft = rect.left;
          const cardRight = rect.right;
          const cardWidth = rect.width;

          const normalCard = wrapper.querySelector(".card-normal");
          const asciiCard = wrapper.querySelector(".card-ascii");

          if (cardLeft < scannerRight && cardRight > scannerLeft) {
            const scannerIntersectLeft = Math.max(scannerLeft - cardLeft, 0);
            const scannerIntersectRight = Math.min(scannerRight - cardLeft, cardWidth);

            const normalClipRight = (scannerIntersectLeft / cardWidth) * 100;
            const asciiClipLeft = (scannerIntersectRight / cardWidth) * 100;

            normalCard.style.clipPath = `inset(0 0 0 ${normalClipRight}%)`;
            asciiCard.style.clipPath = `inset(0 calc(100% - ${asciiClipLeft}%) 0 0)`;
          }
        });
      }

      generateCode(width, height) {
        const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789(){}[]<>;:,._-+=!@#$%^&*|\\/\"'`~?";
        let code = "";
        
        for (let i = 0; i < height; i++) {
          for (let j = 0; j < width; j++) {
            code += chars[Math.floor(Math.random() * chars.length)];
          }
          if (i < height - 1) code += "\n";
        }
        return code;
      }

      createCardWrapper(index) {
        const wrapper = document.createElement("div");
        wrapper.className = "card-wrapper";
        wrapper.style.cssText = `
          position: relative;
          width: 400px;
          height: 250px;
          flex-shrink: 0;
        `;

        const normalCard = document.createElement("div");
        normalCard.className = "card-normal";
        normalCard.style.cssText = `
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 15px;
          overflow: hidden;
          background: transparent;
        `;

        const cardImage = document.createElement("img");
        cardImage.className = "card-image";
        cardImage.style.cssText = `
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 15px;
        `;
        
        // Use gradient as fallback instead of external images
        const canvas = document.createElement("canvas");
        canvas.width = 400;
        canvas.height = 250;
        const ctx = canvas.getContext("2d");
        const gradient = ctx.createLinearGradient(0, 0, 400, 250);
        gradient.addColorStop(0, "#667eea");
        gradient.addColorStop(1, "#764ba2");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 400, 250);
        cardImage.src = canvas.toDataURL();

        normalCard.appendChild(cardImage);

        const asciiCard = document.createElement("div");
        asciiCard.className = "card-ascii";
        asciiCard.style.cssText = `
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 15px;
          overflow: hidden;
          background: transparent;
        `;

        const asciiContent = document.createElement("div");
        asciiContent.className = "ascii-content";
        asciiContent.style.cssText = `
          position: absolute;
          width: 100%;
          height: 100%;
          color: rgba(220, 210, 255, 0.6);
          font-family: "Courier New", monospace;
          font-size: 11px;
          line-height: 13px;
          white-space: pre;
          margin: 0;
          padding: 0;
        `;
        
        asciiContent.textContent = this.generateCode(60, 20);
        asciiCard.appendChild(asciiContent);

        wrapper.appendChild(normalCard);
        wrapper.appendChild(asciiCard);

        return wrapper;
      }

      populateCardLine() {
        this.cardLine.innerHTML = "";
        for (let i = 0; i < 10; i++) {
          const cardWrapper = this.createCardWrapper(i);
          this.cardLine.appendChild(cardWrapper);
        }
        this.calculateDimensions();
      }

      startPeriodicUpdates() {
        setInterval(() => {
          this.updateCardClipping();
        }, 1000 / 60);
      }

      toggleAnimation() {
        this.isAnimating = !this.isAnimating;
        setIsAnimating(this.isAnimating);
      }

      resetPosition() {
        this.position = this.containerWidth;
        this.velocity = 120;
        this.direction = -1;
        this.isAnimating = true;
        this.isDragging = false;
        setSpeed(120);
        setIsAnimating(true);
        this.updateCardPosition();
      }

      changeDirection() {
        this.direction *= -1;
      }
    }

    return new CardStreamController();
  }, []);

  // Initialize everything
  useEffect(() => {
    const cardStream = initializeCardScanner();
    
    // Store for cleanup
    cardStreamController.current = cardStream;

    return () => {
      // Cleanup
      if (cardStreamController.current) {
        // Remove event listeners, etc.
      }
    };
  }, [initializeCardScanner]);

  const toggleAnimation = () => {
    cardStreamController.current?.toggleAnimation();
  };

  const resetPosition = () => {
    cardStreamController.current?.resetPosition();
  };

  const changeDirection = () => {
    cardStreamController.current?.changeDirection();
  };

  return (
    <div style={styles.container}>
      <div style={styles.controls}>
        <button 
          style={styles.controlBtn}
          onClick={toggleAnimation}
        >
          {isAnimating ? "⏸️ Pause" : "▶️ Play"}
        </button>
        <button 
          style={styles.controlBtn}
          onClick={resetPosition}
        >
          🔄 Reset
        </button>
        <button 
          style={styles.controlBtn}
          onClick={changeDirection}
        >
          ↕️ Direction
        </button>
      </div>

      <div style={styles.speedIndicator}>
        Speed: <span ref={speedIndicatorRef}>{speed}</span> px/s
      </div>

      <div style={styles.cardStreamContainer}>
        <div style={styles.canvasContainer}>
          <canvas 
            ref={particleCanvasRef} 
            style={styles.particleCanvas}
          />
          <canvas 
            ref={scannerCanvasRef} 
            style={styles.scannerCanvas}
          />
        </div>

        <div 
          ref={cardStreamRef}
          style={styles.cardStream}
        >
          <div 
            ref={cardLineRef}
            style={styles.cardLine}
          />
        </div>
      </div>

      <div style={styles.inspirationCredit}>
        Arslan Rathore
      </div>
    </div>
  );
};

export default CardScanner;