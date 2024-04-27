// src/lib/stores/userStore.js
import { writable } from "svelte/store";

// Initialize the store with an object that includes userPhoto and userName
export const userStore = writable({
	userPhoto: "/default-profile-picture.jpg",
	userName: "Guest",
	isLoading: true
});
