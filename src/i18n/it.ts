import type { Translations } from "../types/i18n";

/**
 * Italian translations
 *
 * Italian language support for Heritage Tracker application.
 */
export const it: Translations = {
  common: {
    loading: "Caricamento...",
    error: "Errore",
    success: "Successo",
    cancel: "Annulla",
    save: "Salva",
    close: "Chiudi",
    back: "Indietro",
    next: "Avanti",
    previous: "Precedente",
    reset: "Ripristina",
    apply: "Applica",
    clear: "Cancella",
    search: "Cerca",
    filter: "Filtro",
    export: "Esporta",
    share: "Condividi",
    info: "Info",
    help: "Aiuto",
    settings: "Impostazioni",
    about: "Informazioni",
    na: "N/D",
    unknown: "Sconosciuto",
  },

  header: {
    title: "Registro del Patrimonio",
    dashboard: "Cruscotto",
    data: "Dati",
    timeline: "Timeline",
    statistics: "Statistiche",
    helpPalestine: "Aiuta la Palestina",
    about: "Informazioni",
    resources: {
      title: "Risorse",
      donate: "Dona",
      organizations: "Organizzazioni",
      research: "Ricerca e Rapporti",
      media: "Media e Documentazione",
      education: "Risorse Educative",
      legal: "Diritto e Sostegno",
      trackers: "Altri Tracciatori del Patrimonio",
    },
  },

  map: {
    streetView: "Stradale",
    satelliteView: "Satellite",
    baseline2014: "Riferimento 2014",
    preConflict2023: "Pre-Conflitto (Ago 2023)",
    current: "Attuale",
    zoomIn: "Ingrandisci",
    zoomOut: "Rimpicciolisci",
    showSiteMarkers: "Mostra marcatori siti",
    switchTo: "Passa a",
    satelliteImagery: "immagini satellitari",
  },

  timeline: {
    play: "Riproduci",
    pause: "Pausa",
    playTooltip: "Riproduci animazione timeline",
    speed: "Velocità",
    syncMap: "Sincronizza Mappa",
    zoomToSite: "Zoom sul Sito",
    showMapMarkers: "Mostra Marcatori Mappa",
    comparisonMode: "Modalità Confronto",
    dateRange: "Intervallo Date",
    startDate: "Data Inizio",
    endDate: "Data Fine",
    previous: "Precedente",
    previousAriaLabel: "Vai all'evento di distruzione precedente",
    previousTitle: "Naviga all'evento di distruzione del sito precedente",
    next: "Successivo",
    nextAriaLabel: "Vai al prossimo evento di distruzione",
    nextTitle: "Naviga al prossimo evento di distruzione del sito",
    dateFilter: "Data",
    from: "Da",
    to: "a",
    clear: "Cancella",
    clearFilter: "Cancella filtro data",
    keyboard: "Tastiera",
    playPause: "Riproduci/Pausa",
    step: "Passo",
    jump: "Salta",
    tooltipDefault:
      "Fai clic su Riproduci per animare gli eventi di distruzione. Usa il filtro data per concentrarti su periodi di tempo specifici. Fai clic sui punti per vedere i dettagli del sito.",
    tooltipAdvanced:
      "Fai clic sui punti per evidenziare i siti. Usa Precedente/Successivo per navigare tra gli eventi.",
    interval: "Intervallo",
    intervalAsLargeAsPossible: "Il più grande possibile",
    intervalAsSmallAsPossible: "Il più piccolo possibile",
    interval1Month: "1 mese (30 giorni)",
    interval1Year: "1 anno",
    interval5Years: "5 anni",
    syncMapVersion: "Sincronizza Versione Mappa",
    unknownDate: "Sconosciuto",
    noImageryAvailable: "Nessuna versione di immagini disponibile",
  },

  table: {
    name: "Nome",
    type: "Tipo",
    status: "Stato",
    yearBuilt: "Anno di Costruzione",
    dateDestroyed: "Data di Distruzione",
    surveyDate: "Data del Sondaggio",
    location: "Posizione",
    verifiedBy: "Verificato da",
    compact: "Compatto",
    expanded: "Espanso",
    mobile: "Mobile",
    viewDetails: "Visualizza Dettagli",
    sortBy: "Ordina per",
    heritageSites: "Siti Patrimonio",
    expandTable: "Espandi tabella per vedere tutte le colonne",
    selectExportFormat: "Seleziona formato esportazione",
    export: "Esporta",
    siteName: "Nome Sito",
    destructionDate: "Data Distruzione",
    destructionDateGregorian: "Data Distruzione (Gregoriano)",
    destructionDateIslamic: "Data Distruzione (Islamico)",
    builtGregorian: "Costruito (Gregoriano)",
    builtIslamic: "Costruito (Islamico)",
    tooltip:
      "Fai clic su qualsiasi riga del sito per visualizzare informazioni dettagliate. Fai clic sulle intestazioni delle colonne per ordinare. Passa il mouse sopra le righe del sito per evidenziarle sulla mappa e sulla timeline.",
    showing: "Visualizzazione",
    site: "sito",
    sites: "siti",
    islamic: "Islamico",
    description: "Descrizione",
    coordinates: "Coordinate",
    sources: "Fonti",
    lastUpdated: "Ultimo Aggiornamento",
  },

  filters: {
    filters: "Filtri",
    clear: "Cancella",
    clearAll: "Cancella Tutto",
    searchPlaceholder: "Cerca...",
    search: "Cerca",
    clearSearch: "Cancella ricerca",
    openFilters: "Apri menu filtri",
    typeFilter: "Filtro Tipo",
    statusFilter: "Filtro Stato",
    allTypes: "Tutti i Tipi",
    allStatuses: "Tutti gli Stati",
    creationYearRange: "Intervallo Anno Creazione",
    destructionDateRange: "Intervallo Data Distruzione",
    applyFilters: "Applica Filtri",
    clearFilters: "Cancella Filtri",
    siteType: "Tipo di Sito",
    type: "Tipo",
    selectTypes: "Seleziona tipi...",
    status: "Stato",
    selectStatus: "Seleziona stato...",
    destructionDate: "Data Distruzione",
    yearBuilt: "Anno di Costruzione",
    showingCount: "Mostrando {{filtered}} di {{total}} siti",
  },

  siteTypes: {
    mosque: "Moschea",
    church: "Chiesa",
    archaeological: "Sito Archeologico",
    museum: "Museo",
    historicBuilding: "Edificio Storico",
  },

  siteStatus: {
    destroyed: "Distrutto",
    heavilyDamaged: "Gravemente Danneggiato",
    looted: "Saccheggiato",
    damaged: "Danneggiato",
    abandoned: "Abbandonato",
    unknown: "Sconosciuto",
    unharmed: "Integro",
  },

  stats: {
    title: "Statistiche",
    totalSites: "Siti Totali",
    destroyed: "Distrutti",
    damaged: "Danneggiati",
    ancientSites: "Siti Antichi",
    legalFramework: "Quadro Legale",
    notableLosses: "Perdite Notevoli",
  },

  timelinePage: {
    title: "Timeline Satellitare",
    backToMain: "Torna alla Vista Principale",
    releases: "Rilasci",
    satelliteDates: "Date immagini satellitari",
    siteDestruction: "Eventi di distruzione dei siti",
    playAnimation: "Riproduci animazione",
    pauseAnimation: "Pausa animazione",
    resetTimeline: "Ripristina timeline",
    nextEvent: "Evento successivo",
    previousEvent: "Evento precedente",
    waybackTooltip:
      "Naviga tra 186 versioni storiche di immagini satellitari dal 2014 al 2025. Ogni linea grigia rappresenta una data di acquisizione dell'immagine. Fai clic ovunque sulla timeline per saltare a quella data. Passa il mouse sopre le linee grigie per vedere le date esatte.",
  },

  siteDetail: {
    overview: "Panoramica",
    historicalSignificance: "Importanza Storica",
    culturalValue: "Valore Culturale",
    sources: "Fonti",
    images: "Immagini",
    coordinates: "Coordinate",
    verificationSources: "Fonti di Verifica",
    siteType: "Tipo di Sito",
    yearBuilt: "Anno di Costruzione",
    status: "Stato",
    dateDestroyed: "Data Distruzione/Danneggiamento",
    surveyDate: "Data del Sondaggio",
    lastUpdated: "Ultimo Aggiornamento",
    description: "Descrizione",
    whatWasLost: "Cosa È Andato Perso",
    beforeDestruction: "Prima della distruzione",
    afterDestruction: "Dopo la distruzione",
    seeMore: "Vedi di Più",
  },

  modals: {
    confirmClose: "Sei sicuro di voler chiudere?",
    unsavedChanges: "Hai modifiche non salvate.",
  },

  errors: {
    loadingFailed: "Caricamento dati fallito",
    networkError: "Si è verificato un errore di rete",
    notFound: "Non trovato",
    invalidData: "Formato dati non valido",
    exportFailed: "Esportazione fallita",
    somethingWrong: "Qualcosa è andato storto",
    unexpectedError: "Si è verificato un errore imprevisto. Riprova.",
    tryAgain: "Riprova",
    persistsContact: "Se il problema persiste, contatta l'assistenza.",
  },

  aria: {
    openMenu: "Apri menu",
    closeMenu: "Chiudi menu",
    toggleTheme: "Attiva/disattiva modalità scura",
    toggleLanguage: "Cambia lingua",
    filterControl: "Controllo filtro",
    timelineControl: "Controllo timeline",
    mapControl: "Controllo mappa",
    switchToLightMode: "Passa alla modalità chiara",
    switchToDarkMode: "Passa alla modalità scura",
    viewGithub: "Visualizza codice sorgente su GitHub",
    helpPalestineDonate: "Aiuta la Palestina - Dona per gli sforzi di soccorso",
    viewStatistics: "Visualizza Statistiche",
    aboutHeritageTracker: "Informazioni su Registro del Patrimonio",
    resizeTable: "Ridimensiona tabella",
    dragToResizeTable: "Trascina per ridimensionare la tabella",
    clearSearch: "Cancella ricerca",
  },

  pagination: {
    showingPage: "Visualizzazione pagina",
    of: "di",
    totalSites: "siti totali",
    previous: "Precedente",
    next: "Successivo",
    goToPage: "Vai alla pagina",
  },

  loading: {
    message: "Caricamento...",
    pleaseWait: "Caricamento contenuto, attendere prego...",
  },

  donate: {
    title: "Aiuta la Palestina",
    description:
      "Organizzazioni affidabili che forniscono aiuti umanitari essenziali ai palestinesi.",
    focus: "Focus:",
    donateButton: "Dona",
    disclaimer: "Nota:",
    disclaimerText:
      "Heritage Tracker non è affiliato con queste organizzazioni. Effettua ricerche prima di donare.",
  },

  footer: {
    title: "Registro del Patrimonio",
    sources: "UNESCO, Forensic Architecture, Heritage for Peace",
    github: "Github",
    donate: "Dona",
    stats: "Statistiche",
    about: "Informazioni",
  },

  legend: {
    colorKey: "Legenda Colori:",
  },

  // Resources section - using English descriptions for now (can be translated later)
  resources: {
    organizations: {
      title: "Organizzazioni",
      description:
        "Organizzazioni palestinesi per il patrimonio, i diritti umani e l'aiuto umanitario che lavorano per la giustizia e la conservazione.",
      heritageSection: "Patrimonio e Documentazione",
      humanRightsSection: "Organizzazioni per i Diritti Umani",
      humanitarianSection: "Aiuti Umanitari",
      legalSection: "Istituzioni Legali",
      unescoDesc:
        "Leading international organization for cultural heritage protection and assessment.",
      h4pDesc: "NGO dedicated to protecting cultural heritage in conflict zones.",
      forensicDesc:
        "Research agency investigating human rights violations through spatial and architectural analysis.",
      alhaqDesc:
        "Independent Palestinian non-governmental human rights organization established in 1979.",
      btselemDesc:
        "Israeli human rights organization documenting human rights violations in occupied territories.",
      amnestyDesc: "Global human rights monitoring and advocacy for Palestinian rights.",
      hrwDesc:
        "International human rights organization documenting abuses and advocating for change.",
      unrwaDesc:
        "UN agency providing education, healthcare, and emergency aid to Palestinian refugees.",
      mapDesc: "UK-based charity providing medical and humanitarian assistance to Palestinians.",
      pcrfDesc:
        "Non-profit providing free medical care to children in the Middle East regardless of nationality or religion.",
      icjDesc: "UN's principal judicial organ hearing cases on international law violations.",
      iccDesc: "International tribunal investigating war crimes and crimes against humanity.",
    },
    research: {
      title: "Ricerca e Rapporti",
      description:
        "Ricerca accademica, rapporti ufficiali e progetti di documentazione sul patrimonio palestinese e i diritti umani.",
      officialReportsSection: "Rapporti e Valutazioni Ufficiali",
      documentationSection: "Progetti di Documentazione",
      academicSection: "Pubblicazioni Accademiche",
      databasesSection: "Database e Archivi",
      unescoReportDesc:
        "Comprehensive damage assessment of cultural heritage sites in Gaza (October 2025).",
      ochaDesc:
        "Real-time humanitarian situation reports and data on occupied Palestinian territory.",
      unrwaReportsDesc: "Detailed reports on humanitarian conditions and refugee needs.",
      forensicProjectsDesc:
        "Evidence-based investigations using spatial analysis and open-source data.",
      airwarsDesc: "Non-profit tracking civilian casualties from international airstrikes.",
      euromedDesc:
        "Independent organization documenting human rights violations and legal advocacy.",
      palestineStudiesDesc:
        "Leading academic journal on Palestinian history, politics, and culture since 1971.",
      holyLandJournalDesc:
        "Peer-reviewed journal covering history, politics, and heritage of Palestine.",
      meripDesc: "Independent non-profit providing critical analysis of Middle East affairs.",
      openMapsDesc:
        "Interactive mapping platform documenting Palestinian towns, villages, and historical sites.",
      rememberedDesc:
        "Comprehensive database of destroyed Palestinian villages and refugee stories.",
    },
    media: {
      title: "Media e Documentazione",
      description:
        "Archivi fotografici, documentari, fonti di notizie e account di social media che documentano la vita e il patrimonio palestinese.",
      photoArchivesSection: "Archivi Fotografici e Cinematografici",
      newsOutletsSection: "Testate Giornalistiche",
      documentariesSection: "Film Documentari",
      socialMediaSection: "Documentazione sui Social Media",
      palMuseumDesc: "Digital archive preserving Palestinian cultural heritage and history.",
      photoCollectionDesc:
        "Curated collection of historical and contemporary Palestinian photographs.",
      unrwaArchiveDesc: "70+ years of photographs and films documenting Palestinian refugee life.",
      alJazeeraDesc:
        "Comprehensive coverage of Palestinian news, politics, and humanitarian situation.",
      meeDesc:
        "Independent news organization covering Middle East with focus on Palestinian affairs.",
      eintifadaDesc: "Non-profit providing news, analysis, and commentary on Palestinian struggle.",
      mondoweissDesc:
        "News website devoted to covering American foreign policy in the Middle East.",
      "972Desc": "Magazine providing news and analysis from Israeli and Palestinian journalists.",
      "5camerasDesc":
        "Oscar-nominated documentary following Palestinian farmer's nonviolent resistance (2011).",
      occupationMindDesc: "Documentary examining US media coverage of Israel-Palestine conflict.",
      gazaFightsDesc: "Documentary on Gaza's 2018-2019 Great March of Return protests.",
      eyeOnPalDesc:
        "Instagram account documenting daily life, protests, and humanitarian situation in Palestine.",
      pymDesc: "Transnational, independent grassroots organization of Palestinian youth activists.",
    },
    education: {
      title: "Risorse Educative",
      description:
        "Materiali didattici, contesto storico, libri e programmi scolastici per conoscere la storia e il patrimonio palestinese.",
      teachingResourcesSection: "Risorse Didattiche e Programmi",
      historicalContextSection: "Contesto Storico e Timeline",
      booksSection: "Libri e Pubblicazioni",
      youthResourcesSection: "Risorse per Giovani e Bambini",
      zinnDesc:
        "Free downloadable lessons and resources for teaching Palestine in K-12 classrooms.",
      t4cDesc:
        "Non-profit providing social justice teaching resources including Palestine curriculum.",
      rethinkingDesc:
        "Publisher of educational materials promoting social and environmental justice in education.",
      timelineDesc:
        "Interactive visual timeline of key events in Palestinian history from 1799 to present.",
      nakbaArchiveDesc:
        "Digital archive documenting the 1948 Nakba through survivor testimonies and historical records.",
      ipsDesc:
        "Oldest institute in the world devoted exclusively to documentation and research on Palestinian affairs.",
      khalidiDesc:
        "Definitive history of modern Palestine from leading historian at Columbia University.",
      pappeDesc:
        "Groundbreaking historical account of systematic expulsion of Palestinians in 1947-1949.",
      masalhaDesc: "Comprehensive history challenging colonial narratives about Palestine's past.",
      hillPlitnickDesc:
        "Analysis of how Palestinian rights are treated as exception in progressive movements.",
      pisforpalDesc:
        "Alphabet book introducing children to Palestinian culture, food, and history.",
      sittisKeyDesc: "Children's story about Palestinian family memory and connection to homeland.",
    },
    legal: {
      title: "Diritto e Sostegno",
      description:
        "Casi giudiziari internazionali, organizzazioni di difesa legale, risoluzioni ONU e campagne di sostegno per i diritti palestinesi.",
      internationalCourtsSection: "Corti e Tribunali Internazionali",
      legalAdvocacySection: "Organizzazioni di Difesa Legale",
      unResolutionsSection: "Risoluzioni e Rapporti ONU",
      advocacyCampaignsSection: "Campagne di Sostegno",
      icjCaseDesc:
        "Historic case alleging violations of Genocide Convention in Gaza, filed December 2023.",
      iccInvestigationDesc:
        "Ongoing investigation into alleged war crimes in occupied Palestinian territory since 2021.",
      unRapporteurDesc:
        "UN expert monitoring and reporting on human rights situation in occupied territories.",
      ccrDesc: "Non-profit legal advocacy organization defending constitutional and human rights.",
      palLegalDesc:
        "Organization protecting the rights of Palestine advocates in the United States.",
      adalahDesc: "Legal center working to protect rights of Palestinian citizens of Israel.",
      alhaqLegalDesc:
        "Palestinian human rights organization providing legal representation and documentation.",
      gaResolutionsDesc:
        "Collection of General Assembly resolutions on Palestinian rights and self-determination.",
      scResolutionsDesc:
        "Security Council resolutions on Israel-Palestine conflict including Resolution 242.",
      unCommitteeDesc: "Committee supporting inalienable rights of Palestinian people since 1975.",
      bdsDesc:
        "Palestinian-led movement for boycott, divestment, and sanctions until international law compliance.",
      jvpDesc:
        "Organization of Jewish Americans advocating for Palestinian rights and end to occupation.",
      ampDesc:
        "Grassroots organization educating the public about Palestine and supporting activism.",
      uscprDesc: "National coalition working to change US policy toward Palestine/Israel.",
    },
    trackers: {
      title: "Altri Tracciatori del Patrimonio",
      description:
        "Progetti simili che documentano la distruzione del patrimonio e i conflitti in altre regioni, più piattaforme di documentazione globale.",
      palestineSection: "Tracciatori Specifici per la Palestina",
      syriaSection: "Tracciatori del Patrimonio Siriano",
      yemenSection: "Documentazione del Conflitto Yemenita",
      ukraineSection: "Protezione del Patrimonio Ucraino",
      globalSection: "Documentazione Globale del Patrimonio e dei Conflitti",
      gazaMosquesDesc:
        "Dedicated documentation of mosque destruction in Gaza with satellite imagery.",
      openMapsDesc:
        "Interactive maps of Palestinian geography, demolished villages, and cultural sites.",
      vizPalDesc:
        "Data-driven storytelling about Palestine through infographics and visualizations.",
      syrianArchiveDesc: "Database of endangered Syrian heritage sites with damage assessments.",
      dayAfterDesc:
        "Syrian civil society organization working on heritage protection and post-conflict planning.",
      asorSyriaDesc: "Weekly reports on cultural heritage destruction in Syria since 2014.",
      yemenDataDesc: "Independent project documenting airstrikes and civilian casualties in Yemen.",
      yemenArchiveDesc:
        "Digital archive preserving documentation of Yemen conflict for accountability.",
      conflictObsDesc: "US government initiative documenting atrocities and war crimes in Ukraine.",
      ukraineLabDesc:
        "Real-time monitoring of cultural heritage sites at risk in Ukraine using satellite imagery.",
      smithsonianDesc:
        "Initiative protecting cultural heritage threatened by conflict and natural disasters worldwide.",
      bellingcatDesc:
        "Investigative journalism network using open-source data to document conflicts globally.",
      syrianArchiveOrgDesc:
        "Preserving and verifying digital documentation of human rights violations in Syria.",
      mnemonicDesc:
        "Organization archiving digital documentation from conflict zones for justice and accountability.",
    },
  },
};
