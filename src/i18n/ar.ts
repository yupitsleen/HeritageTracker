import type { Translations } from "../types/i18n";

/**
 * Arabic translations (العربية)
 *
 * RTL language support for Heritage Tracker application.
 */
export const ar: Translations = {
  common: {
    loading: "جار التحميل...",
    error: "خطأ",
    success: "نجح",
    cancel: "إلغاء",
    save: "حفظ",
    close: "إغلاق",
    back: "رجوع",
    next: "التالي",
    previous: "السابق",
    reset: "إعادة تعيين",
    apply: "تطبيق",
    clear: "مسح",
    search: "بحث",
    filter: "تصفية",
    export: "تصدير",
    share: "مشاركة",
    info: "معلومات",
    help: "مساعدة",
    settings: "الإعدادات",
    about: "حول",
    na: "غير متوفر",
  },

  header: {
    title: "متتبع التراث",
    advancedTimeline: "الجدول الزمني المتقدم",
    statistics: "الإحصائيات",
    helpPalestine: "ساعد فلسطين",
    about: "حول",
  },

  map: {
    streetView: "الشارع",
    satelliteView: "القمر الصناعي",
    baseline2014: "خط الأساس ٢٠١٤",
    preConflict2023: "ما قبل النزاع (أغسطس ٢٠٢٣)",
    current: "الحالي",
    zoomIn: "تكبير",
    zoomOut: "تصغير",
    showSiteMarkers: "إظهار علامات المواقع",
  },

  timeline: {
    play: "تشغيل",
    pause: "إيقاف مؤقت",
    speed: "السرعة",
    syncMap: "مزامنة الخريطة",
    zoomToSite: "التكبير إلى الموقع",
    dateRange: "نطاق التاريخ",
    startDate: "تاريخ البدء",
    endDate: "تاريخ الانتهاء",
  },

  table: {
    name: "الاسم",
    type: "النوع",
    status: "الحالة",
    yearBuilt: "سنة البناء",
    dateDestroyed: "تاريخ التدمير",
    location: "الموقع",
    verifiedBy: "تم التحقق بواسطة",
    compact: "مضغوط",
    expanded: "موسع",
    mobile: "الجوال",
    viewDetails: "عرض التفاصيل",
    sortBy: "ترتيب حسب",
  },

  filters: {
    searchPlaceholder: "البحث عن المواقع...",
    typeFilter: "تصفية النوع",
    statusFilter: "تصفية الحالة",
    allTypes: "جميع الأنواع",
    allStatuses: "جميع الحالات",
    creationYearRange: "نطاق سنة الإنشاء",
    destructionDateRange: "نطاق تاريخ التدمير",
    applyFilters: "تطبيق المرشحات",
    clearFilters: "مسح المرشحات",
  },

  siteTypes: {
    mosque: "مسجد",
    church: "كنيسة",
    archaeological: "موقع أثري",
    museum: "متحف",
    historicBuilding: "مبنى تاريخي",
  },

  siteStatus: {
    destroyed: "مدمر",
    heavilyDamaged: "تضرر بشدة",
    damaged: "متضرر",
  },

  stats: {
    title: "الإحصائيات",
    totalSites: "إجمالي المواقع",
    destroyed: "مدمر",
    damaged: "متضرر",
    ancientSites: "مواقع قديمة",
    legalFramework: "الإطار القانوني",
    notableLosses: "الخسائر البارزة",
  },

  advancedTimeline: {
    title: "الجدول الزمني المتقدم للأقمار الصناعية",
    backToMain: "العودة إلى العرض الرئيسي",
    releases: "الإصدارات",
    satelliteDates: "تواريخ الصور الفضائية",
    siteDestruction: "أحداث تدمير المواقع",
    playAnimation: "تشغيل الرسوم المتحركة",
    pauseAnimation: "إيقاف الرسوم المتحركة",
    resetTimeline: "إعادة تعيين الجدول الزمني",
    nextEvent: "الحدث التالي",
    previousEvent: "الحدث السابق",
  },

  siteDetail: {
    overview: "نظرة عامة",
    historicalSignificance: "الأهمية التاريخية",
    culturalValue: "القيمة الثقافية",
    sources: "المصادر",
    images: "الصور",
    coordinates: "الإحداثيات",
    verificationSources: "مصادر التحقق",
  },

  modals: {
    confirmClose: "هل أنت متأكد أنك تريد الإغلاق؟",
    unsavedChanges: "لديك تغييرات غير محفوظة.",
  },

  errors: {
    loadingFailed: "فشل تحميل البيانات",
    networkError: "حدث خطأ في الشبكة",
    notFound: "غير موجود",
    invalidData: "تنسيق بيانات غير صالح",
    exportFailed: "فشل التصدير",
  },

  aria: {
    openMenu: "فتح القائمة",
    closeMenu: "إغلاق القائمة",
    toggleTheme: "تبديل الوضع الليلي",
    toggleLanguage: "تغيير اللغة",
    filterControl: "التحكم في التصفية",
    timelineControl: "التحكم في الجدول الزمني",
    mapControl: "التحكم في الخريطة",
  },
};
