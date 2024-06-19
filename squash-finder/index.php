<?php
/*
Plugin Name: Squash Finder
Description: Integrate Squash Finder into your WordPress site.
Version: 2.14
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

function plugin_add_settings_link( $links ) {
    	$url = esc_url( add_query_arg(
		'page',
		'squash-finder-settings',
		get_admin_url() . 'admin.php'
	) );
	// Create the link.
	$settings_link = "<a href='$url'>" . __( 'Settings' ) . '</a>';

    array_push( $links, $settings_link );
    return $links;
}
$plugin = plugin_basename( __FILE__ );
add_filter( "plugin_action_links_$plugin", 'plugin_add_settings_link' );


// for plugin updates

add_filter('pre_set_site_transient_update_plugins', 'check_for_plugin_update');
add_filter('plugins_api', 'plugin_info', 10, 3);

function check_for_plugin_update($transient) {
    if (empty($transient->checked)) {
        return $transient;
    }

    $plugin_slug = plugin_basename(__FILE__);
    $current_version = $transient->checked[$plugin_slug];

    $response = wp_remote_get('https://clubhub1.s3.eu-north-1.amazonaws.com/squash-finder-update-info.json');
    if (!is_wp_error($response) && is_array($response)) {
        $update_info = json_decode($response['body'], true);
        if (version_compare($current_version, $update_info['new_version'], '<')) {
            $transient->response[$plugin_slug] = (object) array(
                'slug'        => $plugin_slug,
                'new_version' => $update_info['new_version'],
                'url'         => $update_info['url'],
                'package'     => $update_info['package'],
            );
        }
    }

    return $transient;
}

function plugin_info($false, $action, $args) {
    $plugin_slug = plugin_basename(__FILE__);

    if ($action === 'plugin_information' && $args->slug === $plugin_slug) {
        $response = wp_remote_get('https://clubhub1.s3.eu-north-1.amazonaws.com/squash-finder-update-info.json');
        if (!is_wp_error($response) && is_array($response)) {
            $update_info = json_decode($response['body'], true);

            return (object) array(
                'name'          => 'Squash Finder',
                'slug'          => $plugin_slug,
                'version'       => $update_info['new_version'],
                'author'        => 'ClubHub',
                'homepage'      => $update_info['url'],
                'download_link' => $update_info['package'],
                'sections'      => array(
                    'description' => 'Integrate Squash Finder into your WordPress site.',
                ),
            );
        }
    }

    return false;
}


include_once( plugin_dir_path( __FILE__ ) . 'settings.php');

