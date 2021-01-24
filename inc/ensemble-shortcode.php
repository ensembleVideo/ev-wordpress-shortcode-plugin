<?php

function get_iframe_video( $atts ) {
	$classAttributes = array(
		"displaytitle",
		"displaysharing",
		"displayannotations",
		"displaycaptionsearch",
		"displaymetadata",
		"displayattachments",
		"displayembedcode",
		"displaydownloadicon",
		"displaylinks",
		"displayviewersreport",
		"audiopreviewimage",
	);
	$attributes      = array(
		"autoplay",
		"displayaxdxs",
		"embedasthumbnail",
		"starttime",
		"displaycredits",
		"showcaptions",
		"hidecontrols",
		"embedtype",
		"isaudio",
		"audiopreviewimage",
		"version"
	);

	$data       = array();
	$output     = '';
	$extraClass = '';
	$audioClass = '';

	foreach ( $attributes as $attribute ) {
		$data[ $attribute ] = $atts[ $attribute ];
	}
	foreach ( $classAttributes as $classAttribute ) {
		$data[ $classAttribute ] = $atts[ $classAttribute ];
		if ( $atts[ $classAttribute ] == "true" ) {
			if ( $extraClass == '' ) {
				$extraClass = ' ' . $classAttribute;
			}
		}
	}

	if ( ! empty( $atts["audiopreviewimage"] ) ) {
		if ( ! empty( $atts["isaudio"] ) ) {
			if ( $atts["isaudio"] === "true" ) {
				if ( $atts["audiopreviewimage"] == "false" ) {
					$audioClass = ' audiopreviewimageoff';
				}
			}
		} else {
			if ( $atts["audiopreviewimage"] == "false" ) {
				$audioClass = ' audiopreviewimageoff';
			}
		}
	}

	$output .= '<div class="ensemble-video-wrapper' . $extraClass . $audioClass . '"';

	if ( ! empty( $atts["embedtype"] ) ) {
		if ( $atts["embedtype"] !== "responsive" ) {
			$output .= 'style="width:' . $atts["width"] . 'px; height:' . $atts["height"] . 'px;"';
		}
	}

	$output .= '>'; // end <div class="ensemble-video-wrapper
	$output .= '<iframe src="';
	$output .= $atts['url'];
	$output .= '/hapi/v1/contents/';
	$output .= $atts['id'];
	$output .= '/plugin?';
	$output .= http_build_query( $data, '', '&amp;' );

	$output .= '" frameborder="0" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" scrolling="no" allowfullscreen=""></iframe>';
	$output .= '</div>';

	return $output;
}

function get_iframe_playlist( $atts ) {

	$attributes = array(
		"ispreview",
		"layout",
		"sortby",
		"desc",
		"featuredcontentid",
		"displaytitle",
		"displaylogo",
		"displayembedcode",
		"displayattachments",
		"displayannotations",
		"displaylinks",
		"displaysharing",
		"displaycopyurl",
		"autoplay",
		"showcaptions",
		"displaymetadata",
		"displaycaptionsearch",
		"audiopreviewimage",
		"displayviewersreport",
		"displayaxdxs",
		"isresponsive",
		"resultscount",
		"search",
		"categories",
	);

	$data = array();

	foreach ( $attributes as $attribute ) {
		if ( ! empty( $atts[ $attribute ] ) ) {
			$data[ $attribute ] = $atts[ $attribute ];
		}
	}
	$output = '';

	if ( $atts['embedtype'] === 'responsive' ) {
		$output .= '<div id="pl-wrapper-' . $atts['id'] . '" class="ensemble-playlist-wrapper ' . strtolower($atts['layout']) . '">';
	} else {
		$output = '<div id="pl-wrapper-' . $atts['id'] . '" class="ensemble-playlist-wrapper" style="width:' . $atts["width"] . 'px; height:' . $atts["height"] . 'px;">';
	}
	$id     = 'pl-wrapper-' . $atts['id'];
	$output .= '<iframe src="';
	$output .= $atts['url'];
	$output .= '/hapi/v1/ui/Playlists/';
	$output .= $atts['id'];
	$output .= '/plugin?';
	$output .= http_build_query( $data, '', '&amp;' );

	$output .= '" frameborder="0" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" allowfullscreen=""></iframe>';
	if ( $atts['embedtype'] === 'responsive' ) {
		switch (strtolower($atts['layout'])) {
			case 'verticallistwithplayer':
				$output .= '<script type="text/javascript">function handleResize() { var e = document.getElementById("' . $id . '"); if (null != e) { var i = e.getElementsByTagName("iframe")[0]; if (null != i) { e.style = "width: 100%; height: 100%;"; i.style = "width: 100%; height: 100%;"; var n = e.offsetWidth; e.style.height = n >= 822 ? 66.6 * n / 100 * .5625 + 15 + "px" : .5625 * n + 350 + "px" }}} handleResize(), window.onresize = function (e) { handleResize() };</script>';
				break;
			case 'grid':
			case 'list':
				$output .= '<script type="text/javascript">function handleResize() { var e = document.getElementById("' . $id . '"); if (null != e) { var i = e.getElementsByTagName("iframe")[0]; if (null != i) { e.style = "width: 100%; height: 100%;"; i.style = "width: 100%; height: 100%;"; var n = e.offsetWidth; e.style.height = n >= 400 ? 56.25 * n / 100 + 140 + "px" : 56.25 * n / 100 + 390 + "px" }}} handleResize(), window.onresize = function (e) { handleResize() };</script>';
				break;
			case 'horizontallistwithplayer':
				break;
			default:
				break;
		}
	}
	$output .= '</div>';

	return $output;
}

