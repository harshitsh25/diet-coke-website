// Elements
const canvas = document.getElementById('animation-canvas');
const context = canvas.getContext('2d');
const loader = document.getElementById('loader');
const progressCircle = document.getElementById('progress-circle');
const loaderPercentage = document.getElementById('loader-percentage');
const scrollHint = document.getElementById('scroll-hint');
const progressBar = document.getElementById('scroll-progress-bar');
const progressText = document.getElementById('scroll-percentage-text');
const progressContainer = document.getElementById('scroll-progress-container');

// Configurations
const frameCount = 240;
const images = [];
let loadedCount = 0;
const circleCircumference = 282.7; // SVG circle length (2 * pi * r)

// Animation State
let currentFrameIndex = 0;
let targetFrameIndex = 0;
const lerpFactor = 0.07; // Easing intensity (0.05 to 0.1 is optimal for smooth inertia)
let isAnimating = false;

// Helper to format frame filename (e.g. ezgif-frame-001.jpg)
const getFrameUrl = (index) => `ezgif-frame-${index.toString().padStart(3, '0')}.jpg`;

// Preload Images
function preloadImages() {
    for (let i = 1; i <= frameCount; i++) {
        const img = new Image();
        img.src = getFrameUrl(i);
        
        img.onload = () => {
            loadedCount++;
            onFrameLoadProgress();
        };
        
        img.onerror = () => {
            console.warn(`Could not load frame ${i}. Skipping...`);
            loadedCount++;
            onFrameLoadProgress();
        };
        
        images.push(img);
    }
}

// Track and display progress
function onFrameLoadProgress() {
    const ratio = loadedCount / frameCount;
    const percent = Math.round(ratio * 100);
    
    // Update percentage text
    loaderPercentage.textContent = `${percent}%`;
    
    // Update SVG stroke-dashoffset
    const offset = circleCircumference - (ratio * circleCircumference);
    progressCircle.style.strokeDashoffset = offset;
    
    // Start animation if loaded all frames
    if (loadedCount === frameCount) {
        setTimeout(initApp, 500); // Small delay to enjoy 100% completion look
    }
}

// Draw frame using object-fit: cover sizing
function drawImageCover(ctx, img) {
    const canvasWidth = ctx.canvas.width;
    const canvasHeight = ctx.canvas.height;
    
    const imgWidth = img.width;
    const imgHeight = img.height;
    
    // Fit canvas aspect ratio to image
    const ratio = Math.max(canvasWidth / imgWidth, canvasHeight / imgHeight);
    
    const newWidth = imgWidth * ratio;
    const newHeight = imgHeight * ratio;
    
    // Center image
    const x = (canvasWidth - newWidth) / 2;
    const y = (canvasHeight - newHeight) / 2;
    
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.drawImage(img, x, y, newWidth, newHeight);
}

// Render the frame at the specified index
function renderFrame(index) {
    const safeIndex = Math.min(frameCount - 1, Math.max(0, index));
    const img = images[safeIndex];
    if (img && img.complete) {
        drawImageCover(context, img);
    }
}

// Smooth Linear Interpolation (lerp) loop
function updatePhysicsLoop() {
    const diff = targetFrameIndex - currentFrameIndex;
    
    // Calculate current interpolated fraction
    const currentFraction = currentFrameIndex / (frameCount - 1);
    updateHeaderOpacity(currentFraction);
    
    if (Math.abs(diff) > 0.01) {
        currentFrameIndex += diff * lerpFactor;
        renderFrame(Math.round(currentFrameIndex));
        requestAnimationFrame(updatePhysicsLoop);
    } else {
        currentFrameIndex = targetFrameIndex;
        renderFrame(Math.round(currentFrameIndex));
        isAnimating = false;
        
        // Final state sync
        updateHeaderOpacity(targetFrameIndex / (frameCount - 1));
    }
}

// Fade out logo and subheading overlay based on animation fraction (complete by 30% scroll)
function updateHeaderOpacity(fraction) {
    const headerOverlay = document.getElementById('animation-header');
    if (headerOverlay) {
        const opacity = Math.max(0, 1 - (fraction / 0.3));
        headerOverlay.style.opacity = opacity;
        if (opacity <= 0) {
            headerOverlay.style.visibility = 'hidden';
        } else {
            headerOverlay.style.visibility = 'visible';
        }
    }
}

// Track and update active navigation link highlight
function updateActiveNavLink() {
    const sections = [
        { id: 'animation-section', link: document.querySelector('a[href="#animation-section"]') },
        { id: 'refreshment', link: document.querySelector('a[href="#refreshment"]') },
        { id: 'style-spirit', link: document.querySelector('a[href="#style-spirit"]') },
        { id: 'newsletter', link: document.querySelector('a[href="#newsletter"]') }
    ];
    
    let currentActiveSection = sections[0];
    
    for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
            const rect = element.getBoundingClientRect();
            if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
                currentActiveSection = section;
                break;
            }
        }
    }
    
    sections.forEach(section => {
        if (section.link) {
            if (section === currentActiveSection) {
                section.link.classList.add('active');
            } else {
                section.link.classList.remove('active');
            }
        }
    });
}

// Handle scroll updates relative to the sticky wrapper
function handleScroll() {
    const animationSection = document.getElementById('animation-section');
    if (!animationSection) return;
    
    const rect = animationSection.getBoundingClientRect();
    const maxScroll = animationSection.scrollHeight - window.innerHeight;
    const currentScroll = -rect.top;
    
    const scrollFraction = Math.min(1, Math.max(0, currentScroll / maxScroll));
    
    // Set target frame
    targetFrameIndex = scrollFraction * (frameCount - 1);
    
    // Fire interpolation loop if idle
    if (!isAnimating) {
        isAnimating = true;
        requestAnimationFrame(updatePhysicsLoop);
    }
    
    // Update scroll progress bar UI
    const scrollPercent = Math.round(scrollFraction * 100);
    progressBar.style.height = `${scrollPercent}%`;
    progressText.textContent = `${scrollPercent}%`;
    
    // Toggle navigation bar contrast state
    const nav = document.getElementById('main-nav');
    if (nav) {
        if (scrollFraction >= 0.99) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    }
    
    // Update active highlight link
    updateActiveNavLink();
    
    // Toggle indicators visibility
    if (scrollFraction >= 0.99) {
        // Hide progress bar and hint when we scroll past the animation section
        progressContainer.classList.remove('visible');
        scrollHint.classList.add('hidden');
    } else {
        // Show progress bar
        progressContainer.classList.add('visible');
        
        // Toggle scroll hint visibility based on scroll depth
        if (currentScroll > 50) {
            scrollHint.classList.add('hidden');
        } else {
            scrollHint.classList.remove('hidden');
        }
    }
}

// Handle canvas resizing for Retina sharpness
function handleResize() {
    const scale = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * scale;
    canvas.height = window.innerHeight * scale;
    
    // Immediately redraw current frame after size change
    renderFrame(Math.round(currentFrameIndex));
}

// Initialize application state
function initApp() {
    // Hide loader
    loader.classList.add('fade-out');
    
    // Setup canvas size
    handleResize();
    
    // Show first frame
    renderFrame(0);
    updateHeaderOpacity(0);
    updateActiveNavLink();
    
    // Event listeners
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Reveal indicators
    setTimeout(() => {
        progressContainer.classList.add('visible');
        scrollHint.classList.remove('hidden');
    }, 600);
}

// Start preloading after page is ready
document.addEventListener('DOMContentLoaded', preloadImages);
