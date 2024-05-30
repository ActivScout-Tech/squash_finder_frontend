<?php
/*
Plugin Name: Squash Finder
Description: Integrate Squash Finder into your WordPress site.
Version: 1.0
Author: ClubHub 
*/

// Enqueue custom JavaScript file in the footer
function custom_script_enqueue() {
    wp_register_script('squash-search-script', plugins_url('/squash-search.umd.js',__FILE__ ), array(), '1.0', array('footer' => true));
    wp_enqueue_script('squash-search-script');
}
add_action('wp_enqueue_scripts', 'custom_script_enqueue');


function squash_search($atts) {
	$Content = "<div>\r\n";
    $Content .= "<div id='squash-search'></div>\r\n";
    $Content .= "</div>\r\n";
	 
    return $Content;
}

add_shortcode('squash_search', 'squash_search');

add_action('wp_footer', 'link_script');
