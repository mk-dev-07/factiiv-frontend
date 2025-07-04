import { industry } from "../../../constants/industry.constants";
import { useFactiivStore } from "../../../store";
import Profile from "../../../types/profile.interface";

const IndustryFormField = ({
	formik,
	profile,
	isAdmin = false,
}: {
	formik: any;
	profile?: Profile;
	isAdmin?: boolean,
}) => {
	return (
		<div className="col-span-6 lg:col-span-3">
			<div>
				<label htmlFor="industry" className="block font-medium text-onyx">
					vertical
				</label>
				<div className="mt-1">
					<select
						id="industry"
						name="industry"
						onChange={formik.handleChange}
						disabled={!!profile?.country && !isAdmin && profile.dataUnderReview}
						onBlur={formik.handleBlur}
						value={formik.values.industry}
						className="block w-full !text-lg placeholder:text-lg bg-white appearance-none rounded border-2 border-onyx px-3 py-3 focus:border-topaz focus:outline-none sm:text-sm"
					>
						<option value="" disabled>
							select your business vertical
						</option>
						{industry.map((industry) => (
							<option key={industry} value={industry}>
								{industry}
							</option>
						))}
					</select>
					{formik.touched.industry && formik.errors.industry ? (
						<div className="text-red-500">{formik.errors.industry}</div>
					) : null}
					{!isAdmin && <>
						{!formik.touched.industry &&
					!profile?.isIndustry &&
					(!profile?.isReviewed ? 
						<div className="text-red-500">
									Not reviewed yet.
						</div> :
						profile?.businessVerticalNote ? (
							<div className="text-red-500">
								{profile?.businessVerticalNote || "Rejected by admin"}
							</div>
						) : null)}
					</>}
					
				</div>
			</div>
		</div>
	);
};

export default IndustryFormField;
