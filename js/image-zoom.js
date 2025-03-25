document.addEventListener('DOMContentLoaded', function() {
    const venueImage = document.getElementById('venue-image');
    const imageModal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const modalClose = document.getElementById('modalClose');
    
    // Only set up the event listeners if the elements exist
    if (venueImage && imageModal && modalImage && modalClose) {
        // Get the thumbnail image source
        const thumbSrc = venueImage.querySelector('img').src;
        
        // Get the high-resolution version (if using the same image, keep thumbSrc)
        // If you have a higher resolution version, use:
        // const highResSrc = thumbSrc.replace('.jpg', '-large.jpg');
        const highResSrc = thumbSrc;
        
        // Open modal when clicking on venue image
        venueImage.addEventListener('click', function() {
            // Show loading state or spinner here if needed
            
            // Set modal image source to high-resolution version
            // This loads the full-res image only when needed
            modalImage.src = highResSrc;
            
            // Show modal
            requestAnimationFrame(() => {
                imageModal.classList.add('active');
            });
            
            // Prevent body scrolling when modal is open
            document.body.style.overflow = 'hidden';
        });
        
        // Close modal when clicking the close button
        modalClose.addEventListener('click', closeModal);
        
        // Close modal when clicking outside the image
        imageModal.addEventListener('click', function(e) {
            if (e.target === imageModal) {
                closeModal();
            }
        });
        
        // Close modal when pressing Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && imageModal.classList.contains('active')) {
                closeModal();
            }
        });
        
        // Add zoom in/out ability with mouse wheel
        modalImage.addEventListener('wheel', function(e) {
            e.preventDefault();
            
            // Get current width
            const currentWidth = this.clientWidth;
            
            // Zoom factor (adjust as needed)
            const zoomFactor = 0.1;
            
            // Zoom in or out based on wheel direction
            if (e.deltaY < 0) {
                // Zoom in
                this.style.width = `${currentWidth * (1 + zoomFactor)}px`;
            } else {
                // Zoom out
                this.style.width = `${currentWidth * (1 - zoomFactor)}px`;
            }
        });
        
        function closeModal() {
            imageModal.classList.remove('active');
            document.body.style.overflow = '';
            
            // Reset modal image size if it was zoomed
            modalImage.style.width = '';
            
            // Reset modal image source after transition ends
            setTimeout(() => {
                if (!imageModal.classList.contains('active')) {
                    // Clear source to free memory
                    modalImage.src = '';
                }
            }, 300);
        }
    }
});