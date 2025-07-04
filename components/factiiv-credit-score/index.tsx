import { ScoreSvg } from "../svgs/ScoreSvg";
import Tooltip from "../tooltip";

interface FactiivCreditScoreProps {
	factiivScore: number;
	reputationScore: number;
	historyScore: number;
	utilizationScore: number;
}

const FactiivCreditScore = ({
	factiivScore = 0,
	reputationScore = 0,
	historyScore = 0,
	utilizationScore = 0,
}: FactiivCreditScoreProps) => {
	const asFixedLength = (value: number) => {
		if (isNaN(value) || isNaN(parseFloat("" + value))) {
			return 0;
		}

		return parseFloat(value?.toFixed(1)) ?? 0;
	};

	// This is the logic for the score text that appears below the score
	let scoreText = "poor"; // Default score text for factiivScore <= 250
	if (factiivScore > 250 && factiivScore <= 500) {
		scoreText = "needs improvement";
	} else if (factiivScore > 500 && factiivScore <= 750) {
		scoreText = "looking good";
	} else if (factiivScore > 750 && factiivScore < 1000) {
		scoreText = "excellent!";
	} else if (factiivScore === 1000) {
		scoreText = "incredible!";
	}

	return (
		<>
			<div className="pb-2">
				<h2 className="relative font-medium text-center text-base xs:text-lg sm:text-xl md:text-2xl lg:text-xl 2xl:text-2xl text-onyx">
					factiiv score{" "}
					<Tooltip text="your factiiv score can range from 0 to 1000. the more payments you make on time the higher you score will get" />
				</h2>
			</div>
			<ScoreSvg factiivScore={asFixedLength(factiivScore) || 0} />
			<div className="h-8 animate-fade-in  ">
				<p className="text-center w-full font-medium font-prox text-base sm:text-lg md:text-xl pt-2 bg-transparent">
					{scoreText}
				</p>
			</div>
			<div className="mt-1 mb-4">
				<div className="relative group">
					<h4 className="replative text-xs z-[2] tracking-wider text-onyx dark:text-pearl">
						reputation{" "}
						<Tooltip text="reputation represents how verified your account is. look for improvements to increase reputation." />
					</h4>
					<div className="bg-pearl-shade dark:bg-onyx h-4 w-full rounded-sm relative overflow-hidden box-border">
						<div
							className="reputation-score-slider w-full h-4 border-2 duration-1000 delay-[2000ms] border-onyx-light absolute bg-gold"
							style={{
								transform: `translateX(-${
									100 - (asFixedLength(reputationScore) || 0)
								}%)`,
							}}
						></div>
						<div className="w-full h-4 border-2 border-onyx-light absolute inset-0"></div>
					</div>
				</div>
				<div className="relative group">
					<h4 className="text-xs z-[2] tracking-wider text-onyx dark:text-pearl">
						history{" "}
						<Tooltip text="history shows your on-time payments. the less late payments you have, the higher this score will be." />
					</h4>
					<div className="bg-pearl-shade dark:bg-onyx h-4 w-full rounded-sm relative overflow-hidden box-border">
						<div
							className="w-full h-4 border-2 duration-1000 delay-[2000ms] border-onyx-light absolute bg-gold"
							style={{
								transform: `translate(-${
									100 - (asFixedLength(historyScore) || 0)
								}%)`,
							}}
						></div>
						<div className="w-full h-4 border-2 border-onyx-light absolute inset-0"></div>
					</div>
				</div>
				<div className="relative group">
					<h4 className="text-xs z-[2] tracking-wider text-onyx dark:text-pearl">
						utilization{" "}
						<Tooltip text="utilization represents how much of your credit limit you are using. the lower your utilization the higher your score." />
					</h4>
					<div className="bg-pearl-shade dark:bg-onyx h-4 w-full rounded-sm relative overflow-hidden box-border">
						<div
							className="w-full h-4 border-2 duration-1000 delay-[2000ms] border-onyx-light absolute bg-gold"
							style={{
								transform: `translate(-${
									asFixedLength(100 - utilizationScore) || 0
								}%)`,
							}}
						></div>
						<div className="w-full h-4 border-2 border-onyx-light absolute inset-0"></div>
					</div>
				</div>
			</div>
		</>
	);
};

export default FactiivCreditScore;
