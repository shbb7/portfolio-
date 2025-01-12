// Smooth scrolling with offset for fixed header
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        const headerOffset = 70;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    });
});

// Advanced typewriter effect with cursor
const TypeWriter = function(txtElement, words, wait = 3000) {
    this.txtElement = txtElement;
    this.words = words;
    this.txt = '';
    this.wordIndex = 0;
    this.wait = parseInt(wait, 10);
    this.type();
    this.isDeleting = false;
}

TypeWriter.prototype.type = function() {
    const current = this.wordIndex % this.words.length;
    const fullTxt = this.words[current];

    if(this.isDeleting) {
        this.txt = fullTxt.substring(0, this.txt.length - 1);
    } else {
        this.txt = fullTxt.substring(0, this.txt.length + 1);
    }

    this.txtElement.innerHTML = `<span class="txt">${this.txt}</span><span class="cursor">|</span>`;

    let typeSpeed = 200;

    if(this.isDeleting) {
        typeSpeed /= 2;
    }

    if(!this.isDeleting && this.txt === fullTxt) {
        typeSpeed = this.wait;
        this.isDeleting = true;
    } else if(this.isDeleting && this.txt === '') {
        this.isDeleting = false;
        this.wordIndex++;
        typeSpeed = 500;
    }

    setTimeout(() => this.type(), typeSpeed);
}

// Initialize TypeWriter
window.addEventListener('load', init);

function init() {
    const txtElement = document.querySelector('.typewriter');
    const words = ['Professional Graphics Designer', 'Front-End Developer', 'UI/UX Designer'];
    new TypeWriter(txtElement, words, 2000);
}

// Mobile menu functionality with smooth animation
const menuBtn = document.querySelector('.menu-btn');
const navLinks = document.querySelector('.nav-links');
let menuOpen = false;

menuBtn.addEventListener('click', () => {
    if(!menuOpen) {
        menuBtn.classList.add('open');
        navLinks.classList.add('active');
        menuOpen = true;
    } else {
        menuBtn.classList.remove('open');
        navLinks.classList.remove('active');
        menuOpen = false;
    }
});

// Scroll reveal animation with IntersectionObserver
const observerOptions = {
    threshold: 0.25,
    rootMargin: "0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            if(entry.target.classList.contains('skill-category')) {
                animateSkills(entry.target);
            }
        }
    });
}, observerOptions);

document.querySelectorAll('section, .portfolio-item, .skill-category').forEach(el => {
    el.classList.add('reveal');
    observer.observe(el);
});

// Animate skills progress
function animateSkills(skillCategory) {
    const skills = skillCategory.querySelectorAll('.skill-progress');
    skills.forEach(skill => {
        const progress = skill.dataset.progress;
        skill.style.width = progress + '%';
    });
}

// Portfolio filtering
const filterButtons = document.querySelectorAll('.filter-btn');
const portfolioGrid = document.querySelector('.portfolio-grid');
const portfolioItems = document.querySelectorAll('.portfolio-item');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        button.classList.add('active');
        
        const filterValue = button.getAttribute('data-filter');
        
        // Add filtering class to enable transition
        portfolioGrid.classList.add('filtering');
        
        setTimeout(() => {
            portfolioItems.forEach(item => {
                const itemCategory = item.getAttribute('data-category');
                
                if (filterValue === 'all' || itemCategory === filterValue) {
                    item.classList.remove('hidden');
                    setTimeout(() => {
                        item.classList.remove('fade-out');
                    }, 10);
                } else {
                    item.classList.add('fade-out');
                    setTimeout(() => {
                        item.classList.add('hidden');
                    }, 300);
                }
            });
            
            // Remove filtering class to show items
            portfolioGrid.classList.remove('filtering');
        }, 300);
    });
});

// Form validation and submission
const contactForm = document.getElementById('contact-form');
const formInputs = contactForm.querySelectorAll('input, textarea');

formInputs.forEach(input => {
    input.addEventListener('focus', () => {
        input.parentElement.classList.add('focused');
    });

    input.addEventListener('blur', () => {
        if (input.value === '') {
            input.parentElement.classList.remove('focused');
        }
    });
});

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Basic form validation
    let isValid = true;
    formInputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.classList.add('error');
        } else {
            input.classList.remove('error');
        }
    });

    if (!isValid) {
        showNotification('Please fill in all fields', 'error');
        return;
    }

    // Show success message
    showNotification('Thank you for your message! I will get back to you soon.', 'success');
    contactForm.reset();
});

