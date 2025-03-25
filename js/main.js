/**
 * Casa Del Sol AZ - Main JavaScript
 * Version: 2.1.0
 * Optimized for performance
 */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    // Cache DOM elements
    const header = document.getElementById('header');
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const backToTop = document.querySelector('.back-to-top');
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu-container a');
    
    // Track scroll position for performance
    let lastScrollTop = 0;
    let scrollThreshold = 50;
    
    /**
     * Initialize all functions
     */
    function init() {
        setupEventListeners();
        checkScroll();
        
        // Set initial ARIA state for accessibility
        if (menuToggle) {
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    }
    
    /**
     * Setup all event listeners with performance optimizations
     */
    function setupEventListeners() {
        // Enhanced scroll handling with throttling and requestAnimationFrame
        let isScrolling = false;
        window.addEventListener('scroll', function() {
            if (!isScrolling) {
                window.requestAnimationFrame(function() {
                    handleScroll();
                    isScrolling = false;
                });
                isScrolling = true;
            }
        }, { passive: true }); // Passive for improved scrolling performance
        
        // Optimized mobile menu toggle
        if (menuToggle) {
            menuToggle.addEventListener('click', function() {
                // Toggle menu-open class instead of active
                header.classList.toggle('menu-open');
                
                // Toggle aria-expanded for accessibility
                const expanded = header.classList.contains('menu-open');
                menuToggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
                
                // Toggle body scroll lock
                document.body.style.overflow = expanded ? 'hidden' : '';
            }, { passive: true });
        }
        
        // Close menu when clicking mobile menu links
        if (mobileMenuLinks.length > 0) {
            mobileMenuLinks.forEach(link => {
                link.addEventListener('click', function() {
                    header.classList.remove('menu-open');
                    menuToggle.setAttribute('aria-expanded', 'false');
                    document.body.style.overflow = '';
                }, { passive: true });
            });
        }
        
        // Back to top button
        if (backToTop) {
            backToTop.addEventListener('click', scrollToTop);
        }
    }
    
    /**
     * Enhanced scroll handling with direction detection and performance optimization
     */
    function handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Only process if meaningful scroll change occurred (improved performance)
        if (Math.abs(lastScrollTop - scrollTop) <= 5) return;
        
        // Check if scrolled for header background change
        if (scrollTop > scrollThreshold) {
            if (!header.classList.contains('scrolled')) {
                header.classList.add('scrolled');
            }
            if (backToTop && !backToTop.classList.contains('show')) {
                backToTop.classList.add('show');
            }
        } else {
            header.classList.remove('scrolled');
            if (backToTop) backToTop.classList.remove('show');
        }
        
        // Save current position for comparison
        lastScrollTop = scrollTop;
    }
    
    /**
     * Check scroll position to modify header
     */
    function checkScroll() {
        handleScroll(); // Just call the enhanced function
    }
    
    /**
     * Scroll to top function with performance optimization
     * @param {Event} e - Click event
     */
    function scrollToTop(e) {
        e.preventDefault();
        
        // Use native API for smooth scrolling (more performant than CSS)
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
    
    /**
     * Scroll to element with smooth behavior
     * @param {string} selector - Element selector
     */
    function scrollToElement(selector) {
        const element = document.querySelector(selector);
        if (element) {
            // Calculate header height for offset
            const headerHeight = header ? header.offsetHeight : 0;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerHeight;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
            
            // If menu is open, close it
            if (header && header.classList.contains('menu-open')) {
                header.classList.remove('menu-open');
                if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        }
    }
    
    // Make scrollToElement available globally but with performance protection
    window.scrollToElement = scrollToElement;
    
    // Initialize everything
    init();
});