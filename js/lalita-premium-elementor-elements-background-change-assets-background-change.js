( function( $, elementor ) {
    "use strict";
    var WPKoiElements = {
        init: function() {
            elementor.hooks.addAction( 'frontend/element_ready/section', WPKoiElements.elementorSection );
        },
        elementorSection: function( $scope ) {
			var $target   = $scope,
				instance  = null,
				editMode  = Boolean( elementor.isEditMode() );

			instance = new wpkoiSectionBGC( $target );
			instance.init();
		},
    };
    $( window ).on( 'elementor/frontend/init', WPKoiElements.init );
	
	window.wpkoiSectionBGC = function( $target ) {
		var self             = this,
			sectionId        = $target.data('id'),
			settings         = false,
			editMode         = Boolean( elementor.isEditMode() ),
			$window          = $( window ),
			$body            = $( 'body' );

		self.init = function() {

			if ( ! editMode ) {
				settings = wpkoiElements[ 'wpkoiBGChangeSections' ][ sectionId ] || false;
			} else {
				settings = self.generateEditorSettings( sectionId );
			}

			if ( ! settings ) {
			  return false;
			}

			self.generateLayouts();

		};

		self.generateEditorSettings = function( sectionId ) {
			var editorElements      = null,
				sectionsData        = {},
				sectionData         = {},
				settings            = [];

			if ( ! window.elementor.hasOwnProperty( 'elements' ) ) {
				return false;
			}

			editorElements = window.elementor.elements;

			$.each( editorElements.models, function( index, obj ) {
				if ( sectionId == obj.id ) {
					sectionData = obj.attributes.settings.attributes;
				}
			} );

			return { 
				'wpkoi_bgc_section_list' : {
					'sectionid' : sectionId || '',
					'wpkoi_bgc_background_color': sectionData['background_color'] || '#ffffff',
					'section_wpkoi_background_change_speed': sectionData['section_wpkoi_background_change_speed'] || 300,
					'section_wpkoi_background_change_pos': sectionData['section_wpkoi_background_change_pos'] || 2,
					'section_wpkoi_background_change_mob': sectionData['section_wpkoi_background_change_mob'] || false,
					'section_wpkoi_background_change': sectionData['section_wpkoi_background_change'] || false,
				}
			}
		};

		self.generateLayouts = function() {

			$.each( settings, function( index, layout ) {

				var section_wpkoi_background_change 		= layout['section_wpkoi_background_change'] || false,
					section_wpkoi_background_change_speed 	= layout['section_wpkoi_background_change_speed'] || 300,
					section_wpkoi_background_change_pos 	= layout['section_wpkoi_background_change_pos'] || 2,
					section_wpkoi_background_change_mob 	= layout['section_wpkoi_background_change_mob'] || false,
					sectionid    							= layout['sectionid'],
					wpkoi_bgc_background_color  			= layout['wpkoi_bgc_background_color'];

				if ( false == section_wpkoi_background_change ) {
					$target.removeClass( 'wpkoi-background-change-section' );
					return false;
				}
				
				if ( 'false' == section_wpkoi_background_change ) {
					$target.removeClass( 'wpkoi-background-change-section' );
					return false;
				}
				
				if ( ! editMode ) {
				
					if ( section_wpkoi_background_change = true ) {
					
						$target.addClass( 'wpkoi-background-change-section' );
						$target.addClass( 'wpkoi-bcs-mob' );
						if ( section_wpkoi_background_change_mob === "true" ) {
							$target.removeClass( 'wpkoi-bcs-mob' );
						}
		
						$(window).on("scroll touchmove", function() {
							var $window = $(window);
							var scroll = $window.scrollTop() + ($window.height() / section_wpkoi_background_change_pos);
							var $this = $(".wpkoi-background-change-section.elementor-element-" + sectionid);
							if ($this.position().top <= scroll && $this.position().top + $this.height() > scroll) {
								$("body").css("transition-duration", section_wpkoi_background_change_speed + "ms");
								$("body").css("background", wpkoi_bgc_background_color);
							};
						});
					}
				} 
			});
		};
	}
}( jQuery, window.elementorFrontend ) );
/*This file was exported by "Export WP Page to Static HTML" plugin which created by ReCorp (https://myrecorp.com) */