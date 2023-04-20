interface VideoThumbnailProps {
	id: string;
    onChangeId: (id: string, autoplay: boolean) => void;
}

function VideoThumbnail({ id, onChangeId }: VideoThumbnailProps) {
    const handleClick = () => {
        onChangeId(id, false);
    }
	return (
		<button onClick={handleClick} className="border-2">
			<video className="w-full overflow-hidden" src={`/assets/${id}`} />
		</button>
	);
}

export default VideoThumbnail;