function get_iframe_dropbox( $atts ) {
	$output = '<div class="ensemble-dropbox-wrapper" style="width:' . $atts["width"] . 'px; height:' . $atts["height"] . 'px;">';
	$output .= '<iframe src="';
	$output .= $atts['url'];
	$output .= '/hapi/v1/ui/dropboxes/';
	$output .= $atts['id'];
	$output .= '/embed ';
	$output .= '" frameborder="0" style="width: 100%; height: 100%;" scrolling="scroll" allowfullscreen="" ></iframe>';
	$output .= '</div>';

	return $output;
}

function get_iframe_quiz( $atts ) {
	$attributes = array(
		"displaytitle",
		"displayattachment",
		"displaylinks",
		"displaymetadata",
		"displaycredits",
		"autoplay",
		"showcaptions",
		"id"
	);
	$data       = array();

	foreach ( $attributes as $attribute ) {
		$data[ $attribute ] = $atts[ $attribute ];
	}
	$output = '<div class="ensemble-quiz-wrapper">';

	$output .= '<iframe src="';
	$output .= $atts['url'];
	$output .= '/hapi/v1/quiz/';
	$output .= $atts['id'];
	$output .= '/plugin?';
	$output .= http_build_query( $data, '', '&amp;' );

	$output .= '"frameborder="0" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" scrolling="no" allowfullscreen=""></iframe>';
	$output .= '</div>';

	return $output;
}

