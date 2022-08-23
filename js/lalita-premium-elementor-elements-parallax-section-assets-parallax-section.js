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

			instance = new wpkoiSectionParallax( $target );
			instance.init();
		},
		
		
    };
    $( window ).on( 'elementor/frontend/init', WPKoiElements.init );
	/**
	 * wpkoiSectionParallax Class
	 *
	 * @return {void}
	 */
	window.wpkoiSectionParallax = function( $target ) {
		var self             = this,
			sectionId        = $target.data('id'),
			settings         = false,
			editMode         = Boolean( elementor.isEditMode() ),
			$window          = $( window ),
			$body            = $( 'body' ),
			scrollLayoutList = [],
			mouseLayoutList  = [],
			winScrollTop     = $window.scrollTop(),
			winHeight        = $window.height(),
			requesScroll     = null,
			requestMouse     = null,
			tiltx            = 0,
			tilty            = 0,
			isSafari         = !!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/),
			platform         = navigator.platform;

		/**
		 * Init
		 */
		self.init = function() {

			if ( ! editMode ) {
				settings = wpkoiElements[ 'wpkoiParallaxSections' ][ sectionId ] || false;
			} else {
				settings = self.generateEditorSettings( sectionId );
			}

			if ( ! settings ) {
			  return false;
			}

			$target.addClass( 'wpkoi-parallax-section' );
			self.generateLayouts();

			if ( 0 !== scrollLayoutList.length ) {
				$window.on( 'scroll.wpkoiSectionParallax resize.wpkoiSectionParallax', self.scrollHandler );
			}

			self.scrollUpdate();
		};

		self.generateEditorSettings = function( sectionId ) {
			var editorElements      = null,
				sectionsData        = {},
				sectionData         = {},
				sectionParallaxData = {},
				settings            = [];

			if ( ! window.elementor.hasOwnProperty( 'elements' ) ) {
				return false;
			}

			editorElements = window.elementor.elements;

			if ( ! editorElements.models ) {
				return false;
			}

			$.each( editorElements.models, function( index, obj ) {
				if ( sectionId == obj.id ) {
					sectionData = obj.attributes.settings.attributes;
				}
			} );

			if ( ! sectionData.hasOwnProperty( 'wpkoi_parallax_layout_image' ) || 0 === Object.keys( sectionData ).length ) {
				return false;
			}

			return { 
				'wpkoi_parallax_layout_list' : {
					'imageData': sectionData['wpkoi_parallax_layout_image'] || '',
					'wpkoi_parallax_layout_image' : sectionData['wpkoi_parallax_layout_image'] || '',
					'wpkoi_parallax_layout_speed': sectionData['wpkoi_parallax_layout_speed'] || 50,
					'wpkoi_parallax_layout_type': sectionData['wpkoi_parallax_layout_type'] || 'scroll',
					'wpkoi_parallax_layout_scale': sectionData['wpkoi_parallax_layout_scale'] || 100,
					'wpkoi_parallax_layout_bg_x': sectionData['wpkoi_parallax_layout_bg_x'] || 50,
					'wpkoi_parallax_layout_bg_y': sectionData['wpkoi_parallax_layout_bg_y'] || 50,
					'wpkoi_parallax_layout_z_index': sectionData['wpkoi_parallax_layout_z_index'] || '',
					'wpkoi_parallax_layout_bg_size': sectionData['wpkoi_parallax_layout_bg_size'] || 'auto',
					'wpkoi_parallax_layout_animation_prop': sectionData['wpkoi_parallax_layout_animation_prop'] || 'transform',
				}
			}
			
			
		};

		self.generateLayouts = function() {

			$( '.wpkoi-parallax-section__layout', $target ).remove();

			$.each( settings, function( index, layout ) {

				if(typeof layout['wpkoi_parallax_layout_scale'] === 'undefined') {
    				var mmscales	= 100;
				}
				else {
					var mmscales	= layout['wpkoi_parallax_layout_scale']['size'];
				}
				
				var imageData   = layout['wpkoi_parallax_layout_image'],
					speed       = 50,
					speedmatrix = speed / 10,
					mmspeed		= 100 - speed,
					mmscale		= mmscales,
					mmscaleste	= mmscale / 100,
					zIndex      = layout['wpkoi_parallax_layout_z_index'],
					bgSize      = layout['wpkoi_parallax_layout_bg_size'] || 'auto',
					animProp    = layout['wpkoi_parallax_layout_animation_prop'] || 'bgposition',
					bgX         = layout['wpkoi_parallax_layout_bg_x'],
					bgY         = layout['wpkoi_parallax_layout_bg_y'],
					type        = layout['wpkoi_parallax_layout_type'] || 'none',
					device      = layout['wpkoi_parallax_layout_on'] || [ 'desktop', 'tablet' ],
					idofimage   = 'koi55555',
					$layout     = null,
					layoutData  = {},
					safariClass = isSafari ? ' is-safari' : '',
					macClass    = 'MacIntel' == platform ? ' is-mac' : '',
					newtrickDeviceMode = elementorFrontend.getCurrentDeviceMode();

				if ( '' == imageData['url'] ) {
					return false;
				}

				if ( 'mouse' == type ) {
					$layout = $( '<div id="' + idofimage + '" class="wpkoi-parallax-section__layout wpkoi-parallax-section__' + type +'-layout' + macClass + '"><div class="wpkoi-parallax-section__image" data-parallax-deep=' + mmspeed + ' data-parallax-scale=' + mmscale + ' style="transform: scale(' + mmscaleste + ');transition-duration: 0.3s;"></div></div>' )
						.prependTo( $target )
						.css({
							'z-index': zIndex
						});
				} else if ( 'matrix' == type ) {
					$layout = $( '<div id="' + idofimage + '" class="wpkoi-parallax-section__layout wpkoi-parallax-section__' + type +'-layout' + macClass + '"><img src="' + imageData['url'] + '" ></div>' )
						.prependTo( $target )
						.css({
							'z-index': zIndex
						});
				} else {
					$layout = $( '<div id="' + idofimage + '" class="wpkoi-parallax-section__layout wpkoi-parallax-section__' + type +'-layout' + macClass + '"><div class="wpkoi-parallax-section__image"></div></div>' )
						.prependTo( $target )
						.css({
							'z-index': zIndex
						});
				}

				$( '> .wpkoi-parallax-section__image', $layout ).css({
					'background-image': 'url(' + imageData['url'] + ')',
					'background-size': bgSize,
					'background-position-x': bgX + '%',
					'background-position-y': bgY + '%',
				});
				
				if ( -1 !== device.indexOf( newtrickDeviceMode ) ) {
				} else {
					$( $layout ).css({
						'display': 'none'
					} );
				};

				layoutData = {
					selector: $layout,
					image: imageData['url'],
					size: bgSize,
					prop: animProp,
					type: type,
					device: device,
					xPos: bgX,
					yPos: bgY,
					speed: 2 * ( speed / 100 )
				};

				if ( 'none' !== type ) {
					if ( 'scroll' === type || 'zoom' === type ) {
						scrollLayoutList.push( layoutData );
					}
				};
				
				if ( 'matrix' == type ) {
					var options = {
						effectWeight: speedmatrix,
					};
					$("#" + idofimage).logosDistort(options);
				};

			});

		};

		self.scrollHandler = function( event ) {
			winScrollTop = $window.scrollTop();
			winHeight    = $window.height();

			self.scrollUpdate();
		};

		self.scrollUpdate = function() {
			$.each( scrollLayoutList, function( index, layout ) {

				var $this      = layout.selector,
					$image     = $( '.wpkoi-parallax-section__image', $this ),
					speed      = layout.speed,
					offsetTop  = $this.offset().top,
					thisHeight = $this.outerHeight(),
					prop       = layout.prop,
					type       = layout.type,
					posY       = ( winScrollTop - offsetTop + winHeight ) / thisHeight * 100,
					device     = elementorFrontend.getCurrentDeviceMode();

				if ( -1 == layout.device.indexOf( device ) ) {
					$image.css( {
						'transform': 'translateY(0)',
						'background-position-y': layout.yPos
					} );

					return false;
				}

				if ( winScrollTop < offsetTop - winHeight ) posY = 0;
				if ( winScrollTop > offsetTop + thisHeight) posY = 200;

				posY = parseFloat( speed * posY ).toFixed(1);

				switch( type ) {
					case 'scroll':
						if ( 'bgposition' === layout.prop ) {
							$image.css( {
								'background-position-y': 'calc(' + layout.yPos + '% + ' + posY + 'px)'
							} );
						} else {
							$image.css( {
								'transform': 'translateY(' + posY + 'px)'
							} );
						}
						break;
					case 'zoom':
						var deltaScale = ( winScrollTop - offsetTop + winHeight ) / winHeight,
							scale      = deltaScale * speed;

						scale = scale + 1;

						$image.css( {
							'transform': 'scale(' + scale + ')'
						} );
						break;
				}

			} );
		};

	}
}( jQuery, window.elementorFrontend ) );


