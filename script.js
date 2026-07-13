document.addEventListener('DOMContentLoaded', () => {
    // 1. Universal Theme Toggle Logic
    const themeToggleBtn = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme') || 'dark';

    if (currentTheme === 'light') {
        document.body.setAttribute('data-theme', 'light');
        if(themeToggleBtn) themeToggleBtn.textContent = '🌙';
    } else {
        document.body.removeAttribute('data-theme');
        if(themeToggleBtn) themeToggleBtn.textContent = '⚡';
    }

    if(themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            let theme = document.body.getAttribute('data-theme');
            if (theme === 'light') {
                document.body.removeAttribute('data-theme');
                themeToggleBtn.textContent = '⚡';
                localStorage.setItem('theme', 'dark');
            } else {
                document.body.setAttribute('data-theme', 'light');
                themeToggleBtn.textContent = '🌙';
                localStorage.setItem('theme', 'light');
            }
        });
    }

    // 2. Multi-Page Active Header Highlighting Logic
    const currentPath = window.location.pathname.split("/").pop();
    const navLinks = document.querySelectorAll('.navbar .nav-links a');
    
    navLinks.forEach(link => {
        const linkAttribute = link.getAttribute('href');
        link.classList.remove('active');
        
        if (currentPath === linkAttribute || (currentPath === "" && linkAttribute === "index.html")) {
            link.classList.add('active');
        }
    });

// 3. Conditional Scroll Count-Up Animation Logic (FIXED: Raw numbers only)
const metricsSection = document.querySelector('.metrics-section');
    
const startCounters = () => {
    const counters = document.querySelectorAll('.count');
    const speed = 40;

    counters.forEach(counter => {
        const updateCount = () => {
            const target = +counter.getAttribute('data-target');
            const count = +counter.innerText;
            const increment = Math.ceil(target / speed);

            if (count < target) {
                counter.innerText = count + increment;
                setTimeout(updateCount, 30);
            } else {
                counter.innerText = target; // Stops exactly at the target raw number
            }
        };
        updateCount();
    });
};

if (metricsSection) {
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                startCounters();
                observer.unobserve(entry.target);
            }
        });
    }, { root: null, threshold: 0.2 });
    observer.observe(metricsSection);
}

    // 4. Conditional Portfolio Filter Logic
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    if (filterButtons.length > 0 && portfolioItems.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                const selectedFilter = button.getAttribute('data-filter');

                portfolioItems.forEach(item => {
                    const itemCategory = item.getAttribute('data-category');

                    if (selectedFilter === 'all' || itemCategory === selectedFilter) {
                        item.style.display = 'block';
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'scale(1)';
                        }, 10);
                    } else {
                        item.style.opacity = '0';
                        item.style.transform = 'scale(0.95)';
                        setTimeout(() => {
                            item.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }

    // 5. Safe Context Overlay Callout Mechanisms
    const overlayContainer = document.getElementById('details-overlay');
    const overlayContent = document.getElementById('overlay-content');
    const closeBtn = document.querySelector('.close-overlay');
    const openButtons = document.querySelectorAll('.open-details');

    if (overlayContainer && overlayContent && openButtons.length > 0) {
        const infoRepository = {
            'hero-details': `<h3>Comprehensive Clean Tech Deployments</h3><p>...</p>`,
            'solar-details': `<h3>Institutional Solar PV Array Specifications</h3><p>...</p>`,
            'agro-details': `<h3>Mobile Irrigation & Smallholder Support</h3><p>...</p>`,
            'storage-details': `<h3>Smart Lithium Energy Storage Systems (ESS)</h3><p>...</p>`
        };

        openButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetKey = button.getAttribute('data-target');
                if (infoRepository[targetKey]) {
                    overlayContent.innerHTML = infoRepository[targetKey];
                    overlayContainer.classList.add('visible');
                    document.body.style.overflow = 'hidden';
                }
            });
        });

        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                overlayContainer.classList.remove('visible');
                document.body.style.overflow = '';
            });
        }
    }

    // 6. Premium AJAX Formspree Submission Handling
    const contactForm = document.getElementById('skygreen-contact-form');
    const successAlert = document.getElementById('form-success');
    const errorAlert = document.getElementById('form-error');
    const submitBtn = document.getElementById('submit-btn');

    if (contactForm) {
        contactForm.addEventListener('submit', async (event) => {
            event.preventDefault(); 
            
            const data = new FormData(event.target);
            
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending Inquiry...';
            if (errorAlert) errorAlert.style.display = 'none';

            fetch(contactForm.action, {
                method: contactForm.method,
                body: data,
                headers: { 'Accept': 'application/json' }
            }).then(response => {
                if (response.ok) {
                    contactForm.style.display = 'none';
                    if (successAlert) {
                        successAlert.style.display = 'block';
                        successAlert.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                } else {
                    response.json().then(data => {
                        if (errorAlert) {
                            errorAlert.innerText = Object.hasOwn(data, 'errors') ? data['errors'].map(e => e['message']).join(", ") : "Oops! Technical error.";
                            errorAlert.style.display = 'block';
                        }
                        submitBtn.disabled = false;
                        submitBtn.textContent = 'Submit Inquiry';
                    });
                }
            }).catch(() => {
                if (errorAlert) {
                    errorAlert.innerText = "Network timeout. Please check your connectivity.";
                    errorAlert.style.display = 'block';
                }
                submitBtn.disabled = false;
                submitBtn.textContent = 'Submit Inquiry';
            });
        });
    }
});