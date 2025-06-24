// Main JavaScript for Camera Confidence Coaching

// Default videos for main page
const defaultVideos = {
    video0: {
        id: '1095226090',
        padding: '80.28%'
    },
    video1: {
        id: '1056853912',
        padding: '63.28%'
    },
    video2: {
        id: '1052267805',
        padding: '56.25%'
    },
    video3: {
        id: '847106055',
        padding: '100%'
    }
};

// Global videos object that can be extended per page
let videos = { ...defaultVideos };

// Function to add more videos (call this in individual pages)
function addVideos(newVideos) {
    videos = { ...videos, ...newVideos };
}

// Function to set videos for a specific page (replaces all videos)
function setVideos(pageVideos) {
    videos = pageVideos;
}

function openLightbox(videoId) {
    const lightbox = document.getElementById('lightbox');
    const videoContainer = document.getElementById('lightbox-video');
    const video = videos[videoId];
    
    if (!video) {
        console.error(`Video ${videoId} not found`);
        return;
    }
    
    const videoSrc = `https://player.vimeo.com/video/${video.id}?autoplay=1&badge=0&autopause=0&player_id=0&app_id=58479`;

    videoContainer.style.paddingBottom = video.padding;
    videoContainer.innerHTML = `
        <iframe
            src="${videoSrc}"
            frameborder="0"
            allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
            style="position:absolute;top:0;left:0;width:100%;height:100%;"
            allowfullscreen>
        </iframe>`;

    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox(event) {
    if (event && event.target !== event.currentTarget && !event.target.classList.contains('lightbox-close')) {
        return;
    }

    const lightbox = document.getElementById('lightbox');
    const videoContainer = document.getElementById('lightbox-video');

    lightbox.classList.remove('active');
    videoContainer.innerHTML = '';
    document.body.style.overflow = 'auto';
}

document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeLightbox();
    }
});

// Function to load video thumbnails
function loadVideoThumbnails() {
    for (const key in videos) {
        const videoId = videos[key].id;
        fetch(`https://vimeo.com/api/oembed.json?url=https://vimeo.com/${videoId}`)
            .then(response => response.json())
            .then(data => {
                const container = document.querySelector(`.video-testimonial[onclick="openLightbox('${key}')"] .video-thumbnail`);
                if (container) {
                    // Try multiple higher resolution options
                    let highResThumb = data.thumbnail_url
                        .replace('_200x150', '_1280x720')
                        .replace('_295x166', '_1280x720')
                        .replace('_640x360', '_1280x720')
                        .replace('_640', '_1280');

                    const img = document.createElement('img');
                    img.src = highResThumb;
                    img.alt = data.title;
                    img.style.width = '100%';
                    img.style.height = '100%';
                    img.style.objectFit = 'cover';
                    img.style.position = 'absolute';
                    img.style.top = '0';
                    img.style.left = '0';

                    // Handle image load errors by trying different resolutions
                    img.onerror = function() {
                        // Fallback to medium resolution if high-res fails
                        this.src = data.thumbnail_url.replace('_295x166', '_640x360').replace('_640', '_640');
                    };

                    container.appendChild(img);
                }
            })
            .catch(error => {
                console.error('Error fetching Vimeo thumbnail:', error);
            });
    }
}

// Load thumbnails when DOM is ready
document.addEventListener('DOMContentLoaded', function () {
    loadVideoThumbnails();
});

// Hamburger menu functionality
function toggleMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.getElementById('navMenu');
    
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
}

// Close menu when clicking outside
document.addEventListener('click', function(event) {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.getElementById('navMenu');
    
    if (!hamburger.contains(event.target) && !navMenu.contains(event.target)) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// Utility function to create video HTML (for dynamic video creation)
function createVideoHTML(videoKey, title, customClass = '') {
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