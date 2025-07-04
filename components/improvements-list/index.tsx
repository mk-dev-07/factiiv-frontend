import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useFactiivStore } from "../../store";
import { Improvement } from "../../types/improvements.interface";
import animationData from "../../assets/lotties/confetti.json";
import Lottie from "react-lottie";
const ImprovementsList = ({
	change,
}: {
	change?: (improvements: Improvement[]) => void;
}) => {
	const store = useFactiivStore();
	const {
		activeProfile: {
			profileInfoStatus,
			isDocsReviewed,
			profileDocsStatus,
			einDocumentPath,
			aoiDocumentPath,
			googleBusiness,
			phoneListing,
			reviewedBy: profileReviewedBy,
			dataUnderReview,
			profileDataStatus,
			verifiedStatus,
		},
		activeProfileInfo: {
			id: infoId,
			reviewedBy: infoReviewedBy,
			infoUnderReview,
		},
	} = store;
	const [isAnimationPlaying, setIsAnimationPlaying] = useState(false);

	const improvements = useMemo<Improvement[]>(() => {
		const showSubmitBusinessDocs = !(einDocumentPath || aoiDocumentPath);

		const showDocsUnderReview =
			(einDocumentPath || aoiDocumentPath) && !isDocsReviewed;

		const showDocsNeedsAttention =
			(einDocumentPath || aoiDocumentPath) &&
			isDocsReviewed &&
			!profileDocsStatus;

		const showCompleteInformation = !infoId && !infoUnderReview;
		const showInformationUnderReview = !!infoId && infoUnderReview;

		const showInformationNeedsAttention =
			!!infoId && !!infoReviewedBy && !profileInfoStatus && !infoUnderReview;

		const showUpdateListings = !googleBusiness || !phoneListing;

		const showProfileNeedsAttention =
			!dataUnderReview && profileReviewedBy && !profileDataStatus;

		const show100Percent = profileDataStatus && profileDocsStatus && profileInfoStatus && !showUpdateListings && !showSubmitBusinessDocs && !showInformationUnderReview && !showCompleteInformation;

		return [
			{
				importanceClass: "bg-red-300",
				label: "submit business documentation",
				link: "/edit-business#documentation",
				show: showSubmitBusinessDocs,
			},
			{
				importanceClass: "bg-red-300",
				label: "documentations are under review",
				link: "/edit-business#documentation",
				show: showDocsUnderReview,
			},
			{
				importanceClass: "bg-red-300",
				label: "documentations need more attention",
				link: "/edit-business#documentation",
				show: showDocsNeedsAttention,
			},
			{
				importanceClass: "bg-yellow-300",
				label: "complete information",
				link: "/information",
				show: showCompleteInformation,
			},
			{
				importanceClass: "bg-green-300",
				label: "your information is under review",
				link: "/information",
				interactive: false,
				show: showInformationUnderReview,
			},
			{
				importanceClass: "bg-yellow-300",
				label: "your information needs more attention",
				link: "/information",
				show: showInformationNeedsAttention,
			},
			{
				importanceClass: "bg-yellow-300",
				label: "update listings",
				link: "/edit-business#listings",
				show: showUpdateListings,
			},
			{
				importanceClass: "bg-red-300",
				label: "your profile needs attention",
				link: "/edit-business",
				show: showProfileNeedsAttention,
			},
			{
				importanceClass: "bg-green-300",
				label: (
					<p>
						you&apos;re{" "}
						<strong>100% factiiv verified!</strong>
						 {" "}If there is ever further information needed you&apos;ll see it here.
					</p>
				),
				link: "/information",
				interactive: false,
				show: show100Percent,
				name: "verified",
			},
		];
	}, [
		einDocumentPath,
		aoiDocumentPath,

		googleBusiness,
		phoneListing,

		profileReviewedBy,
		profileDataStatus,
		profileDocsStatus,
		dataUnderReview,

		infoId,
		profileInfoStatus,
		infoReviewedBy,
	]);

	const renderVerifiedIcon = useCallback(() => {
		const defaultOptions = {
			loop: true,
			animationData: animationData,
			rendererSettings: {
				preserveAspectRatio: "xMidYMid slice",
			},
		};
		return (
			<div className="rounded-full border-2 border-onyx bg-topaz-light relative h-12 w-12 flex-none mr-3">
				<div className="absolute -left-5 -top-14">
					<div style={{ width: 120, height: 120, position: "relative" }}>
						<Lottie options={defaultOptions} isStopped={!isAnimationPlaying} />
					</div>
				</div>
			</div>
		);
	}, [isAnimationPlaying]);

	useEffect(() => {
		if (!change) return;
		change(improvements);
	}, [improvements]);

	return (
		<ul className="space-y-3 text-base">
			{improvements.map(
				(
					{ label, link, importanceClass, show, interactive = true, name = "" },
					index
				) => (
					<li key={`${link}-${index}`} className={`${show ? "" : "hidden"}`}>
						{interactive ? (
							<Link
								href={link}
								className="border-2 border-onyx text-onyx dark:text-white font-medium py-2 px-6 block leading-tight rounded bg-gold hover:bg-opacity-20 bg-opacity-10 relative"
							>
								<div
									className={`border-2 border-onyx ${importanceClass} h-3 w-3 absolute left-[2px] top-[2px] rounded-sm`}
								></div>
								{label}
							</Link>
						) : (
							<div
								className="border-2 cursor-default transition-shadow duration-300 hover:ring-4 hover:ring-topaz border-onyx focus:ring-4 focus:ring-topaz rounded flex items-start space-x-3 bg-topaz-lighter p-3"
								onMouseEnter={() => setIsAnimationPlaying(true)}
								onMouseLeave={() => setIsAnimationPlaying(false)}
							>
								{name ? (
									renderVerifiedIcon()
								) : (
									<div
										className={`border-2 border-onyx ${importanceClass} h-3 w-3 absolute left-[2px] top-[2px] rounded-sm`}
									></div>
								)}
								{label}
							</div>
						)}
					</li>
				)
			)}
		</ul>
	);
};

export default ImprovementsList;
