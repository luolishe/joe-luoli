( function () {
	const EvanIdCard = function ( options ) {
		if ( !( this instanceof EvanIdCard ) ) {
			return new EvanIdCard( options )
		}
		this.options = Object.assign( {}, {
			nickname: "昵称",
			logo: "",
			title: "博客名称",
			desc: "博客简介信息，尽量简短",
			link: "博客域名",
			color: "#fff",
			bgColor: "#ff80ab",
			interval: 0,
			position: "c",
			zIndex: 101,
			image: "",
			imageConfig: {
				width: 200,
				height: 310,
				left: 300,
				bottom: 22,
			},
		}, options );
		this.init()
	};
	const _Utils = {
		checkIsMobile: function () {
			return /Mobi|Android|iPhone/i.test( navigator.userAgent )
		},
		getBrowserRedirect () {
			var sUserAgent = navigator.userAgent;
			var isWin = navigator.platform == "Win32" || navigator.platform == "Windows";
			var isMac = navigator.platform == "Mac68K" || navigator.platform == "MacPPC" || navigator.platform == "Macintosh" || navigator.platform == "MacIntel";
			if ( isMac ) return "Mac";
			var isUnix = navigator.platform == "X11" && !isWin && !isMac;
			if ( isUnix ) return "Unix";
			var isLinux = String( navigator.platform )
				.indexOf( "Linux" ) > -1;
			if ( isLinux ) return "Linux";
			if ( isWin ) {
				var isWin2K = sUserAgent.indexOf( "Windows NT 5.0" ) > -1 || sUserAgent.indexOf( "Windows 2000" ) > -1;
				if ( isWin2K ) return "Win2000";
				var isWinXP = sUserAgent.indexOf( "Windows NT 5.1" ) > -1 || sUserAgent.indexOf( "Windows XP" ) > -1;
				if ( isWinXP ) return "WinXP";
				var isWin2003 = sUserAgent.indexOf( "Windows NT 5.2" ) > -1 || sUserAgent.indexOf( "Windows 2003" ) > -1;
				if ( isWin2003 ) return "Win2003";
				var isWinVista = sUserAgent.indexOf( "Windows NT 6.0" ) > -1 || sUserAgent.indexOf( "Windows Vista" ) > -1;
				if ( isWinVista ) return "WinVista";
				var isWin7 = sUserAgent.indexOf( "Windows NT 6.1" ) > -1 || sUserAgent.indexOf( "Windows 7" ) > -1;
				if ( isWin7 ) return "Windows 7";
				var isWin10 = sUserAgent.indexOf( "Windows NT 10" ) > -1 || sUserAgent.indexOf( "Windows 10" ) > -1;
				if ( isWin10 ) return "Windows 10"
			}
			return "Unknown"
		},
		getBrowser () {
			var Sys = {};
			var ua = navigator.userAgent.toLowerCase();
			var s;
			( s = ua.match( /rv:([\d.]+)\) like gecko/ ) ) ? ( Sys.ie = s[ 1 ] ) : ( s = ua.match( /msie ([\d\.]+)/ ) ) ? ( Sys.ie = s[ 1 ] ) : ( s = ua.match( /edge\/([\d\.]+)/ ) ) ? ( Sys.edge = s[ 1 ] ) : ( s = ua.match( /firefox\/([\d\.]+)/ ) ) ? ( Sys.firefox = s[ 1 ] ) : ( s = ua.match( /(?:opera|opr).([\d\.]+)/ ) ) ? ( Sys.opera = s[ 1 ] ) : ( s = ua.match( /chrome\/([\d\.]+)/ ) ) ? ( Sys.chrome = s[ 1 ] ) : ( s = ua.match( /version\/([\d\.]+).*safari/ ) ) ? ( Sys.safari = s[ 1 ] ) : 0;
			if ( Sys.ie ) return "IE " + Sys.ie;
			if ( Sys.edge ) return "EDGE " + Sys.edge;
			if ( Sys.firefox ) return "Firefox " + Sys.firefox;
			if ( Sys.chrome ) return "Chrome " + Sys.chrome;
			if ( Sys.opera ) return "Opera " + Sys.opera;
			if ( Sys.safari ) return "Safari " + Sys.safari;
			return "Unknown"
		},
		getNowDate () {
			const _week = {
				0: "星期日",
				1: "星期一",
				2: "星期二",
				3: "星期三",
				4: "星期四",
				5: "星期五",
				6: "星期六",
			};
			const _fillZero = function ( num ) {
				if ( num < 10 ) return "0" + num;
				return num
			};
			const date = new Date();
			return `${_fillZero(date.getFullYear())}年${_fillZero(date.getMonth()+1)}月${_fillZero(date.getDate())}日${_week[date.getDay()]}`
		},
		getHourInterval ( s1, s2 ) {
			s1 = new Date( s1 );
			s2 = new Date( s2 );
			var ms = s2.getTime() - s1.getTime();
			if ( ms < 0 ) return 0;
			return Math.floor( ms / 1000 / 60 / 60 )
		},
	};
	const _CanvasUtils = {
		fillRoundRect ( cxt, x, y, width, height, radius, fillColor ) {
			if ( 2 * radius > width || 2 * radius > height ) {
				return false
			}
			cxt.save();
			cxt.translate( x, y );
			this.drawRoundRectPath( cxt, width, height, radius );
			cxt.fillStyle = fillColor || "#000";
			cxt.fill();
			cxt.restore()
		},
		drawRoundRectPath ( cxt, width, height, radius ) {
			cxt.beginPath( 0 );
			cxt.arc( width - radius, height - radius, radius, 0, Math.PI / 2 );
			cxt.lineTo( radius, height );
			cxt.arc( radius, height - radius, radius, Math.PI / 2, Math.PI );
			cxt.lineTo( 0, radius );
			cxt.arc( radius, radius, radius, Math.PI, ( Math.PI * 3 ) / 2 );
			cxt.lineTo( width - radius, 0 );
			cxt.arc( width - radius, radius, radius, ( Math.PI * 3 ) / 2, Math.PI * 2 );
			cxt.lineTo( width, height - radius );
			cxt.closePath()
		},
		drawerArc ( ctx, x, y, radius, stArtAngle, color, fillColor ) {
			ctx.beginPath();
			ctx.strokeStyle = color;
			ctx.arc( x, y, radius, stArtAngle, 2 * Math.PI );
			ctx.closePath();
			ctx.stroke();
			ctx.fillStyle = fillColor;
			ctx.fill()
		},
	};
	EvanIdCard.prototype = {
		data: {
			cname: " 未获取到IP属地 ",
			cip: "未获取到IP地址",
			canvas: null,
		},
		fnGetIpInfo () {
			const _this = this;
			if ( location.protocol.indexOf( "https" ) == -1 ) {
				$.get( "http://ip-api.com/json?lang=zh-CN", function ( e ) {
					_this.data.cname = `${e.city}${e.regionName}`;
					_this.data.cip = e.query;
					_this.fnRenderHtml()
				} )
			} else {
				if ( typeof returnCitySN == "undefined" ) {
					return console.warn( 'EvanIdCard：https站点缺少 <script src="https://pv.sohu.com/cityjson?ie=utf-8"></script> 的引用' )
				}
				_this.data.cname = returnCitySN[ "cname" ];
				_this.data.cip = returnCitySN[ "cip" ];
				_this.fnRenderHtml()
			}
		},
		fnRenderCanvasCard () {
			const _this = this;
			const _width = 550,
				_height = 340;
			const canvas = document.getElementById( "EvanIdCard" );
			if ( !canvas.getContext ) return console.log( "浏览器不支持！" );
			const ctx = canvas.getContext( "2d" );
			ctx.shadowColor = "rgba(0,0,0,0.25)";
			ctx.shadowBlur = 10;
			_CanvasUtils.fillRoundRect( ctx, 10, 90, _width - 100, _height - 100, 12, _this.options.bgColor );
			ctx.shadowColor = "";
			ctx.shadowBlur = 0;
			_CanvasUtils.drawerArc( ctx, 260, _height - 10, 32, 3.15, "rgba(255,255,255,0.1)", "rgba(255,255,255,0.15)" );
			_CanvasUtils.fillRoundRect( ctx, 26, _height - 185, _width - 220, _height - 220, 12, "rgba(255,255,255,0.1)" );
			ctx.beginPath();
			ctx.strokeStyle = "rgba(255,255,255,0.1)";
			ctx.arc( 50, _height - 249, 30, 3.15, Math.PI * 180, 1 );
			ctx.closePath();
			ctx.stroke();
			ctx.fillStyle = "rgba(255,255,255,0.2)";
			ctx.fill();
			let image = new Image();
			image.onload = function () {
				ctx.drawImage( image, _this.options.imageConfig.left, _this.options.imageConfig.bottom, _this.options.imageConfig.width, _this.options.imageConfig.height )
			};
			image.src = _this.options.image;
			ctx.font = "normal bold 15px Arial";
			ctx.fillStyle = "#fff";
			ctx.fillText( `☾访友ID：${_this.data.cip}`, 26, _height - 225 );
			ctx.font = "12px Arial";
			ctx.fillText( `❤来自本站博主${_this.options.nickname}的问候：`, 30, _height - 195 );
			ctx.font = "normal bold 15px Arial";
			ctx.fillStyle = "#fff";
			ctx.fillText( `»欢迎来自「${_this.data.cname}」的朋友`, 40, _height - 160 );
			ctx.font = "14px Arial";
			ctx.fillText( `»访问日期：${_Utils.getNowDate()}`, 40, _height - 130 );
			ctx.fillText( `»访问信息：`, 40, _height - 100 );
			ctx.font = "13px Arial";
			ctx.fillText( `»使用${_Utils.getBrowserRedirect()}+${_Utils.getBrowser()}`, 40, _height - 80 );
			_CanvasUtils.drawerArc( ctx, 44, _height - 36, 15, 0, "#fff", "#fff" );
			let logo = new Image();
			logo.onload = function () {
				ctx.drawImage( logo, 30, _height - 50, 28, 28 )
			};
			logo.src = _this.options.logo;
			ctx.font = "12px Arial";
			ctx.fillStyle = "#fff";
			ctx.fillText( `☑${_this.options.title}（${_this.options.link}）`, 70, _height - 38 );
			ctx.font = "12px Arial";
			ctx.fillText( `☑${_this.options.desc}`, 70, _height - 21 );
			this.canvas = canvas;
			return canvas
		},
		fnRenderHtml () {
			const _this = this;
			const _modal = `<div id="EvanIdCardModal"class="evan-id-card_modal ${_this.options.position}"style="z-index:${_this.options.zIndex};"><span class="warn-tips">温馨提示：在签名档上右键可保存至本地(*^▽^*)~</span><span class="close-btn">×</span><canvas id="EvanIdCard"class="evan-id-card-canvas"width="550"height="340"></canvas><div class="btn-wrap"></div></div>`;
			$( "body" )
				.append( _modal );
			this.fnRenderCanvasCard();
			$( "body" )
				.append( `<div id="EvanIdCardSwitch"class="evan-id-card_switch">签</div` );
			$( "#EvanIdCardSwitch" )
				.off( "click" )
				.click( function () {
					if ( $( "#EvanIdCardModal" )
						.hasClass( "is-show" ) ) {
						$( "#EvanIdCardModal" )
							.removeClass( "is-show" );
						$( this )
							.removeClass( "active" );
						localStorage.setItem( "EvanIdCardShow", "off" )
					} else {
						$( "#EvanIdCardModal" )
							.addClass( "is-show" );
						$( this )
							.addClass( "active" );
						localStorage.setItem( "EvanIdCardShow", "on" )
					}
				} );
			$( "#EvanIdCardModal .close-btn" )
				.off( "click" )
				.click( function () {
					if ( $( "#EvanIdCardModal" )
						.hasClass( "is-show" ) ) {
						$( "#EvanIdCardModal" )
							.removeClass( "is-show" );
						$( this )
							.removeClass( "active" );
						localStorage.setItem( "EvanIdCardShow", "off" )
					} else {
						$( "#EvanIdCardModal" )
							.addClass( "is-show" );
						$( this )
							.addClass( "active" );
						localStorage.setItem( "EvanIdCardShow", "on" )
					}
				} );
			setTimeout( () => {
				if ( _this.options.interval == 0 ) {
					$( "#EvanIdCardModal" )
						.addClass( "is-show" );
					$( "#EvanIdCardSwitch" )
						.addClass( "active" );
					localStorage.setItem( "EvanIdCardShow", "on" );
					localStorage.removeItem( "EvanIdCardShowTime" )
				} else {
					if ( localStorage.getItem( "EvanIdCardShowTime" ) == null ) {
						$( "#EvanIdCardModal" )
							.addClass( "is-show" );
						$( "#EvanIdCardSwitch" )
							.addClass( "active" );
						localStorage.setItem( "EvanIdCardShow", "on" );
						localStorage.setItem( "EvanIdCardShowTime", new Date()
							.getTime() )
					} else {
						if ( _Utils.getHourInterval( Number( localStorage.getItem( "EvanIdCardShowTime" ) ), new Date()
							.getTime() ) > _this.options.interval ) {
							$( "#EvanIdCardModal" )
								.addClass( "is-show" );
							$( "#EvanIdCardSwitch" )
								.addClass( "active" );
							localStorage.setItem( "EvanIdCardShow", "on" );
							localStorage.setItem( "EvanIdCardShowTime", new Date()
								.getTime() )
						}
					}
				}
			}, 1500 )
		},
		init () {
			const _this = this;
			$( function () {
				if ( _Utils.checkIsMobile() ) {
					console.warn( "EvanIdCard：很抱歉，游客身份标识卡不兼容移动端！" )
				} else {
					_this.fnGetIpInfo()
				}
			} )
		},
	};
	window.EvanIdCard = EvanIdCard
} )();
