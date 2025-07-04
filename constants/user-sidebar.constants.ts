import { ConnectionsSvg } from "../components/svgs/ConnectionsSvg";
import { DashboardSvg } from "../components/svgs/DashboardSvg";
import { FactiivitySvg } from "../components/svgs/FactiivitySvg";
import { FactsSvg } from "../components/svgs/FactsSvg";
import { ReportSvg } from "../components/svgs/ReportSvg";
import { ScoreDetailsSvg } from "../components/svgs/ScoreDetailsSvg";
import SidebarLink from "../types/sidebarLink.interface";

export const userSidebarConfig: SidebarLink[] = [
	{
		label: "dashboard",
		route: "/dashboard",
		SvgIcon: DashboardSvg,
		paths: ["/dashboard", "/empty", "/new-profile"],
	},
	{
		label: "my report",
		route: "/my-report",
		SvgIcon: ReportSvg,
		paths: ["/my-report"],
	},
	{
		label: "score details",
		route: "/score-details",
		SvgIcon: ScoreDetailsSvg,
		paths: ["/score-details"],
	},
	{
		label: "factiivity",
		route: "/factiivity",
		SvgIcon: FactiivitySvg,
		paths: ["/factiivity", "/trade-details"],
	},
	{
		label: "connections",
		route: "/connections",
		SvgIcon: ConnectionsSvg,
		paths: ["/connections", "/connection-details", "/new-connection"],
	},
	{
		label: "get FACT",
		route: "/get-fact",
		SvgIcon: FactsSvg,
		paths: ["/get-fact"],
	},
];
