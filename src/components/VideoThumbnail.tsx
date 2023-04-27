import { cn } from "@/lib/utils";

interface VideoThumbnailProps {
	id: string;
	current: boolean;
	onChangeId: (id: string, autoplay: boolean) => void;
}

function VideoThumbnail({ id, onChangeId, current }: VideoThumbnailProps) {
	const handleClick = () => {
		onChangeId(id, false);
	};
	return (
		<button
			onClick={handleClick}
			className={cn("relative", current ? "border-4 border-red-500" : "border-2")}
		>
			<video className="w-full overflow-hidden" src={`/assets/${id}`} />
			<p className="absolute -bottom-2 right-1 text-black z-index-10 w-fit h-8">
				{id.split(".")[0]}
			</p>
		</button>
	);
}

export default VideoThumbnail;
