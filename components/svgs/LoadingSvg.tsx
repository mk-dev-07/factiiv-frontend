export const LoadingSvg = () => (
	<svg
		width="100"
		height="100"
		preserveAspectRatio="xMidYMid"
		className="block mx-auto"
		strokeWidth="2"
	>
		<g transform="rotate(180 50 50)" stroke="currentColor">
			<rect rx="0.5" x="12.5" y="15" width="15" height="40" fill="#EFBC73">
				<animate
					attributeName="height"
					values="50;70;30;50"
					keyTimes="0;0.33;0.66;1"
					dur="2.5s"
					repeatCount="indefinite"
					calcMode="spline"
					keySplines="0.5 0 0.5 1;0.5 0 0.5 1;0.5 0 0.5 1"
					begin="-1.08s"
				></animate>
			</rect>
			<rect rx="0.5" x="12.5" y="15" width="15" height="20" fill="#409AF4">
				<animate
					attributeName="height"
					values="40;60;20;40"
					keyTimes="0;0.33;0.66;1"
					dur="2.5s"
					repeatCount="indefinite"
					calcMode="spline"
					keySplines="0.5 0 0.5 1;0.5 0 0.5 1;0.5 0 0.5 1"
					begin="-1.08s"
				></animate>
			</rect>
			<rect rx="0.5" x="32.5" y="15" width="15" height="40" fill="#EFBC73">
				<animate
					attributeName="height"
					values="50;20;60;50"
					keyTimes="0;0.33;0.66;1"
					dur="2.5s"
					repeatCount="indefinite"
					calcMode="spline"
					keySplines="0.5 0 0.5 1;0.5 0 0.5 1;0.5 0 0.5 1"
					begin="-0.5s"
				></animate>
			</rect>
			<rect rx="0.5" x="32.5" y="15" width="15" height="40" fill="#409AF4">
				<animate
					attributeName="height"
					values="40;10;50;40"
					keyTimes="0;0.33;0.66;1"
					dur="2.5s"
					repeatCount="indefinite"
					calcMode="spline"
					keySplines="0.5 0 0.5 1;0.5 0 0.5 1;0.5 0 0.5 1"
					begin="-0.5s"
				></animate>
			</rect>
			<rect rx="0.5" x="52.5" y="15" width="15" height="40" fill="#EFBC73">
				<animate
					attributeName="height"
					values="50;70;30;50"
					keyTimes="0;0.33;0.66;1"
					dur="2.5s"
					repeatCount="indefinite"
					calcMode="spline"
					keySplines="0.5 0 0.5 1;0.5 0 0.5 1;0.5 0 0.5 1"
					begin="-1.6s"
				></animate>
			</rect>
			<rect rx="0.5" x="52.5" y="15" width="15" height="40" fill="#409AF4">
				<animate
					attributeName="height"
					values="40;60;20;40"
					keyTimes="0;0.33;0.66;1"
					dur="2.5s"
					repeatCount="indefinite"
					calcMode="spline"
					keySplines="0.5 0 0.5 1;0.5 0 0.5 1;0.5 0 0.5 1"
					begin="-1.6s"
				></animate>
			</rect>
			<rect rx="0.5" x="72.5" y="15" width="15" height="40" fill="#EFBC73">
				<animate
					attributeName="height"
					values="50;70;30;50"
					keyTimes="0;0.33;0.66;1"
					dur="2.5s"
					repeatCount="indefinite"
					calcMode="spline"
					keySplines="0.5 0 0.5 1;0.5 0 0.5 1;0.5 0 0.5 1"
					begin="-2.5s"
				></animate>
			</rect>
			<rect rx="0.5" x="72.5" y="15" width="15" height="40" fill="#409AF4">
				<animate
					attributeName="height"
					values="40;60;20;40"
					keyTimes="0;0.33;0.66;1"
					dur="2.5s"
					repeatCount="indefinite"
					calcMode="spline"
					keySplines="0.5 0 0.5 1;0.5 0 0.5 1;0.5 0 0.5 1"
					begin="-2.5s"
				></animate>
			</rect>
		</g>
	</svg>
);
