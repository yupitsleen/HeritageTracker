import type { Translations } from "../types/i18n";

/**
 * English translations
 *
 * Default language for Heritage Tracker application.
 */
export const en: Translations = {
  common: {
    loading: "Loading...",
    error: "Error",
    success: "Success",
    cancel: "Cancel",
    save: "Save",
    close: "Close",
    back: "Back",
    next: "Next",
    previous: "Previous",
    reset: "Reset",
    apply: "Apply",
    clear: "Clear",
    search: "Search",
    filter: "Filter",
    export: "Export",
    share: "Share",
    info: "Info",
    help: "Help",
    settings: "Settings",
    about: "About",
    na: "N/A",
  },

  header: {
    title: "Heritage Tracker",
    advancedTimeline: "Advanced Timeline",
    statistics: "Statistics",
    helpPalestine: "Help Palestine",
    about: "About",
  },

  map: {
    streetView: "Street",
    satelliteView: "Satellite",
    baseline2014: "2014 Baseline",
    preConflict2023: "Pre-Conflict (Aug 2023)",
    current: "Current",
    zoomIn: "Zoom in",
    zoomOut: "Zoom out",
    showSiteMarkers: "Show site markers",
  },

  timeline: {
    play: "Play",
    pause: "Pause",
    speed: "Speed",
    syncMap: "Sync Map",
    zoomToSite: "Zoom to Site",
    dateRange: "Date Range",
    startDate: "Start Date",
    endDate: "End Date",
  },

  table: {
    name: "Name",
    type: "Type",
    status: "Status",
    yearBuilt: "Year Built",
    dateDestroyed: "Date Destroyed",
    location: "Location",
    verifiedBy: "Verified By",
    compact: "Compact",
    expanded: "Expanded",
    mobile: "Mobile",
    viewDetails: "View Details",
    sortBy: "Sort by",
  },

  filters: {
    searchPlaceholder: "Search sites...",
    typeFilter: "Type Filter",
    statusFilter: "Status Filter",
    allTypes: "All Types",
    allStatuses: "All Statuses",
    creationYearRange: "Creation Year Range",
    destructionDateRange: "Destruction Date Range",
    applyFilters: "Apply Filters",
    clearFilters: "Clear Filters",
  },

  siteTypes: {
    mosque: "Mosque",
    church: "Church",
    archaeological: "Archaeological Site",
    museum: "Museum",
    historicBuilding: "Historic Building",
  },

  siteStatus: {
    destroyed: "Destroyed",
    heavilyDamaged: "Heavily Damaged",
    damaged: "Damaged",
  },

  stats: {
    title: "Statistics",
    totalSites: "Total Sites",
    destroyed: "Destroyed",
    damaged: "Damaged",
    ancientSites: "Ancient Sites",
    legalFramework: "Legal Framework",
    notableLosses: "Notable Losses",
  },

  advancedTimeline: {
    title: "Advanced Satellite Timeline",
    backToMain: "Back to Main View",
    releases: "Releases",
    satelliteDates: "Satellite imagery dates",
    siteDestruction: "Site destruction events",
    playAnimation: "Play animation",
    pauseAnimation: "Pause animation",
    resetTimeline: "Reset timeline",
    nextEvent: "Next event",
    previousEvent: "Previous event",
  },

  siteDetail: {
    overview: "Overview",
    historicalSignificance: "Historical Significance",
    culturalValue: "Cultural Value",
    sources: "Sources",
    images: "Images",
    coordinates: "Coordinates",
    verificationSources: "Verification Sources",
  },

  modals: {
    confirmClose: "Are you sure you want to close?",
    unsavedChanges: "You have unsaved changes.",
  },

  errors: {
    loadingFailed: "Failed to load data",
    networkError: "Network error occurred",
    notFound: "Not found",
    invalidData: "Invalid data format",
    exportFailed: "Export failed",
  },

  aria: {
    openMenu: "Open menu",
    closeMenu: "Close menu",
    toggleTheme: "Toggle dark mode",
    toggleLanguage: "Change language",
    filterControl: "Filter control",
    timelineControl: "Timeline control",
    mapControl: "Map control",
  },
};
