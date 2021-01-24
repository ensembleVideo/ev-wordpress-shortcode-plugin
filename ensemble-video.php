<?php

/*
Plugin Name: Ensemble Video Responsive Plugin
Description: Easily embed Ensemble Videos in your site. This version includes responsive embed codes and several embedding options.
Version: 5.6.1
*/


class Ensemble_Video {
	// constructor
	function __construct() {

		add_action( 'wp_enqueue_scripts', array( &$this, 'admin_enqueue_scripts' ) );

		$this->enqueue_ensemble_styles();

		// add our shortcode
		add_shortcode( 'ensemblevideo', array( &$this, 'ensemblevideo_shortcode' ) );

		// set default options
		if ( get_site_option( 'ensemble_video' ) === false ) {
			if ( $this->is_network_activated() ) {
				update_site_option( 'ensemble_video', $this->default_options() );
			} else {
				update_option( 'ensemble_video', $this->default_options() );
			}
		}

		if ( is_admin() ) {
			// add media button
			add_action( 'media_buttons_context', array( &$this, 'add_media_button' ), 999 );
			// add media button scripts and styles
			add_action( 'admin_enqueue_scripts', array( &$this, 'admin_enqueue_scripts' ) );

			// add admin page
			add_action( 'admin_menu', array( &$this, 'admin_menu' ) );
			add_action( 'admin_init', array( &$this, 'admin_init' ) );

			// add network admin page
			add_action( 'network_admin_menu', array( &$this, 'admin_menu' ) );
			// save settings for network admin
			add_action( 'network_admin_edit_ensemble_video', array( &$this, 'save_network_settings' ) );
			// return message for update settings
			add_action( 'network_admin_notices', array( &$this, 'network_admin_notices' ) );
		}
	}

	function is_network_activated() {
		// Makes sure the plugin is defined before trying to use it
		if ( ! function_exists( 'is_plugin_active_for_network' ) ) {
			require_once( ABSPATH . '/wp-admin/includes/plugin.php' );
		}

		return is_multisite() && is_plugin_active_for_network( plugin_basename( __FILE__ ) );
	}

	function default_options() {
		return array(
			'ensemble_url'              => 'https://demo.ensemblevideo.com',
			'ensemble_base_url'         => '',
			'ensemble_institution_guid' => '',
			'ensemble_version'          => '',
			'ensemble_institution_name' => ''
		);
	}

	function enqueue_ensemble_styles() {
		// For ensemble version 5.3 and below
		wp_enqueue_style( 'ensemble-styles', plugins_url( '/css/ensemble.css', __FILE__ ) );
		//  For ensemble version 5.4 and above
		wp_enqueue_style( 'ensemble-video-styles', plugins_url( '/css/ensemble-video.css', __FILE__ ) );
	}

	function admin_enqueue_scripts() {
		// TODO: restrict to pages with post editor
		wp_enqueue_style( 'ensemble-styles', plugins_url( '/css/ensemble.css', __FILE__ ) );
		//  For ensemble version 5.4 and above
		wp_enqueue_style( 'ensemble-video-styles', plugins_url( '/css/ensemble-video.css', __FILE__ ) );
		// For ensemble version 5.3 and below
		wp_enqueue_script( 'ensemble-video', plugins_url( '/js/ensemble-video-5-3.js', __FILE__ ), array('jquery') );
		//  For ensemble version 5.4 and above
		wp_enqueue_script( 'ev-embedder', plugins_url( '/js/ev-embedder.js', __FILE__ ), array('jquery') );

		$options        = $this->get_options();
		$bindingsToPass = array(
			'ensemble_url'              => $options['ensemble_url'],
			'ensemble_base_url'         => $options['ensemble_base_url'],
			'ensemble_institution_guid' => $options['ensemble_institution_guid'],
			'ensemble_version'          => $options['ensemble_version'],
			'ensemble_institution_name' => $options['ensemble_institution_name']
		);
		$dataToPass     = array(
			'keys' => $bindingsToPass
		);
		wp_localize_script( 'ev-embedder', 'passedData', $dataToPass );
	}

	// add the menu to our site or network

	function get_options() {

		if ( $this->is_network_activated() ) {
			return get_site_option( 'ensemble_video' );
		}
		return get_option( 'ensemble_video' );
	}

