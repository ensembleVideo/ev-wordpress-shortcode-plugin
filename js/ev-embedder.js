//  This is the code that adds the shortcode for ensemble server version 5.4 and above.

jQuery(document).ready(function ($) {

    if (meetsVersionRequirements(passedData.keys.ensemble_version, '5.5.0')) {
        window.addEventListener("message", receiveMessageJson, false);
    }
    else if (meetsVersionRequirements(passedData.keys.ensemble_version, '5.4.0')) {
        window.addEventListener("message", receiveMessage, false);
    }

    let embedded_code = '';

    $('<div />')
        .attr('id', 'ensemble-video2')
        .append("<div id='ensemble-video-inner'>\
		<form name='embdedform'>\
		<iframe id='test-iframe' width='100%' height='100%' frameBorder='0'>Browser not compatible.</iframe>\
		<input class='button-primary' type=submit value='Add Content' id='sbmtBtn' disabled /> \
		<span> (+) Choose the item you would like to add, edit the options, then check the [Add Content] button.</span>\
		</form>\
		</div>")
        .hide()
        .appendTo('body');

    $('#ensemble-video-inner form').submit(function (e) {
        e.preventDefault();
        insertEnsembleShortcode();
        // closes Thickbox
        tb_remove();
        return false;
    });

    $('#shortcode-type-header a').click(function () {
        $('#ensemble-video-inner a').removeClass('active');
        $(this).addClass('active');
        // set insert button text based on tab text
        $("#ensemble-video-inner .button-primary").val($(this).text());
        // toggle display of form elements
        $('#ensemble-video-inner p, #ensemble-video-inner h4').hide();
        $('#ensemble-video-inner .' + $(this).attr('data-display-class')).show();
    });

    $('#add-ensemble-video2').click(function () {
        // Create a browser alert with the first element of passedData
        // var url = passedData.keys.ensemble_url + "/settings/SP/Chooser/Launch?useJson=true&institutionId=" + passedData.keys.ensemble_institution;
        // var url = passedData.keys.ensemble_url + "/settings/SP/Chooser/Launch?institutionId=" + passedData.keys.ensemble_institution;

        if (meetsVersionRequirements(passedData.keys.ensemble_version, '5.5.0')) {
            const url = passedData.keys.ensemble_base_url + "/settings/SP/Chooser/Launch?useJson=true&allowFixed=true&institutionId=" + passedData.keys.ensemble_institution_guid;
            $('#test-iframe').attr('src', url)
        } else {
            if (meetsVersionRequirements(passedData.keys.ensemble_version, '5.4.0')) {
                const url = passedData.keys.ensemble_url + "/settings/SP/Chooser/Launch?institutionId=" + passedData.keys.ensemble_institution_guid;
                $('#test-iframe').attr('src', url)
            }
        }
    });

    function meetsVersionRequirements(serverVersion, expectedVersion) {
        if (serverVersion === expectedVersion) {
            return true;
        }
        const server_components = serverVersion.split(".");
        const expected_components = expectedVersion.split(".");
        const len = Math.min(server_components.length, expected_components.length);

        for (let i = 0; i < len; i++) {
            if (parseInt(server_components[i]) !== parseInt(expected_components[i])) {
                return parseInt(server_components[i]) > parseInt(expected_components[i])
            }
        }

        if (server_components.length === expected_components.length) {
            return true;
        }
        // If the server has extra stuff, that's OK
        return (server_components.length > expected_components.length)
    }


    function insertEnsembleShortcode() {
        window.send_to_editor(embedded_code);
        tb_remove();
        return false;
    }

    function checkFormValidity(embedded_code) {
       sbmtBtn.disabled = embedded_code === "";
    }

    function getLocation(href) {
        const match = href.match(/^(https?\:)\/\/(([^:\/?#]*)(?:\:([0-9]+))?)([\/]{0,1}[^?#]*)(\?[^#]*|)(#.*|)$/);
        return match && {
                href: href,
                protocol: match[1],
                host: match[2],
                hostname: match[3],
                port: match[4],
                pathname: match[5],
                search: match[6],
                hash: match[7]
            }
    }

    // embedcode attributes and the json don't match, correct
    function getEmbedCodeAttribute(attribute, parammatch) {
        return parammatch[attribute] ? parammatch[attribute].toLowerCase() : attribute.toLowerCase()
    }

    function addKeyValuePairQuotes(data, attribute, parammatch) {
        if (typeof data[attribute] =="undefined") {
            return '';
        }

        if (data[attribute] === '') {
            return '';
        }
        if (attribute === 'key') {
            return " id" + "=" + "\"" + data[attribute] + "\" ";
        }

        return " " + (attribute === "key" ? "id" : getEmbedCodeAttribute(attribute, parammatch)) + "=" + "\"" +
            data[attribute] + "\""
    }

    function ConvertKeysToLowerCase(obj) {
        let output = {};
        for (const i in obj) {
            if (obj.hasOwnProperty(i)) {
                if (Object.prototype.toString.apply(obj[i]) === '[object Object]') {
                    output[i.toLowerCase()] = ConvertKeysToLowerCase(obj[i]);
                } else if (Object.prototype.toString.apply(obj[i]) === '[object Array]') {
                    output[i.toLowerCase()] = [];
                    output[i.toLowerCase()].push(ConvertKeysToLowerCase(obj[i][0]));
                } else {
                    output[i.toLowerCase()] = obj[i];
                }
            }
        }
        return output;
    }

    function getScript(data)
    {
        if (typeof data === 'string' || data instanceof String) {
            const start = data.indexOf('<script type');
            const end = data.indexOf('</script>');
            if (start !== -1) {
                return data.slice(start, end + 9)
            }
        }
        return '';
    }



    function receiveMessageJson(event) {
        if (passedData.keys.ensemble_base_url) {
            if (passedData.keys.ensemble_base_url === event.origin) {
                embedded_code = '';
                let params = [];
                let contentParams = []
                const mixedBag = event.data[0]
                const script = getScript(mixedBag)

                const data = ConvertKeysToLowerCase(mixedBag)

                const paramMatch = {
                    id: 'id',
                    width: "width",
                    height: "height",
                    showtitle: 'displaytitle',
                    autoplay: 'autoPlay',
                    showcaptions: 'showCaptions',
                    hidecontrols: 'hideControls',
                    socialsharing: 'displaysharing',
                    annotations: 'displayAnnotations',
                    captionsearch: 'displayCaptionSearch',
                    attachments: 'displayAttachments',
                    audiopreviewimage: 'audioPreviewImage',
                    isaudio: 'isaudio',
                    links: 'displayLinks',
                    metadata: 'displayMetaData',
                    dateproduced: 'displayDateProduced',
                    embedcode: 'displayEmbedCode',
                    download: 'displayDownloadIcon',
                    viewersreport: 'displayViewersReport',
                    embedthumbnail: 'embedAsThumbnail',
                    axdxs: 'displayAxdxs',
                    layout: 'layout',
                    sortby: 'sortBy',
                    desc: 'desc',   // this can have didderent meanings by the type: showDescription
                    search: 'search',
                    categories: 'categories',
                    logo: 'displayLogo',
                    nextup: 'displayNextup', // not really a field
                    statistics: 'displayStatistics', // not really a field
                    credits: 'displayCredits' // not really a field
                }

                const contentType = data.type
                if ((contentType === "video") || (contentType === "playlist") || (contentType === "quiz") || (contentType === "dropbox")) {
                    if (contentType === "video") {
                        params = ["id",
                            "width",
                            "height",
                            "showtitle",
                            "autoplay",
                            "showcaptions",
                            "hidecontrols",
                            "socialsharing",
                            "annotations",
                            "captionsearch",
                            "attachments",
                            "audiopreviewimage",
                            "isaudio",
                            "links",
                            "metadata",
                            "dateproduced",
                            "embedcode",
                            "download",
                            "viewersreport",
                            "embedthumbnail",
                            "axdxs",
                            "embedtype",
                            "forceembedtype",
                        ]
                        contentParams = ["name", "description", "shortTitle"]
                    } else if (contentType === "playlist") {
                        params = ["id",
                            "width",
                            "height",
                            "layout",
                            "sortby",
                            "desc",
                            "search",
                            "categories",
                            "resultscount",
                            "embedcode",
                            "attachments",
                            "annotations",
                            "links",
                            "logo",
                            "metadata",
                            "socialsharing",
                            "autoplay",
                            "showcaptions",
                            "audiopreviewimage",
                            "captionsearch",
                            "viewersreport",
                            "axdxs",
                            "nextup",
                            "embedtype",
                            "forceembedtype",
                            "jswrapper"];
                        contentParams = ["name", "defaultLayout"]
                    }
                    else if (contentType === 'quiz') {
                        params = ["width", "height", "showtitle", "showcaptions", "attachments", "links", "metadata",
                            "search", "embedtype", "forceembedtype"];
                        contentParams = ["name", "comments", "key"]
                    }
                    else {  // it's the dropbox

                        params = ["id", "width", "height", "search", "embedtype", "forceembedtype", "contentid"];
                        contentParams = ["name", "shortName", "description", "isEnabled", "isPublic", "showKeywords",
                            "showDescription", "availableAfter", "availableUntil", "hasAvailabilityRestrictions"]
                    }

                    embedded_code = "[ensemblevideo version=\"" + passedData.keys.ensemble_version + "\" content_type=\"" + contentType + "\" ";
                    params.forEach(function (param) {
                        embedded_code += addKeyValuePairQuotes(data, param, paramMatch)
                    })
                    contentParams.forEach(function (param) {
                        embedded_code += addKeyValuePairQuotes(data.content, param, paramMatch)
                    })

                    if (script !== '')
                    {
                        embedded_code += ' embedscript=true '
                    }

                    embedded_code += "]"
                }
                else {
                    embedded_code = "";
                }
                checkFormValidity(embedded_code);
            }
        }
    }


    function isAudio(response) {
        if (response) {
            if (response.dataSet) {
                if (response.dataSet.encodings) {
                    const encodings = response.dataSet.encodings;
                    let contentType;

                    if (Array.isArray(encodings)) {
                        contentType = encodings[0].contentType
                    } else {
                        contentType = encodings[0].contentType
                    }
                    if (contentType.toLowerCase().startsWith('audio/')) {
                        return true;
                    }
                }
            }
        }
        return false
    }

    function receiveMessage(event) {
        let params = '';

        if (passedData.keys.ensemble_url) {
            if (passedData.keys.ensemble_url === event.origin) {
                embedded_code = '';
                params = ' ';

                const script = getScript(event.data[0])
                const parsedHtml = $(event.data[0]);

                //  Get the iframe.src - this is where the data is located
                const url = parsedHtml[0].children[0].src;

                //  break the url up
                const location = getLocation(url);
                let contentID = ''
                let contentType = ''
                if (location.pathname.indexOf('contents') > -1) {
                    //  It's a video:
                    contentID = location.pathname.split("/")[4];
                    contentType = 'video'
                } else if (location.pathname.indexOf('Playlists') > 1) {
                    contentID = location.pathname.split("/")[5];
                    contentType = 'playlist';
                }
                else if (location.pathname.indexOf('dropboxes') > 1) {
                    //TODO: do I need to pull the title?
                    contentID = location.pathname.split("/")[5];
                    contentType = 'dropbox';
                }
                else if (location.pathname.indexOf('quiz') > 1) {
                    contentID = location.pathname.split("/")[4];
                    contentType = 'quiz';
                }
                let audioPreviewImage = '';

                if (contentType !== '') {
                    params = ' ';
                    // get the search params and remove the first ?
                    const search = location.search.substr(1);
                    if (search !== "") {
                        search.split("&").forEach(function (part) {
                            const item = part.split("=");
                            const uriComp = decodeURIComponent(item[1]);
                            if (uriComp) {
                                if (item[0].toLowerCase() === 'audiopreviewimage') {
                                    audioPreviewImage = item[1]
                                }
                                params += item[0].toLowerCase() + "=\"" + uriComp.toLowerCase() + '" ';
                            } else {
                                params += item[0].toLowerCase() + "='' ";
                            }
                        });
                    }

                    if (contentType === 'video') {
                        if (audioPreviewImage === "false") {

                            const apiUrl = passedData.keys.ensemble_url + '/app/api/content/show.json/' + contentID
                            $.ajax({
                                type: "GET",
                                url: apiUrl,
                                dataType: 'jsonp',
                                jsonp: 'callback', // name of the var specifying the callback in the request
                                error: function (xhr, errorType, exception) {
                                    alert("Excep:: " + exception + "Status:: " + xhr.statusText);
                                },
                                success: function (response) {
                                    if (isAudio(response)) {
                                        embedded_code = "[ensemblevideo version=\"" + passedData.keys.ensemble_version + "\" content_type=\"" + contentType + "\" isaudio=\"true\" id=" + contentID + params + "]";
                                    }
                                    else {
                                        embedded_code = "[ensemblevideo version=\"" + passedData.keys.ensemble_version + "\" content_type=\"" + contentType + "\" isaudio=\"false\" id=" + contentID + params + "]";
                                    }
                                }
                            })
                        }

                    }
                    const embedScriptStatement = script !== '' ? 'embedscript="true"':''
                    embedded_code = "[ensemblevideo version=\"" + passedData.keys.ensemble_version + "\" content_type=\"" + contentType + "\" isaudio=\"false\" id=" + contentID + params + embedScriptStatement +  " ]";
                    embedded_code += script;
                    checkFormValidity(embedded_code);
                }
            }
        }
    }

});