function legacy_coding( $atts ) {
	$embed_defaults = wp_embed_defaults();
	if ( $atts['width'] == $embed_defaults['width'] && $atts['height'] == $embed_defaults['height'] ) {

		// expand videos to be the biggest they can and still have the right proportions
		// but only for single videos, leave web destinations at maximum embed size
		if ( ! empty( $atts['contentid'] ) ) {
			list( $width, $height ) = wp_expand_dimensions( 640, 393, $atts['width'], $atts['height'] );
		}
	} else {
		$width  = $atts['width'];
		$height = $atts['height'];
	}
	if ( $atts['audio'] == true ) {
		$height = '40';
	}

	/* START EMBED CODE */
	$output = '<div class="ensemble-video-wrapper ';
	if ( ! empty( $atts['destinationid'] ) ) {
		$output .= 'destinationid ';
	} elseif ( $atts['displaytitle'] === 'true' ) {
		$output .= 'displaytitle';
	} elseif ( $atts['displaysharing'] === 'true' ) {
		$output .= 'displaysharing';
	} elseif ( $atts['displayAnnotations'] === 'true' ) {
		$output .= 'displayAnnotations';
	} elseif ( $atts['displaycaptionsearch'] === 'true' ) {
		$output .= 'displaycaptionsearch';
	} elseif ( $atts['displaymetadata'] === 'true' ) {
		$output .= 'displaymetadata';
	} elseif ( $atts['displaydownloadicon'] === 'true' ) {
		$output .= 'displaydownloadicon';
	} elseif ( $atts['displaydateproduced'] === 'true' ) {
		$output .= 'displaydateproduced';
	} elseif ( $atts['displayattachments'] === 'true' ) {
		$output .= 'displayattachments';
	} elseif ( $atts['displayembedcode'] === 'true' ) {
		$output .= 'displayembedcode';
	} elseif ( $atts['displaylinks'] === 'true' ) {
		$output .= 'displaylinks';
	} elseif ( $atts['displayviewersreport'] === 'true' ) {
		$output .= 'displayviewersreport';
	}
	if ( $atts['audio'] === 'true' ) {
		if ( $atts['audiopreviewimage'] !== 'true' ) {
			$output .= ' audiopreviewimageoff';
		}
	}
	$output .= '"><iframe id="';
	/*CH*/
	if ( ! empty( $atts['contentid'] ) ) {
		$output .= 'ensembleEmbeddedContent_';
	}
	/*CH*/
	if ( ! empty( $atts['destinationid'] ) ) {
		$output .= 'ensembleFrame_';
	}
	$output .= ! empty( $atts['contentid'] ) ? $atts['contentid'] : $atts['destinationid'];
	$output .= '"';
	$output .= 'src="' . $atts['url'] . '/app/plugin/embed.aspx?';
	/*CH*/
	if ( ! empty( $atts['destinationid'] ) ) {
		$output .= 'Destination';
	}
	$output .= 'ID=';

	$output .= ! empty( $atts['contentid'] ) ? $atts['contentid'] : $atts['destinationid'];
	if ( ! empty( $atts['contentid'] ) ) {
		$output .= '&contentID=' . $atts['contentid'];
		$output .= '&autoplay=' . $atts['autoplay'];
		$output .= '&hideControls=' . $atts['hidecontrols'];
		$output .= '&showCaptions=' . $atts['showcaptions'];
		$output .= '&width=' . $width;
		if ( $atts['audio'] == false ) {
			$output .= '&height=' . ( $height - 30 );
		}
		$output .= '&embed=true';
		$output .= '&startTime=0';
		$output .= '&displayCaptionSearch=' . $atts['displaycaptionsearch'];
		$output .= '&isResponsive=' . $atts['isresponsive'];
		$output .= '&isNewPluginEmbed=true'; //CH Set to always true
		$output .= '&displayDownloadIcon=' . $atts['displaydownloadicon'];
		$output .= '&displaySharing=' . $atts['displaysharing'];
		$output .= '&displayMetaData=' . $atts['displaymetadata'];
		$output .= '&displayAnnotations=' . $atts['displayannotations'];
		$output .= '&displayDateProduced=' . $atts['displaydateproduced'];
		$output .= '&displayEmbedCode=' . $atts['displayembedcode'];
		$output .= '&displayStatistics=' . $atts['displaystatistics'];
		$output .= '&displayAttachments=' . $atts['displayattachments'];
		$output .= '&displayLinks=' . $atts['displaylinks'];
		$output .= '&displayCredits=' . $atts['displaycredits'];
		$output .= '&displayViewersReport=' . $atts['displayviewersreport'];
		$output .= '&displayTitle=' . $atts['displaytitle'];
		$output .= '&audioPreviewImage=' . $atts['audiopreviewimage'];

	} else {
		$output .= '&playlistEmbed=true&isResponsive=true';
		$output .= '&hideControls=' . $atts['hidecontrols'];
		$output .= '&showCaptions=' . $atts['showcaptions'];
		$output .= '&displayDownloadIcon=' . $atts['displaydownloadicon'];
		$output .= '&displaySharing=' . $atts['displaysharing'];
		$output .= '&displayMetaData=' . $atts['displaymetadata'];
		$output .= '&displayAnnotations=' . $atts['displayannotations'];
		$output .= '&displayDateProduced=' . $atts['displaydateproduced'];
		$output .= '&displayEmbedCode=' . $atts['displayembedcode'];
		$output .= '&displayStatistics=' . $atts['displaystatistics'];
		$output .= '&displayAttachments=' . $atts['displayattachments'];
		$output .= '&displayLinks=' . $atts['displaylinks'];
		$output .= '&displayCredits=' . $atts['displaycredits'];
		$output .= '&displayViewersReport=' . $atts['displayviewersreport'];
		$output .= '&displayTitle=' . $atts['displaytitle'];
		$output .= '&audioPreviewImage=' . $atts['audiopreviewimage'];
		$output .= '&autoplay=' . $atts['autoplay'];
		$output .= '&displayCaptionSearch=' . $atts['displaycaptionsearch'];
		if ( ! empty( $width ) ) {
			$output .= '&maxContentWidth=' . $width;
		}

		if ( $atts['displayshowcase'] !== false ) {
			$output .= '&displayShowcase=' . $atts['displayshowcase'];
			$output .= '&featuredContentOrderByDirection=' . $atts['featuredcontentorderbydirection'];
			$output .= '&displayCategoryList=' . $atts['displaycategorylist'];
			$output .= '&categoryOrientation=' . $atts['categoryorientation'];
		}

		$output .= '&displayTitle=' . $atts['displaytitle'];

	}
	$output .= '&useIFrame=' . $atts['iframe'] . '" ';
	$output .= 'frameborder="0" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"';
	if ( ! empty( $atts['contentid'] ) ) {
		$output .= 'scrolling="no"';
	}
	$output .= ' allowfullscreen></iframe></div>';

	return $output;
}

