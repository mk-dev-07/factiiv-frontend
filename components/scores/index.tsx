import React, { useEffect, useMemo, useState } from "react";
import {
	informationScoreProperties,
	score5PointProperties,
} from "../../constants/scores.constants";
import { useFactiivStore } from "../../store";
import FactiivCreditScore from "../factiiv-credit-score";
import { ScoreSvg } from "../svgs/ScoreSvg";
import { ScoreVerifiedSvg } from "../svgs/ScoreVerifiedSvg";
import { ShareSvg } from "../svgs/ShareSvg";
import Tooltip from "../tooltip";

const Scores = () => {
	const store = useFactiivStore();
	const { activeProfile, activeProfileInfo } = store;

	const documentationScoreValue = useMemo(() => {
		const { aoiDocumentApproved, einDocumentApproved } = activeProfile;

		let score = 0;
		if (aoiDocumentApproved) score += 50;
		if (einDocumentApproved) score += 50;

		return score;
	}, [activeProfile.aoiDocumentApproved, activeProfile.einDocumentApproved]);

	const listingsScoreValue = useMemo(() => {
		const { isGoogleBusiness, isPhoneListing } = activeProfile;

		let score = 0;
		if (isGoogleBusiness) score += 50;
		if (isPhoneListing) score += 50;

		return score;
	}, [activeProfile.isGoogleBusiness, activeProfile.isPhoneListing]);

	const informationScoreValue = useMemo(() => {
		const profileData = { ...activeProfile, ...activeProfileInfo };
		let score = Object.entries(profileData)
			.filter(([key]) =>
				[...informationScoreProperties, ...score5PointProperties].includes(key)
			)
			.reduce((acc, [key, value]) => {
				if (score5PointProperties.includes(key) && value === true) {
					return acc + 5;
				}

				if (value === true) {
					return acc + 1;
				}

				return acc;
			}, 0);

		// these four properties only apply 1 point sif any single one of them is true
		if (
			activeProfileInfo.isLinesOfCredit ||
			activeProfileInfo.isBusinessCreditCards ||
			activeProfileInfo.isSbaLoans ||
			activeProfileInfo.isVendorAccounts
		) {
			score += 1;
		}

		// total max score 25 + 6 + 1 = 32
		return score * (100 / 32);
	}, [
		activeProfile.profileDataStatus,
		activeProfile.profileInfoStatus,

		activeProfile.isBusinessName,
		// activeProfile.isIsOwner,
		// activeProfile.isOwnerName,
		// activeProfile.isIndustry,
		// activeProfile.isStreet,
		// activeProfile.isCity,
		// activeProfile.isState,
		// activeProfile.isZip,
		// activeProfile.isCountry,
		activeProfile.isPhoneNumber,
		activeProfile.isWebsite,
		activeProfile.isEmail,
		activeProfile.isEin,
		activeProfileInfo.isState,
		activeProfileInfo.isBusinessSize,
		activeProfileInfo.isBusinessStartDate,
		activeProfileInfo.isCreditChecked,
		activeProfileInfo.knowledgeHowCreditWorks,
		activeProfileInfo.isInterestInFunding,
	]);

	const [
		{
			factiivScore,
			reputationScore,
			historyScore,
			utilizationScore,
			documentationScore,
			listingsScore,
			informationScore,
		},
		setScores,
	] = useState({
		factiivScore: 0,
		reputationScore: 0,
		historyScore: 0,
		utilizationScore: 0,
		documentationScore: 0,
		listingsScore: 0,
		informationScore: 0,
	});

	const getMessageOrVerified = useMemo(() => {
		if (reputationScore === 100) {
			return ["amazing", "great job", "perfect", "well done"].at(
				Math.floor(Math.random() * 4)
			);
		}

		return "verified";
	}, [reputationScore]);

	useEffect(() => {
		const { factiivScore, reputationScore, historyScore, utilizationScore } =
			activeProfile;
		setScores({
			factiivScore,
			reputationScore,
			historyScore,
			utilizationScore,
			documentationScore: documentationScoreValue,
			listingsScore: listingsScoreValue,
			informationScore: informationScoreValue,
		});
	}, [activeProfile]);

	return (
		<>
			{/* factiiv credit score section */}
			<div>
				<FactiivCreditScore
					factiivScore={factiivScore ?? 0}
					reputationScore={reputationScore ?? 0}
					historyScore={historyScore ?? 0}
					utilizationScore={utilizationScore ?? 0}
				></FactiivCreditScore>
				<a href="/my-report" className="relative group">
					<span className="bg-topaz z-[2] relative group-hover:-translate-y-1 focus:-translate-y-1 focus:outline-none transition-transform text-white border-2 border-onyx rounded text-sm xs:text-lg font-medium py-3 px-6 w-full flex items-center justify-center space-x-4">
						<ShareSvg />
						<span>share my report</span>
					</span>
					<span className="absolute inset-0 bg-onyx z-[1] rounded"></span>
				</a>
			</div>
			{/* reputation score */}
			<div>
				<div className="pb-2">
					<h2 className="relative font-medium text-center text-base xs:text-lg sm:text-xl md:text-2xl lg:text-xl 2xl:text-2xl">
						{reputationScore !== 100 && "verification"}
						{reputationScore === 100 && "reputation score"}{" "}
						<Tooltip
							text={`Your
							${reputationScore !== 100 ? "verification score" : "reputation score"}
							is based on the information you have provided to us. The more
							information you provide, the higher your score will be.`}
						/>
					</h2>
				</div>
				<ScoreVerifiedSvg reputationScore={reputationScore ?? 0} />
				<div className="h-8 animate-fade-in">
					<p className="text-center w-full font-medium font-prox text-base sm:text-lg md:text-xl pt-2 bg-transparent">
						{reputationScore === 100 ? getMessageOrVerified : "verified"}
					</p>
				</div>
				<div className="mt-1 mb-4">
					<div className="relative group">
						<h4 className="text-xs z-[2] tracking-wider text-onyx dark:text-pearl">
							documentation{" "}
							<Tooltip text="other users are more likely to trust you if you have legal documents. upload EIN and articles of incorporation documents to increase this score." />
						</h4>
						<div className="bg-pearl-shade dark:bg-onyx h-4 w-full rounded-sm relative overflow-hidden box-border">
							<div
								className="documentation-score-slider w-full h-4 border-2 duration-1000 delay-[2000ms] border-onyx-light absolute bg-topaz"
								style={{
									transform: `translateX(-${100 - documentationScore}%)`,
								}}
							></div>
							<div className="w-full h-4 border-2 border-onyx-light absolute inset-0"></div>
						</div>
					</div>
					<div className="relative group">
						<h4 className="text-xs z-[2] tracking-wider text-onyx dark:text-pearl">
							information{" "}
							<Tooltip text="the more we know about your business the better. complete information under improvements to make sure you get maximum points on this score." />
						</h4>
						<div className="bg-pearl-shade dark:bg-onyx h-4 w-full rounded-sm relative overflow-hidden box-border">
							<div
								className=" w-full h-4 border-2 duration-1000 delay-[2000ms] border-onyx-light absolute bg-topaz"
								style={{
									transform: `translateX(-${100 - informationScore}%)`,
								}}
							></div>
							<div className="w-full h-4 border-2 border-onyx-light absolute inset-0"></div>
						</div>
					</div>
					<div className="relative group">
						<h4 className="text-xs z-[2] tracking-wider text-onyx dark:text-pearl">
							listings{" "}
							<Tooltip text="add the link to your google listing and list yourself in the 411 directory to get the highest score." />
						</h4>
						<div className="bg-pearl-shade dark:bg-onyx h-4 w-full rounded-sm relative overflow-hidden box-border">
							<div
								className="listings-score-slider w-full h-4 border-2 duration-1000 delay-[2000ms] border-onyx-light absolute bg-topaz"
								style={{ transform: `translateX(-${100 - listingsScore}%)` }}
							></div>
							<div className="w-full h-4 border-2 border-onyx-light absolute inset-0"></div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default Scores;
