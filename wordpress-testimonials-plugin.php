<?php
/*
Plugin Name: WebDev Testimonials
Description: Display testimonials from the WebDev Clients Feedback Platform
Version: 1.0
*/

// Add shortcode [webdev_testimonials]
function webdev_testimonials_shortcode() {
    ob_start();
    ?>
    <div id="webdev-testimonials" class="testimonials-grid">
        <div class="testimonials-loading">Loading testimonials...</div>
    </div>

    <style>
        .testimonials-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            margin: 2rem 0;
        }
        .testimonial-card {
            background: #fff;
            padding: 1.5rem;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .testimonial-content {
            font-style: italic;
            margin-bottom: 1rem;
        }
        .testimonial-author {
            font-weight: bold;
        }
        .testimonial-company {
            color: #666;
        }
        .testimonial-rating {
            color: #d4542c;
            margin-bottom: 0.5rem;
        }
        .testimonial-service {
            display: inline-block;
            padding: 0.25rem 0.75rem;
            background: #fbe5e1;
            color: #d4542c;
            border-radius: 9999px;
            font-size: 0.875rem;
            margin-bottom: 1rem;
        }
    </style>

    <script>
    document.addEventListener('DOMContentLoaded', function() {
        const testimonialContainer = document.getElementById('webdev-testimonials');
        
        fetch('http://localhost:3000/api/public/testimonials', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
        })
            .then(response => response.json())
            .then(data => {
                if (data.success && data.testimonials.length > 0) {
                    testimonialContainer.innerHTML = data.testimonials.map(t => `
                        <div class="testimonial-card">
                            <div class="testimonial-service">${t.service}</div>
                            <div class="testimonial-rating">${t.stars}</div>
                            <div class="testimonial-content">${t.content}</div>
                            <div class="testimonial-author">${t.clientName}</div>
                            ${t.companyName ? `<div class="testimonial-company">${t.companyName}</div>` : ''}
                        </div>
                    `).join('');
                } else {
                    testimonialContainer.innerHTML = '<p>No testimonials available.</p>';
                }
            })
            .catch(error => {
                console.error('Error fetching testimonials:', error);
                testimonialContainer.innerHTML = '<p>Failed to load testimonials.</p>';
            });
    });
    </script>
    <?php
    return ob_get_clean();
}
add_shortcode('webdev_testimonials', 'webdev_testimonials_shortcode'); 