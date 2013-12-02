/*
	August W. Miller
	Summer 2013
*/

var Gallery;

/*
	Matrix Schema
*/

function Matrix ( options ) {
	var self = this;

	self.container = options.wrapper ? $(options.wrapper) : $('.gallery-wrapper');
	self.map = options.map ? $(options.map) : $('#minimap');
	self.rows = [];

	self.options = {
		speed : 1000,
		rowSpeed : 1000,
		rowClass : options.rowClass,
		slideClass : options.slideClass
	};

	self.init();

	// console.log(self);
}

Matrix.prototype.init = function ( ) {
	var self = this;

	self.els = self.container.find( self.options.rowClass );
	self.current = 0;
	self.preload = 3;
	self.touch = {};

	for ( var p = 0; p < self.els.length; p++ ) {
		self.rows.push( new Row({
			el : self.els[p],
			index : p,
			slideClass : self.options.slideClass,
			parent : self,
			speed : self.options.rowSpeed
		}));
	}

	self.listen();
	self.resize( true );
	self.pick( self.current );
};

Matrix.prototype.listen = function ( ) {
	var self = this;

	$(window).on( 'resize.Rows' , function ( ) {
		self.resize( true );
	});

	$(window).on( 'keydown.Gallery' , function ( e ) {
		var key = e.keyCode;
		// console.log(['pressed',key]);

		switch ( key ) {
			case 39 :
				// Right
				e.preventDefault();
				self.rows[self.current].pick( self.rows[self.current].next(), self.rows[self.current].options.speed );
				break;

			case 37 :
				// Left
				e.preventDefault();
				self.rows[self.current].pick( self.rows[self.current].prev() , self.rows[self.current].options.speed );
				break;

			case 40 :
				// Down
				e.preventDefault();
				self.pick( self.next() , self.options.speed );
				break;

			case 38 :
				// Up
				e.preventDefault();
				self.pick( self.prev() , self.options.speed );
				break;

			case 82 :
				// R
				self.reset();
				break;

			case 73 :
				// I
				// alert("Info Panel, eventually");
				break;

			default :
				// Matrix don't care.
		}
	});
	
	$(self.container).on( 'touchstart' , function ( e ) {
		// e.preventDefault();
		self.touchSetup( e.originalEvent );
	}).on( 'touchmove' , function ( e ) {
		e.preventDefault();
		self.touchPan( e.originalEvent );
	}).on( 'touchend' , function ( e ) {
		// e.preventDefault();
		self.touchConclude( e.originalEvent );
	});
};

Matrix.prototype.touchSetup = function ( e ) {
	var self = this;

	self.touch = {
		x : {
			start : {
				position : e.touches[0].pageX,
				time : e.timeStamp
			},
			delta : {
				distance : 0,
				duration : 0
			}
		},
		y : {
			start : {
				position : e.touches[0].pageY,
				time : e.timeStamp
			},
			delta : {
				distance : 0,
				duration : 0
			}
		}
	};
},

Matrix.prototype.touchPan = function ( e ) {
	var self = this;

	self.touch.x.delta.distance = ( self.touch.x.start.position - e.touches[0].pageX );
	self.touch.x.delta.duration = ( e.timeStamp - self.touch.x.start.time );

	self.touch.y.delta.distance = ( self.touch.y.start.position - e.touches[0].pageY );
	self.touch.y.delta.duration = ( e.timeStamp - self.touch.y.start.time );

	if ( Math.abs( self.touch.y.delta.distance ) > 5 || Math.abs( self.touch.x.delta.distance ) > 5 ) {

		if ( Math.abs( self.touch.x.delta.distance ) < Math.abs( self.touch.y.delta.distance ) ) {
			// The gesture is dominantly vertical.
			self.container.css({
				top : ( - ( self.current * window.innerHeight ) - self.touch.y.delta.distance )
			});
		} else {
			// The gesture is dominantly horizontal.
			self.rows[self.current].el.css({
				left : ( ( - self.touch.x.delta.distance ) - ( self.container.width() * self.rows[self.current].current ) )
			});
		}
	}

};

