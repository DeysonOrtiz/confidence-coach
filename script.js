// Main JavaScript for Camera Confidence Coaching

// Default videos for main page
const defaultVideos = {
  video0: {
    id: "1095226090",
    padding: "80.28%",
  },
  video1: {
    id: "1056853912",
    padding: "63.28%",
  },
  video2: {
    id: "1052267805",
    padding: "56.25%",
  },
  video3: {
    id: "847106055",
    padding: "100%",
  },
};

// Global videos object that can be extended per page
let videos = { ...defaultVideos };

// Global array to store all clickable images for navigation
let allImages = [];
let currentImageIndex = 0;

// Function to add more videos (call this in individual pages)
function addVideos(newVideos) {
  videos = { ...videos, ...newVideos };
}

// Function to set videos for a specific page (replaces all videos)
function setVideos(pageVideos) {
  videos = pageVideos;
}

function openLightbox(videoId) {
  const lightbox = document.getElementById("lightbox");
  const videoContainer = document.getElementById("lightbox-video");
  const video = videos[videoId];

  if (!video) {
    console.error(`Video ${videoId} not found`);
    return;
  }

  const videoSrc = `https://player.vimeo.com/video/${video.id}?autoplay=1&badge=0&autopause=0&player_id=0&app_id=58479`;

  // Reset for video content
  videoContainer.style.paddingBottom = video.padding;
  videoContainer.style.height = "0";
  videoContainer.style.maxHeight = "none";
  videoContainer.style.maxWidth = "none";
  videoContainer.style.display = "block";

  videoContainer.innerHTML = `
        <iframe
            src="${videoSrc}"
            frameborder="0"
            allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
            style="position:absolute;top:0;left:0;width:100%;height:100%;"
            allowfullscreen>
        </iframe>`;

  // Hide navigation arrows for videos
  hideImageNavigation();

  // Show lightbox with animation
  lightbox.style.display = "flex";
  document.body.style.overflow = "hidden";

  // Trigger animation after display is set
  requestAnimationFrame(() => {
    lightbox.classList.add("active");
  });
}

// Enhanced function to open images in lightbox with navigation
function openImageLightbox(imageSrc, altText = "", imageIndex = null) {
  const lightbox = document.getElementById("lightbox");
  const videoContainer = document.getElementById("lightbox-video");

  // Set current image index if provided
  if (imageIndex !== null) {
    currentImageIndex = imageIndex;
  }

  // Complete reset for image content
  videoContainer.style.paddingBottom = "0";
  videoContainer.style.height = "auto";
  videoContainer.style.maxHeight = "none";
  videoContainer.style.maxWidth = "none";
  videoContainer.style.display = "flex";
  videoContainer.style.alignItems = "center";
  videoContainer.style.justifyContent = "center";
  videoContainer.style.position = "static";
  videoContainer.style.overflow = "visible";

  // Get the lightbox content container and modify it for images
  const lightboxContent = lightbox.querySelector(".lightbox-content");
  lightboxContent.style.background = "transparent";
  lightboxContent.style.maxWidth = "none";
  lightboxContent.style.width = "auto";
  lightboxContent.style.height = "auto";
  lightboxContent.style.overflow = "visible";

  videoContainer.innerHTML = `
        <img
            src="${imageSrc}"
            alt="${altText}"
            class="lightbox-image"
            style="
                max-width: calc(100vw - 80px);
                max-height: calc(100vh - 80px);
                width: auto;
                height: auto;
                object-fit: contain;
                border-radius: 8px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
                display: block;
                margin: 0 auto;
            "
        />`;

  // Show navigation arrows if there are multiple images
  if (allImages.length > 1) {
    showImageNavigation();
    updateNavigationState();
  }

  // Show lightbox with animation
  lightbox.style.display = "flex";
  document.body.style.overflow = "hidden";

  // Trigger animation after display is set
  requestAnimationFrame(() => {
    lightbox.classList.add("active");
  });
}

