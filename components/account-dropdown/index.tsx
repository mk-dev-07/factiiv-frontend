import Link from "next/link";
import { useEffect, useState } from "react";
import { useFactiivStore } from "../../store";
import ClickOutsideWrapper from "../click-outside";
import Image from "next/image";
import PlaceholderImage from "../../public/images/placeholder.png";
import AccountIcon from "../../public/images/account.png";
import { ArrowRightSvg } from "../svgs/ArrowRightSvg";
import getConfig from "next/config";

const AccountDropdown = () => {
	const store = useFactiivStore();
	const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
	const [name, setName] = useState("");
	const [imgSrc, setImgSrc] = useState("");
	const {
		publicRuntimeConfig: { rootUrl },
	} = getConfig();

	const { activeProfile } = store;

	useEffect(() => {
		setName(() => activeProfile?.businessName);

		if (!activeProfile.imagePath) {
			return;
		}

		setImgSrc(
			() =>
				activeProfile.imagePath 
		);
	}, [
		activeProfile?.businessName,
		activeProfile?.imagePath,
		store.pictureUploadedTimestamp,
	]);

	return (
		<div className="relative">
			<button
				id="account-dropdown"
				className="hidden md:block rounded-full bg-pearl dark:bg-onyx-light p-1 text-onyx dark:text-pearl-shade border-2 border-onyx shadow focus:outline-none focus:border-topaz dark:focus:border-topaz-light focus:ring-1 focus:ring-topaz"
				onClick={() => setIsAccountDropdownOpen(true)}
			>
				<span className="sr-only">Open account menu</span>
				<div className="h-8 w-8 rounded-full flex shrink-0">
					<img
						className="w-full h-full rounded-full object-cover"
						src={imgSrc ? imgSrc : PlaceholderImage.src}
						alt={`connection ${name || ""} image`}
					/>
				</div>
			</button>
			<ClickOutsideWrapper
				show={isAccountDropdownOpen}
				clickOutsideHandler={() => {
					setIsAccountDropdownOpen(false);
				}}
			></ClickOutsideWrapper>
			<div
				id="account-drop"
				aria-expanded="false"
				aria-label="Account dropdown"
				className={`sm:block absolute top-full duration-100 right-0 mt-3 rounded-md border-2 border-onyx bg-pearl dark:bg-onyx-light p-3 transform scale-y-90 scale-x-95 space-y-3 w-72 z-10 origin-top ${
					isAccountDropdownOpen
						? "opacity-100 block visible"
						: "opacity-0 hidden invisible"
				}`}
			>
				<div>
					<p>change business profile</p>
					<Link
						href="/profiles"
						className="block border-2 border-onyx rounded bg-pearl hover:bg-pearl-shade px-2 group"
					>
						<div className="flex py-2 items-center">
							<div className="relative h-12 w-12 flex shrink-0">
								<img
									className="relative h-12 w-12 rounded-full border-2 border-onyx object-cover"
									src={imgSrc ? imgSrc : PlaceholderImage.src}
									alt={`connection ${activeProfile?.businessName} image`}
								/>
							</div>
							<div className="ml-3">
								<p className="text-sm font-medium text-onyx">{name}</p>
							</div>
							<div className="ml-auto flex items-center justify-end">
								<ArrowRightSvg styleProps="h-8 w-8 text-onyx group-hover:translate-x-1 duration-300 rotate-180" />
							</div>
						</div>
					</Link>
				</div>
				<div className="pt-2">
					<p>useful links</p>
					<div className="grid grid-cols-2 gap-2 border-2 border-onyx rounded bg-pearl p-2 xs:px-6">
						<Link
							href="/edit-account"
							className="text-base font-medium text-onyx hover:text-gray-500 hover:underline hover:decoration-onyx hover:decoration-2"
						>
							edit account
						</Link>
						<Link
							href="/edit-business"
							className="text-base font-medium text-onyx hover:text-gray-500 hover:underline hover:decoration-onyx hover:decoration-2"
						>
							edit profile
						</Link>
						<Link
							href="/preferences"
							className="text-base font-medium text-onyx hover:text-gray-500 hover:underline hover:decoration-onyx hover:decoration-2"
						>
							preferences
						</Link>
						{/* <Link
							href="/docs"
							className="text-base font-medium text-onyx hover:text-gray-500 hover:underline hover:decoration-onyx hover:decoration-2"
						>
							docs
						</Link> */}
						{/* <Link
							href="/help-center"
							className="text-base font-medium text-onyx hover:text-gray-500 hover:underline hover:decoration-onyx hover:decoration-2"
						>
							help center
						</Link> */}
						<Link
							href="/terms"
							className="text-base font-medium text-onyx hover:text-gray-500 hover:underline hover:decoration-onyx hover:decoration-2"
						>
							terms
						</Link>
						<Link
							href="/privacy"
							className="text-base font-medium text-onyx hover:text-gray-500 hover:underline hover:decoration-onyx hover:decoration-2"
						>
							privacy
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AccountDropdown;
