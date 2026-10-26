on addVideoSlide(theDocument, clipPath, clipDuration, slideLabel, isFirstSlide)
	tell application "Keynote"
		tell theDocument
			if isFirstSlide then
				set theSlide to slide 1
			else
				set theSlide to make new slide at end of slides
			end if
			tell theSlide
				set title showing to false
				set body showing to false
				set presenter notes to slideLabel
				set transition properties to {transition effect:no transition effect, transition duration:0.0, transition delay:clipDuration, automatic transition:true}
				set theMovie to make new movie with properties {file name:(POSIX file clipPath), position:{0, 0}}
				set width of theMovie to 1920
				set height of theMovie to 1080
				set movie volume of theMovie to 0
				set repetition method of theMovie to none
				set locked of theMovie to true
			end tell
		end tell
	end tell
end addVideoSlide

on run argv
	if (count of argv) is not 1 then error "Usage: osascript build-keynote.applescript /absolute/output/path.key"
	set outputPath to item 1 of argv
	set mediaRoot to "/Users/sniper/work/0自媒体/自媒体项目/03课程/Aliang-AI-Course/output/Lesson1ChalkboardRevisedReview-Keynote/media/"
	set clipNames to {"scene-01-question.mp4", "scene-02-product-model.mp4", "scene-03-llm-actions.mp4", "scene-04-predict-next.mp4", "scene-05-generation-loop.mp4", "scene-06-streaming.mp4", "scene-07-token-definition.mp4", "scene-08-tokenizer.mp4", "scene-09-encode-decode.mp4", "scene-10-tokenizer-merged.mp4", "scene-11-token-impact.mp4", "scene-12-full-chain.mp4"}
	set clipDurations to {40.0, 34.0, 37.0, 42.0, 40.0, 47.0, 67.0, 61.0, 89.0, 81.0, 106.0, 25.0}
	set slideLabels to {"01｜大模型为什么能够生成回答？", "02｜AI 产品与大模型", "03｜大模型背后的四种交互", "04｜预测接下来更可能出现什么", "05｜生成一个，再预测下一个", "06｜流式生成", "07｜真正接的是 Token", "08｜Tokenizer 切分", "09｜编码与解码", "10｜Token 合并过程", "11｜Token 为什么重要", "12｜完整链路"}

	tell application "Keynote"
		activate
		set newDocument to make new document with properties {width:1920, height:1080}
		tell newDocument
			set slide numbers showing to false
			set auto loop to false
			set auto play to true
		end tell
	end tell

	repeat with clipIndex from 1 to count of clipNames
		set clipPath to mediaRoot & item clipIndex of clipNames
		my addVideoSlide(newDocument, clipPath, item clipIndex of clipDurations, item clipIndex of slideLabels, clipIndex is 1)
	end repeat

	tell application "Keynote"
		tell newDocument
			save in POSIX file outputPath
		end tell
	end tell
	return outputPath
end run