function ensemble_shortcode( $atts, $options ) {
	$embed_defaults = wp_embed_defaults();
	$atts           = shortcode_atts( array(
		'url'                  => $options['ensemble_base_url'],
		'content_type'         => '',
		'contentid'            => '',
		'id'                   => '',
		'version'              => '',  //  The version of the plugin
		'audio'                => false,
		'width'                => $embed_defaults["width"],
		'height'               => $embed_defaults["height"],
		'iframe'               => 'true',
		'displaytitle'         => 'false',
		'autoplay'             => 'false',
		'showcaptions'         => 'false',
		'hidecontrols'         => 'false',
		'audiopreviewimage'    => '',
		'displaycaptionsearch' => 'false',
		'isresponsive'         => 'true',
		'isnewpluginembed'     => 'true',

		'destinationid' => '',

		'displayshowcase'                 => false,
		'featuredcontentorderbydirection' => 'desc',
		'displaycategorylist'             => 'true',
		'categoryorientation'             => 'horizontal',

		'displayembedcode'     => 'false',
		'displaystatistics'    => 'false',
		'displayattachments'   => 'false',
		'displaylinks'         => 'false',
		'displaycredits'       => 'false',
		'displaydownloadicon'  => 'false',
		'displaysharing'       => 'false',
		'displayannotations'   => 'false',
		'displaymetadata'      => 'false',
		'displayDateProduced'  => 'false',
		'displayviewersreport' => 'false',

		'layout' => 'verticallistwithplayer',
		'sortby' => 'dateadded',
		'desc'   => 'true',
		'search' => null,

		"ispreview"         => 'false',
		"categories"        => null,
		"resultscount"      => null,
		"featuredcontentid" => '',
		"displaylogo"       => 'true',
		"displaycopyurl"    => 'false',
		"displayaxdxs"      => 'false',
		"embedtype"         => 'responsive',
		"isaudio"           => "",
		"audio"             => "",
		"contentid"         => "",
		"key"               => ""
	), $atts );


	if ( ! empty( $atts['content_type'] ) ) {
		// this is the new versioned way of doing things.
		$output = '';

		if ( $atts['content_type'] === 'video' ) {
			$output .= get_iframe_video( $atts );
		} elseif ( $atts['content_type'] === 'playlist' ) {
			$output .= get_iframe_playlist( $atts );
		} elseif ( $atts['content_type'] === 'dropbox' ) {
			$output .= get_iframe_dropbox( $atts );
		} elseif ( $atts['content_type'] === 'quiz' ) {
			$output .= get_iframe_quiz( $atts );
		} else {
			$output = '<div>invalid tag</div> ';
		}
	} else {
		$output = legacy_coding( $atts );
	}

	return $output;
}


