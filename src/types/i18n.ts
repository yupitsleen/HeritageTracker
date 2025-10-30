/**
 * Internationalization (i18n) type definitions
 *
 * Defines structure for multi-language support including
 * translation keys, locale configuration, and RTL support.
 */

/**
 * Supported locale codes (BCP 47 language tags)
 */
export type LocaleCode = "en" | "ar" | "it";

/**
 * Text direction for locale
 */
export type TextDirection = "ltr" | "rtl";

/**
 * Locale configuration
 */
export interface LocaleConfig {
  /** BCP 47 locale code */
  code: LocaleCode;

  /** Full BCP 47 tag for date/number formatting */
  bcp47: string;

  /** Display name in English */
  name: string;

  /** Display name in native language */
  nativeName: string;

  /** Text direction */
  direction: TextDirection;

  /** Whether this is the default locale */
  isDefault?: boolean;
}

/**
 * Translation namespace structure
 *
 * Organizes translations by feature area for better maintainability.
 */
export interface Translations {
  /** Common UI elements */
  common: {
    loading: string;
    error: string;
    success: string;
    cancel: string;
    save: string;
    close: string;
    back: string;
    next: string;
    previous: string;
    reset: string;
    apply: string;
    clear: string;
    search: string;
    filter: string;
    export: string;
    share: string;
    info: string;
    help: string;
    settings: string;
    about: string;
    na: string; // "N/A"
  };

  /** Header navigation */
  header: {
    title: string;
    dashboard: string;
    advancedTimeline: string;
    statistics: string;
    helpPalestine: string;
    about: string;
  };

  /** Map component */
  map: {
    streetView: string;
    satelliteView: string;
    baseline2014: string;
    preConflict2023: string;
    current: string;
    zoomIn: string;
    zoomOut: string;
    showSiteMarkers: string;
    switchTo: string;
    satelliteImagery: string;
  };

  /** Timeline component */
  timeline: {
    play: string;
    pause: string;
    speed: string;
    syncMap: string;
    zoomToSite: string;
    dateRange: string;
    startDate: string;
    endDate: string;
    previous: string;
    previousAriaLabel: string;
    previousTitle: string;
    next: string;
    nextAriaLabel: string;
    nextTitle: string;
    dateFilter: string;
    from: string;
    to: string;
    clear: string;
    clearFilter: string;
    keyboard: string;
    playPause: string;
    step: string;
    jump: string;
    tooltipDefault: string;
    tooltipAdvanced: string;
  };

  /** Table component */
  table: {
    name: string;
    type: string;
    status: string;
    yearBuilt: string;
    dateDestroyed: string;
    location: string;
    verifiedBy: string;
    compact: string;
    expanded: string;
    mobile: string;
    viewDetails: string;
    sortBy: string;
    heritageSites: string;
    expandTable: string;
    selectExportFormat: string;
    export: string;
    siteName: string;
    destructionDate: string;
    destructionDateGregorian: string;
    destructionDateIslamic: string;
    builtGregorian: string;
    builtIslamic: string;
    showing: string;
    site: string;
    sites: string;
    islamic: string;
    description: string;
    coordinates: string;
    sources: string;
    tooltip: string;
  };

  /** Filter bar */
  filters: {
    filters: string;
    clear: string;
    clearAll: string;
    searchPlaceholder: string;
    search: string;
    clearSearch: string;
    typeFilter: string;
    statusFilter: string;
    allTypes: string;
    allStatuses: string;
    creationYearRange: string;
    destructionDateRange: string;
    applyFilters: string;
    clearFilters: string;
    siteType: string;
    selectTypes: string;
    status: string;
    selectStatus: string;
    destructionDate: string;
    yearBuilt: string;
  };

  /** Site types */
  siteTypes: {
    mosque: string;
    church: string;
    archaeological: string;
    museum: string;
    historicBuilding: string;
  };

  /** Site statuses */
  siteStatus: {
    destroyed: string;
    heavilyDamaged: string;
    looted: string;
    damaged: string;
    abandoned: string;
    unknown: string;
    unharmed: string;
  };

