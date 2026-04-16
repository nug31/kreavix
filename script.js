document.addEventListener('DOMContentLoaded', () => {
    // Header Scroll Effect
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    mobileMenuBtn?.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        // Simple animation toggle for mobile
        if (navLinks.classList.contains('active')) {
            navLinks.style.display = 'flex';
            navLinks.style.flexDirection = 'column';
            navLinks.style.position = 'absolute';
            navLinks.style.top = '100%';
            navLinks.style.left = '0';
            navLinks.style.width = '100%';
            navLinks.style.background = 'rgba(13, 13, 15, 0.95)';
            navLinks.style.padding = '2rem';
            navLinks.style.backdropFilter = 'blur(10px)';
        } else {
            navLinks.style.display = 'none';
        }
    });

    // Reveal Animations on Scroll
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.1
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // Smooth Scrolling for Nav Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
                // Close mobile menu if open
                navLinks.classList.remove('active');
                if (window.innerWidth <= 768) {
                    navLinks.style.display = 'none';
                }
            }
        });
    });

    // Form Submission
    const contactForm = document.getElementById('contact-form');
    contactForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = contactForm.querySelector('button');
        const originalText = btn.textContent;
        
        btn.textContent = 'Sending...';
        btn.disabled = true;

        const formData = new FormData(contactForm);
        
        try {
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                alert('Thank you! Your message has been sent successfully.');
                contactForm.reset();
            } else if (response.status === 403 || response.status === 404) {
                alert('Form not verified yet. Please check kreavixid@gmail.com for a verification email from Formspree and click the link inside.');
            } else {
                const data = await response.json();
                if (data && data.errors) {
                    alert(data.errors.map(error => error.message).join(", "));
                } else {
                    alert('Oops! There was a problem submitting your form.');
                }
            }
        } catch (error) {
            alert('Oops! There was a problem submitting your form.');
        } finally {
            btn.textContent = originalText;
            btn.disabled = false;
        }
    });

    // Pricing Toggle
    const pricingToggle = document.getElementById('pricing-toggle');
    const prices = document.querySelectorAll('.price');
    const monthlyLabel = document.getElementById('monthly-label');
    const yearlyLabel = document.getElementById('yearly-label');

    pricingToggle?.addEventListener('change', () => {
        const isYearly = pricingToggle.checked;
        
        // Update Labels
        if (isYearly) {
            yearlyLabel?.classList.add('active');
            monthlyLabel?.classList.remove('active');
        } else {
            monthlyLabel?.classList.add('active');
            yearlyLabel?.classList.remove('active');
        }

        // Update Prices
        prices.forEach(price => {
            price.style.opacity = '0';
            setTimeout(() => {
                const newPrice = isYearly ? price.dataset.yearly : price.dataset.monthly;
                const period = isYearly ? '/yr' : '/mo';
                price.innerHTML = `${newPrice}<span class="period">${period}</span>`;
                price.style.opacity = '1';
            }, 200);
        });
    });

    // Pricing Button Redirection
    document.querySelectorAll('.pricing-card .btn-primary, .pricing-card .btn-secondary').forEach((btn, index) => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const isYearly = document.getElementById('pricing-toggle')?.checked;
            const plan = index === 0 ? 'basic' : 'pro';
            const billing = isYearly ? 'yearly' : 'monthly';
            window.location.href = `checkout.html?plan=${plan}&billing=${billing}`;
        });
    });
});
