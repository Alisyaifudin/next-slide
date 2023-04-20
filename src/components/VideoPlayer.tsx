import React, { useRef } from "react";
import { ChevronLeft, ChevronRight, Play, RotateCcw } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { cn } from "@/lib/utils";
interface VideoPlayerProps {
	id: string;
	onChangeId: (id: string, autoplay: boolean) => void;
	onEnded: (id: string, end: boolean) => void;
	next?: string;
	prev?: string;
	autoplay: boolean;
	isEnded: boolean;
	hidden: boolean;
}

const VideoPlayer = ({
	id,
	next,
	prev,
	onChangeId,
	autoplay,
	isEnded,
	onEnded,
	hidden,
}: VideoPlayerProps) => {
	const videoRef = useRef<HTMLVideoElement>(null);
	const handleClick = () => {
		if (!next) return;
		if (isEnded && !!next) {
			onChangeId(next, true);
			return;
		}
		if (videoRef.current?.paused) {
			videoRef.current.play();
		} else {
			videoRef.current?.pause();
		}
	};
	const handleBack = () => {
		if (isEnded) {
			handleReset();
			return;
		}
		if (!prev) return;
		if (!isEnded) {
			onEnded(prev, false);
			onChangeId(prev, false);
			return;
		}
		onChangeId(prev, false);
	};
	const handleNext = () => {
		if (videoRef.current === null) return;
		if (!isEnded) {
			videoRef.current.currentTime = videoRef.current.duration;
			onEnded(id, true);
		}
		if (!next) return;
		if (isEnded) {
			onEnded(next, true);
			onChangeId(next, false);
		} else onChangeId(next, false);
	};
	const handlePlay = () => {
		if (isEnded) return;
		videoRef.current?.play();
	};
	const handleReset = () => {
		if (!isEnded) return;
		videoRef.current?.load();
		onEnded(id, false);
	};
	const handleEnded = () => {
		onChangeId(id, false);
		onEnded(id, true);
	};
	if (autoplay && !hidden) {
		videoRef.current?.play();
	}
	if (isEnded && videoRef.current !== null) {
		videoRef.current.currentTime = videoRef.current.duration;
	}
	if (!isEnded && videoRef.current !== null) {
		videoRef.current.currentTime = 0;
	}
	return (
		<div
			className={cn("flex flex-col gap-6 items-center justify-centers", hidden ? "hidden" : "flex")}
		>
			<div className="w-full max-w-[1500px] justify-center flex items-center aspect-video">
				<video
					className="w-full "
					onEnded={handleEnded}
					ref={videoRef}
					src={`/assets/${id}`}
					onClick={handleClick}
				/>
			</div>
			<div className="flex justify-center gap-5">
				<button
					className="border rounded-lg p-2 disabled:border-zinc-500 disabled:text-zinc-500"
					onClick={handleBack}
					disabled={!prev && !isEnded}
				>
					<ChevronLeft />
				</button>
				{isEnded ? (
					<button onClick={handleReset} className="border rounded-lg p-2">
						<RotateCcw />
					</button>
				) : (
					<button onClick={handlePlay} className="border rounded-lg p-2">
						<Play />
					</button>
				)}
				<button
					className="border rounded-lg p-2 disabled:border-zinc-500 disabled:text-zinc-500"
					disabled={!next && isEnded}
					onClick={handleNext}
				>
					<ChevronRight />
				</button>
			</div>
		</div>
	);
};

export default VideoPlayer;