function Parallax(options){
	options = options || {};
	this.nameSpaces = {
		wrapper: options.wrapper || '.wpkoi-parallax-section',
		layers: options.layers || '.wpkoi-parallax-section__mouse-layout .wpkoi-parallax-section__image',
		deep: options.deep || 'data-parallax-deep',
		scale: options.scale || 'data-parallax-scale'
	};
	this.init = function() {
		var self = this,
			parallaxWrappers = document.querySelectorAll(this.nameSpaces.wrapper);
		for(var i = 0; i < parallaxWrappers.length; i++){
			(function(i){
				parallaxWrappers[i].addEventListener('mousemove', function(e){
					var x = e.clientX,
						y = e.clientY,
						layers = parallaxWrappers[i].querySelectorAll(self.nameSpaces.layers);
					for(var j = 0; j < layers.length; j++){
				(function(j){
				  var deep = layers[j].getAttribute(self.nameSpaces.deep),
					  scale = layers[j].getAttribute(self.nameSpaces.scale),
					  scale = scale / 100,
					  disallow = layers[j].getAttribute('data-parallax-disallow'),
					  itemX = (disallow && disallow === 'x') ? 0 : x / deep - 10,
					  itemY = (disallow && disallow === 'y') ? 0 : y / deep - 10;
					  if(disallow && disallow === 'both') return;
					  layers[j].style.transform = 'translateX(' + itemX + '%) translateY(' + itemY + '%) scale(' + scale + ')';
					  layers[j].style.transitionDuration = '0s';
				})(j);
			  
					}
				})
				
				parallaxWrappers[i].addEventListener('mouseleave', function(e){
					var layers = parallaxWrappers[i].querySelectorAll(self.nameSpaces.layers);
					for(var j = 0; j < layers.length; j++){
				(function(j){
				  var scale = layers[j].getAttribute(self.nameSpaces.scale),
					  scale = scale / 100,
					  disallow = layers[j].getAttribute('data-parallax-disallow');
					  if(disallow && disallow === 'both') return;
					  layers[j].style.transform = 'translateX(0%) translateY(0%) scale(' + scale + ')';
					  layers[j].style.transitionDuration = '0.5s';
				})(j);
			  
					}
				})
			})(i);
		}
	};
	this.init();
	return this;
}

jQuery(document).ready(function($) {
	new Parallax();
});
/*This file was exported by "Export WP Page to Static HTML" plugin which created by ReCorp (https://myrecorp.com) */