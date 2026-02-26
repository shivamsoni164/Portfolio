// Portfolio — Shivam Soni
// Minimal JS for subtle entrance animations

document.addEventListener('DOMContentLoaded', () => {
    // Fade-in observer for sections
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.1 }
    );

    // Observe all sections and project cards
    document.querySelectorAll('.section, .project-card').forEach((el) => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
});
