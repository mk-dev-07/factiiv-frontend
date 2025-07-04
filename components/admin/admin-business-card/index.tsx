import Image from "next/image";
import React from "react";
import AccountPlaceholder from "../../../public/images/account.png";
import { ArrowRightSvg } from "../../svgs/ArrowRightSvg";
import getConfig from "next/config";

interface IBusinessCard {
	businessName: string;
	ownerName: string;
	createdAt: string;
	numberOfTrades: number;
	imagePath?: string;
}

const AdminBusinessCard = ({
	businessName,
	ownerName,
	createdAt,
	numberOfTrades,
	imagePath,
}: IBusinessCard) => {
	const {
		publicRuntimeConfig: { rootUrl },
	} = getConfig();

	return (
		<div className="block hover:bg-gold-lighter">
			<div className="flex items-center px-4 py-4 sm:px-6">
				<div className="flex min-w-0 flex-1 items-center">
					<div className="flex-shrink-0">
						<img
							className="h-12 w-12 rounded-full"
							src={
								imagePath
									? imagePath
									: AccountPlaceholder.src
							}
							alt="Business pic"
							style={{ objectFit: "cover" }}
						/>
					</div>
					<div className="min-w-0 px-4 md:w-[600px] md:grid md:grid-cols-2 md:gap-12">
						<div>
							<p className="truncate text-lg font-bold text-onyx">
								{businessName}
							</p>
							<p className="mt-0 flex items-center text-sm text-onyx">
								<span className="truncate">
									owner: {ownerName ? ownerName : "no owner name"}
								</span>
							</p>
						</div>
						<div className="hidden md:block">
							<div>
								<p className="text-sm text-gray-900">
									{" "}
									created{" "}
									<time>
										<b>{createdAt}</b>
									</time>
								</p>
								<p className="mt-2 flex items-center text-sm text-onyx">
									{" "}
									trades:&nbsp; <b>{numberOfTrades}</b>
								</p>
							</div>
						</div>
					</div>
				</div>
				<div>
					<ArrowRightSvg styleProps="h-6 w-6 text-onyx" />
				</div>
			</div>
		</div>
	);
};

export default AdminBusinessCard;
