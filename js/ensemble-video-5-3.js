//  This is the code that adds the shortcode for ensemble server version 5.3 and below.

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
		<span id='content-title-id'><strong>Content ID:</strong></span>\
		<p id='content-id' class='for-video settings'>\
		<label>Content ID <input id='content-id-input' /></label></p>\
		<p id='destination-id' class='for-web-destination settings'>\
		<label>Playlist ID <input id='destination-id-input' /></label></p>\
		<span><strong>Settings</strong></span>\
		<p class='for-video settings'>\
		<label><input type='checkbox' id='displayannotations' /> Annotations</label>\
		<label><input type='checkbox' id='showcaptions' /> Captions On By Default</label> \
		<label><input type='checkbox' id='displaycaptionsearch' /> Interactive Transcript</label> \
		<label><input type='checkbox' id='displaysharing' /> Social Sharing</label> \
		<label><input type='checkbox' id='displaytitle' /> Title</label></br>\
        <label><input type='checkbox' id='displayviewersreport' /> Viewers Report</label> \
        <p class='for-web-destination settings'>\
		<label><input type='checkbox' id='displayannotations-wd' /> Annotations</label> \
		<label><input type='checkbox' id='showcaptions-wd' /> Captions On By Default</label> \
		<label><input type='checkbox' id='displaycaptionsearch-wd' /> Interactive Transcript</label> \
		<label><input type='checkbox' id='displaysharing-wd' /> Social Sharing</label> \
		<label><input type='checkbox' id='displaytitle-wd' /> Title</label></br>\
        <label><input type='checkbox' id='displayviewersreport-wd' /> Viewers Report</label></p> \
        </p> \
        <span class='for-video'><strong>Additional Settings</strong></span>\
        <p class='for-video additional-settings'>\
        <label><input type='checkbox' id='displayattachments' /> Attachments</label>\
        <label><input type='checkbox' id='autoplay' /> Autoplay</label> \
		<label><input type='checkbox' id='displaydownloadicon' /> Download Link</label> \
		<label><input type='checkbox' id='displayembedcode' /> Embed Code</label> \
		<label><input type='checkbox' id='displaylinks' /> Links</label> \
		<label><input type='checkbox' id='displaymetadata' /> Meta Data</label><br>\
		<label><input type='checkbox' id='audiopreviewimage' /> Audio Preview Image</label></p>\
	    <p class='for-web-destination additional-settings'>\
        <label><input type='checkbox' id='displayattachments-wd' /> Attachments</label> \
        <label><input type='checkbox' id='autoplay-wd' /> Autoplay</label> \
		<label><input type='checkbox' id='displayembedcode-wd' /> Embed Code</label> \
		<label><input type='checkbox' id='displaylinks-wd' /> Links</label> \
		<label><input type='checkbox' id='displaymetadata-wd' /> Meta Data</label><br>\
		<label><input type='checkbox' id='audiopreviewimage-wd' /> Audio Preview Image</label> \
		<label><input type='checkbox' id='display-showcase' /> Display As Showcase</label></p>\
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

		if ($(this).text() === 'Add Video') {
            $("#content-title-id").html('<strong>Video Content Settings</strong>')
        } else if ($(this).text() === 'Add Audio') {
            $("#content-title-id").html('<strong>Audio Content Settings</strong>')
        } else {
            $("#content-title-id").html('<strong>Playlist Content Settings</strong>')
        }

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

            var videoSettings = [
                {id: '#autoplay', shortcode: ' autoplay=true'},
                {id: '#showcaptions', shortcode: ' showcaptions=true'},
                {id: '#displayannotations', shortcode: ' displayAnnotations=true'},
                {id: '#displaycaptionsearch', shortcode: ' displaycaptionsearch=true'},
                {id: '#displaysharing', shortcode: ' displaySharing=true'},
                {id: '#displaytitle', shortcode: ' displayTitle=true'},
                {id: '#displayviewersreport', shortcode: ' displayViewersReport=true'},
                {id: '#displayattachments', shortcode: ' displayattachments=true'},
                {id: '#displaydownloadicon', shortcode: ' displaydownloadicon=true'},
                {id: '#displayembedcode', shortcode: ' displayembedcode=true'},
                {id: '#displaylinks', shortcode: ' displaylinks=true'},
                {id: '#displaymetadata', shortcode: ' displayMetaData=true'},
                {id: '#embedasthumbnail', shortcode: ' embedAsThumbnail=true'},
                {id: '#audiopreviewimage', shortcode: ' audioPreviewImage=true'}
            ]

            videoSettings.forEach(function (vsetting) {
                if ($(vsetting.id).is(':checked')) {
                    shortcode += vsetting.shortcode;
                }
            })
		} else {
            shortcode += 'destinationid=' + $('#destination-id-input').val();

            var playlistSettings = [
                { id: '#display-showcase',  shortcode: ' displayshowcase=true' },
                { id: '#autoplay-wd', shortcode: ' autoplay=true'  },
                { id: '#showcaptions-wd', shortcode: ' showcaptions=true'  },
                { id: '#displayannotations-wd', shortcode: ' displayAnnotations=true'  },
                { id: '#displaycaptionsearch-wd', shortcode: ' displaycaptionsearch=true'  },
                { id: '#displaysharing-wd', shortcode: ' displaySharing=true'  },
                { id: '#displaytitle-wd', shortcode: ' displayTitle=true'  },
                { id: '#displayviewersreport-wd', shortcode: ' displayViewersReport=true'  },
                { id: '#displayattachments-wd', shortcode: ' displayattachments=true'  },
                { id: '#displayembedcode-wd', shortcode: ' displayembedcode=true'  },
                { id: '#displaylinks-wd', shortcode: ' displaylinks=true'  },
                { id: '#displaymetadata-wd', shortcode: ' displayMetaData=true'  },
                { id: '#embedasthumbnail-wd', shortcode: ' embedAsThumbnail=true'  },
                { id: '#audiopreviewimage-wd', shortcode: ' audioPreviewImage=true'  },
            ]

            playlistSettings.forEach(function(setting) {
                if( $(setting.id).is(':checked') ){
                    shortcode += setting.shortcode;
                }
            })
        }

		shortcode += ']';
		
		return shortcode;
	}
	
});