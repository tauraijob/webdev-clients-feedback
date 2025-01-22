<?php
class WebDev_Testimonials_Widget extends WP_Widget {
    public function __construct() {
        parent::__construct(
            'webdev_testimonials_widget',
            'WebDev Testimonials',
            array('description' => 'Display testimonials from WebDev Clients Feedback Platform')
        );
    }

    public function widget($args, $instance) {
        echo $args['before_widget'];
        echo do_shortcode('[webdev_testimonials]');
        echo $args['after_widget'];
    }
}

function register_webdev_testimonials_widget() {
    register_widget('WebDev_Testimonials_Widget');
}
add_action('widgets_init', 'register_webdev_testimonials_widget'); 