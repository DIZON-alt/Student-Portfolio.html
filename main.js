// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Functionality
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const header = document.querySelector('.main-header');
    const body = document.body;

    // Toggle mobile menu
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent click from bubbling to document
            mobileMenuBtn.classList.toggle('active');
            navLinks.classList.toggle('active');
            body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
        });
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navLinks && !e.target.closest('.nav-container')) {
            navLinks.classList.remove('active');
            if (mobileMenuBtn) {
                mobileMenuBtn.classList.remove('active');
            }
            body.style.overflow = '';
        }
    });

    // Close mobile menu when clicking a link
    if (navLinks) {
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                if (mobileMenuBtn) {
                    mobileMenuBtn.classList.remove('active');
                }
                body.style.overflow = '';
            });
        });
    }

    // Close mobile menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            if (mobileMenuBtn) {
                mobileMenuBtn.classList.remove('active');
            }
            body.style.overflow = '';
        }
    });

    // Header scroll effect
    let lastScroll = 0;
    if (header) {
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll <= 0) {
                header.classList.remove('scroll-up');
                return;
            }
            
            if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
                // Scrolling down
                header.classList.remove('scroll-up');
                header.classList.add('scroll-down');
            } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
                // Scrolling up
                header.classList.remove('scroll-down');
                header.classList.add('scroll-up');
            }
            
            lastScroll = currentScroll;
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                // Close mobile menu after clicking a link
                if (navLinks) {
                    navLinks.classList.remove('active');
                }
                if (mobileMenuBtn) {
                    mobileMenuBtn.classList.remove('active');
                }
                body.style.overflow = '';
            }
        });
    });

    // Intersection Observer for animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements for animation based on page
    if (document.querySelector('.about-section')) {
        // About page animations
        document.querySelectorAll('.skill-card, .timeline-item, .story-content p').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
            observer.observe(el);
        });
    } else if (document.querySelector('.contact-section')) {
        // Contact page animations
        document.querySelectorAll('.info-card, .contact-form-container').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
            observer.observe(el);
        });
    } else {
        // Default animations for other pages
        document.querySelectorAll('.skill-card, .project-card').forEach(el => {
            observer.observe(el);
        });
    }

    // Social links tooltip
    document.querySelectorAll('.social-link').forEach(link => {
        const tooltip = link.querySelector('.social-tooltip');
        if (tooltip) {
            link.addEventListener('mouseenter', () => {
                tooltip.style.opacity = '1';
                tooltip.style.visibility = 'visible';
                tooltip.style.transform = 'translateX(-50%) translateY(-5px)';
            });

            link.addEventListener('mouseleave', () => {
                tooltip.style.opacity = '0';
                tooltip.style.visibility = 'hidden';
                tooltip.style.transform = 'translateX(-50%) translateY(-10px)';
            });
        }
    });

    // Newsletter form handling
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = newsletterForm.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            if (email) {
                // Here you would typically send the email to your server
                console.log('Newsletter subscription:', email);
                
                // Show success message
                const button = newsletterForm.querySelector('button');
                const originalText = button.innerHTML;
                button.innerHTML = '<i class="fas fa-check"></i> Subscribed!';
                button.style.backgroundColor = '#28a745';
                
                // Reset form
                emailInput.value = '';
                
                // Reset button after 3 seconds
                setTimeout(() => {
                    button.innerHTML = originalText;
                    button.style.backgroundColor = '';
                }, 3000);
            }
        });
    }

    // Contact form handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        // Form input animations
        const formInputs = contactForm.querySelectorAll('.form-group input, .form-group textarea');
        formInputs.forEach(input => {
            // Add focus effect
            input.addEventListener('focus', () => {
                input.parentElement.style.transform = 'translateY(-2px)';
                input.parentElement.style.transition = 'transform 0.3s ease';
            });
            
            input.addEventListener('blur', () => {
                input.parentElement.style.transform = 'translateY(0)';
            });
            
            // Add input validation styling
            input.addEventListener('input', () => {
                if (input.value.trim()) {
                    input.style.borderColor = 'var(--color-accent)';
                } else {
                    input.style.borderColor = '';
                }
            });
        });

        // Form submission handling
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const formObject = Object.fromEntries(formData.entries());
            
            // Basic form validation
            let isValid = true;
            const requiredFields = ['name', 'email', 'subject', 'message'];
            
            requiredFields.forEach(field => {
                const input = contactForm.querySelector(`[name="${field}"]`);
                if (!input.value.trim()) {
                    isValid = false;
                    input.style.borderColor = '#ff4444';
                    setTimeout(() => {
                        input.style.borderColor = '';
                    }, 3000);
                }
            });
            
            if (!isValid) return;
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formObject.email)) {
                const emailInput = contactForm.querySelector('[name="email"]');
                emailInput.style.borderColor = '#ff4444';
                setTimeout(() => {
                    emailInput.style.borderColor = '';
                }, 3000);
                return;
            }
            
            // Show loading state
            const submitBtn = contactForm.querySelector('.submit-btn');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            
            try {
                // Here you would typically send the form data to your server
                // For now, we'll simulate a successful submission
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                // Show success message
                submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
                submitBtn.style.backgroundColor = '#28a745';
                contactForm.classList.add('form-success');
                
                // Reset form
                contactForm.reset();
                
                // Reset button after 3 seconds
                setTimeout(() => {
                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.style.backgroundColor = '';
                    submitBtn.disabled = false;
                    contactForm.classList.remove('form-success');
                }, 3000);
                
            } catch (error) {
                // Show error message
                submitBtn.innerHTML = '<i class="fas fa-times"></i> Error!';
                submitBtn.style.backgroundColor = '#dc3545';
                
                // Reset button after 3 seconds
                setTimeout(() => {
                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.style.backgroundColor = '';
                    submitBtn.disabled = false;
                }, 3000);
                
                console.error('Error submitting form:', error);
            }
        });
    }

    // Initialize animations
    document.querySelectorAll('.animate').forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
    });
});

// Add CSS classes for animations
document.head.insertAdjacentHTML('beforeend', `
    <style>
        .scroll-down {
            transform: translateY(-100%);
            transition: transform 0.3s ease-in-out;
        }
        
        .scroll-up {
            transform: translateY(0);
            transition: transform 0.3s ease-in-out;
        }

        .mobile-menu-btn.active span:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
        }

        .mobile-menu-btn.active span:nth-child(2) {
            opacity: 0;
        }

        .mobile-menu-btn.active span:nth-child(3) {
            transform: rotate(-45deg) translate(7px, -6px);
        }

        @media (max-width: 768px) {
            .nav-links {
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background-color: var(--color-dark);
                flex-direction: column;
                padding: 1rem;
                text-align: center;
                box-shadow: var(--shadow-md);
                border-top: 1px solid rgba(193, 154, 107, 0.2);
                z-index: 1000;
            }
        }

        .animate {
            animation: fadeInUp 0.6s ease-out forwards;
        }

        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .form-success {
            animation: successPulse 0.5s ease-in-out;
        }

        @keyframes successPulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
    </style>
`); 
