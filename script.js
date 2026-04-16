// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
    
    // Set current year in footer
    document.getElementById('year').textContent = new Date().getFullYear();

    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.add('scrolled'); // keep background white initially too or remove? Let's just add shadow.
        }
    });

    // Handle initial state
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    }

    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-links a');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
        
        // Animate hamburger to X (optional simple animation done via css but we just toggle active class here for potential future css adjustments)
        const spans = hamburger.querySelectorAll('span');
        if(navLinks.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });

    // Close mobile menu when a link is clicked
    navLinksItems.forEach(item => {
        item.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                
                const spans = hamburger.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    });

    // Intersection Observer for Scroll Animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
                sectionObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Apply animation initial state to elements we want to fade in on scroll
    const animateElements = document.querySelectorAll('.value-card, .gallery-item, .section-title, .creations-header');
    
    animateElements.forEach(el => {
        el.style.opacity = "0";
        el.style.transform = "translateY(30px)";
        el.style.transition = "all 0.6s cubic-bezier(0.25, 0.8, 0.25, 1)";
        sectionObserver.observe(el);
    });

    // --- Booking Modal Logic ---
    const bookingModal = document.getElementById('bookingModal');
    const openModalBtns = document.querySelectorAll('.open-booking-modal');
    const closeBtns = document.querySelectorAll('.modal-close, .modal-close-btn');

    openModalBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            bookingModal.classList.add('active');
            document.body.style.overflow = 'hidden';

            // Pre-select cake if clicked from menu
            const cakeName = btn.dataset.cake;
            if (cakeName) {
                const card = Array.from(document.querySelectorAll('#flavorSelect .select-card'))
                    .find(c => c.querySelector('h4').textContent.includes(cakeName));
                if (card) card.click();
            }
        });
    });

    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            bookingModal.classList.remove('active');
            document.body.style.overflow = '';
            // Reset to step 1
            setTimeout(() => {
                goToStep(1);
            }, 300);
        });
    });

    // Multi-step Form Logic
    let currentStep = 1;
    const totalSteps = 4;
    const progressSteps = document.querySelectorAll('.progress-step');
    const formSteps = document.querySelectorAll('.form-step');

    function goToStep(step) {
        currentStep = step;
        
        // Update Progress Bar
        progressSteps.forEach(p => {
            if (parseInt(p.dataset.step) <= currentStep) {
                p.classList.add('active');
            } else {
                p.classList.remove('active');
            }
        });

        // Update Form Steps
        formSteps.forEach(fs => fs.classList.remove('active'));
        if(document.getElementById(`step-${currentStep}`)) {
            document.getElementById(`step-${currentStep}`).classList.add('active');
            document.querySelector('.modal-footer').style.display = 'block';
        } else if(currentStep === 5) {
             document.getElementById(`step-success`).classList.add('active');
             document.querySelector('.modal-footer').style.display = 'none';
        }
    }

    document.querySelectorAll('.next-step').forEach(btn => {
        btn.addEventListener('click', () => {
            if (currentStep < totalSteps) {
                goToStep(currentStep + 1);
            }
        });
    });

    document.querySelectorAll('.prev-step').forEach(btn => {
        btn.addEventListener('click', () => {
            if (currentStep > 1) {
                goToStep(currentStep - 1);
            }
        });
    });

    // Pricing Logic
    let basePrice = 800;
    let sizeMultiplier = 1;
    let baseName = "Rustic Chocolate";
    let sizeName = "1.0 Kg";
    const liveTotalValue = document.getElementById('liveTotal');
    const finalTotalValue = document.getElementById('finalTotal');
    const payBtnAmountValue = document.getElementById('payBtnAmount');
    
    function calculateTotal() {
        let addonPrice = 0;
        document.querySelectorAll('input[name="decor"]:checked').forEach(cb => {
            addonPrice += parseInt(cb.dataset.price);
        });

        const total = (basePrice * sizeMultiplier) + addonPrice;
        
        // Update UI
        const formattedTotal = '₹' + total;
        liveTotalValue.textContent = formattedTotal;
        finalTotalValue.textContent = formattedTotal;
        payBtnAmountValue.textContent = formattedTotal;
        
        return { total, formattedTotal, addonPrice };
    }

    // Single Select Cards (Base Flavor & Size)
    document.querySelectorAll('#flavorSelect .select-card').forEach(card => {
        card.addEventListener('click', function() {
            document.querySelectorAll('#flavorSelect .select-card').forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            basePrice = parseInt(this.dataset.price);
            baseName = this.querySelector('h4').textContent;
            calculateTotal();
        });
    });

    document.querySelectorAll('#sizeSelect .select-card').forEach(card => {
        card.addEventListener('click', function() {
            document.querySelectorAll('#sizeSelect .select-card').forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            sizeMultiplier = parseFloat(this.dataset.multiplier);
            sizeName = this.querySelector('h4').textContent;
            calculateTotal();
        });
    });

    // Multi-Select Addons
    document.querySelectorAll('input[name="decor"]').forEach(cb => {
        cb.addEventListener('change', calculateTotal);
    });

    // Generate Order Summary on Step 3 -> 4
    document.querySelector('.review-order').addEventListener('click', () => {
        const summaryList = document.getElementById('summaryList');
        let html = `
            <div class="summary-item">
                <span>Base (${sizeName} ${baseName})</span>
                <span>₹${basePrice * sizeMultiplier}</span>
            </div>
        `;
        
        document.querySelectorAll('input[name="decor"]:checked').forEach(cb => {
            const name = cb.parentElement.textContent.trim().split(' (+')[0];
            const price = parseInt(cb.dataset.price);
            html += `
                <div class="summary-item" style="color:#666; font-size:0.85rem">
                    <span>+ Addon: ${name}</span>
                    <span>₹${price}</span>
                </div>
            `;
        });
        
        calculateTotal();
        summaryList.innerHTML = html;
    });

    // WhatsApp Integration & Order Saving
    document.getElementById('confirmOrderBtn').addEventListener('click', function() {
        const name = document.getElementById('custName').value;
        const phone = document.getElementById('custPhone').value;
        const date = document.getElementById('custDate').value;
        const qty = document.getElementById('custQty').value || 1;
        const address = document.getElementById('custAddress').value;
        const message = document.getElementById('customMessage').value;

        if(!name || !phone || !date) {
            alert("Please fill in your name, phone, and delivery date.");
            goToStep(3);
            return;
        }

        const totalObj = calculateTotal();
        const addons = Array.from(document.querySelectorAll('input[name="decor"]:checked'))
            .map(cb => cb.parentElement.textContent.trim().split(' (+')[0])
            .join(', ');

        const orderData = {
            id: Math.floor(100000 + Math.random() * 900000),
            name,
            phone,
            cake: `${sizeName} ${baseName}`,
            qty,
            addons: addons || 'None',
            date,
            address,
            message: message || 'None',
            total: totalObj.formattedTotal,
            timestamp: new Date().toISOString()
        };

        // Save to LocalStorage (Admin usage)
        const orders = JSON.parse(localStorage.getItem('ranju_orders') || '[]');
        orders.push(orderData);
        localStorage.setItem('ranju_orders', JSON.stringify(orders));

        // Show Toast
        const toast = document.getElementById('successToast');
        toast.classList.add('show');

        // Redirect to WhatsApp after brief delay
        setTimeout(() => {
            const waNumber = "918940244626"; // Client WhatsApp
            const waMessage = `Hello, I want to order:
*Cake:* ${orderData.cake}
*Quantity:* ${orderData.qty}
*Addons:* ${orderData.addons}
*Total:* ${orderData.total}
*Date:* ${orderData.date}
*Name:* ${orderData.name}
*Phone:* ${orderData.phone}
*Address:* ${orderData.address}
*Note:* ${orderData.message}`;

            const encodedMsg = encodeURIComponent(waMessage);
            window.open(`https://wa.me/${waNumber}?text=${encodedMsg}`, '_blank');
            
            // Show success step in modal
            document.getElementById('randomOrderId').textContent = orderData.id;
            goToStep(5);
            toast.classList.remove('show');
        }, 1500);
    });
});
