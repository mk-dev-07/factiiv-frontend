import getConfig from "next/config";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useMemo } from "react";
import AccountPlaceholder from "../../../public/images/account.png";
import { IAdminCard } from "../../../types/adminCard.interface";
import { dateToString } from "../../../utils/date.utils";
import { ArrowRightSvg } from "../../svgs/ArrowRightSvg";

const AdminCard = ({
	name,
	email,
	joinedOn,
	itemsReviewed,
	linkTo,
	profileImg,
}: IAdminCard) => {
	const joinDateString = useMemo(() => {
		const joinDate: Date = new Date(joinedOn);
		if (!joinDate) {
			return "";
		}
		return dateToString(joinDate, {});
	}, [joinedOn]);
	const {
		publicRuntimeConfig: { rootUrl },
	} = getConfig();

	return (
		<Link href={linkTo} className="block hover:bg-gold-lighter">
			<div className="flex items-center px-4 py-4 sm:px-6">
				<div className="flex min-w-0 flex-1 items-center">
					<div className="h-12 w-12 relative rounded-full border-2 border-onyx flex shrink-0">
						<img
							className="h-full w-full object-cover rounded-full "
							src={
								profileImg
									? profileImg
									: AccountPlaceholder.src
							}
							alt="Account pic"
						/>
					</div>
					<div className="min-w-0 px-4 md:w-[600px] md:grid md:grid-cols-2 md:gap-12">
						<div>
							<p className="truncate text-lg font-bold text-onyx">{name}</p>
							<p className="mt-0 flex items-center text-sm text-onyx">
								<span className="truncate">{email}</span>
							</p>
						</div>
						<div className="hidden md:block">
							<div>
								<p className="text-sm text-gray-900">
									{" "}
									joined on{" "}
									<time>
										<b>{joinDateString}</b>
									</time>
								</p>
								{!!itemsReviewed && (
									<p className="mt-2 flex items-center text-sm text-onyx">
										{" "}
										items reviewed:&nbsp; <b>{itemsReviewed}</b>
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

export default AdminCard;
