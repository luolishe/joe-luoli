  	/* 初始化全屏模式 */
      {
		function launchFullscreen(element) {
			if (element.requestFullscreen) {
				element.requestFullscreen()
			} else if (element.mozRequestFullScreen) {
				element.mozRequestFullScreen()
			} else if (element.msRequestFullscreen) {
				element.msRequestFullscreen()
			} else if (element.webkitRequestFullscreen) {
				element.webkitRequestFullScreen()
			}
		}
		function exitFullscreen() {
			if (document.exitFullscreen) {
				document.exitFullscreen()
			} else if (document.msExitFullscreen) {
				document.msExitFullscreen()
			} else if (document.mozCancelFullScreen) {
				document.mozCancelFullScreen()
			} else if (document.webkitExitFullscreen) {
				document.webkitExitFullscreen()
			}
		}
		$(".joe_action_item.full_screen").on("click", () => {
			if ($(".joe_action_item.full_screen .icon-2").css('display') == 'none') {
				launchFullscreen(document.documentElement)
			} else {
				exitFullscreen()
			}
			$(".joe_action_item.full_screen .icon-2").toggle('slow')
			$(".joe_action_item.full_screen .icon-1").toggle('slow')
		});
	}
  /* 初始化全屏结束 */