interface VideoThumbnailProps {
	id: string;
	onChangeId: (id: string, autoplay: boolean) => void;
}

function VideoThumbnail({ id, onChangeId }: VideoThumbnailProps) {
	const handleClick = () => {
		onChangeId(id, false);
	};
	return (
		<button onClick={handleClick} className="border-2 relative">
			<video className="w-full overflow-hidden" src={`/assets/${id}`} />
			<p className="absolute -bottom-2 right-1 text-black z-index-10 w-fit h-8">{id.split(".")[0]}</p>
		</button>
	);
}

export default VideoThumbnail;
