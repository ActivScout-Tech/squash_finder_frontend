// zustand store

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { Venue } from "../types";
import axios from "axios";

const SERVER_URL = "https://squash-search.ctoninja.tech";
// import.meta.env.NODE_ENV === "production"
// 	? "https://squash-search.ctoninja.tech"
// 	: // ? "https://squash-search-server.vercel.app"
// 	  "http://localhost:8080";

const milesToMeters = (miles: number) => miles * 1609.34;
const kmToMeters = (km: number) => km * 1000;

interface MainStore {
	currentLocation: [number, number];
	defaultLocation: [number, number];
	venues: Venue[];
	searchedVenues: Venue[];
	sort: string;
	distance: number;
	searchTerm: string;
	locationDenied: boolean;
	setSearchTerm: (searchTerm: string) => void;
	fetchVenues: (reset: boolean, sort?: string) => Promise<void>;
	setCurrentLocation: (location: [number, number]) => void;
	currentView: string;
	setCurrentView: (view: string) => void;
	selectedVenue: any;
	setSelectedVenue: (venue: any) => void;
	setSort: (sort: string) => void;
	setDistance: (distance: number) => void;
	searchVenues: (searchTerm: string) => Promise<void>;
	setLocationDenied: (denied: boolean) => void;
	requestCurrentLocation: () => void;
}

export const useMainStore = create<MainStore>()(
	devtools((set, get) => ({
		currentLocation: [0, 0],
		defaultLocation: [51.5072178, 0.1275862], // London, UK
		venues: [],
		currentView: "map",
		selectedVenue: null,
		sort: "distance",
		distance: 10,
		searchTerm: "",
		searchedVenues: [],
		locationDenied: false,

		setCurrentLocation: (location: [number, number]) =>
			set(() => ({ currentLocation: location })),

		setCurrentView: (view: string) => set(() => ({ currentView: view })),

		setSelectedVenue: (venue: any) => set(() => ({ selectedVenue: venue })),

		setLocationDenied: (denied: boolean) =>
			set(() => ({ locationDenied: denied })),

		fetchVenues: async (reset: boolean, sort?: string) => {
			const { data } = await axios.get(
				`${SERVER_URL}/venues?sort=${sort}&targetLat=${
					get().currentLocation[0]
				}&targetLon=${get().currentLocation[1]}&radius=${kmToMeters(
					get().distance
				)}&limit=5&skip=${reset ? 0 : get().venues.length}`
			);

			set(() => ({ venues: reset ? data : [...data, ...data] }));
		},

		searchVenues: async (searchTerm: string) => {
			const { data } = await axios.get(
				`${SERVER_URL}/venues/?search=${searchTerm}&targetLat=${
					get().currentLocation[0]
				}&targetLon=${get().currentLocation[1]}&radius=${kmToMeters(
					get().distance
				)}&sort=${get().sort}
				&limit=10
				`
			);

			set(() => ({ searchedVenues: data }));
		},

		setSort: (sort: string) => set(() => ({ sort })),

		setDistance: (distance: number) => set(() => ({ distance })),

		setSearchTerm: (searchTerm: string) => set(() => ({ searchTerm })),

		requestCurrentLocation: () => {
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition((position) => {
					set(() => ({
						currentLocation: [
							position.coords.latitude,
							position.coords.longitude,
						],
					}));
				});
			} else {
				set(() => ({
					locationDenied: true,
					// set current location to default location: London, UK
					currentLocation: get().defaultLocation as [number, number],
				}));
			}
		},
	}))
);
