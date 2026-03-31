// Mobile Menu Toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');
const navButtons = document.querySelector('.nav-buttons');

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenuBtn.classList.toggle('active');
        navLinks.classList.toggle('active');
        navButtons.classList.toggle('active');
    });
}

// Smooth Scrolling for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });

            // Close mobile menu if open
            if (mobileMenuBtn && mobileMenuBtn.classList.contains('active')) {
                mobileMenuBtn.classList.remove('active');
                navLinks.classList.remove('active');
                navButtons.classList.remove('active');
            }
        }
    });
});

// Intersection Observer for Animations
const observerOptions = {
    root: null,
    rootMargin: '0px 0px -100px 0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        }
    });
}, observerOptions);

// Observe feature cards for animation
document.querySelectorAll('.feature-card').forEach(el => {
    observer.observe(el);
});

// Observe pricing cards for animation
document.querySelectorAll('.pricing-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(40px)';
    el.style.transition = 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
    observer.observe(el);
});

// Observe section headers for animation
document.querySelectorAll('.section-header').forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = `opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.2}s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.2}s`;
    observer.observe(el);
});

// Observe hero elements for animation
document.querySelectorAll('.hero-badge, .hero h1, .hero-subtitle, .hero-cta, .hero-stats').forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = `opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.1}s, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.1}s`;
    observer.observe(el);
});