// Navigation functions
function showImageNavigation() {
  let prevArrow = document.getElementById("lightbox-prev");
  let nextArrow = document.getElementById("lightbox-next");

  if (!prevArrow) {
    // Create navigation arrows
    const lightbox = document.getElementById("lightbox");

    prevArrow = document.createElement("div");
    prevArrow.id = "lightbox-prev";
    prevArrow.className = "lightbox-nav lightbox-prev";
    prevArrow.innerHTML = "‹";
    prevArrow.onclick = showPreviousImage;

    nextArrow = document.createElement("div");
    nextArrow.id = "lightbox-next";
    nextArrow.className = "lightbox-nav lightbox-next";
    nextArrow.innerHTML = "›";
    nextArrow.onclick = showNextImage;

    lightbox.appendChild(prevArrow);
    lightbox.appendChild(nextArrow);
  }

  prevArrow.style.display = "flex";
  nextArrow.style.display = "flex";
}

function hideImageNavigation() {
  const prevArrow = document.getElementById("lightbox-prev");
  const nextArrow = document.getElementById("lightbox-next");

  if (prevArrow) prevArrow.style.display = "none";
  if (nextArrow) nextArrow.style.display = "none";
}

function updateNavigationState() {
  const prevArrow = document.getElementById("lightbox-prev");
  const nextArrow = document.getElementById("lightbox-next");

  if (prevArrow && nextArrow) {
    // Disable/enable arrows based on position
    prevArrow.style.opacity = currentImageIndex === 0 ? "0.3" : "1";
    nextArrow.style.opacity =
      currentImageIndex === allImages.length - 1 ? "0.3" : "1";

    prevArrow.style.pointerEvents = currentImageIndex === 0 ? "none" : "auto";
    nextArrow.style.pointerEvents =
      currentImageIndex === allImages.length - 1 ? "none" : "auto";
  }
}

function showPreviousImage() {
  if (currentImageIndex > 0) {
    currentImageIndex--;
    const prevImage = allImages[currentImageIndex];
    openImageLightbox(prevImage.src, prevImage.alt, currentImageIndex);
  }
}

function showNextImage() {
  if (currentImageIndex < allImages.length - 1) {
    currentImageIndex++;
    const nextImage = allImages[currentImageIndex];
    openImageLightbox(nextImage.src, nextImage.alt, currentImageIndex);
  }
}

function closeLightbox(event) {
  if (
    event &&
    event.target !== event.currentTarget &&
    !event.target.classList.contains("lightbox-close")
  ) {
    return;
  }

  const lightbox = document.getElementById("lightbox");

  // Start close animation
  lightbox.classList.remove("active");

  // Wait for animation to complete before hiding
  setTimeout(() => {
    const videoContainer = document.getElementById("lightbox-video");
    const lightboxContent = lightbox.querySelector(".lightbox-content");

    lightbox.style.display = "none";
    videoContainer.innerHTML = "";

    // Hide navigation
    hideImageNavigation();

    // Reset all container styles to defaults
    videoContainer.style.height = "0";
    videoContainer.style.maxHeight = "none";
    videoContainer.style.maxWidth = "none";
    videoContainer.style.display = "block";
    videoContainer.style.alignItems = "";
    videoContainer.style.justifyContent = "";
    videoContainer.style.position = "relative";
    videoContainer.style.overflow = "hidden";
    videoContainer.style.paddingBottom = "";

    // Reset lightbox content styles
    lightboxContent.style.background = "#000000";
    lightboxContent.style.maxWidth = "800px";
    lightboxContent.style.width = "90%";
    lightboxContent.style.height = "";
    lightboxContent.style.overflow = "hidden";

    document.body.style.overflow = "auto";
  }, 300); // Match CSS transition duration
}

