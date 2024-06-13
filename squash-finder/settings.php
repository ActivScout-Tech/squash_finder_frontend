<?php

add_action( 'admin_init',  'rudr_settings_fields' );
function rudr_settings_fields(){

	// I created variables to make the things clearer
	$page_slug = 'squash_finder';
	$option_group = 'squash_finder_settings';

	// 1. create section
	add_settings_section(
		'sf_settings_section', // section ID
		'', // title (optional)
		'', // callback function to display the section (optional)
		$page_slug
	);

	// Register fields with sanitization
    register_setting($option_group, 'sf_radius_unit', function($value) {
        return sf_set_value($value, 'sf_radius_unit');
    });
    register_setting($option_group, 'sf_default_view', function($value) {
        return sf_set_value($value, 'sf_default_view');
    });
    register_setting($option_group, 'sf_theme_accent_color', function($value) {
        return sf_set_value($value, 'sf_theme_accent_color');
    });

	// add fields
	add_settings_field( 
		'sf_radius_unit',
		'Radius unit',
		'sf_radius', // function to print the field
		$page_slug,
		'sf_settings_section' // section ID
	);

	add_settings_field(
		'sf_default_view',
		'Default View',
		'default_view',
		$page_slug,
		'sf_settings_section'
	);
	add_settings_field(
		'sf_theme_accent_color',
		'Theme Accent Color',
		'theme_accent',
		$page_slug,
		'sf_settings_section'
	);

    add_action( 'admin_enqueue_scripts', 'mw_enqueue_color_picker' );
    function mw_enqueue_color_picker( $hook_suffix ) {

    wp_enqueue_style( 'wp-color-picker' );
    wp_enqueue_script( 'my-script-handle', plugins_url('my-script.js', __FILE__ ), array( 'wp-color-picker' ), false, true );
}

}
function sf_radius( $args ) {
	$value = get_option( 'sf_radius_unit' );
	?>
		<select name="sf_radius_unit" id="sf_radius_unit" >
                <option value="km" <?php selected( $value, 'km' ); ?>>Kilometers</option>
                <option value="miles" <?php selected( $value, 'miles' ); ?>>Miles</option>
		</select>
	<?php
} 
function default_view( $args ){
	$value = get_option( 'sf_default_view' );
	?>
		<select name="sf_default_view" id="sf_default_view" >
                <option value="map" <?php selected( $value, 'map' ); ?>>Map</option>
                <option value="list" <?php selected( $value, 'list' ); ?>>List</option>
		</select>
	<?php
}
function theme_accent( $args ){
	$value = get_option( 'sf_theme_accent_color' );
	?>
		<input type="text" name="sf_theme_accent_color" id="sf_theme_accent_color" value="<?php echo $value; ?>" /> <?php echo $value; ?>
        <script>
            jQuery(document).ready(function($){
                $('#sf_theme_accent_color').wpColorPicker();
            });
        </script>
	<?php
}


function sf_set_value($value, $option_name) {
    switch ($option_name) {
        case 'sf_radius_unit':
            $allowed_values = array('km', 'miles');
            if (!in_array($value, $allowed_values)) {
                return 'km'; // Default value
            }
            break;

        case 'sf_default_view':
            $allowed_views = array('map', 'list');
            if (!in_array($value, $allowed_views)) {
                return 'map'; // Default value
            }
            break;

        case 'sf_theme_accent_color':
            $value = sanitize_hex_color($value);
            if (!$value) {
                return '#000000'; // Default color if invalid
            }
            break;

        default:
            $value = sanitize_text_field($value);
            break;
    }
    return $value;
}


add_action( 'admin_menu', 'sf_top_lvl_menu' );
 
function sf_top_lvl_menu(){
 
	add_menu_page(
		'Squash Finder Settings',
		'Squash Finder',
		'manage_options', 
		'squash-finder-settings', 
		'squash_finder_page_callback',
		'dashicons-search', 
		9
	);
}
 
function squash_finder_page_callback(){
	?>
		<div class="wrap">
			<h1><?php echo get_admin_page_title() ?></h1>
			<form method="post" action="options.php">
				<?php
					settings_fields( 'squash_finder_settings' ); // settings group name
					do_settings_sections( 'squash_finder' ); // just a page slug
					submit_button(); // "Save Changes" button
				?>
			</form>
		</div>
	<?php
}