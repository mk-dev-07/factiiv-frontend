import React, { useEffect, useState } from "react";
import Image from "next/image";
import AccountIcon from "../../../public/images/account.png";
import { useAdminStore } from "../../../store";
import ClickOutsideWrapper from "../../click-outside";
import { useRouter } from "next/navigation";
import { useQuery } from "react-query";
import { useAuthenticatedFetch } from "../../../hooks/useAuthenticatedFetch";
import getConfig from "next/config";
import { IAdmin } from "../../../types/admin.interface";

const AdminAccountDropdown = () => {
	const router = useRouter();
	const adminStore = useAdminStore();
	const { admin } = adminStore || {};
	const { refreshedFetch } = useAuthenticatedFetch({ isAdmin: true });

	const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
	const [adminInfo, setAdminInfo] = useState<IAdmin | null>();
	const [adminImage, setAdminImage] = useState("");

	const {
		publicRuntimeConfig: { rootUrl },
	} = getConfig();

	const handleEdit = () => {
		router.push("/admin/edit-user");
	};

	useEffect(() => {
		setAdminInfo(admin);
	}, []);

	useEffect(()=> {
		if (!admin?.imagePath) return;

		setAdminImage(			
			admin?.imagePath
		);
	}, [admin, admin?.imagePath]);

	return (
		<div className="relative">
			<button
				id="admin-account-dropdown"
				className="hidden md:block rounded-full bg-pearl dark:bg-onyx-light p-1 text-onyx dark:text-pearl-shade border-2 border-onyx shadow focus:outline-none focus:border-topaz dark:focus:border-topaz-light focus:ring-1 focus:ring-topaz"
				onClick={() => setIsAccountDropdownOpen(true)}
			>
				<span className="sr-only">Open admin account menu</span>
				<div className="h-8 w-8 relative rounded-full border-2 border-onyx">
					<img
						className="h-full w-full rounded-full"
						src={adminImage ? adminImage : AccountIcon.src}
						alt={`${adminInfo?.firstName ?? ""} ${adminInfo?.lastName ?? ""}`}
						style={{ objectFit: "cover" }}
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
				aria-label="Admin account dropdown"
				className={`sm:block absolute top-full duration-100 right-0 mt-3 rounded-md border-2 border-onyx bg-pearl dark:bg-onyx-light p-3 transform scale-y-90 scale-x-95 space-y-3 w-72 z-10 origin-top ${
					isAccountDropdownOpen
						? "opacity-100 block visible"
						: "opacity-0 hidden invisible"
				}`}
			>
				<p>logged in as</p>
				<button
					id="admin-edit"
					onClick={handleEdit}
					className="block w-full border-2 border-onyx rounded bg-pearl hover:bg-pearl-shade px-2 group"
				>
					<div className="flex py-2 items-center">
						<div className="h-12 w-12 relative rounded-full border-2 border-onyx">
							<img
								className="h-full w-full object-cover rounded-full"
								src={adminImage ? adminImage : AccountIcon.src}
								alt={`connection ${adminInfo?.firstName} ${adminInfo?.lastName} image`}
							/>
						</div>
						<div className="ml-3 mr-3">
							<p className="text-sm font-medium text-onyx">
								{`${adminInfo?.username}`}
							</p>
						</div>
						<div className="ml-auto flex items-center justify-end">
							<div className="border-2 border-onyx p-1 text-sm rounded px-2">
								edit
							</div>
						</div>
					</div>
				</button>
			</div>
		</div>
	);
};

export default AdminAccountDropdown;
