<?php
/*
Plugin Name: Squash Finder
Description: Integrate Squash Finder into your WordPress site.
Version: 2.5
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

add_action('wp_head', 'inject_settings');

function inject_settings() {
    $default_view = get_option('sf_default_view');
    $radius_unit = get_option('sf_radius_unit');
    $theme_accent_color = get_option('sf_theme_accent_color');

    echo "<script>
        window.squashFinderSettings = {
            defaultView: '$default_view',
            radiusUnit: '$radius_unit',
            themeAccentColor: '$theme_accent_color'
        }
    </script>";
}


include_once( plugin_dir_path( __FILE__ ) . 'settings.php');

