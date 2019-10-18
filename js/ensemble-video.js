jQuery(document).ready(function($) {

	$('<div />')
		.attr('id', 'ensemble-video')
		.append("<div id='ensemble-video-inner'>\
		<div id='shortcode-type-header'>\
		<ul>\
			<li><a id='embed-video-link' data-display-class='for-video'>Add Video</a></li>\
			<li><a id='embed-audio-link' data-display-class='for-video'>Add Audio</a></li>\
			<li><a id='embed-destination-link' data-display-class='for-web-destination'>Add Playlist</a></li>\
		</ul>\
		</div>\
		<form>\
		<p id='content-id' class='for-video'>\
		<label>Content ID <input id='content-id-input' /></label></p>\
		<p id='destination-id' class='for-web-destination'>\
		<label>Playlist ID <input id='destination-id-input' /></label></p>\
		<p class='for-video'>\
		<label><input type='checkbox' id='displayannotations' /> Annotations</label> &nbsp;&nbsp;&nbsp;\
		<label><input type='checkbox' id='showcaptions' /> Captions On By Default</label> &nbsp;&nbsp;&nbsp;\		        <label><input type='checkbox' id='displaycaptionsearch' /> Interactive Transcript</label> &nbsp;&nbsp;&nbsp;\
		<label><input type='checkbox' id='displaysharing' /> Social Sharing</label> &nbsp;&nbsp;&nbsp;\
		<label><input type='checkbox' id='displaytitle' /> Title</label></br>\
        <label><input type='checkbox' id='displayviewersreport' /> Viewers Report</label> &nbsp;&nbsp;&nbsp;\
        <label><input type='checkbox' id='displayattachments' /> Attachments</label> &nbsp;&nbsp;&nbsp;\
        <label><input type='checkbox' id='autoplay' /> Autoplay</label> &nbsp;&nbsp;&nbsp;\
		<label><input type='checkbox' id='displaydownloadicon' /> Download Link</label> &nbsp;&nbsp;&nbsp;\
		<label><input type='checkbox' id='displayembedcode' /> Embed Code</label> &nbsp;&nbsp;&nbsp;\
		<label><input type='checkbox' id='displaylinks' /> Links</label> &nbsp;&nbsp;&nbsp;\
		<label><input type='checkbox' id='displaymetadata' /> Meta Data</label><br>\
		<label><input type='checkbox' id='audiopreviewimage' /> Audio Preview Image</label></p>\
		<p class='for-web-destination'>\
		<label><input type='checkbox' id='displayannotations-wd' /> Annotations</label> &nbsp;&nbsp;&nbsp;\
		<label><input type='checkbox' id='showcaptions-wd' /> Captions On By Default</label> &nbsp;&nbsp;&nbsp;\		        <label><input type='checkbox' id='displaycaptionsearch-wd' /> Interactive Transcript</label> &nbsp;&nbsp;&nbsp;\
		<label><input type='checkbox' id='displaysharing-wd' /> Social Sharing</label> &nbsp;&nbsp;&nbsp;\
		<label><input type='checkbox' id='displaytitle-wd' /> Title</label></br>\
        <label><input type='checkbox' id='displayviewersreport-wd' /> Viewers Report</label> &nbsp;&nbsp;&nbsp;\
        <label><input type='checkbox' id='displayattachments-wd' /> Attachments</label> &nbsp;&nbsp;&nbsp;\
        <label><input type='checkbox' id='autoplay-wd' /> Autoplay</label> &nbsp;&nbsp;&nbsp;\
		<label><input type='checkbox' id='displayembedcode-wd' /> Embed Code</label> &nbsp;&nbsp;&nbsp;\
		<label><input type='checkbox' id='displaylinks-wd' /> Links</label> &nbsp;&nbsp;&nbsp;\
		<label><input type='checkbox' id='displaymetadata-wd' /> Meta Data</label><br>\
		<label><input type='checkbox' id='audiopreviewimage-wd' /> Audio Preview Image</label> </p>\
		<h4 class='for-web-destination'>Choose Layout</h4>\
		<p class='for-web-destination'><label><input type='checkbox' id='display-showcase' /> Display Showcase</label></p>\
		<input class='button-primary' type=submit value='Add video' /> \
		<input type='button' class='button' onclick='tb_remove(); return false;' value='Cancel' />\
		</form>\
		</div>")
		.hide()
		.appendTo('body');

	$('#ensemble-video-inner form').submit(function(e){
		e.preventDefault();
		
		insertEnsembleShortcode();
		
		// closes Thickbox
		tb_remove();
		
		return false;		
	});
	
	$('#shortcode-type-header a').click(function(){
		
		$('#ensemble-video-inner a').removeClass('active');
		$(this).addClass('active');
			
		// set insert button text based on tab text
		$("#ensemble-video-inner .button-primary").val( $(this).text() );
		
		// toggle display of form elements
		$('#ensemble-video-inner p, #ensemble-video-inner h4').hide();
		$( '#ensemble-video-inner .' + $(this).attr('data-display-class') ).show();
		
	});
	
	$('#embed-video-link').click();


	function insertEnsembleShortcode() {
				
		var shortcode = generateEnsembleShortcode();
		
		window.send_to_editor( shortcode );	
	}
	
	function generateEnsembleShortcode() {
		var shortcode = "[ensemblevideo ";
		
		if( $('#ensemble-video-inner a#embed-video-link').is('.active') || $('#ensemble-video-inner a#embed-audio-link').is('.active') ) {
			
			shortcode += 'contentid=' + $('#content-id-input').val();
			
			if( $('#ensemble-video-inner a#embed-audio-link').is('.active') ){
				shortcode += ' audio=true';
			}
			
		} else {
			
			shortcode += 'destinationid=' + $('#destination-id-input').val();
			
			if( $('#display-showcase').is(':checked') ){
				shortcode += ' displayshowcase=true';
			}
			
			if( $('#autoplay-wd').is(':checked') ){
				shortcode += ' autoplay=true';
			}
		
			if( $('#showcaptions-wd').is(':checked') ){
				shortcode += ' showcaptions=true';
			}

			if( $('#displayannotations-wd').is(':checked') ){
				shortcode += ' displayAnnotations=true';
			}

			if( $('#displaycaptionsearch-wd').is(':checked') ){
				shortcode += ' displaycaptionsearch=true';
			}

			if( $('#displaysharing-wd').is(':checked') ){
				shortcode += ' displaySharing=true';
			}

			if( $('#displaytitle-wd').is(':checked') ){
				shortcode += ' displayTitle=true';
			}

			if( $('#displayviewersreport-wd').is(':checked') ){
				shortcode += ' displayViewersReport=true';
			}

			if( $('#displayattachments-wd').is(':checked') ){
				shortcode += ' displayattachments=true';
			}

			if( $('#displayembedcode-wd').is(':checked') ){
				shortcode += ' displayembedcode=true';
			}

			if( $('#displaylinks-wd').is(':checked') ){
				shortcode += ' displaylinks=true';
			}

			if( $('#displaymetadata-wd').is(':checked') ){
				shortcode += ' displayMetaData=true';
			}

			if( $('#embedasthumbnail-wd').is(':checked') ){
				shortcode += ' embedAsThumbnail=true';
			}

			if( $('#audiopreviewimage-wd').is(':checked') ){
				shortcode += ' audioPreviewImage=true';
			}
			
		}
		
		if( $('#autoplay').is(':checked') ){
			shortcode += ' autoplay=true';
		}
		
		if( $('#showcaptions').is(':checked') ){
			shortcode += ' showcaptions=true';
		}
		
		if( $('#displayannotations').is(':checked') ){
			shortcode += ' displayAnnotations=true';
		}
		
		if( $('#displaycaptionsearch').is(':checked') ){
			shortcode += ' displaycaptionsearch=true';
		}
		
		if( $('#displaysharing').is(':checked') ){
			shortcode += ' displaySharing=true';
		}
		
		if( $('#displaytitle').is(':checked') ){
			shortcode += ' displayTitle=true';
		}
		
		if( $('#displayviewersreport').is(':checked') ){
			shortcode += ' displayViewersReport=true';
		}
		
		if( $('#displayattachments').is(':checked') ){
			shortcode += ' displayattachments=true';
		}
		
		if( $('#displaydownloadicon').is(':checked') ){
			shortcode += ' displaydownloadicon=true';
		}
		
		if( $('#displayembedcode').is(':checked') ){
			shortcode += ' displayembedcode=true';
		}
		
		if( $('#displaylinks').is(':checked') ){
			shortcode += ' displaylinks=true';
		}
		
		if( $('#displaymetadata').is(':checked') ){
			shortcode += ' displayMetaData=true';
		}

		if( $('#embedasthumbnail').is(':checked') ){
			shortcode += ' embedAsThumbnail=true';
		}
		
		if( $('#audiopreviewimage').is(':checked') ){
			shortcode += ' audioPreviewImage=true';
		}
		shortcode += ']';
		
		return shortcode;
	}
	
});