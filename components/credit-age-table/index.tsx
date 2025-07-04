import Link from "next/link";
import { PropsWithoutRef, useEffect, useMemo } from "react";
import {
	HeaderCell,
	TableColumnDef,
	CreditAgeTableData,
} from "../../types/score-details.interface";

const CreditAgeTable = ({ data = [] }: { data: CreditAgeTableData[] }) => {
	const columns: TableColumnDef[] = [
		{ id: "connection", label: "connection" },
		{ id: "type", label: "type" },
		{ id: "openDate", label: "open date" },
		{ id: "closeDate", label: "close date" },
		{ id: "view", label: "view", hidden: true },
	];

	const sortedData = useMemo(() => {
		if (!data) return [];

		return data.sort(
			({ openDate: dateA }, { openDate: dateB }) =>
				(new Date(dateB)?.getTime?.() ?? 0) -
				(new Date(dateA)?.getTime?.() ?? 0)
		);
	}, [data]);

	const HeaderCell = ({ label, hidden }: HeaderCell) =>
		hidden ? (
			// hidden header cell
			<th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6 md:pr-0">
				<span className="sr-only">{label}</span>
			</th>
		) : (
			<th
				scope="col"
				className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-onyx sm:pl-6 md:pl-3"
			>
				{label}
			</th>
		);

	const CellView = ({ viewLink }: PropsWithoutRef<{ viewLink: string }>) => (
		<td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-center text-sm font-medium sm:pr-6 md:pr-0">
			<Link
				href={{ pathname: viewLink }}
				className="text-topaz hover:text-topaz-dark"
			>
				view <span className="sr-only"></span>
			</Link>
		</td>
	);

	const renderCell = (value: boolean | string, data: CreditAgeTableData) => {
		if (value === data.id) {
			return <td className="hidden w-0 h-0" key={data.id}></td>;
		}

		if (value === null || value === undefined) {
			return <span>N/A</span>;
		}

		if (typeof value === "string" && value.includes("/trade-details/")) {
			return <CellView key={data.id} viewLink={data.view}></CellView>;
		}

		return (
			<td
				key={data.id}
				className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-onyx sm:pl-6 md:pl-3"
			>
				{"" + value}
			</td>
		);
	};

	return (
		<>
			{!data.length && <p className="p-3 text-center">Currently there is nothing to display here. Once you establish some tradelines, they will be listed here.</p>}

			{!!data.length && (
				<table className="min-w-full divide-y divide-onyx">
					<thead>
						<tr>
							{columns.map(({ id, label, hidden }) => (
								<HeaderCell key={id} label={label} hidden={hidden}></HeaderCell>
							))}
						</tr>
					</thead>
					<tbody className="divide-y divide-onyx">
						{(sortedData ?? [])?.map((row) => (
							<tr key={row.id} className="hover:bg-gold-lightest">
								{Object.values(row).map((value) => renderCell(value, row))}
							</tr>
						))}
						{/* <tr className="hover:bg-gold-lightest">
							<td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-onyx sm:pl-6 md:pl-3">
								Tools R Us
							</td>
							<td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-onyx sm:pl-6 md:pl-3">
								685431
							</td>
							<td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-onyx sm:pl-6 md:pl-3">
								1/22/2023
							</td>
							<td className="whitespace-nowrap py-4 px-3 text-sm text-gray-500">
								N/A
							</td>
							<td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-center text-sm font-medium sm:pr-6 md:pr-0">
								<a
									href="/trade-detail"
									className="text-topaz hover:text-topaz-dark"
								>
									view <span className="sr-only"></span>
								</a>
							</td>
						</tr> */}
					</tbody>
				</table>
			)}
		</>
	);
};

export default CreditAgeTable;
