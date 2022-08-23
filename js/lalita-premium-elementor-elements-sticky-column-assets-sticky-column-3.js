( function( $, elementor ) {

	'use strict';

	var WPKoiStickyColumn = {

		init: function() {
			elementor.hooks.addAction( 'frontend/element_ready/column', WPKoiStickyColumn.elementorColumn );

		},

		elementorColumn: function( $scope ) {
			var $target  = $scope,
				$window  = $( window ),
				columnId = $target.data( 'id' ),
				editMode = Boolean( elementor.isEditMode() ),
				settings = {},
				stickyInstance = null,
				stickyInstanceOptions = {
					topSpacing: 50,
					bottomSpacing: 50,
					containerSelector: '.elementor-column-gap-default',
					innerWrapperSelector: '.elementor-widget-wrap',
				};

			if ( ! editMode ) {
				settings = $target.data( 'settings' );

				if ( $target.hasClass( 'wpkoi-sticky-column' ) ) {

					if ( -1 !== settings['stickyOn'].indexOf( elementorFrontend.getCurrentDeviceMode() ) ) {

						stickyInstanceOptions.topSpacing = settings['topSpacing'];
						stickyInstanceOptions.bottomSpacing = settings['bottomSpacing'];

						$target.data( 'stickyColumnInit', true );
						stickyInstance = new StickySidebar( $target[0], stickyInstanceOptions );

						$window.on( 'resize.WPKoiStickyColumnStickyColumn orientationchange.WPKoiStickyColumnStickyColumn', WPKoiStickyColumnTools.debounce( 50, resizeDebounce ) );
					}
				}
			} else {
				settings = WPKoiStickyColumn.columnEditorSettings( columnId );

				if ( 'true' === settings['sticky'] ) {
					$target.addClass( 'wpkoi-sticky-column' );

					if ( -1 !== settings['stickyOn'].indexOf( elementorFrontend.getCurrentDeviceMode() ) ) {
						stickyInstanceOptions.topSpacing = settings['topSpacing'];
						stickyInstanceOptions.bottomSpacing = settings['bottomSpacing'];

						$target.data( 'stickyColumnInit', true );
						stickyInstance = new StickySidebar( $target[0], stickyInstanceOptions );

						$window.on( 'resize.WPKoiStickyColumnStickyColumn orientationchange.WPKoiStickyColumnStickyColumn', WPKoiStickyColumnTools.debounce( 50, resizeDebounce ) );
					}
				}
			}

			function resizeDebounce() {
				var currentDeviceMode = elementorFrontend.getCurrentDeviceMode(),
					availableDevices  = settings['stickyOn'] || [],
					isInit            = $target.data( 'stickyColumnInit' );

				if ( -1 !== availableDevices.indexOf( currentDeviceMode ) ) {

					if ( ! isInit ) {
						$target.data( 'stickyColumnInit', true );
						stickyInstance = new StickySidebar( $target[0], stickyInstanceOptions );
						stickyInstance.updateSticky();
					}
				} else {
					$target.data( 'stickyColumnInit', false );
					stickyInstance.destroy();
				}
			}

		},

		columnEditorSettings: function( columnId ) {
			var editorElements = null,
				columnData     = {};

			if ( ! window.elementor.hasOwnProperty( 'elements' ) ) {
				return false;
			}

			editorElements = window.elementor.elements;

			if ( ! editorElements.models ) {
				return false;
			}

			$.each( editorElements.models, function( index, obj ) {

				$.each( obj.attributes.elements.models, function( index, obj ) {
					if ( columnId == obj.id ) {
						columnData = obj.attributes.settings.attributes;
					}
				} );

			} );

			return {
				'sticky': columnData['wpkoi_tricks_column_sticky'] || false,
				'topSpacing': columnData['wpkoi_tricks_top_spacing'] || 50,
				'bottomSpacing': columnData['wpkoi_tricks_bottom_spacing'] || 50,
				'stickyOn': columnData['wpkoi_tricks_column_sticky_on'] || [ 'desktop', 'tablet', 'mobile']
			}

		},

	};

	$( window ).on( 'elementor/frontend/init', WPKoiStickyColumn.init );
	
	var WPKoiStickyColumnTools = {
		debounce: function( threshold, callback ) {
			var timeout;

			return function debounced( $event ) {
				function delayed() {
					callback.call( this, $event );
					timeout = null;
				}

				if ( timeout ) {
					clearTimeout( timeout );
				}

				timeout = setTimeout( delayed, threshold );
			};
		}
	}

}( jQuery, window.elementorFrontend ) );

/*This file was exported by "Export WP Page to Static HTML" plugin which created by ReCorp (https://myrecorp.com) */