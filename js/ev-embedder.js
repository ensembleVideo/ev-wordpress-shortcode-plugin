//  This is the code that adds the shortcode for ensemble server version 5.4 and above.

jQuery(document).ready(function ($) {

    if (meetsVersionRequirements(passedData.keys.ensemble_version, '5.5.0')) {
        window.addEventListener("message", receiveMessageJson, false);
    }
    if (meetsVersionRequirements(passedData.keys.ensemble_version, '5.4.0')) {
        window.addEventListener("message", receiveMessage, false);
    }

    embedded_code = '';

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
            var url = passedData.keys.ensemble_base_url + "/settings/SP/Chooser/Launch?useJson=true&allowFixed=true&institutionId=" + passedData.keys.ensemble_institution_guid;
            $('#test-iframe').attr('src', url)
        } else {
            if (meetsVersionRequirements(passedData.keys.ensemble_version, '5.4.0')) {
                var url = passedData.keys.ensemble_url + "/settings/SP/Chooser/Launch?institutionId=" + passedData.keys.ensemble_institution_guid;
                $('#test-iframe').attr('src', url)
            }
        }
    });

    function meetsVersionRequirements(serverVersion, expectedVersion) {
        if (serverVersion === expectedVersion) {
            return true;
        }
        var server_components = serverVersion.split(".");
        var expected_components = expectedVersion.split(".");
        var len = Math.min(server_components.length, expected_components.length);

        for (var i = 0; i < len; i++) {
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
        if (embedded_code !== "") {
            sbmtBtn.disabled = false;
        } else {
            sbmtBtn.disabled = true;
        }
    }

    function getLocation(href) {
        var match = href.match(/^(https?\:)\/\/(([^:\/?#]*)(?:\:([0-9]+))?)([\/]{0,1}[^?#]*)(\?[^#]*|)(#.*|)$/);
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

    function addKeyValuePair(data, attribute) {
        if (data[attribute] === '') {
            return '';
        }
        return " " + attribute + "=" +
            data[attribute]
    }

    // embedcode attributes and the json don't match, correct
    function getEmbedCodeAttribute(attribute, parammatch) {
        return parammatch[attribute] ? parammatch[attribute].toLowerCase() : attribute.toLowerCase()
    }

    function addKeyValuePairQuotes(data, attribute, parammatch) {
        if (data[attribute] === '') {
            return '';
        }
        if (attribute == 'key') {
            return " id" + "=" + "\"" + data[attribute] + "\" ";
        }

        return " " + (attribute === "key" ? "id" : getEmbedCodeAttribute(attribute, parammatch)) + "=" + "\"" +
            data[attribute] + "\" "
    }

    function ConvertKeysToLowerCase(obj) {
        var output = {};
        for (i in obj) {
            if (Object.prototype.toString.apply(obj[i]) === '[object Object]') {
                output[i.toLowerCase()] = ConvertKeysToLowerCase(obj[i]);
            } else if (Object.prototype.toString.apply(obj[i]) === '[object Array]') {
                output[i.toLowerCase()] = [];
                output[i.toLowerCase()].push(ConvertKeysToLowerCase(obj[i][0]));
            } else {
                output[i.toLowerCase()] = obj[i];
            }
        }
        return output;
    };

    function getScript(data)
    {
        var start = data.indexOf('<script type');
        var end = data.indexOf('</script>');
        if (start != -1) {
            return data.slice(start,end + 9)
        }
        return '';
    }


    function receiveMessageJson(event) {
        if (passedData.keys.ensemble_base_url) {
            if (passedData.keys.ensemble_base_url == event.origin) {
                embedded_code = '';
                var params = [];
                var contentparams = []
                var mixedBag = event.data[0]
                var script = getScript(mixedBag)


                var data = ConvertKeysToLowerCase(mixedBag)

                const parammatch = {
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
                if ((contentType == "video") || (contentType == "playlist") || (contentType == "quiz") || (contentType == "dropbox")) {
                    if (contentType == "video") {
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
                        contentparams = ["name", "description", "shortTitle"]
                    } else if (contentType == "playlist") {
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
                        contentparams = ["name", "defaultLayout"]
                    }
                    else if (contentType == 'quiz') {
                        params = ["width", "height", "showtitle", "showcaptions", "attachments", "links", "metadata",
                            "search", "embedtype", "forceembedtype"];
                        contentparams = ["name", "comments", "key"]
                    }
                    else {  // it's the dropbox
                        // lots of missing fields
                        //  https://test01.ensemblevideo.com/hapi/v1/ui/Playlists/2630b227-7067-45cc-8f2a-f98c749032fb/Plugin?
                        // isPreview=false&amp;
                        // layout=gridWithPlayer&amp;
                        // sortBy=DateAdded&amp;
                        // desc=true&amp;search=&amp;
                        // categories=&amp;
                        // resultsCount=&amp;
                        // featuredContentId=&amp;
                        // displayTitle=true&amp;
                        // displayLogo=true&amp;
                        // displayEmbedCode=false&amp;
                        // displayAttachments=true&amp;
                        // displayAnnotations=true&amp;d
                        // isplayLinks=true&amp;
                        // displaySharing=false&amp;
                        // displayCopyUrl=false&amp;
                        // autoPlay=false&amp;
                        // showCaptions=false&amp;
                        // displayMetadata=true&amp;
                        // displayCaptionSearch=true&amp;
                        // audioPreviewImage=false&amp;
                        // displayViewersReport=false&amp;
                        // displayAxdxs=false&amp;
                        // isResponsive=true
                        params = ["id", "width", "height", "search", "embedtype", "forceembedtype", "contentid"];
                        contentparams = ["name", "shortName", "description", "isEnabled", "isPublic", "showKeywords",
                            "showDescription", "availableAfter", "availableUntil", "hasAvailabilityRestrictions"]
                    }

                    embedded_code = "[ensemblevideo version=\"" + passedData.keys.ensemble_version + "\" content_type=\"" + contentType + "\" ";
                    params.forEach(function (param) {
                        embedded_code += addKeyValuePairQuotes(data, param, parammatch)
                    })
                    contentparams.forEach(function (param) {
                        embedded_code += addKeyValuePairQuotes(data.content, param, parammatch)
                    })

                    if (script != '')
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
                    var encodings = response.dataSet.encodings
                    var contentType

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
        if (passedData.keys.ensemble_url) {
            if (passedData.keys.ensemble_url == event.origin) {
                embedded_code = '';
                params = ' ';

                //mbedded_code = "[ensemblevideo version=5.5 content_type=" + contentType + " id=" + contentID + params + "]";
                // video code:
                //"<div style="position: relative; padding-bottom: 56.25%; padding-top: 0px; height: 0; overflow: auto; -webkit-overflow-scrolling: touch;">
                // <iframe src="https://demo.ensemblevideo.com/hapi/v1/contents/f60aaf2c-4cc6-495b-9043-1bf8079c998b/plugin?autoPlay=false&amp;displayTitle=true&amp;displaySharing=false&amp;displayAnnotations=true&amp;displayCaptionSearch=true&amp;displayAttachments=true&amp;audioPreviewImage=true&amp;displayLinks=true&amp;displayMetaData=false&amp;displayEmbedCode=false&amp;displayDownloadIcon=false&amp;displayViewersReport=false&amp;displayAxdxs=false&amp;embedAsThumbnail=false&amp;startTime=0&amp;displayCredits=false&amp;showCaptions=false&amp;hideControls=true" title="Capture + Manage + Play" frameborder="0" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" scrolling="no" allowfullscreen=""></iframe></div>"

                // "<div id="pl-wrapper-a736a8e4-a924-4942-bb93-d229650461c5" style="position: relative; padding-bottom: 39%; padding-top: 0px; height: 0; overflow: auto; -webkit-overflow-scrolling: touch;">
                // <iframe src="https://demo.ensemblevideo.com/hapi/v1/ui/Playlists/a736a8e4-a924-4942-bb93-d229650461c5/Plugin?isPreview=false&amp;layout=verticalListWithPlayer&amp;sortBy=DateAdded&amp;desc=true&amp;search=&amp;categories=&amp;resultsCount=&amp;featuredContentId=74d3befe-df25-4e62-8149-7348886ac80d&amp;displayTitle=true&amp;displayLogo=true&amp;displayEmbedCode=false&amp;displayAttachments=true&amp;displayAnnotations=true&amp;displayLinks=true&amp;displaySharing=false&amp;displayCopyUrl=false&amp;autoPlay=false&amp;showCaptions=false&amp;displayMetadata=true&amp;displayCaptionSearch=true&amp;audioPreviewImage=false&amp;displayViewersReport=false&amp;displayAxdxs=false&amp;isResponsive=true"
                // frameborder="0" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" allowfullscreen=""></iframe>            <script type="text/javascript">function handleResize() { var e = document.getElementById("pl-wrapper-a736a8e4-a924-4942-bb93-d229650461c5"); if (null != e) { var i = e.getElementsByTagName("iframe")[0]; if (null != i) { e.style = "width: 100%; height: 100%;"; i.style = "width: 100%; height: 100%;"; var n = e.offsetWidth; e.style.height = n >= 822 ? 66.6 * n / 100 * .5625 + 15 + "px" : .5625 * n + 350 + "px" }}} handleResize(), window.onresize = function (e) { handleResize() };</script>
                //</div>"

                // dropbox
                // <div style="display:table; width:100%; height:100%;"><iframe src="https://demo.ensemblevideo.com/hapi/v1/ui/dropboxes/ac09f26d-6c3e-4780-8930-eb264af903e4/embed" title="Graded Video Assignment" frameborder="0" style="width: 100%; height: 720px;" scrolling="scroll" allowfullscreen=""></iframe></div>

                // Embed code: <div style="position: relative; padding-bottom: 56.25%; padding-top: 0px; height: 0; overflow: auto; -webkit-overflow-scrolling: touch;"><iframe src="https://demo.ensemblevideo.com/hapi/v1/quiz/f5e298f5-b9b1-41a5-9f42-ab6bbe2c25cf/plugin?displayTitle=false&amp;displayAttachments=false&amp;displayLinks=false&amp;displayMetaData=false&amp;displayCredits=false&amp;showCaptions=false" frameborder="0" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" scrolling="no" allowfullscreen=""></iframe></div>


                var script = getScript(event.data[0])


                parsedHtml = $(event.data[0]);

                //  Get the iframe.src - this is where the data is located
                var url = parsedHtml[0].children[0].src;

                //  break the url up
                var location = getLocation(url);
                var contentID = ''
                var contentType = ''
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


                var audiopreviewimage = '';

                if (contentType !== '') {
                    params = ' ';
                    // get the search arams and remove the first ?
                    var search = location.search.substr(1);
                    if (search !== "") {
                        search.split("&").forEach(function (part) {
                            var item = part.split("=");
                            var uriComp = decodeURIComponent(item[1]);
                            if (uriComp) {
                                if (item[0].toLowerCase() == 'audiopreviewimage') {
                                    audiopreviewimage = item[1]
                                }
                                params += item[0].toLowerCase() + "=\"" + uriComp.toLowerCase() + '" ';
                            } else {
                                params += item[0].toLowerCase() + "='' ";
                            }
                        });
                    }

                    if (contentType === 'video') {
                        if (audiopreviewimage === "false") {

                            var apiurl = passedData.keys.ensemble_url + '/app/api/content/show.json/' + contentID
                            $.ajax({
                                type: "GET",
                                url: apiurl,
                                dataType: 'jsonp',
                                //  jsonpCallback: myfunc,
                                jsonp: 'callback', // name of the var specifying the callback in the request
                                error: function (xhr, errorType, exception) {
                                    var errorMessage = exception || xhr.statusText;
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


                            // debugger
                            //
                            // fetch(apiurl).then(function (response) {
                            //     response.text().then(function(text) {
                            //         if (isAudio(text)) {
                            //             embedded_code = "[ensemblevideo version=\"" + passedData.keys.ensemble_version + "\" content_type=\"" + contentType + "\" isaudio=\"true\" id=" + contentID + params + "]";
                            //         } else {
                            //             embedded_code = "[ensemblevideo version=\"" + passedData.keys.ensemble_version + "\" content_type=\"" + contentType + "\" id=" + contentID + params + "]";
                            //         }
                            //
                            //     })
                            //     console.log(response.body)
                            // }).catch(function (error) {
                            //     console.log(error)
                            // })
                        }

                    }
                    //  https://passedData.keys.ensemble_url/app/api/content/show.json/02ce5ccd-6b28-40a3-b315-90599f0f5aad

                    var embedscriptStatement = script != '' ? 'embedscript="true"':''
                    embedded_code = "[ensemblevideo version=\"" + passedData.keys.ensemble_version + "\" content_type=\"" + contentType + "\" isaudio=\"false\" id=" + contentID + params + embedscriptStatement +  " ]";
                    embedded_code += script;
                    checkFormValidity(embedded_code);
                }
            }
        }
    }

});