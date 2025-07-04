import Link from "next/link";
import AdminAccountSvg from "../../svgs/AdminAccountSvg";
import { ArrowRightSvg } from "../../svgs/ArrowRightSvg";
import Image from "next/image";
import getConfig from "next/config";

const BusinessListingsCard = ({
	businessName,
	businessOwner,
	createdAt,
	tradesNumber,
	profileImgURL,
	linkTo,
}: {
	businessName: string;
	businessOwner: string;
	createdAt: string;
	tradesNumber: number;
	profileImgURL: string;
	linkTo?: string;
}) => {
	const date: Date = new Date(createdAt);

	const options: Intl.DateTimeFormatOptions = {
		year: "numeric",
		month: "long",
		day: "numeric",
	};

	const formattedDate: string = date.toLocaleDateString("en-US", options);

	const {
		publicRuntimeConfig: { rootUrl },
	} = getConfig();

	if (!linkTo) return null;

	return (
		<Link href={linkTo} className="block hover:bg-gold-lighter">
			<div className="flex items-center px-4 py-4 sm:px-6">
				<div className="flex min-w-0 flex-1 items-center">
					<div className="w-12 h-12 rounded-full">
						<div className="relative h-12 w-12 flex shrink-0 hidden sm:flex rounded-full border-2 border-onyx bg-gold-light items-center justify-center">
							{profileImgURL ? (
								<img
									src={profileImgURL}
									alt={
										businessName
											? businessName + "profile picture"
											: "business logo"
									}
									className="rounded-full w-full h-full object-cover"
								/>
							) : (
								<AdminAccountSvg />
							)}
						</div>
					</div>
					<div className="min-w-0 px-4 md:w-[600px] md:grid md:grid-cols-2 md:gap-12">
						<div>
							<p className="truncate text-lg font-bold text-onyx">
								{businessName}
							</p>
							<p className="mt-0 flex items-center text-sm text-onyx">
								<span className="truncate">owner: {businessOwner}</span>
							</p>
						</div>
						<div className="hidden md:block">
							<div>
								<p className="text-sm text-gray-900">
									created:
									<time>
										<b> {formattedDate}</b>
									</time>
								</p>
								<p className="mt-2 flex items-center text-sm text-onyx">
									trades:&nbsp; <b>{tradesNumber}</b>
								</p>
							</div>
						</div>
					</div>
				</div>
				<div>
					<ArrowRightSvg styleProps={""} />
				</div>
			</div>
		</Link>
	);
};

export default BusinessListingsCard;
