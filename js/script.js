// Navbar Scroll Effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('shadow-md', 'bg-white');
        navbar.classList.remove('bg-white/95');
    } else {
        navbar.classList.remove('shadow-md', 'bg-white');
        navbar.classList.add('bg-white/95');
    }

    // Active link highlighting
    let current = '';
    const sections = document.querySelectorAll('section[id]');
    
    sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 150) {
            current = section.getAttribute('id');
        }
    });

    const navLinks = document.querySelectorAll('.desktop-nav-link');
    navLinks.forEach((a) => {
        a.classList.remove('active');
        if (a.getAttribute('href').includes(current) && current !== '') {
            a.classList.add('active');
        }
    });
});

// Mobile App Menu
const mobileBtn = document.getElementById('mobile-menu-btn');
const mobileCloseBtn = document.getElementById('mobile-close-btn');
const mobileMenu = document.getElementById('mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-link');

function toggleMobileMenu() {
    mobileMenu.classList.toggle('hidden');
    mobileMenu.classList.toggle('flex');
    
    // Toggle icon between bars and times if it exists
    const icon = mobileBtn ? mobileBtn.querySelector('i') : null;
    if (icon) {
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
    }
}

if (mobileBtn) mobileBtn.addEventListener('click', toggleMobileMenu);
if (mobileCloseBtn) mobileCloseBtn.addEventListener('click', toggleMobileMenu);

mobileLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        // Only close if it's a direct link, not a dropdown trigger
        if (!link.classList.contains('mobile-dropdown-btn') && !link.closest('.mobile-dropdown-btn')) {
            if(!mobileMenu.classList.contains('hidden')) {
                toggleMobileMenu();
            }
        }
    });
});

// Mobile Dropdown Toggle Logic
const mobileDropdownBtns = document.querySelectorAll('.mobile-dropdown-btn');
mobileDropdownBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const parent = btn.closest('.mobile-dropdown');
        const icon = btn.querySelector('i');
        
        // Toggle active class
        parent.classList.toggle('mobile-dropdown-active');
        
        // Toggle icon plus/minus
        if (icon) {
            icon.classList.toggle('fa-plus');
            icon.classList.toggle('fa-minus');
        }
        
        // Close other dropdowns (optional, but cleaner)
        mobileDropdownBtns.forEach(otherBtn => {
            if (otherBtn !== btn) {
                const otherParent = otherBtn.closest('.mobile-dropdown');
                otherParent.classList.remove('mobile-dropdown-active');
                const otherIcon = otherBtn.querySelector('i');
                if (otherIcon) {
                    otherIcon.classList.add('fa-plus');
                    otherIcon.classList.remove('fa-minus');
                }
            }
        });
    });
});

// Hero Slider
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.slider-dot');
const nextBtn = document.getElementById('next-slide');
const prevBtn = document.getElementById('prev-slide');
let currentSlide = 0;
let slideInterval;

function showSlide(index) {
    if (slides.length === 0) return; // Prevent errors if not on index.html
    
    slides.forEach((slide, i) => {
        slide.classList.remove('opacity-100', 'z-20');
        slide.classList.add('opacity-0', 'z-0');
        dots[i].classList.remove('active', 'w-8', 'bg-accent-500');
        dots[i].classList.add('w-3', 'bg-white/40');
    });

    slides[index].classList.remove('opacity-0', 'z-0');
    slides[index].classList.add('opacity-100', 'z-20');
    dots[index].classList.add('active', 'w-8', 'bg-accent-500');
    dots[index].classList.remove('w-3', 'bg-white/40');
}

function nextSlide() {
    if (slides.length === 0) return;
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
    resetInterval();
}

function prevSlide() {
    if (slides.length === 0) return;
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(currentSlide);
    resetInterval();
}

function startInterval() {
    slideInterval = setInterval(nextSlide, 7000); // 7s autoplay
}

function resetInterval() {
    clearInterval(slideInterval);
    startInterval();
}

if (nextBtn && prevBtn) {
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            showSlide(currentSlide);
            resetInterval();
        });
    });

    // Start auto slider
    startInterval();
}

// Review Slider
const reviewSlider = document.getElementById('review-slider');
const prevReviewBtn = document.getElementById('prev-review');
const nextReviewBtn = document.getElementById('next-review');

if (reviewSlider && prevReviewBtn && nextReviewBtn) {
    let currentReviewIndex = 0;
    
    // Function to calculate how many cards are visible based on screen size
    function getVisibleCards() {
        if (window.innerWidth >= 1024) return 3; // lg
        if (window.innerWidth >= 768) return 2;  // md
        return 1;                                // sm
    }

    // Function to visually highlight the "middle" or active card
    function updateActiveReviewCard() {
        const visibleCards = getVisibleCards();
        const cards = reviewSlider.children;
        
        // Remove active class from all
        for(let i = 0; i < cards.length; i++) {
            cards[i].querySelector('.review-card').classList.remove('is-active');
        }
        
        // Calculate active index (middle on desktop, left on tablet/mobile)
        let activeIndex = currentReviewIndex; 
        if (visibleCards === 3) {
            activeIndex = currentReviewIndex + 1; // Middle one
        }
        
        if (cards[activeIndex]) {
            cards[activeIndex].querySelector('.review-card').classList.add('is-active');
        }
    }

    function updateReviewSliderPosition() {
        const cardWidth = reviewSlider.children[0].offsetWidth;
        reviewSlider.style.transform = `translateX(-${currentReviewIndex * cardWidth}px)`;
        updateActiveReviewCard();
    }
    
    // Initial highlighting
    updateActiveReviewCard();

    nextReviewBtn.addEventListener('click', () => {
        const visibleCards = getVisibleCards();
        const totalCards = reviewSlider.children.length;
        
        // Only slide if we haven't reached the end
        if (currentReviewIndex < totalCards - visibleCards) {
            currentReviewIndex++;
            updateReviewSliderPosition();
        } else {
            // Optional: loop back to start
            currentReviewIndex = 0;
            updateReviewSliderPosition();
        }
    });

    prevReviewBtn.addEventListener('click', () => {
        if (currentReviewIndex > 0) {
            currentReviewIndex--;
            updateReviewSliderPosition();
        } else {
            // Optional: loop to end
            const visibleCards = getVisibleCards();
            const totalCards = reviewSlider.children.length;
            currentReviewIndex = totalCards - visibleCards;
            updateReviewSliderPosition();
        }
    });

    // Update position on window resize to prevent misalignment
    window.addEventListener('resize', () => {
        const visibleCards = getVisibleCards();
        const totalCards = reviewSlider.children.length;
        
        // Ensure index is within bounds after resize
        if (currentReviewIndex > totalCards - visibleCards) {
            currentReviewIndex = Math.max(0, totalCards - visibleCards);
        }
        
        // Disable transition temporarily during resize for snappiness
        reviewSlider.style.transition = 'none';
        updateReviewSliderPosition();
        setTimeout(() => {
            reviewSlider.style.transition = 'transform 0.5s ease-in-out';
        }, 50);
    });
}
