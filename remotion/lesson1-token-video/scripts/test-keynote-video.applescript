set inputPath to "/private/tmp/keynote-animation-test.mp4"
set keyPath to "/private/tmp/keynote-animation-test.key"
set moviePath to "/private/tmp/keynote-animation-export.m4v"

tell application "Keynote"
	activate
	set testDocument to make new document with properties {width:1920, height:1080}
	tell testDocument
		set auto play to true
		set auto loop to false
		tell slide 1
			set title showing to false
			set body showing to false
			set transition properties to {transition effect:no transition effect, transition duration:0.0, transition delay:4.0, automatic transition:true}
			set testMovie to make new movie with properties {file name:(POSIX file inputPath), position:{0, 0}}
			set width of testMovie to 1920
			set height of testMovie to 1080
			set movie volume of testMovie to 0
		end tell
		save in POSIX file keyPath
		export to POSIX file moviePath as QuickTime movie with properties {movie format:format540p, movie codec:h264, movie framerate:FPS30}
		close saving no
	end tell
end tell