// Enhanced keyboard support
document.addEventListener("keydown", function (event) {
  const lightbox = document.getElementById("lightbox");

  if (lightbox && lightbox.classList.contains("active")) {
    switch (event.key) {
      case "Escape":
        closeLightbox();
        break;
      case "ArrowLeft":
        event.preventDefault();
        showPreviousImage();
        break;
      case "ArrowRight":
        event.preventDefault();
        showNextImage();
        break;
    }
  }
});

// Enhanced function to make images clickable with navigation support
function makeImagesClickable() {
  // Clear the array first
  allImages = [];

  // Get all images that should be clickable
  const images = document.querySelectorAll("img");

  images.forEach((img) => {
    // Skip small images, logos, and thumbnails
    const isClickableImage =
      img.closest(".story-section") ||
      img.closest(".section") ||
      img.closest(".hero-content");

    // Don't make video thumbnails clickable
    const isVideoThumbnail = img.closest(".video-thumbnail");

    // Don't make logo clickable
    const isLogo =
      img.closest(".logo-initials") ||
      img.classList.contains("logo") ||
      img.closest(".nav-logo");

    if (isClickableImage && !isVideoThumbnail && !isLogo) {
      // Add to our navigation array
      allImages.push({
        element: img,
        src: img.src,
        alt: img.alt,
      });

      // Add clickable class for styling
      img.classList.add("clickable-image");

      // Add click handler with navigation support
      img.addEventListener("click", function (e) {
        // Prevent any potential bubbling
        e.stopPropagation();

        // Find the index of this image in our array
        const imageIndex = allImages.findIndex((item) => item.element === this);

        // Quick scale down animation before opening lightbox
        this.style.transform = "scale(0.95)";

        setTimeout(() => {
          this.style.transform = "";
          openImageLightbox(this.src, this.alt, imageIndex);
        }, 100);
      });

      // Enhanced hover effects
      img.addEventListener("mouseenter", function () {
        this.style.transform = "scale(1.02)";
      });

      img.addEventListener("mouseleave", function () {
        this.style.transform = "scale(1)";
      });
    }
  });
}

// Function to load video thumbnails
function loadVideoThumbnails() {
  for (const key in videos) {
    const videoId = videos[key].id;
    fetch(`https://vimeo.com/api/oembed.json?url=https://vimeo.com/${videoId}`)
      .then((response) => response.json())
      .then((data) => {
        const container = document.querySelector(
          `.video-testimonial[onclick="openLightbox('${key}')"] .video-thumbnail`,
        );
        if (container) {
          // Try multiple higher resolution options
          let highResThumb = data.thumbnail_url
            .replace("_200x150", "_1280x720")
            .replace("_295x166", "_1280x720")
            .replace("_640x360", "_1280x720")
            .replace("_640", "_1280");

          const img = document.createElement("img");
          img.src = highResThumb;
          img.alt = data.title;
          img.style.width = "100%";
          img.style.height = "100%";
          img.style.objectFit = "cover";
          img.style.position = "absolute";
          img.style.top = "0";
          img.style.left = "0";

          // Handle image load errors by trying different resolutions
          img.onerror = function () {
            // Fallback to medium resolution if high-res fails
            this.src = data.thumbnail_url
              .replace("_295x166", "_640x360")
              .replace("_640", "_640");
          };

          container.appendChild(img);
        }
      })
      .catch((error) => {
        console.error("Error fetching Vimeo thumbnail:", error);
      });
  }
}

// Universal scroll notification functionality for all pages

