import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import dynamic from "next/dynamic";
interface ISidebarLink {
	pathLabel: string;
	linkTo: string;
	svgIcon: JSX.Element;
	paths?: string[];
}

const SidebarLink = ({ pathLabel, linkTo, svgIcon, paths }: ISidebarLink) => {
	const router = useRouter();
	const activeTabStyle =
		"rounded-sm border-2 border-onyx bg-gold text-onyx sm:h-12 h-10 sm:w-12 w-10 flex items-center justify-center mr-2 scale-110";
	const inactiveTabStyle =
		"rounded border-2 border-transparent sm:h-12 h-10 sm:w-12 w-10 flex items-center justify-center mr-2 transition-transform duration-150 scale-90 group-hover:scale-110";
	const handleNavigation = (link: string) => {
		router.push(link);
	};

	return (
		<button
			onClick={() => handleNavigation(linkTo)}
			className="cursor-pointer group text-onyx dark:text-pearl-shade flex items-center p-1 sm:px-2 sm:py-2 text-lg font-medium"
		>
			<div
				className={
					paths?.includes(router.pathname) ? activeTabStyle : inactiveTabStyle
				}
			>
				{svgIcon}
			</div>
			{pathLabel}
		</button>
	);
};

export default dynamic(() => Promise.resolve(SidebarLink), { ssr: false });
