import Image from "next/image";
import Link from "next/link";
import React from "react";
import AccountPlaceholder from "../../../public/images/account.png";
import { IAdminAccountCard } from "../../../types/adminAccountCard.interface";
import { ArrowRightSvg } from "../../svgs/ArrowRightSvg";

const AdminAccountCard = ({
	name,
	email,
	joinedOn,
	numberOfBusinesses,
	linkTo,
	suspended = false,
	imagePath,
}: IAdminAccountCard) => {
	const date: Date = new Date(joinedOn);

	const options: Intl.DateTimeFormatOptions = {
		year: "numeric",
		month: "long",
		day: "numeric",
	};

	const formattedDate: string = date.toLocaleDateString("en-US", options);

	if (!linkTo) return null;

	return (
		<Link href={linkTo} target="_blank" className="block hover:bg-gold-lighter">
			<div className="flex items-center px-4 py-4 sm:px-6">
				<div className="flex min-w-0 flex-1 items-center">
					<div className="flex-shrink-0">
						<img
							className="h-12 w-12 rounded-full"
							src={imagePath? imagePath : AccountPlaceholder.src}
							alt="Account pic"
						/>
					</div>
					<div className="min-w-0 px-4 md:w-[600px] md:grid md:grid-cols-2 md:gap-12">
						<div>
							<p className="truncate text-lg font-bold text-onyx">{name}</p>
							<p className="mt-0 flex items-center text-sm text-onyx">
								<span className="truncate">{email}</span>
							</p>
							{suspended && 
							<p className="mt-0 flex items-center text-sm text-onyx">
								<span className="text-red-400">status: suspended</span>
							</p>
							}
						</div>
						<div className="hidden md:block">
							<div>
								<p className="text-sm text-gray-900">
									{" "}
									joined on{" "}
									<time>
										<b>{formattedDate}</b>
									</time>
								</p>
								{!!numberOfBusinesses && (
									<p className="mt-2 flex items-center text-sm text-onyx">
										{" "}
										businesses:&nbsp; <b>{numberOfBusinesses}</b>
									</p>
								)}
							</div>
						</div>
					</div>
				</div>
				<div>
					<ArrowRightSvg styleProps="h-6 w-6 text-onyx" />
				</div>
			</div>
		</Link>
	);
};

export default AdminAccountCard;
