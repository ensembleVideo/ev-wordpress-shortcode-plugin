<?php
/*
Plugin Name: Ensemble Video Responsive Plugin 
Description: Easily embed Ensemble Videos in your site. This version includes responsive embed codes and several embedding options.
Version: 1.2.0
*/

class Ensemble_Video {
	
	// constructor
	function Ensemble_Video() {		

		// add our shortcode
		add_shortcode('ensemblevideo', array(&$this, 'ensemblevideo_shortcode'));
		
		// set default options
		if ( get_site_option('ensemble_video') === false ) {
			if( $this->is_network_activated() ) {
				update_site_option('ensemble_video', $this->default_options());
			} else {
				update_option('ensemble_video', $this->default_options());
			}
		}
		
		if( is_admin() ) {
			// add media button 
			add_action('media_buttons_context', array(&$this, 'add_media_button'), 999);
			// add media button scripts and styles
			add_action('admin_enqueue_scripts', array(&$this, 'admin_enqueue_scripts'));
			
			
			// add admin page
			add_action('admin_menu', array(&$this, 'admin_menu'));
            add_action('admin_init', array(&$this, 'admin_init'));
			
			// add network admin page
			add_action('network_admin_menu', array(&$this, 'admin_menu'));
			// save settings for network admin
			add_action('network_admin_edit_ensemble_video', array( &$this, 'save_network_settings' ) );
			// return message for update settings
			add_action('network_admin_notices',	array( &$this, 'network_admin_notices' ) );
		}
	}
	
	function admin_enqueue_scripts() {
		// TODO: restrict to pages with post editor
		
		wp_enqueue_script( 'ensemble-video', plugins_url('/js/ensemble-video.js', __FILE__) );
		wp_enqueue_style( 'ensemble-video-styles', plugins_url('/css/ensemble-video.css', __FILE__) );
	}
	
    function add_media_button($context) {

        $image_btn = plugins_url( '/img/ensemble-button-bw.png', __FILE__ );
		$out = "<style>
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
		$out .= '<a href="#TB_inline?width=240&height=240&inlineId=ensemble-video" class="thickbox button" id="add-ensemble-video" title="' . __("Add Ensemble Video", 'ensemble-video') . '"><span class="ensemble-video-media-icon"></span> Add Ensemble Video</a>';
		return $context . $out;
	
	}
	
	// test to see if we are network activated
	function is_network_activated() {
		
	    // Makes sure the plugin is defined before trying to use it
		if ( ! function_exists( 'is_plugin_active_for_network' ) )
		    require_once( ABSPATH . '/wp-admin/includes/plugin.php' );
			
		return is_multisite() && is_plugin_active_for_network( plugin_basename( __FILE__ ));
	}
	
	// add the menu to our site or network
	function admin_menu() {
		if ( $this->is_network_activated() ) {
			add_submenu_page( 'settings.php',__('Ensemble Video Settings','ensemble-video'), __('Ensemble Video','ensemble-video'), 'manage_options', 'ensemble_video', array(&$this, 'display_options_page') );
		} else {
			add_options_page( __('Ensemble Video Settings','ensemble-video'), __('Ensemble Video','ensemble-video'), 'manage_options', 'ensemble_video', array(&$this, 'display_options_page') );
		}
	}
	
	// register Settings API settings
	function admin_init() {
		register_setting('ensemble_video_options_group','ensemble_video',array(&$this, 'validate_options'));
        add_settings_section('ensemble_video','General Settings', array(&$this, 'display_options_description'),'ensemble_video');
		add_settings_field('ensemble_video_ensemble_url','Ensemble Video URL',array(&$this, 'display_ensemble_url_option'),'ensemble_video','ensemble_video');
	}
	
	function default_options() {
		$defaults = array(
			'ensemble_url' => 'https://cloud.ensemblevideo.com',
		);
		
		return apply_filters( $defaults);
	}
	
	function validate_options($input) {
						
		$options = $this->get_options();
		
		// sanitize url
		$ensemble_url = esc_url_raw( $input['ensemble_url'] );
			
		// replace http urls with https, since that is all ensemble supports
		// we are running this after our first sanitization in case they didn't enter a protocol
		$ensemble_url = esc_url_raw( str_replace('http://', 'https://', $ensemble_url ), array('https') );
		
		$ensemble_url = untrailingslashit($ensemble_url);
		
		if( empty($ensemble_url) ) {
			
			add_settings_error('ensemble_video_ensemble_url', 'ensemble_invald_url', __('Please enter a valid Ensemble Video URL.', 'ensemble-video'));
			
		} else {
			$options['ensemble_url'] = $ensemble_url;
		}
				
		return $options;
	}
	
	function display_options_description() {
		?>
		<!-- <p>Configure your Ensemble Video embed defaults.</p> -->
		<?php
	}
	
	function display_ensemble_url_option() {
		
		$options = $this->get_options();
		
		?>
		<input id="ensemble_video_ensemble_url" name="ensemble_video[ensemble_url]" class="regular-text" value="<?php echo $options['ensemble_url']; ?>" />
		<p class="description">This is the URL of your ensemble video site, eg. https://ensemble.example.com.</p>
		<?php
	}
	