// Notification system
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Navbar scroll effect with throttle
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

window.addEventListener('scroll', throttle(() => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        navbar.classList.remove('scroll-up');
        return;
    }
    
    if (currentScroll > lastScroll && !navbar.classList.contains('scroll-down')) {
        navbar.classList.remove('scroll-up');
        navbar.classList.add('scroll-down');
    } else if (currentScroll < lastScroll && navbar.classList.contains('scroll-down')) {
        navbar.classList.remove('scroll-down');
        navbar.classList.add('scroll-up');
    }
    
    lastScroll = currentScroll;
}, 100));

// Handle portfolio image loading
const portfolioImages = document.querySelectorAll('.portfolio-image img');

portfolioImages.forEach(img => {
    // Add loading class
    img.closest('.portfolio-image').classList.add('loading');

    img.onload = function() {
        // Remove loading class when image loads
        img.closest('.portfolio-image').classList.remove('loading');
    }

    img.onerror = function() {
        // Handle failed image loads
        img.closest('.portfolio-image').classList.add('error');
        // Replace with a placeholder or error image
        img.src = 'images/placeholder.png';
    }
});

// Lazy loading with Intersection Observer
const lazyLoadImages = () => {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                observer.unobserve(img);
            }
        });
    });

    portfolioImages.forEach(img => {
        if (img.dataset.src) {
            imageObserver.observe(img);
        }
    });
};

// Initialize lazy loading
lazyLoadImages();

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Active navigation link highlight
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - sectionHeight / 3)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// Navbar background change on scroll
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(0, 0, 0, 0.95)';
    } else {
        navbar.style.background = 'rgba(0, 0, 0, 0.9)';
    }
});

// Reveal animations on scroll
const observerOptions = {
    root: null,
    threshold: 0.1,
    rootMargin: "0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('reveal');
        }
    });
}, observerOptions);

document.querySelectorAll('.animate-on-scroll').forEach((element) => {
    observer.observe(element);
});

// Mouse trail effect
function createTrailDot() {
    const dot = document.createElement('div');
    dot.className = 'cursor-trail';
    document.body.appendChild(dot);
    return dot;
}

const trailDots = Array(20).fill().map(createTrailDot);
let currentDot = 0;

document.addEventListener('mousemove', (e) => {
    const dot = trailDots[currentDot];
    dot.style.opacity = '0.5';
    dot.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    
    setTimeout(() => {
        dot.style.opacity = '0';
    }, 50);

    currentDot = (currentDot + 1) % trailDots.length;
});

// Parallax effect for hero section
document.addEventListener('mousemove', (e) => {
    const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
    const moveY = (e.clientY - window.innerHeight / 2) * 0.01;
    
    const heroContent = document.querySelector('.hero-content');
    const heroImage = document.querySelector('.hero-image');
    
    heroContent.style.transform = `translate(${moveX}px, ${moveY}px)`;
    heroImage.style.transform = `translate(${-moveX}px, ${-moveY}px)`;
});

// Smooth reveal animation
const observerOptions2 = {
    threshold: 0.1,
    rootMargin: "0px"
};

const observer2 = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, observerOptions2);

document.querySelectorAll('.reveal').forEach((el) => observer2.observe(el));

// Gradient text animation
const gradientText = document.querySelector('.highlight');
let hue = 0;

function animateGradient() {
    hue = (hue + 1) % 360;
    const color1 = `hsl(${hue}, 100%, 50%)`;
    const color2 = `hsl(${(hue + 60) % 360}, 100%, 50%)`;
    gradientText.style.background = `linear-gradient(120deg, ${color1}, ${color2})`;
    gradientText.style.webkitBackgroundClip = 'text';
    gradientText.style.backgroundClip = 'text';
    requestAnimationFrame(animateGradient);
}

animateGradient();

// Animate progress bars when skill section is in view
const skillsSection = document.querySelector('.skills');
const skillCategories = document.querySelectorAll('.skill-category');

const skillsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            skillCategories.forEach(category => {
                category.classList.add('animate');
            });
            skillsObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.2
});

skillsObserver.observe(skillsSection);

// Add hover effect for skill items
skillCategories.forEach(category => {
    const items = category.querySelectorAll('li');
    items.forEach((item, index) => {
        item.style.transitionDelay = `${index * 50}ms`;
    });
});
