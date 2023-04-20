import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import fs from "fs";
import path from "path";
import VideoPlayer from "@/components/VideoPlayer";
import { z } from "zod";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import VideoThumbnail from "@/components/VideoThumbnail";
import { ScrollArea } from "@/components/ui/scroll-area";

export const getServerSideProps: GetServerSideProps<{ ids: string[] }> = async (context) => {
	// read the assets files names from @/assets/*
	let files = fs.readdirSync(path.join(process.cwd(), "public", "assets"));
	// sort the files by name
	files = files.sort((a, b) => {
		const aNum = Number(a.split(".")[0]);
		const bNum = Number(b.split(".")[0]);
		return aNum - bNum;
	});
	return {
		props: {
			ids: files,
		},
	};
};

function Video({ ids }: InferGetServerSidePropsType<typeof getServerSideProps>) {
	const [currId, setCurrId] = useState<string>(ids[0]);
	const [autoplay, setAutoplay] = useState<boolean>(false);
	const [videos, setVideos] = useState(
		ids.map((id) => ({
			id,
			ended: false,
		}))
	);
	const [prev, next] = [ids[ids.indexOf(currId) - 1], ids[ids.indexOf(currId) + 1]];
	const handleChangeId = (id: string, autoplay: boolean) => {
		setCurrId(id);
		setAutoplay(autoplay);
	};
	const handleEnded = (id: string, ended: boolean) => {
		setVideos((prev) => {
			const newVideos = [...prev];
			const index = newVideos.findIndex((video) => video.id === id);
			newVideos[index].ended = ended;
			return newVideos;
		});
	};
	return (
		<main className="flex gap-6 h-screen">
			<ScrollArea className="w-60 border max-h-full p-1 gap-4 flex flex-col">
				{videos.map((video) => (
					<VideoThumbnail onChangeId={handleChangeId} key={video.id} id={video.id} />
				))}
			</ScrollArea>
			<section className="flex-1">
				{videos.map((video) => (
					<VideoPlayer
						key={video.id}
						onChangeId={handleChangeId}
						isEnded={video.ended}
						onEnded={handleEnded}
						id={video.id}
						next={next}
						prev={prev}
						autoplay={autoplay}
						hidden={video.id !== currId}
					/>
				))}
			</section>
		</main>
	);
}

export default Video;
