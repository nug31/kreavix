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
        if (navLinks.classList.contains('active')) {
            navLinks.style.display = 'flex';
            navLinks.style.flexDirection = 'column';
            navLinks.style.position = 'absolute';
            navLinks.style.top = '100%';
            navLinks.style.left = '0';
            navLinks.style.width = '100%';
            navLinks.style.background = 'var(--card-bg)';
            navLinks.style.padding = '2rem';
            navLinks.style.backdropFilter = 'blur(10px)';
            navLinks.style.borderBottom = '1px solid var(--border-color)';
        } else {
            navLinks.style.display = 'none';
        }
    });

    // Pricing Toggle
    const pricingToggle = document.getElementById('pricing-toggle');
    const priceBasic = document.getElementById('price-basic');
    const pricePro = document.getElementById('price-pro');
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
        if (priceBasic) {
            const val = isYearly ? priceBasic.dataset.yearly : priceBasic.dataset.monthly;
            priceBasic.innerHTML = `${val}<span>/${isYearly ? 'yr' : 'mo'}</span>`;
        }
        if (pricePro) {
            const val = isYearly ? pricePro.dataset.yearly : pricePro.dataset.monthly;
            pricePro.innerHTML = `${val}<span>/${isYearly ? 'yr' : 'mo'}</span>`;
        }

        // Update Button Links to Auth instead of Checkout
        document.querySelectorAll('.pricing-card a').forEach((btn, index) => {
            const plan = index === 0 ? 'basic' : 'pro';
            const billing = isYearly ? 'yearly' : 'monthly';
            btn.href = `auth.html?plan=${plan}&billing=${billing}`;
        });
    });

    // Handle initial button states
    const isYearly = pricingToggle?.checked;
    document.querySelectorAll('.pricing-card a').forEach((btn, index) => {
        const plan = index === 0 ? 'basic' : 'pro';
        const billing = isYearly ? 'yearly' : 'monthly';
        btn.href = `auth.html?plan=${plan}&billing=${billing}`;
    });
});
