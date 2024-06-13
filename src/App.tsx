import { useEffect, useState } from "react";
import Header from "./Compoenents/Header";
import ListView from "./Views/ListView";
import MapView from "./Views/MapView";
import { CircularProgress, CssVarsProvider, extendTheme } from "@mui/joy";
import { useMainStore } from "./Stores/MainStore";
import "@fontsource/inter";
import "./index.css";

function SquashSearch() {
	const MainStore = useMainStore();
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const settings = (window as any).squashFinderSettings;
		if (settings) {
			MainStore.setCurrentView(settings.defaultView);
			MainStore.setDistanceUnit(settings.radiusUnit);
			MainStore.setThemeAccentColor(settings.themeAccentColor);
		}
	}, []);

	useEffect(() => {
		navigator.permissions.query({ name: "geolocation" }).then((result) => {
			if (result.state === "granted" || result.state === "prompt") {
				navigator.geolocation.getCurrentPosition((position) => {
					MainStore.setCurrentLocation([
						position.coords.latitude,
						position.coords.longitude,
					]);
				});
			} else {
				MainStore.setLocationDenied(true);
				// set current location to default location
				MainStore.setCurrentLocation(MainStore.defaultLocation);
			}
		});
	}, []);

	useEffect(() => {
		if (
			MainStore.currentLocation[0] !== 0 &&
			MainStore.currentLocation[1] !== 0
		) {
			setLoading(true);
			MainStore.fetchVenues(true, MainStore.sort)
				.then(() => {
					setLoading(false);
				})
				.catch(() => {
					setLoading(false);
				});
		}
	}, [MainStore.sort, MainStore.distance, MainStore.currentLocation]);

	const customTheme = extendTheme({
		fontFamily: {
			body: "Nunito Sans, sans-serif",
			display: "Nunito Sans, sans-serif",
		},
	});

	const { currentLocation, currentView, setCurrentView } = MainStore;

	return (
		<div className="App">
			<CssVarsProvider theme={customTheme}>
				<Header
					currLocation={currentLocation as [number, number]}
					currView={currentView}
					onViewChange={setCurrentView}
				/>
				<div
					style={{
						backgroundColor: "#F7F6F5",
						minHeight: "calc(100vh - 50px)",
						containerType: "inline-size",
						containerName: "mainContainer",
					}}>
					{loading ? (
						<CircularProgress
							size={"md"}
							sx={{
								left: "50%",
								top: "50%",
								position: "absolute",
								transform: "translate(-50%, -50%)",
							}}
						/>
					) : currentView === "list" ? (
						<ListView />
					) : (
						<MapView currLocation={currentLocation as [number, number]} />
					)}
				</div>
			</CssVarsProvider>
		</div>
	);
}

export default SquashSearch;