Matrix.prototype.touchConclude = function ( e ) {
	var self = this;

	// Check if the gesture was long enough vertically:

	if ( Math.abs( self.touch.y.delta.distance ) > ( window.innerHeight / 8 ) ) {
		if ( self.touch.y.delta.distance > 0 ) {
			self.pick( self.next() , Math.min( ( self.touch.y.delta.duration * 3 ), self.options.speed ) );
		} else {
			self.pick( self.prev() , Math.min( ( self.touch.y.delta.duration * 3 ) , self.options.speed ) );
		}
	} else {
		self.pick( self.current , self.options.speed );
	}

	// Check if the gesture was long enough horizontally:

	if ( Math.abs( self.touch.x.delta.distance ) > ( window.innerWidth / 5 ) ) {
		if ( self.touch.x.delta.distance > 0 ) {
			self.rows[self.current].pick( self.rows[self.current].next() , Math.min( ( self.touch.x.delta.duration * 3 ) , self.rows[self.current].options.speed ) );
		} else {
			self.rows[self.current].pick( self.rows[self.current].prev() , Math.min( ( self.touch.x.delta.duration * 3 ) , self.rows[self.current].options.speed ) );
		}
	} else {
		// console.log(self.rows[self.current].options.speed);
		self.rows[self.current].pick( self.rows[self.current].current , self.rows[self.current].options.speed );
	}
};

Matrix.prototype.resize = function ( deep ) {
	var self = this;

	if ( deep ) {
		for ( var r = 0; r < self.rows.length; r++ ) {
			self.rows[r].resize( deep );
		}
	} else {
		self.rows[self.current].resize( deep );
	}

	self.pick( self.current , true );
};

Matrix.prototype.reset = function ( ) {
	var self = this;

	for ( var r = 0; r < self.rows.length; r++ ) {
		self.rows[r].pick(0);
	}

	self.seek(0,0);
};

Matrix.prototype.next = function ( ) {
	var self = this;
	
	return ( ( self.current + 1 ) <= (  self.rows.length - 1 ) ) ? ( self.current + 1 ) : ( self.current );
};

Matrix.prototype.prev = function ( ) {
	var self = this;

	return ( ( self.current - 1 ) >= 0 ) ? ( self.current - 1 ) : 0;
};

Matrix.prototype.pick = function ( id , velocity ) {
	var self = this;

	// For now:
	if ( velocity > 1 ) {
		self.container.animate({
			top : - ( id * window.innerHeight )
		},
		{
			duration : velocity,
			queue : false,
			specialEasing : {
				top : "easeOutQuart"
			}
		});
	} else {
		self.container.css({
			top: - ( id * window.innerHeight )
		});
	}

	self.current = id;

	// self.rows[self.current].pick( self.rows[self.current].current );
	self.rows[self.current].preload();

	// Minimap Indicator
	self.rows[self.current].nav.addClass('active');
	self.rows[self.current].nav.siblings().removeClass('active');

	// console.log( [ "At" , self.current , self.rows[self.current].current ] );
};

Matrix.prototype.seek = function( project , slide ) {
	var self = this,
		distance = {
			rows : Math.abs( project - self.current ),
			columns : Math.abs( slide - self.rows[self.current].current )
		}

	self.resize( true );
	self.pick( project , self.options.speed * ( Math.max( distance.rows / 2 , 1 ) ) );
	self.rows[self.current].pick( slide , ( self.rows[self.current].options.speed * ( Math.max( distance.rows / 2 , 1 ) * 1.25 )  ) );
};



/*
	Rows
*/

function Row ( options ) {
	var self = this;

	self.el = options.el ? $(options.el) : $(".row");
	self.index = options.index;
	self.title = self.el.attr('data-proj-name');
	self.pageId = self.el.attr('data-page-id');
	self.slides = [];
	self.Matrix = options.parent;
	self.current = 0;
	self.options = {
		speed : options.speed,
		slideClass : options.slideClass
	};

	self.init();
}

Row.prototype.init = function ( ) {
	var self = this,
		slides = self.el.find(self.options.slideClass);


	self.nav = $('<div/>').addClass('map-row clearfix').appendTo(self.Matrix.map);

	for ( var s = 0; s < slides.length; s++ ) {
		self.slides.push( new Slide ( slides[s] , s , self ) );
	}

	self.nav.append( $("<span/>").addClass("proj-name").text(self.title) );
	// self.preload();
	self.pick( self.current );
};

Row.prototype.preload = function ( ) {
	var self = this;

	for ( var s = self.current; ( s < ( self.current + self.Matrix.preload ) || s < self.slides.length ); s++ ) {
		if ( self.slides[s] ) self.slides[s].load();
	}
};