  /** Statistics dashboard */
  stats: {
    title: string;
    totalSites: string;
    destroyed: string;
    damaged: string;
    ancientSites: string;
    legalFramework: string;
    notableLosses: string;
  };

  /** Advanced Timeline page */
  advancedTimeline: {
    title: string;
    backToMain: string;
    releases: string;
    satelliteDates: string;
    siteDestruction: string;
    playAnimation: string;
    pauseAnimation: string;
    resetTimeline: string;
    nextEvent: string;
    previousEvent: string;
    waybackTooltip: string;
  };

  /** Site detail panel */
  siteDetail: {
    overview: string;
    historicalSignificance: string;
    culturalValue: string;
    sources: string;
    images: string;
    coordinates: string;
    verificationSources: string;
    siteType: string;
    yearBuilt: string;
    status: string;
    dateDestroyed: string;
    lastUpdated: string;
    description: string;
    whatWasLost: string;
    beforeDestruction: string;
    afterDestruction: string;
    seeMore: string;
  };

  /** Modal dialogs */
  modals: {
    confirmClose: string;
    unsavedChanges: string;
  };

  /** Error messages */
  errors: {
    loadingFailed: string;
    networkError: string;
    notFound: string;
    invalidData: string;
    exportFailed: string;
    somethingWrong: string;
    unexpectedError: string;
    tryAgain: string;
    persistsContact: string;
  };

  /** Accessibility labels */
  aria: {
    openMenu: string;
    closeMenu: string;
    toggleTheme: string;
    toggleLanguage: string;
    filterControl: string;
    timelineControl: string;
    mapControl: string;
    switchToLightMode: string;
    switchToDarkMode: string;
    viewGithub: string;
    helpPalestineDonate: string;
    viewStatistics: string;
    aboutHeritageTracker: string;
    resizeTable: string;
    dragToResizeTable: string;
    clearSearch: string;
  };

  /** Pagination component */
  pagination: {
    showingPage: string;
    of: string;
    totalSites: string;
    previous: string;
    next: string;
    goToPage: string;
  };

  /** Loading states */
  loading: {
    message: string;
    pleaseWait: string;
  };

  /** Donate modal */
  donate: {
    title: string;
    description: string;
    focus: string;
    donateButton: string;
    disclaimer: string;
    disclaimerText: string;
  };

  /** Footer component */
  footer: {
    title: string;
    sources: string;
    github: string;
    donate: string;
    stats: string;
    about: string;
  };

  /** Map legend */
  legend: {
    colorKey: string;
  };
}

/**
 * Type-safe translation key paths
 *
 * Allows dot-notation access to nested translation keys
 * e.g., "common.loading", "map.satelliteView"
 */
export type TranslationKey =
  | `common.${keyof Translations["common"]}`
  | `header.${keyof Translations["header"]}`
  | `map.${keyof Translations["map"]}`
  | `timeline.${keyof Translations["timeline"]}`
  | `table.${keyof Translations["table"]}`
  | `filters.${keyof Translations["filters"]}`
  | `siteTypes.${keyof Translations["siteTypes"]}`
  | `siteStatus.${keyof Translations["siteStatus"]}`
  | `stats.${keyof Translations["stats"]}`
  | `advancedTimeline.${keyof Translations["advancedTimeline"]}`
  | `siteDetail.${keyof Translations["siteDetail"]}`
  | `modals.${keyof Translations["modals"]}`
  | `errors.${keyof Translations["errors"]}`
  | `aria.${keyof Translations["aria"]}`
  | `pagination.${keyof Translations["pagination"]}`
  | `loading.${keyof Translations["loading"]}`
  | `donate.${keyof Translations["donate"]}`
  | `footer.${keyof Translations["footer"]}`
  | `legend.${keyof Translations["legend"]}`;

/**
 * Translation function type
 */
export type TranslateFunction = (key: TranslationKey, params?: Record<string, string | number>) => string;
