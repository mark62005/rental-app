import { IDiscoverCardProps } from "@/types/app/component-props";
import Image from "next/image";

function DiscoverCard({ imageSrc, title, description }: IDiscoverCardProps) {
	return (
		<div className="px-4 py-12 shadow-lg rounded-lg bg-gray-50 md:h-72 hover:opacity-90">
			<div className="bg-gray-700 p-[0.6rem] rounded-full mb-4 h-10 w-10 mx-auto">
				<Image
					src={imageSrc}
					width={30}
					height={30}
					className="w-full h-full"
					alt={title}
				/>
			</div>

			<h3 className="mt-4 text-xl font-medium text-gray-800">{title}</h3>

			<p className="mt-2 text-base text-gray-500">{description}</p>
		</div>
	);
}
export default DiscoverCard;
