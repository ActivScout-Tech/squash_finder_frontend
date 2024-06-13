import { Box, Sheet, Typography, styled } from "@mui/joy";
import { Venue } from "../types";
import { useMainStore } from "../Stores/MainStore";
import { useMemo } from "react";

function toRadians(degrees: number) {
	return (degrees * Math.PI) / 180;
}

function calculateDistance(
	lat1: number,
	lon1: number,
	lat2: number,
	lon2: number
) {
	// const R = 3958.755866; // Radius of the Earth in miles
	const R = 6371; // Radius of the Earth in kilometers
	const dLat = toRadians(lat2 - lat1);
	const dLon = toRadians(lon2 - lon1);
	const a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos(toRadians(lat1)) *
			Math.cos(toRadians(lat2)) *
			Math.sin(dLon / 2) *
			Math.sin(dLon / 2);
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	const distance = R * c;
	return distance;
}

const ActionBox = styled(Box, { name: "ActionBox" })(() => ({
	width: 200,
	marginLeft: 10,
	backgroundColor: "#EFEEEC",
	borderRadius: "10px 10px 0 0",
	padding: "1em 0",
}));

const ActionBoxContainerStyled = (compact: boolean) =>
	styled(Box, { name: "ActionBoxContainer" })(({ theme }) => ({
		display: compact ? "block" : "flex",
		justifyContent: "space-between",
		alignItems: "center",
		[theme.breakpoints.down("sm")]: {
			display: "block",
		},
		"@container (max-width: 300px)": {
			display: "block",
		},
	}));

interface ListCardProps {
	venue: Venue;
	compact?: boolean;
	onViewOnMapPress?: (venue: any) => void;
}

export default function ListCard({
	venue,
	compact,
	onViewOnMapPress,
}: ListCardProps) {
	const MainStore = useMainStore();

	const distance = useMemo(() => {
		const userLocation = MainStore.currentLocation;
		if (userLocation) {
			return Math.round(
				calculateDistance(
					userLocation[0],
					userLocation[1],
					venue.latitude as number,
					venue.longitude as number
				)
			);
		}
	}, [MainStore.currentLocation, venue.latitude, venue.longitude]);

	const ActionBoxContainer = useMemo(
		() => ActionBoxContainerStyled(compact),
		[compact]
	);

	return (
		<Sheet
			key={venue.name}
			sx={{
				marginBottom: "1em",
				padding: "1.5em",
				paddingBottom: 0,
				borderBottom: "2px solid #efeeec",
				containerType: "inline-size",
				containerName: "listContainer",
			}}>
			<a
				href={"https://clubhub.net/vu/" + venue.name_unique}
				target="_blank"
				rel="noreferrer"
				style={{ textDecoration: "none" }}>
				<Typography
					level="h3"
					sx={{
						color: MainStore.themeAccentColor,
					}}>
					{venue.name}
				</Typography>
			</a>
			<span style={{ display: "flex", alignItems: "center", marginTop: 10 }}>
				<Typography level="body-xs">{distance} miles away</Typography>
				{!compact && (
					<Typography
						onClick={() => onViewOnMapPress && onViewOnMapPress(venue)}
						level="body-xs"
						sx={{
							ml: 1,
							color: MainStore.themeAccentColor,
							cursor: "pointer",
						}}>
						View on map
					</Typography>
				)}
			</span>
			<Typography level="body-md" sx={{ my: 1 }}>
				{venue.physical_address}
			</Typography>

			<ActionBoxContainer className="cont" sx={{ pb: 5 }}>
				<Typography level="body-sm">COURTS: {venue.no_of_courts}</Typography>
				{/* <Box
					sx={{
						display: "flex",
						alignItems: "center",
						mt: compact ? 1 : 0,
					}}>
					<ActionBox>
						<Typography level="body-sm" sx={{ ml: 1 }}>
							Clubs
						</Typography>
					</ActionBox>
					<ActionBox>
						<Typography level="body-sm" sx={{ ml: 1 }}>
							Coaches
						</Typography>
					</ActionBox>
					<ActionBox sx={{}}>
						<Typography level="body-sm" sx={{ ml: 1 }}>
							Sessions
						</Typography>
					</ActionBox>
				</Box> */}
			</ActionBoxContainer>
		</Sheet>
	);
}
