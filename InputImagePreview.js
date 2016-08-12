/***************************************************
 *
 * Image Input Popup Preview v0.0.1
 *
 * A simple preview plugin using jQuery & Bootstrap
 *
 * © 2016 Arturo Rodríguez
 *
 * MIT license
 *
 ***************************************************/

;(function ($) {
    $.fn.jbImageInputPopupPreview = function(config) {
        var defaultConfig = {
            browseButtonText   : '<i class="zmdi zmdi-search"></i> Browse',
            reBrowseButtonText : '<i class="zmdi zmdi-search"></i> Change',
            removeButtonText   : '&nbsp;<i class="zmdi zmdi-delete"></i>&nbsp;',
            popupTitle         : 'Preview',
            popupCloseButton   : '<i class="zmdi zmdi-close"></i>',
        };

        var settings = $.extend({}, defaultConfig, config || {});

        var idGenerator = function () {
            return 'iipp-' + String.fromCharCode(65 + Math.floor(Math.random() * 26)) + '-' + Date.now();
        };

        var tpl = ''
            + '<div id="${ root_container_id }" class="input-group">'
            +     '<input type="text" id="${ filename_input_id }" class="form-control" disabled="disabled">'
            +     '<span class="input-group-btn">'
            +         '<button id="${ clear_selection_id }" class="btn btn-default" style="display:none;">'
            +             '${ removeButtonText }'
            +         '</button>'
            +         '<button id="${ examine_file_id }" class="btn btn-default">'
            +             '<i class="mdi mdi-search"></i>'
            +             '<span class="">${ browseButtonText }</span>'
            +         '</button>'
            +     '</span>'
            + '</div>'
            +     '<input id="${ input_id }" type="file" accept="${ input_accept }" name="${ input_name }" style="'
            +         'widthx:1px; heightx:1px; opacity:0; filter:alpha(opacity=0); position:absolute; top:0; left:0;'
            +     '">'
            ;

        var popupTitleTpl = ''
            + '<strong>${ popupTitle }</strong>'
            + '<button'
            +     ' type="button"'
            +     ' id="${ close_preview_id }"'
            +     ' class="close pull-right"'
            + '>${ popupCloseButton }</button>'
            ;

        this.each(function (idx, input) {
            var rootContainerId = idGenerator();
            var filenameInputId = idGenerator();
            var clearSelectionId = idGenerator();
            var browseFileId = idGenerator();
            var imageInputId = input.id ? 'iipp-' + input.id : idGenerator();
            var closePreviewId = idGenerator();

            var acceptedTypes = input.getAttribute('accept')
                ? input.getAttribute('accept')
                : 'accept="image/x-png, image/gif, image/jpeg"';

            // create new structure
            var inputTpl = tpl
                .replace('${ browseButtonText }', settings.browseButtonText)
                .replace('${ removeButtonText }', settings.removeButtonText)
                .replace('${ root_container_id }', rootContainerId)
                .replace('${ filename_input_id }', filenameInputId)
                .replace('${ clear_selection_id }', clearSelectionId)
                .replace('${ examine_file_id }', browseFileId)
                .replace('${ input_id }', imageInputId)
                .replace('${ input_name }', input.name)
                .replace('${ input_accept }', input.getAttribute('accept')
                    ? input.getAttribute('accept')
                    : 'accept="image/x-png, image/gif, image/jpeg"'
                );

            var builtInput = $.parseHTML(inputTpl);
            $(builtInput).insertBefore(input);
            input.remove();

            var builtPopupTitle = popupTitleTpl
                .replace('${ popupCloseButton }', settings.popupCloseButton)
                .replace('${ popupTitle }', settings.popupTitle)
                .replace('${ close_preview_id }', closePreviewId);

            // Set the popover default content
            $('#' + rootContainerId).popover({
                title     : builtPopupTitle,
                placement : 'bottom',
                trigger   : 'manual',
                html      : true
            });

            // trigger browsing file dialog
            $('#' + browseFileId).click(function (e) {
                $('#' + imageInputId).focus().click();
                e.stopPropagation();
            });

            // select image
            $('#' + imageInputId).change(function (e) {
                var fileReader = new FileReader();
                var file = this.files[0];
                var img = $('<img>', {
                    width  : 200,
                    height : 200
                });

                fileReader.onload = function (ev) {
                    img.attr('src', ev.target.result);
                    $('#' + browseFileId).html(settings.reBrowseButtonText);
                    $('#' + filenameInputId).val(file.name);
                    $('#' + clearSelectionId).show();
                    $('#' + rootContainerId)
                        .attr("data-content", $(img)[0].outerHTML)
                        .popover("show");
                };

                fileReader.readAsDataURL(file);

                e.stopPropagation();
            });

            // clear selection
            $('#' + clearSelectionId).click(function(e) {
                $('#' + rootContainerId)
                    .unbind('mouseenter mouseleave')
                    .attr('data-content', '')
                    .popover('hide');
                $('#' + browseFileId).html(settings.browseButtonText);
                $('#' + filenameInputId).val('');
                $('#' + imageInputId).val('');
                $(this).hide();
                e.stopPropagation();
            });

            // close preview
            $(document).on('click', '#' + closePreviewId, function() {
                $(this).hide();
                $('#' + rootContainerId).popover('hide');
                $('#' + rootContainerId).hover(
                    function () { $('#' + rootContainerId).popover('show'); },
                    function () { $('#' + rootContainerId).popover('hide'); }
                );
            });
        });
    };
} (jQuery));
