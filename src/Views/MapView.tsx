import { Box } from "@mui/joy";
import {
	MapContainer,
	Marker,
	Popup,
	TileLayer,
	Tooltip,
	useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useState } from "react";
import ListCard from "../Compoenents/ListCard";
import clubs from "../clubs.json";
import { useMainStore } from "../Stores/MainStore";
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
		"https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Map_marker.svg/1200px-Map_marker.svg.png",
	iconSize: [28, 39],
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

	return (
		<Box
			sx={{
				display: {
					sm: "block",
					md: "block",
				},
			}}>
			<MapContainer
				center={
					[
						MainStore.selectedVenue?.latitude ||
							MainStore.venues[0]?.latitude ||
							0,
						MainStore.selectedVenue?.longitude ||
							MainStore.venues[0]?.longitude ||
							0,
					] as any
				}
				zoom={11}
				scrollWheelZoom={false}
				style={{ width: "100%", height: "calc(100vh - 50px)" }}>
				<TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
				<Marker position={props.currLocation as any} icon={myIcon}>
					<Popup>Current Location</Popup>
				</Marker>
				{venues.map((venue, idx) =>
					MainStore.selectedVenue?.id === venue.id ? null : (
						<Marker
							key={venue.id}
							position={[+venue.latitude, +venue.longitude]}>
							{
								//@ts-expect-error - Tooltip props giving error
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
						icon={selectedIcon}
					/>
				)}
				<MyLocationButton />
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