	// register Settings API settings

	function add_media_button( $context ) {
		$image_btn = plugins_url( '/img/ensemble-button-bw.png', __FILE__ );
		$out       = "<style>
		.ensemble-video-media-icon{
        background:url($image_btn) no-repeat top left;
        display: inline-block;
        height: 20px;
        margin: -3px 0 0 0;
        vertical-align: text-top;
        width: 20px;
        }
        .wp-core-ui #add-ensemble-video{
         padding-left: 0.4em;
        }            
		</style>";
		$options   = $this->get_options();
		$version   = $options['ensemble_version'];
		if ( version_compare( $version, '5.4.0' ) >= 0 ) {
			$out .= '<a href="#TB_inline?width=240&height=240&inlineId=ensemble-video2" class="thickbox button" id="add-ensemble-video2" title="' . __( "Add Ensemble Video", 'ensemble-video' ) . '"><span class="ensemble-video-media-icon"></span> Add Ensemble Media</a>';
		} else {
			$out .= '<a href="#TB_inline?width=240&height=240&inlineId=ensemble-video" class="thickbox button" id="add-ensemble-video" title="' . __( "Add Ensemble Video", 'ensemble-video' ) . '"><span class="ensemble-video-media-icon"></span> Add Ensemble Video</a>';
		}