// Function to create scroll notification if it doesn't exist
function createScrollNotification() {
  // Check if scroll notification already exists
  if (document.getElementById("scrollNotification")) {
    return;
  }

  // Create the scroll notification element
  const scrollNotification = document.createElement("div");
  scrollNotification.id = "scrollNotification";
  scrollNotification.className = "scroll-notification";
  scrollNotification.onclick = scrollToContent;

  // Set content based on page
  const pageTitle = document.title.toLowerCase();
  const pageUrl = window.location.pathname.toLowerCase();
  let notificationText = "Scroll to explore more";

  if (
    pageTitle.includes("studio") ||
    pageUrl.includes("studio") ||
    pageTitle.includes("journey")
  ) {
    notificationText = "Scroll to see Jill's transformation";
  } else if (
    pageTitle.includes("confidence") ||
    pageTitle.includes("coaching") ||
    pageUrl.includes("index")
  ) {
    notificationText = "Scroll to discover our services";
  } else if (pageTitle.includes("client") || pageUrl.includes("client")) {
    notificationText = "Scroll to see client results";
  }

  scrollNotification.innerHTML = `
        ${notificationText}
        <span class="scroll-arrow">⬇</span>
    `;

  // Add to page
  document.body.appendChild(scrollNotification);
}

// Universal scroll to content function
function scrollToContent() {
  // Try to find the first meaningful content section
  const targetSelectors = [
    ".story-section",
    ".section",
    ".service-card",
    ".testimonials-grid",
    ".benefits-grid",
    "main section:first-of-type",
    ".container section:first-of-type",
    ".qualification-section",
    ".about-section",
  ];

  let target = null;

  for (const selector of targetSelectors) {
    target = document.querySelector(selector);
    if (target) break;
  }

  // Fallback: scroll down by viewport height
  if (!target) {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    });
  } else {
    target.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }
}

// Universal scroll notification hide/show functionality
function initializeScrollNotification() {
  let scrollTimeout;

  window.addEventListener("scroll", function () {
    const notification = document.getElementById("scrollNotification");
    if (!notification) return;

    const scrollY = window.scrollY;

    // Hide notification after user scrolls 100px
    if (scrollY > 100) {
      notification.classList.add("hidden");
    }

    // Clear any existing timeout
    clearTimeout(scrollTimeout);

    // Set timeout to show notification again if user stops scrolling at top
    scrollTimeout = setTimeout(() => {
      if (scrollY <= 100) {
        notification.classList.remove("hidden");
      }
    }, 2000);
  });

  // Auto-hide notification after 8 seconds
  setTimeout(() => {
    const notification = document.getElementById("scrollNotification");
    if (notification && window.scrollY <= 100) {
      notification.style.animation = "fadeInDown 0.6s ease-out reverse";
      setTimeout(() => {
        notification.classList.add("hidden");
      }, 600);
    }
  }, 8000);
}

// Hamburger menu functionality
function toggleMenu() {
  const hamburger = document.querySelector(".hamburger");
  const navMenu = document.getElementById("navMenu");

  hamburger.classList.toggle("active");
  navMenu.classList.toggle("active");
}

// Close menu when clicking outside
document.addEventListener("click", function (event) {
  const hamburger = document.querySelector(".hamburger");
  const navMenu = document.getElementById("navMenu");

  if (!hamburger.contains(event.target) && !navMenu.contains(event.target)) {
    hamburger.classList.remove("active");
    navMenu.classList.remove("active");
  }
});

// Utility function to create video HTML (for dynamic video creation)
function createVideoHTML(videoKey, title, customClass = "") {
  return `
        <div class="video-testimonial ${customClass}" onclick="openLightbox('${videoKey}')">
            <div class="video-thumbnail" style="padding-bottom: ${videos[videoKey].padding}; position: relative; background: #000;">
                <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 50px; height: 50px; background: rgba(255, 255, 255, 0.9); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                    <span style="color: #000; font-size: 16px; margin-left: 3px;">▶</span>
                </div>
            </div>
            <div class="video-title">${title}</div>
        </div>
    `;
}

// Initialize everything when DOM is ready
document.addEventListener("DOMContentLoaded", function () {
  // Create universal scroll notification
  createScrollNotification();

  // Initialize scroll functionality
  initializeScrollNotification();

  // Load video thumbnails
  loadVideoThumbnails();

  // Small delay to ensure all images are loaded
  setTimeout(() => {
    makeImagesClickable();
  }, 500);
});