// Button Click Effects
document.querySelectorAll('.btn-primary, .btn-secondary').forEach(button => {
    button.addEventListener('click', function(e) {
        // Create ripple effect
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        `;
        
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});

// Add ripple animation
document.head.insertAdjacentHTML('beforeend', `
    <style>
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    </style>
`);

// Counter Animation for Stats
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    function updateCounter() {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    }
    
    updateCounter();
}

// Animate stats when they come into view
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const text = stat.textContent;
                const number = parseInt(text.replace(/[^0-9]/g, ''));
                if (number) {
                    stat.textContent = '0';
                    setTimeout(() => {
                        animateCounter(stat, number);
                        // Restore original format after animation
                        setTimeout(() => {
                            stat.textContent = text;
                        }, 2000);
                    }, 500);
                }
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
    statsObserver.observe(heroStats);
}

// Parallax Effect for Hero
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroVisual = document.querySelector('.hero-visual');
    const heroContent = document.querySelector('.hero-content');
    
    if (heroVisual && scrolled < window.innerHeight) {
        heroVisual.style.transform = `translateY(${scrolled * 0.1}px)`;
    }
    
    if (heroContent && scrolled < window.innerHeight) {
        heroContent.style.transform = `translateY(${scrolled * 0.05}px)`;
    }
});

// Form Validation (if forms are added)
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Toast Notifications
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#8b5cf6'};
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        font-size: 14px;
        font-weight: 500;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.4);
        z-index: 9999;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Add toast animations
document.head.insertAdjacentHTML('beforeend', `
    <style>
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    </style>
`);

// Lazy Loading for Images (if images are added)
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Keyboard Navigation
document.addEventListener('keydown', (e) => {
    // ESC key closes mobile menu
    if (e.key === 'Escape' && mobileMenuBtn && mobileMenuBtn.classList.contains('active')) {
        mobileMenuBtn.classList.remove('active');
        navLinks.classList.remove('active');
        navButtons.classList.remove('active');
    }
});

// Focus Management for Accessibility
document.querySelectorAll('button, a').forEach(element => {
    element.addEventListener('focus', function() {
        this.style.outline = '2px solid #8b5cf6';
        this.style.outlineOffset = '2px';
    });
    
    element.addEventListener('blur', function() {
        this.style.outline = 'none';
    });
});

// Performance: Debounce scroll events
function debounce(func, wait = 10) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debounce to scroll events
const debouncedScroll = debounce(() => {
    // Any additional scroll-based logic can go here
}, 10);

window.addEventListener('scroll', debouncedScroll);

// Initialize on DOM Load
document.addEventListener('DOMContentLoaded', () => {
    // Add loaded class to body
    document.body.classList.add('loaded');
    
    // Initialize any components that need setup
    console.log('Rootio Landing Page Loaded Successfully! 🌱');
    
    // Initialize Features Scroll
    initFeaturesScroll();
});

// Features Scroll Navigation
function initFeaturesScroll() {
    const featuresScroll = document.querySelector('.features-scroll');
    const featuresContainer = document.querySelector('.features-scroll-container');
    
    if (!featuresScroll || !featuresContainer) return;
    
    const featureCards = featuresScroll.querySelectorAll('.feature-card');
    const totalCards = featureCards.length;
    
    // Clone cards for infinite scroll - add multiple sets for seamless looping
    const originalCards = Array.from(featureCards);
    const cloneSets = 4; // Number of complete sets to clone
    
    for (let i = 0; i < cloneSets; i++) {
        originalCards.forEach(card => {
            const clone = card.cloneNode(true);
            clone.setAttribute('aria-hidden', 'true');
            featuresScroll.appendChild(clone);
        });
    }
    
    // Update card count after cloning
    const allCards = featuresScroll.querySelectorAll('.feature-card');
    
    // Observe all cards (including clones) for scroll reveal animation
    allCards.forEach(card => {
        observer.observe(card);
    });
    
    // Add navigation buttons
    const navContainer = document.createElement('div');
    navContainer.className = 'scroll-nav-container';
    
    const prevButton = document.createElement('button');
    prevButton.className = 'scroll-nav';
    prevButton.innerHTML = '<i class="ph ph-caret-left"></i>';
    prevButton.setAttribute('aria-label', 'Anterior');
    
    const nextButton = document.createElement('button');
    nextButton.className = 'scroll-nav';
    nextButton.innerHTML = '<i class="ph ph-caret-right"></i>';
    nextButton.setAttribute('aria-label', 'Próximo');
    
    navContainer.appendChild(prevButton);
    navContainer.appendChild(nextButton);
    featuresContainer.appendChild(navContainer);
    
    // Navigation variables
    let activeCardIndex = 0;
    
    // Update active card
    function updateActiveCard(index) {
        // Remove active class from all cards
        allCards.forEach(card => card.classList.remove('active'));
        
        // Add active class to the selected card
        const activeCard = allCards[index];
        if (activeCard) {
            activeCard.classList.add('active');
        }
        
        activeCardIndex = index;
    }
    
    // Scroll to specific card
    function scrollToCard(index) {
        const cardWidth = originalCards[0].offsetWidth + 24;
        const targetScroll = index * cardWidth;
        
        featuresScroll.scrollTo({
            left: targetScroll,
            behavior: 'smooth'
        });
        
        updateActiveCard(index);
    }
    
    // Navigation button events
    prevButton.addEventListener('click', () => {
        const newIndex = Math.max(0, activeCardIndex - 1);
        scrollToCard(newIndex);
    });
    
    nextButton.addEventListener('click', () => {
        const newIndex = Math.min(totalCards - 1, activeCardIndex + 1);
        scrollToCard(newIndex);
    });
    
    // Touch/drag scroll enhancement
    let isDragging = false;
    let startX;
    let scrollLeft;
    
    featuresScroll.addEventListener('mousedown', (e) => {
        isDragging = true;
        isUserInteracting = true;
        clearTimeout(userInteractionTimeout);
        startX = e.pageX - featuresScroll.offsetLeft;
        scrollLeft = featuresScroll.scrollLeft;
        featuresScroll.style.cursor = 'grabbing';
    });
    
    featuresScroll.addEventListener('mouseleave', () => {
        if (isDragging) {
            isDragging = false;
            featuresScroll.style.cursor = 'grab';
            userInteractionTimeout = setTimeout(() => {
                isUserInteracting = false;
            }, 2000);
        }
    });
    
    featuresScroll.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            featuresScroll.style.cursor = 'grab';
            userInteractionTimeout = setTimeout(() => {
                isUserInteracting = false;
            }, 2000);
        }
    });
    
    featuresScroll.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - featuresScroll.offsetLeft;
        const walk = (x - startX) * 2;
        featuresScroll.scrollLeft = scrollLeft - walk;
        currentScroll = featuresScroll.scrollLeft;
    });
    
    // Wheel scroll support
    featuresScroll.addEventListener('wheel', (e) => {
        isUserInteracting = true;
        clearTimeout(userInteractionTimeout);
        
        if (e.deltaY !== 0) {
            e.preventDefault();
            featuresScroll.scrollLeft += e.deltaY;
            currentScroll = featuresScroll.scrollLeft;
        }
        
        userInteractionTimeout = setTimeout(() => {
            isUserInteracting = false;
        }, 2000);
    }, { passive: false });
    
    // Touch scroll support
    let touchStartX = 0;
    let touchStartScroll = 0;
    
    featuresScroll.addEventListener('touchstart', (e) => {
        isUserInteracting = true;
        clearTimeout(userInteractionTimeout);
        touchStartX = e.touches[0].clientX;
        touchStartScroll = featuresScroll.scrollLeft;
        featuresScroll.style.cursor = 'grabbing';
    }, { passive: true });
    
    featuresScroll.addEventListener('touchmove', (e) => {
        if (!isUserInteracting) return;
        
        const touchX = e.touches[0].clientX;
        const deltaX = touchStartX - touchX;
        featuresScroll.scrollLeft = touchStartScroll + deltaX;
        currentScroll = featuresScroll.scrollLeft;
    }, { passive: true });
    
    featuresScroll.addEventListener('touchend', () => {
        featuresScroll.style.cursor = 'grab';
        userInteractionTimeout = setTimeout(() => {
            isUserInteracting = false;
        }, 2000);
    }, { passive: true });
    
    // Initialize first card as active
    updateActiveCard(0);
    
    // Make featuresScroll focusable for keyboard navigation
    featuresScroll.setAttribute('tabindex', '0');
}

// Service Worker Registration (for PWA support)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('ServiceWorker registration successful');
            })
            .catch(err => {
                console.log('ServiceWorker registration failed: ', err);
            });
    });
}