		return $context . $out;
	}

	function admin_menu() {
		if ( $this->is_network_activated() ) {
			add_submenu_page( 'settings.php', __( 'Ensemble Video Settings', 'ensemble-video' ), __( 'Ensemble Video', 'ensemble-video' ), 'manage_options', 'ensemble_video', array(
				&$this,
				'display_options_page'
			) );
		} else {
			add_options_page( __( 'Ensemble Video Settings', 'ensemble-video' ), __( 'Ensemble Video', 'ensemble-video' ), 'manage_options', 'ensemble_video', array(
				&$this,
				'display_options_page'
			) );
		}
	}

	function save_network_settings() {

		if ( ! wp_verify_nonce( $_REQUEST['_wpnonce'], 'ensemble_video_options_group-options' ) ) {
			wp_die( 'Sorry, you failed the nonce test.' );
		}
		// validate options
		$input = $this->validate_options( $_POST['ensemble_video'] );

		// update options
		$this->update_options( $input );

		// redirect to settings page in network
		wp_redirect(
			add_query_arg(
				array( 'page' => 'ensemble_video', 'updated' => 'true' ),
				network_admin_url( 'settings.php' )
			)
		);
		exit();
	}

	function validate_options( $input ) {
		$options = $this->get_options();

		// sanitize url
		$ensemble_url              = esc_url_raw( $input['ensemble_url'] );
		$ensemble_institution_guid = $input['ensemble_institution_guid'];
		$ensemble_version          = $options['ensemble_version'];

		// replace http urls with https, since that is all ensemble supports
		// we are running this after our first sanitization in case they didn't enter a protocol
		$ensemble_url = esc_url_raw( str_replace( 'http://', 'https://', $ensemble_url ), array( 'https' ) );

		$ensemble_url = untrailingslashit( $ensemble_url );

		if ( empty( $ensemble_url ) ) {
			add_settings_error( 'ensemble_video_ensemble_url', 'ensemble_invald_url', __( 'Please enter a valid Ensemble Video URL.', 'ensemble-video' ) );
		} else {
			$options['ensemble_url'] = $ensemble_url;
		}

		$urlParts          = parse_url( $ensemble_url );
		$ensemble_base_url = $urlParts['scheme'] . '://' . $urlParts['host'];

		$path = $urlParts['path'];
		$path = ltrim( $path, '/' );

		$parts                  = explode( '/', $path );
		$ensemble_branding_name = '';

		if ( count( $parts ) > 0 ) {
			$ensemble_branding_name = $parts[0];
		}
		if ( $_SERVER['REQUEST_METHOD'] === 'POST' ) {
			// Something posted
			$ensemble_version          = $this->get_server_version( $ensemble_base_url );
			$ensemble_institution_guid = $this->get_branding_guid( $ensemble_base_url, $ensemble_url );
		}

		// Validate the ensemble version that was just downloaded.
		if ( empty( $ensemble_version ) ) {
			$options['ensemble_version'] = 'Not verified, the Add Ensemble Media functionality is disabled.';
			add_settings_error( 'ensemble_video_ensemble_version', 'ensemble_invald_version', __( 'Server version not verified.', 'ensemble-video' ) );
		} else {
			$options['ensemble_version'] = $ensemble_version;
		}
		// Make sure the institution id is a GUID.
		if ( preg_match( "/^(\{)?[a-f\d]{8}(-[a-f\d]{4}){4}[a-f\d]{8}(?(1)\})$/i", $ensemble_institution_guid ) ) {
			$options['ensemble_institution_guid'] = $ensemble_institution_guid;
		} else {
			add_settings_error( 'ensemble_video_ensemble_institution', 'ensemble_invalid_guid', __( 'Your ensemble branding id could not be verified, have you specified the correct server?', 'ensemble-video' ) );
		}

		$options['ensemble_branding_name'] = $ensemble_branding_name;
		$options['ensemble_base_url']      = $ensemble_base_url;

		return $options;
	}

	/**
	 * Returns the server version by contacting the hapi/info api
	 * @param
	 * $url - The url provided by the user
	 *
	 * @return
	 *  version from the server if successful
	 */
	function get_server_version( $url ) {
		$versionUrl = rtrim( $url, '/' ) . '/hapi/info';
		$curl       = curl_init();
		curl_setopt( $curl, CURLOPT_URL, $versionUrl );
		curl_setopt( $curl, CURLOPT_RETURNTRANSFER, 1 );
		curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
		$server_output = curl_exec( $curl );
		$vars          = json_decode( $server_output );
		curl_close( $curl );

		return $vars->applicationVersion;
	}

	/**
	 * @param $baseurl - The base url (without params)
	 * @param $fullurl - The full url, could have branding on the end (or be empty)
	 *
	 * @return
	 * The branding guid from the server.
	 */
	function get_branding_guid( $baseurl, $fullurl ) {
		$brandingsUrl = rtrim( $baseurl, '/' ) . '/hapi/v1/brandings?url=' . rtrim( $fullurl, '/' );
		$curl         = curl_init();
		curl_setopt( $curl, CURLOPT_URL, $brandingsUrl );
		curl_setopt( $curl, CURLOPT_RETURNTRANSFER, 1 );
		curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
		$server_output = curl_exec( $curl );
		$vars          = json_decode( $server_output );
		curl_close( $curl );

		return $vars->institutionId;
	}

	/**
	 * This function is not used because it does not work on 5.4.  When all servers are on 5.5, use this
	 * @param $baseurl - the base url from the server
	 * @param $brandingName - The branding name from the url
	 *
	 * @returns the institution id
	 * The branding guid from the server.
	 */
	function get_institution_guid( $baseurl, $brandingName ) {
		$brandingsUrl = rtrim( $baseurl, '/' ) . '/hapi/v1/Brandings/Current';
		$testHeader   = 'X-EV-BrandingUrl:' . rtrim( $baseurl, '/' ) . '/' . $brandingName;
		$curl         = curl_init();
		$headers      = array( $testHeader );
		curl_setopt( $curl, CURLOPT_URL, $brandingsUrl );
		curl_setopt( $curl, CURLOPT_HTTPHEADER, $headers );
		curl_setopt( $curl, CURLOPT_RETURNTRANSFER, 1 );
		curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);

		$server_output = curl_exec( $curl );

		$vars = json_decode( $server_output );
		curl_close( $curl );

		return $vars->institutionId;
	}

	function update_options( $options ) {
		if ( $this->is_network_activated() ) {
			return update_site_option( 'ensemble_video', $options );
		}
		return update_option( 'ensemble_video', $options );
	}

	function admin_init() {
		//  Debug can be turned on to see what is going on with the version and branding settings
		$debug = false;
		register_setting( 'ensemble_video_options_group', 'ensemble_video', array( &$this, 'validate_options' ) );
		add_settings_section( 'ensemble_video', 'General Settings', array(
			&$this,
			'display_options_description'
		), 'ensemble_video' );
		add_settings_field( 'ensemble_video_ensemble_url', 'Ensemble Video URL', array(
			&$this,
			'display_ensemble_url_option'
		), 'ensemble_video', 'ensemble_video' );
		if ( $debug == true ) {
			add_settings_field( 'ensemble_video_base_url', 'Ensemble Video URL', array(
				&$this,
				'display_ensemble_base_url_option'
			), 'ensemble_video', 'ensemble_video' );
			add_settings_field( 'ensemble_video_ensemble_branding_name', 'Branding Name', array(
				&$this,
				'display_ensemble_branding_name'
			), 'ensemble_video', 'ensemble_video' );
			add_settings_field( 'ensemble_video_ensemble_institution_guid', 'Institution GUID', array(
				&$this,
				'display_ensemble_institution_guid'
			), 'ensemble_video', 'ensemble_video' );
		}
		add_settings_field( 'ensemble_video_ensemble_version', 'Ensemble Version', array(
			&$this,
			'display_ensemble_version'
		), 'ensemble_video', 'ensemble_video' );
	}

	function display_options_description() {
		?>
        <!-- <p>Configure your Ensemble Video embed defaults.</p> -->
		<?php
	}

	/**
	 * The one item that the customer needs to fill out.
	 */
	function display_ensemble_url_option() {
		$options = $this->get_options();
		?>
        <input id="ensemble_video_ensemble_url" name="ensemble_video[ensemble_url]" class="regular-text"
               value="<?php echo $options['ensemble_url']; ?>"/>
        <p class="description">Example: https://demo.ensemblevideo.com. If you don’t know your Ensemble Video URL,
            please review the <a href="https://help.ensemblevideo.com/hc/en-us/articles/360046670252">What is my Login
                URL?</a> article.
        </p>
		<?php
	}

	function display_ensemble_base_url_option() {
		$options = $this->get_options();
		echo $options['ensemble_base_url'];
	}

	function display_ensemble_branding_name() {
		$options = $this->get_options();
		echo $options['ensemble_branding_name'];
	}

	function display_ensemble_institution_guid() {
		$options = $this->get_options();
		?>
        <input id="ensemble_video_ensemble_institution_guid" name="ensemble_video[ensemble_institution_guid]"
               class="regular-text"
               value="<?php echo $options['ensemble_institution_guid']; ?>"/>
        <p class="description">This is the branding GUID from your ensemble setup. Contact your ensemble administrator
            for this value.</p>
		<?php
	}

	function display_ensemble_version() {
		$options = $this->get_options();
		if ( empty ( $options['ensemble_version'] ) ) {
			echo "Please click \"Save Changes\" to verify your ensemble version ";
		}
		echo $options['ensemble_version'];
	}

	// Save network settings
	function display_options_page() {
		$post_page = $this->is_network_activated() ? 'edit.php?action=ensemble_video' : 'options.php';
		?>
        <div class="wrap">
			<?php screen_icon( "options-general" ); ?>
            <h2>Ensemble Video Settings</h2>
            <form action="<?php echo $post_page; ?>" method="post">

				<?php settings_fields( 'ensemble_video_options_group' ); ?>
				<?php do_settings_sections( 'ensemble_video' ); ?>
                <p class="submit">
                    <input name="Submit" type="submit" class="button-primary"
                           value="<?php esc_attr_e( 'Save Changes' ); ?>"/>
                </p>
            </form>
        </div>
		<?php
	}

	function network_admin_notices() {
		$screen = get_current_screen();

		// if updated and the right page
		if ( isset( $_GET['updated'] ) &&
		     'settings_page_ensemble_video-network' === $screen->id
		) {
			$message = __( 'Options saved.', 'ensemble_video' );
			echo '<div id="message" class="updated"><p>' . $message . '</p></div>';
		}
	}

	function ensemblevideo_shortcode( $atts ) {
		$options = $this->get_options();
		if ( ! function_exists( 'ensemble_shortcode' ) ) {
			require_once plugin_dir_path( __FILE__ ) . 'inc/ensemble-shortcode.php';
		}

		return ensemble_shortcode( $atts, $options );
	}
}

/* Initialise outselves */
$GLOBALS['ensemble_video'] = new Ensemble_Video();