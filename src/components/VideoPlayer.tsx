import React, { useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Expand, Play, RotateCcw, Shrink } from "lucide-react";
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
	fullscreen: boolean;
	onFullscreen: () => void;
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
	fullscreen,
	onFullscreen,
}: VideoPlayerProps) => {
	const videoRef = useRef<HTMLVideoElement>(null);
	const handleEsc = (e: KeyboardEvent) => {
		if (e.key === "Escape") {
			if (fullscreen) onFullscreen();
		}
	};
	useEffect(() => {
		// add event listener on `esc` key
		// to exit fullscreen mode
		document.addEventListener("keydown", handleEsc);
		return () => {
			document.removeEventListener("keydown", handleEsc);
		};
	});

	const handleClick = () => {
		if (!isEnded) {
			videoRef.current?.play();
			return;
		}
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
	const handleFullscreen = () => {
		onFullscreen();
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
			className={cn(
				fullscreen
					? "w-full h-screen justify-center relative"
					: "w-full flex-col gap-6 items-center justify-around",
				hidden ? "hidden" : "flex"
			)}
		>
			<div
				className={cn(
					"w-full justify-center flex items-center aspect-video",
					!fullscreen ? "max-w-[1500px]" : null
				)}
			>
				<video
					className="w-full"
					onEnded={handleEnded}
					ref={videoRef}
					src={`/assets/${id}`}
					onClick={handleClick}
				/>
				{fullscreen && (
					<>
						<button
							className="border absolute bottom-1 left-2 rounded-lg p-2 disabled:border-zinc-500 disabled:text-zinc-500"
							onClick={handleBack}
							disabled={!prev && !isEnded}
						>
							<ChevronLeft />
						</button>
						<button
							onClick={handleFullscreen}
							className="border absolute bottom-1 right-2 rounded-lg p-2 disabled:border-zinc-500 disabled:text-zinc-500"
						>
							<Shrink />
						</button>
					</>
				)}
			</div>
			{!fullscreen && (
				<div className="flex gap-5 w-full px-10">
					<div className="flex-1" />
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
					<div className="flex-1" />
					<button
						onClick={handleFullscreen}
						className="border rounded-lg p-2 disabled:border-zinc-500 disabled:text-zinc-500"
					>
						<Expand />
					</button>
				</div>
			)}
		</div>
	);
};

export default VideoPlayer;
