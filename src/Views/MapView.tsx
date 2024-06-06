import { Box } from "@mui/joy";
import { MapContainer, Marker, Popup, TileLayer, Tooltip } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useMemo } from "react";
import { useMainStore } from "../Stores/MainStore";
// @ts-expect-error - marker is not a module
import marker from "../icons/marker.png";
import MyLocationButton from "../Compoenents/MyLocationButton";

interface MapViewProps {
	currLocation: [number, number];
}

const selectedIcon = new L.Icon({
	iconUrl:
		"https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678111-map-marker-512.png",
	iconSize: [37, 39],
	iconAnchor: [17, 41],
	popupAnchor: [1, -34],
});

const icon = new L.Icon({
	iconUrl:
		"https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png",
	iconSize: [26, 39],
	iconAnchor: [14, 41],
	popupAnchor: [1, -34],
});

const myIcon = new L.Icon({
	iconUrl: marker,
	iconSize: [39, 39],
	iconAnchor: [14, 41],
	popupAnchor: [1, -34],
});

export default function MapView(props: MapViewProps) {
	const MainStore = useMainStore();

	const venues = MainStore.searchTerm
		? MainStore.searchedVenues
		: MainStore.venues;

	const zoom =
		MainStore.distance === 10 ? 12 : MainStore.distance === 20 ? 11 : 10.5;

	const center = useMemo(() => {
		if (MainStore.selectedVenue) {
			return [
				MainStore.selectedVenue.latitude,
				MainStore.selectedVenue.longitude,
			];
		} else if (props.currLocation[0] && props.currLocation[1]) {
			return props.currLocation;
		} else {
			return MainStore.defaultLocation;
		}
	}, [MainStore.selectedVenue, props.currLocation, MainStore.defaultLocation]);
	return (
		<Box
			sx={{
				display: {
					sm: "block",
					md: "block",
				},
			}}>
			<MapContainer
				center={center as any}
				zoom={zoom}
				scrollWheelZoom={false}
				style={{ width: "100%", height: "calc(100vh - 50px)" }}>
				<TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
				<Marker position={props.currLocation as any} icon={myIcon}>
					<Popup>Current Location</Popup>
				</Marker>
				{venues.map((venue) =>
					MainStore.selectedVenue?.id === venue.id ? null : (
						<Marker
							key={venue.id}
							position={[+venue.latitude, +venue.longitude]}
							icon={icon}>
							{
								<Tooltip permanent direction="right" interactive>
									<a
										href={"https://clubhub.net/vu/" + venue.name_unique}
										target="_blank"
										rel="noreferrer">
										<b>{venue.name}</b>
										<br />
										Squash courts: {venue.no_of_courts}
									</a>
								</Tooltip>
							}
						</Marker>
					)
				)}
				{MainStore.selectedVenue && (
					<Marker
						position={[
							MainStore.selectedVenue.latitude,
							MainStore.selectedVenue.longitude,
						]}
						icon={selectedIcon}>
						{
							<Tooltip permanent direction="right" interactive>
								<a
									href={
										"https://clubhub.net/vu/" +
										MainStore.selectedVenue.name_unique
									}
									target="_blank"
									rel="noreferrer">
									<b>{MainStore.selectedVenue.name}</b>
									<br />
									Squash courts: {MainStore.selectedVenue.no_of_courts}
								</a>
							</Tooltip>
						}
					</Marker>
				)}
				<MyLocationButton zoom={zoom} />
			</MapContainer>
			{/* <Box
				sx={{
					width: "400px",
					backgroundColor: "#f7f6f5",
					borderRadius: "10px 0 0 10px",
					borderTop: "2px solid #efeeec",
				}}>
				{MainStore.selectedVenue || MainStore.venues[0] ? (
					<ListCard
						compact
						venue={MainStore.selectedVenue || MainStore.venues[0]}
					/>
				) : (
					<Box sx={{ p: 2 }}>No venues found</Box>
				)}
			</Box> */}
		</Box>
	);
}
