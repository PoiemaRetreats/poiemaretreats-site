export interface RetreatStatusInfo {
	isOpen: boolean;
	isWaitlist: boolean;
	isSoldOut: boolean;
	isCanceled: boolean;
	isPast: boolean;
	badgeLabel: string;
	badgeClass: string;
	dateRangeFormatted: string;
}

export function getRetreatStatus(retreat: {
	start_date: string | Date;
	end_date: string | Date;
	registration_deadline?: string | Date | null;
	status_override?: string | null;
}): RetreatStatusInfo {
	const now = new Date();
	const startDate = new Date(retreat.start_date);
	const endDate = new Date(retreat.end_date);
	const deadline = retreat.registration_deadline
		? new Date(retreat.registration_deadline)
		: null;

	const override = (retreat.status_override || "automatic").toLowerCase().trim();

	const isPast = now >= endDate;
	const isCanceled = override === "canceled";
	const isSoldOut = override === "sold_out";
	const isWaitlist =
		override === "waitlist" ||
		(!isPast && deadline !== null && now >= deadline && !isSoldOut && !isCanceled);

	const isOpen =
		!isPast &&
		!isCanceled &&
		!isSoldOut &&
		override !== "waitlist" &&
		(deadline === null || now < deadline);

	let badgeLabel = "Registration Open";
	let badgeClass = "badge-open";

	if (isCanceled) {
		badgeLabel = "Canceled";
		badgeClass = "badge-canceled";
	} else if (isSoldOut) {
		badgeLabel = "Sold Out";
		badgeClass = "badge-sold-out";
	} else if (isPast) {
		badgeLabel = "Past Gathering";
		badgeClass = "badge-past";
	} else if (isWaitlist) {
		badgeLabel = "Waitlist / Closed";
		badgeClass = "badge-waitlist";
	}

	// Format date span
	const startMonth = startDate.toLocaleDateString("en-US", { month: "short" });
	const endMonth = endDate.toLocaleDateString("en-US", { month: "short" });
	const startDay = startDate.getDate();
	const endDay = endDate.getDate();
	const startYear = startDate.getFullYear();
	const endYear = endDate.getFullYear();

	let dateRangeFormatted = "";
	if (startYear === endYear) {
		if (startMonth === endMonth) {
			dateRangeFormatted = `${startMonth} ${startDay}–${endDay}, ${startYear}`;
		} else {
			dateRangeFormatted = `${startMonth} ${startDay} – ${endMonth} ${endDay}, ${startYear}`;
		}
	} else {
		dateRangeFormatted = `${startMonth} ${startDay}, ${startYear} – ${endMonth} ${endDay}, ${endYear}`;
	}

	return {
		isOpen,
		isWaitlist,
		isSoldOut,
		isCanceled,
		isPast,
		badgeLabel,
		badgeClass,
		dateRangeFormatted,
	};
}