	function display_options_page() {
		
		$options = $this->get_options();
		
		$post_page = $this->is_network_activated() ? 'edit.php?action=ensemble_video' : 'options.php';
		
		?>
		<div class="wrap">
			<?php screen_icon("options-general"); ?>
			<h2>Ensemble Video Settings</h2>
			<form action="<?php echo $post_page; ?>" method="post">
				<?php settings_fields('ensemble_video_options_group'); ?>
				<?php do_settings_sections('ensemble_video'); ?>
				<p class="submit">
					<input name="Submit" type="submit" class="button-primary" value="<?php esc_attr_e('Save Changes'); ?>" />
				</p>
			</form>
		</div>
         <?php
	}

	// get options for current site, or network if network activated
	function get_options() {
		if ( $this->is_network_activated() ) {
			return get_site_option('ensemble_video');
		} 
	
		return get_option('ensemble_video');
	}
	
	// update options for current site, or network if network activated
	function update_options( $options ) {
		
		if ( $this->is_network_activated() ) {
			return update_site_option('ensemble_video', $options);
		} 
	
		return update_option('ensemble_video', $options);
	}
	
	// Save network settings
	function save_network_settings() {
		
		if ( ! wp_verify_nonce( $_REQUEST['_wpnonce'], 'ensemble_video_options_group-options' ) )
			wp_die( 'Sorry, you failed the nonce test.' );
		
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
	
	// Retrun string for update message
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
	
	function ensemblevideo_shortcode($atts){
		
		$options = $this->get_options();
		
		$embed_defaults = wp_embed_defaults();
	
		$atts = shortcode_atts( array(		

			'url' 								=> $options['ensemble_url'],
			
			'contentid' 						=> '',
			
			'audio'								=> false,
			
			'width' 							=> $embed_defaults["width"],
			'height' 							=> $embed_defaults["height"],
			'iframe' 							=> 'true',
			'displaytitle'						=> 'false',
			'autoplay' 							=> 'false',
			'showcaptions' 						=> 'false',
			'hidecontrols' 						=> 'false',
			'audiopreviewimage'					=> 'false',
			'displaycaptionsearch'				=> 'false',
			'isresponsive'						=> 'true',
			'isnewpluginembed'					=> 'true',
			'audiopreviewimage'					=> 'false',
			
			'destinationid' 					=> '',
			
			'displayshowcase' 					=> false,
			'featuredcontentorderbydirection' 	=> 'desc',
			'displaycategorylist'				=> 'true',
			'categoryorientation'				=> 'horizontal',
			
			'displayembedcode'					=> 'false',
			'displaystatistics'					=> 'false',
			'displayattachments'				=> 'false',
			'displaylinks'						=> 'false',
			'displaycredits'					=> 'false',
			'displaydownloadicon'				=> 'false',
			'displaysharing'					=> 'false',
			'displayannotations'				=> 'false',
			'displaymetadata'					=> 'false',
			'displayDateProduced'				=> 'false',
			'displayviewersreport'				=> 'false',
			
		), $atts);
		
		
		if( $atts['width'] == $embed_defaults['width'] && $atts['height'] == $embed_defaults['height'] ) {
				
			// expand videos to be the biggest they can and still have the right proportions
			// but only for single videos, leave web destinations at maximum embed size
			if( !empty($atts['contentid']) ) {

				list( $width, $height ) = wp_expand_dimensions( 640, 393, $atts['width'], $atts['height'] );
			}
			
		}  else {
			$width = $atts['width'];
			$height = $atts['height'];
		}
		
		if( $atts['audio'] == true ) {
			$height = '40';
		}
		
/* START EMBED CODE */
		$output =  '<div style="position: relative; padding-bottom: 56.25%; padding-top: ';
		if( !empty($atts['destinationid']) ) {
			$output .= '9';
		} elseif ($atts['displaytitle']==='true') {
    		$output .= '4';
		} elseif ($atts['displaysharing']==='true') {
    		$output .= '4';
		} elseif ($atts['displayAnnotations']==='true') {
    		$output .= '4';
		} elseif ($atts['displaycaptionsearch']==='true') {
    		$output .= '4';
		} elseif ($atts['displaymetadata']==='true') {
    		$output .= '4';
		} elseif ($atts['displaydownloadicon']==='true') {
    		$output .= '4';
		} elseif ($atts['displaydateproduced']==='true') {
    		$output .= '4';
		} elseif ($atts['displayattachments']==='true') {
    		$output .= '4';
		} elseif ($atts['displayembedcode']==='true') {
    		$output .= '4';
		} elseif ($atts['displaylinks']==='true') {
    		$output .= '4';
		} elseif ($atts['displayviewersreport']==='true') {
    		$output .= '4';
		} 

		$output .=  '0px; height: 0;  -webkit-overflow-scrolling: touch;"><iframe id="';
/*CH*/	if( !empty($atts['contentid']) ) {
			$output .= 'ensembleEmbeddedContent_';
		}
/*CH*/	if( !empty($atts['destinationid']) ) {
			$output .= 'ensembleFrame_';
		}
		$output .= !empty($atts['contentid']) ? $atts['contentid'] : $atts['destinationid'];
		$output .= '"';
		$output .= 'src="' . $atts['url'] . '/app/plugin/embed.aspx?';
/*CH*/	if( !empty($atts['destinationid']) ) {
			$output .= 'Destination';
		}
		$output .= 'ID=';

		$output .= !empty($atts['contentid']) ? $atts['contentid'] : $atts['destinationid'];
//CH		$output .= '" class="ensembleEmbeddedContent" style="width: ' . ($width + 8) . 'px; height: ' . ($height + 10) . 'px;';
		
//CH		if( !empty($atts['contentid']) ) {
//CH			$output .= 'margin-left:-8px;margin-top:-8px;';
//CH		}
		
//CH		$output .= '"><script type="text/javascript" src="' . $atts['url'] . '/app/plugin/plugin.aspx?';
		if( !empty($atts['contentid']) ) {
			$output .= '&contentID=' . $atts['contentid'];
			$output .= '&autoplay=' . $atts['autoplay'];
			$output .= '&hideControls=' . $atts['hidecontrols'];
			$output .= '&showCaptions=' . $atts['showcaptions'];
			$output .= '&width=' . $width;
			if( $atts['audio'] == false ) {
				$output .= '&height=' . ($height - 30);
			}
			$output .= '&embed=true';
			$output .= '&startTime=0';
			$output .= '&displayCaptionSearch=' . $atts['displaycaptionsearch'];
			$output .= '&isResponsive=' . $atts['isresponsive'];
			$output .= '&isNewPluginEmbed=true'; //CH Set to always true
			$output .= '&displayDownloadIcon='	 . $atts['displaydownloadicon'];
			$output .= '&displaySharing='	 . $atts['displaysharing'];
			$output .= '&displayMetaData='	 . $atts['displaymetadata'];
			$output .= '&displayAnnotations='	. $atts['displayannotations'];
			$output .= '&displayDateProduced='	. $atts['displaydateproduced'];
			$output .= '&displayEmbedCode='	 . $atts['displayembedcode'];
			$output .= '&displayStatistics='	 . $atts['displaystatistics'];
			$output .= '&displayAttachments=' . $atts['displayattachments'];
			$output .= '&displayLinks='		 . $atts['displaylinks'];
			$output .= '&displayCredits='	 . $atts['displaycredits'];
			$output .= '&displayViewersReport='	 . $atts['displayviewersreport'];
			$output .= '&displayTitle='	 . $atts['displaytitle'];
			$output .= '&audioPreviewImage='	 . $atts['audiopreviewimage'];
						
		} else {
//CH		$output .= 'DestinationID=' . $atts['destinationid'];
			$output .=	'&playlistEmbed=true&isResponsive=true';
			$output .= '&hideControls=' . $atts['hidecontrols'];
			$output .= '&showCaptions=' . $atts['showcaptions'];
			$output .= '&displayDownloadIcon='	 . $atts['displaydownloadicon'];
			$output .= '&displaySharing='	 . $atts['displaysharing'];
			$output .= '&displayMetaData='	 . $atts['displaymetadata'];
			$output .= '&displayAnnotations='	. $atts['displayannotations'];
			$output .= '&displayDateProduced='	. $atts['displaydateproduced'];
			$output .= '&displayEmbedCode='	 . $atts['displayembedcode'];
			$output .= '&displayStatistics='	 . $atts['displaystatistics'];
			$output .= '&displayAttachments=' . $atts['displayattachments'];
			$output .= '&displayLinks='		 . $atts['displaylinks'];
			$output .= '&displayCredits='	 . $atts['displaycredits'];
			$output .= '&displayViewersReport='	 . $atts['displayviewersreport'];
			$output .= '&displayTitle='	 . $atts['displaytitle'];
			$output .= '&audioPreviewImage='	 . $atts['audiopreviewimage'];
			$output .= '&autoplay=' . $atts['autoplay'];
			$output .= '&displayCaptionSearch=' . $atts['displaycaptionsearch'];
			if( !empty($width) ) {$output .= '&maxContentWidth=' . $width;
			}
			
			if( $atts['displayshowcase'] !== false ) {
				$output .= '&displayShowcase=' . $atts['displayshowcase'];
				$output .= '&featuredContentOrderByDirection=' . $atts['featuredcontentorderbydirection'];
				$output .= '&displayCategoryList=' . $atts['displaycategorylist'];
				$output .= '&categoryOrientation=' . $atts['categoryorientation'];
			}
			
			$output .= '&displayTitle='	 . $atts['displaytitle'];
				
		}
		$output .= '&useIFrame=' . $atts['iframe'] . '" ';
/*CH*/	$output .= 'frameborder="0" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"';
/*CH*/	if( !empty($atts['contentid']) ) {
/*CH*/		$output .= 'scrolling="no"';
/*CH*/	}
/*CH*/	$output .= ' allowfullscreen></iframe></div>';			
		
		return $output;
	}
	
}

/* Initialise outselves */
$GLOBALS['ensemble_video'] = new Ensemble_Video();