import Image from "next/image";
import Link from "next/link";
import { IFeatureCardProps } from "@/types/app/component-props";
import { Button } from "@/components/ui/button";

const FeatureCard = ({ featureLink }: IFeatureCardProps) => {
	const { title, description, label, href, imageSrc } = featureLink;

	return (
		<div className="text-center">
			<div className="p-4 rounded-lg mb-4 flex items-center justify-center h-48">
				<Image
					src={imageSrc}
					width={400}
					height={400}
					className="w-full h-full object-contain"
					alt={title}
				/>
			</div>

			<h3 className="text-xl font-semibold mb-2">{title}</h3>

			<p className="mb-4">{description}</p>

			<Link
				href={href}
				scroll={false}
			>
				<Button
					variant="outline"
					size="lg"
				>
					{label}
				</Button>
			</Link>
		</div>
	);
};
export default FeatureCard;