Row.prototype.next = function ( ) {
	var self = this;

	return ( ( self.current + 1 ) <= (  self.slides.length - 1 ) ) ? ( self.current + 1 ) : ( self.current );
};

Row.prototype.prev = function ( ) {
	var self = this;

	return ( ( self.current - 1 ) >= 0 ) ? ( self.current - 1 ) : 0
};

Row.prototype.pick = function ( id , velocity ) {
	var self = this;

	if ( velocity > 1 ) {
		self.el.animate({
			left : - ( id * window.innerWidth )
		},
		{
			duration : velocity,
			queue : false,
			specialEasing : {
				left : "easeOutQuint"
			}
		});
	} else {
		self.el.css({
			left : - ( id * window.innerWidth )
		});
	}

	if ( id !== self.current ) {
		self.preload();
	}

	self.current = id;

	// Minimap Indicator
	self.slides[self.current].mapTile.addClass('visible').siblings().removeClass('visible');
};

Row.prototype.resize = function( deep ) {
	var self = this,
		newWidth = ( self.slides.length * window.innerWidth );

	self.el.width( newWidth );

	// self.slides[self.current].resize();

	if ( deep ) {
		for ( var s = 0; s < self.slides.length; s++ ) {
			self.slides[s].resize();
		}
	}

	self.pick( self.current , true );
};

/*
	Slides
*/

function Slide ( el , id , parent ) {
	var self = this;

	self.index = id;
	self.el = $(el);
	self.Row = parent;
	self.mapTile = $('<div/>').addClass('map-slide').appendTo(self.Row.nav);

	self.init();
}

Slide.prototype.init = function ( ) {
	var self = this;

	if ( self.el.find('.image') ) {
		self.isImage = true;
		self.wrapper = self.el.find('.image');
		self.image = self.el.find('img');
		self.ratio = ( self.image.attr('data-width') / self.image.attr('data-height') );
	} else {
		self.isImage = false;
	}

	self.mapTile.on('click.Seek' , function ( ) {
		self.Row.Matrix.seek( self.Row.index , self.index );
	});

	self.loaded = false;
	// self.load();
};

Slide.prototype.load = function ( ) {
	var self = this;

	if ( self.isImage && !self.loaded ) {
		// console.log("Found an image to load.");
		if ( window.innerWidth < 500 && window.devicePixelRatio == 1 ) {
			self.image.attr( 'src' , self.image.attr('data-src-mobile') );
		} else if ( window.devicePixelRatio < 1.5 || window.innerWidth < 768 ) {
			self.image.attr( 'src' , self.image.attr('data-src-small') );
		} else {
			self.image.attr( 'src' , self.image.attr('data-src-large') );
		}
		self.loaded = true;
	}
};

Slide.prototype.resize = function ( ) {
	var self = this;

	self.el.height( window.innerHeight );
	self.el.width( window.innerWidth );

	if ( self.isImage ) self.position();
};

Slide.prototype.position = function ( ) {
	var self = this,
		w = {
			height: window.innerHeight,
			width: window.innerWidth,
			ratio: ( window.innerWidth / window.innerHeight )
		};

	if ( w.ratio < self.ratio ) {
		self.wrapper.css({
			'width' : ( self.ratio * w.height ),
			'margin-left' : ( ( w.width - ( self.ratio * w.height ) ) / 2 ),
			'margin-top' : 0
		});
	} else {
		self.wrapper.css({
			'width' : w.width,
			'margin-left' : 0,
			'margin-top' : ( ( w.height - ( w.width / self.ratio ) ) / 2 )
		});
	}

};

$(document).ready( function ( ) {

	if ( $('#gallery').length ) {
		Gallery = new Matrix ({
			wrapper : ".gallery-wrapper",
			rowClass : ".row",
			slideClass : ".slide",
			map : "#minimap"
		});

		// Go to a slide (dev purposes)
		// Gallery.seek(0,1);
	}

	$(document.body).addClass('loaded');

	/*
		Turn off the pesky instructions when we use the arrow keys
	*/

	$(window).on( 'keydown' , function ( e ) {
		var key = e.keyCode;
		if ( key == 39 || key == 37 || key == 40 || key == 38 ) {
			$('.instructions').fadeOut();
		} else if ( key == 82 ) {
			$('.instructions').fadeIn();
		}
	});

});