export type Language = "en" | "rw"

export interface Translations {
  // Authentication
  welcomeBack: string
  signInToAccount: string
  email: string
  password: string
  signIn: string
  signingIn: string
  createAccount: string
  joinUs: string
  fullName: string
  createPassword: string
  confirmPassword: string
  creatingAccount: string
  dontHaveAccount: string
  alreadyHaveAccount: string
  signUp: string

  // Dashboard
  foodTracker: string
  reduceWasteSaveMoney: string
  welcome: string
  signOut: string

  // Stats
  totalItems: string
  foodItemsTracked: string
  freshItems: string
  stillGoodToEat: string
  expiringSoon: string
  useWithinDays: string
  expiredItems: string
  needAttention: string

  // Quick Actions
  quickActions: string
  commonTasks: string
  addFoodItem: string
  trackNewFood: string
  scanBarcode: string
  quickAddBarcode: string
  viewReminders: string
  checkExpiringItems: string
  settings: string
  appPreferences: string
  managePreferences: string
  language: string
  languageDescription: string
  profile: string
  profileDescription: string
  name: string

  // Food Management
  addFood: string
  trackNewItem: string
  editFoodItem: string
  updateDetails: string
  foodName: string
  category: string
  selectCategory: string
  quantity: string
  unit: string
  purchaseDate: string
  expirationDate: string
  notes: string
  notesOptional: string
  additionalNotes: string
  addItem: string
  adding: string
  saveChanges: string
  saving: string
  cancel: string
  edit: string

  // Food Categories
  fruits: string
  vegetables: string
  dairy: string
  meatFish: string
  grainsCereals: string
  beverages: string
  snacks: string
  condiments: string
  frozenFoods: string
  other: string

  // Food List
  yourFoodItems: string
  searchFoodItems: string
  allStatus: string
  fresh: string
  expired: string
  allCategories: string
  noItemsFound: string
  noItemsYet: string
  startByAdding: string
  tryAdjusting: string

  // Status Messages
  expiresIn: string
  expiredDaysAgo: string
  freshFor: string
  expiresOn: string
  day: string
  days: string
  nextIn: string

  // Notifications
  notifications: string
  markAllRead: string
  noNotificationsYet: string
  foodExpired: string
  expiredYesterday: string
  foodExpiringSoon: string
  foodExpiresToday: string
  expiresNow: string

  // Notification Settings
  notificationSettings: string
  configureReminders: string
  browserNotifications: string
  desktopNotifications: string
  dailyReminders: string
  dailySummaries: string
  dailyReminderTime: string
  expirationWarning: string
  getNotifiedBefore: string
  testNotification: string
  notificationsBlocked: string
  enableInBrowser: string

  // Time options
  morning7: string
  morning8: string
  morning9: string
  morning10: string
  morning11: string
  noon: string
  evening6: string
  evening7: string
  evening8: string

  // Warning periods
  dayBefore: string
  daysBefore: string
  weekBefore: string

  // Recent Items
  recentItems: string
  latestAdditions: string

  // Common
  loading: string
  error: string
  success: string
  delete: string
  confirm: string

  // Validation Messages
  fillAllFields: string
  passwordsDontMatch: string
  passwordTooShort: string
  invalidCredentials: string
  registrationFailed: string

  // Reminders
  back: string
  reminders: string
  remindersDescription: string
  expiredItemsDescription: string
  expiredOn: string
  expiringSoonDescription: string
  expiresToday: string
  expiresTomorrow: string
  daysLeft: string
  noReminders: string
  noRemindersDescription: string
  backToDashboard: string
  muteToday: string
  notificationsMuted: string
  notificationsUnmuted: string
  muteDescription: string
  unmuteDescription: string
  areYouSureLogout: string
  logoutDescription: string
  dashboard: string
  welcomeBackName: string
  trackManageNeverWaste: string
  loadingInventory: string
  smartAlertSuggestion: string
  dairySuggestionText: string
  applyNow: string
  settingsUpdatedToast: string
  alertThresholdSetTo: string
  confirmClearAll: string
  clearAllDescription: string
}

export const translations: Record<Language, Translations> = {
  en: {
    // Authentication
    welcomeBack: "Welcome Back",
    signInToAccount: "Sign in to your food tracker account",
    email: "Email",
    password: "Password",
    signIn: "Sign In",
    signingIn: "Signing in...",
    createAccount: "Create Account",
    joinUs: "Join us to start tracking your food",
    fullName: "Full Name",
    createPassword: "Create a password",
    confirmPassword: "Confirm your password",
    creatingAccount: "Creating account...",
    dontHaveAccount: "Don't have an account?",
    alreadyHaveAccount: "Already have an account?",
    signUp: "Sign up",

    // Dashboard
    foodTracker: "Food Tracker",
    reduceWasteSaveMoney: "Reduce waste, save money",
    welcome: "Welcome",
    signOut: "Sign Out",

    // Stats
    totalItems: "Total Items",
    foodItemsTracked: "Food items tracked",
    freshItems: "Fresh Items",
    stillGoodToEat: "Still good to eat",
    expiringSoon: "Expiring Soon",
    useWithinDays: "Use within 3 days",
    expiredItems: "Expired Items",
    needAttention: "Need attention",

    // Quick Actions
    quickActions: "Quick Actions",
    commonTasks: "Common tasks and shortcuts",
    addFoodItem: "Add Food Item",
    trackNewFood: "Track a new food item",
    scanBarcode: "Scan Barcode",
    quickAddBarcode: "Quick add with barcode",
    viewReminders: "View Reminders",
    checkExpiringItems: "Check expiring items",
    settings: "Settings",
    appPreferences: "App preferences",
    managePreferences: "Manage your app preferences and notifications",
    language: "Language",
    languageDescription: "Choose your preferred language for the app",
    profile: "Profile",
    profileDescription: "Your account information",
    name: "Name",

    // Food Management
    addFood: "Add Food Item",
    trackNewItem: "Track a new food item and its expiration date",
    editFoodItem: "Edit Food Item",
    updateDetails: "Update your food item details",
    foodName: "Food Name",
    category: "Category",
    selectCategory: "Select category",
    quantity: "Quantity",
    unit: "Unit",
    purchaseDate: "Purchase Date",
    expirationDate: "Expiration Date",
    notes: "Notes",
    notesOptional: "Notes (Optional)",
    additionalNotes: "Any additional notes about this item...",
    addItem: "Add Item",
    adding: "Adding...",
    saveChanges: "Save Changes",
    saving: "Saving...",
    cancel: "Cancel",
    edit: "Edit",

    // Food Categories
    fruits: "Fruits",
    vegetables: "Vegetables",
    dairy: "Dairy",
    meatFish: "Meat & Fish",
    grainsCereals: "Grains & Cereals",
    beverages: "Beverages",
    snacks: "Snacks",
    condiments: "Condiments",
    frozenFoods: "Frozen Foods",
    other: "Other",

    // Food List
    yourFoodItems: "Your Food Items",
    searchFoodItems: "Search food items...",
    allStatus: "All Status",
    fresh: "Fresh",
    expired: "Expired",
    allCategories: "All Categories",
    noItemsFound: "No food items found",
    noItemsYet: "No items added yet",
    startByAdding: "Start by adding your first food item to track its expiration date.",
    tryAdjusting: "Try adjusting your search or filter criteria.",

    // Status Messages
    expiresIn: "Expires in",
    expiredDaysAgo: "Expired",
    freshFor: "Fresh for",
    expiresOn: "Expires",
    day: "day",
    days: "days",
    nextIn: "Next in",

    // Notifications
    notifications: "Notifications",
    markAllRead: "Mark all read",
    noNotificationsYet: "No notifications yet",
    foodExpired: "Food Item Expired",
    expiredYesterday: "expired yesterday. Consider removing it from your inventory.",
    foodExpiringSoon: "Food Expiring Soon",
    foodExpiresToday: "Food Expires Today",
    expiresNow: "expires today! Use it now or it will go bad.",

    // Notification Settings
    notificationSettings: "Notification Settings",
    configureReminders: "Configure how and when you receive expiration reminders",
    browserNotifications: "Browser Notifications",
    desktopNotifications: "Receive desktop notifications for expiring items",
    dailyReminders: "Daily Reminders",
    dailySummaries: "Get daily summaries of expiring items",
    dailyReminderTime: "Daily Reminder Time",
    expirationWarning: "Expiration Warning",
    getNotifiedBefore: "Get notified when items are about to expire",
    testNotification: "Test Notification",
    notificationsBlocked:
      "Browser notifications are blocked. Enable them in your browser settings to receive desktop alerts.",
    enableInBrowser: "Enable them in your browser settings to receive desktop alerts.",

    // Time options
    morning7: "7:00 AM",
    morning8: "8:00 AM",
    morning9: "9:00 AM",
    morning10: "10:00 AM",
    morning11: "11:00 AM",
    noon: "12:00 PM",
    evening6: "6:00 PM",
    evening7: "7:00 PM",
    evening8: "8:00 PM",

    // Warning periods
    dayBefore: "1 day before",
    daysBefore: "days before",
    weekBefore: "1 week before",

    // Recent Items
    recentItems: "Recent Items",
    latestAdditions: "Your latest food additions",

    // Common
    loading: "Loading...",
    error: "Error",
    success: "Success",
    delete: "Delete",
    confirm: "Confirm",

    // Validation Messages
    fillAllFields: "Please fill in all fields",
    passwordsDontMatch: "Passwords do not match",
    passwordTooShort: "Password must be at least 6 characters",
    invalidCredentials: "Invalid email or password",
    registrationFailed: "Registration failed. Please try again.",

    // Reminders
    back: "Back",
    reminders: "Reminders",
    remindersDescription: "Items that need your attention",
    expiredItemsDescription: "These items have passed their expiration date",
    expiredOn: "Expired on",
    expiringSoonDescription: "These items will expire within 3 days",
    expiresToday: "Expires today",
    expiresTomorrow: "Expires tomorrow",
    daysLeft: "days left",
    noReminders: "No urgent reminders",
    noRemindersDescription: "All your food items are fresh! Check back later.",
    backToDashboard: "Back to Dashboard",
    muteToday: "Mute Today",
    notificationsMuted: "Notifications Muted",
    notificationsUnmuted: "Notifications Unmuted",
    muteDescription: "You won't receive alerts for the rest of today.",
    unmuteDescription: "Alerts are now active.",
    areYouSureLogout: "Are you sure you want to log out?",
    logoutDescription: "You will be redirected to the home page.",
    dashboard: "Dashboard",
    welcomeBackName: "Welcome back,",
    trackManageNeverWaste: "Track, manage, and never waste food again.",
    loadingInventory: "Loading your inventory...",
    smartAlertSuggestion: "Smart Alert Suggestion",
    dairySuggestionText: "You store mostly dairy products. We suggest setting your expiry alerts to 2 days for better freshness tracking.",
    applyNow: "Apply Now",
    settingsUpdatedToast: "Settings Updated",
    alertThresholdSetTo: "Your alert threshold is now set to 2 days.",
    confirmClearAll: "Clear All Notifications?",
    clearAllDescription: "Are you sure you want to clear all notifications? This cannot be undone.",
  },

  rw: {
    // Authentication
    welcomeBack: "Murakaza neza",
    signInToAccount: "Injira muri konti yawe yo gukurikirana ibiryo",
    email: "Imeyili",
    password: "Ijambo ry'ibanga",
    signIn: "Injira",
    signingIn: "Urinjira...",
    createAccount: "Kora Konti",
    joinUs: "Dufatanye kugira ngo utangire gukurikirana ibiryo byawe",
    fullName: "Amazina yose",
    createPassword: "Kora ijambo ry'ibanga",
    confirmPassword: "Emeza ijambo ry'ibanga",
    creatingAccount: "Turimo gukora konti...",
    dontHaveAccount: "Ntufite konti?",
    alreadyHaveAccount: "Usanzwe ufite konti?",
    signUp: "Iyandikishe",

    // Dashboard
    foodTracker: "Gukurikirana Ibiryo",
    reduceWasteSaveMoney: "Gabanya imyanda, uzigame amafaranga",
    welcome: "Murakaza neza",
    signOut: "Sohoka",

    // Stats
    totalItems: "Ibintu Byose",
    foodItemsTracked: "Ibiryo bikurikiranwa",
    freshItems: "Ibiryo Bishya",
    stillGoodToEat: "Biracyafite ubwiza",
    expiringSoon: "Bigiye Kurangira",
    useWithinDays: "Koresha mu minsi 3",
    expiredItems: "Ibiryo Byarangiye",
    needAttention: "Bikeneye kwitabwaho",

    // Quick Actions
    quickActions: "Ibikorwa Byihuse",
    commonTasks: "Ibikorwa bisanzwe n'inzira ngufi",
    addFoodItem: "Ongeraho Ibiryo",
    trackNewFood: "Kurikirana ibiryo bishya",
    scanBarcode: "Siga Barcode",
    quickAddBarcode: "Ongeraho vuba ukoresheje barcode",
    viewReminders: "Reba Ibyibutso",
    checkExpiringItems: "Reba ibiryo bigiye kurangira",
    settings: "Amagenamiterere",
    appPreferences: "Amahitamo ya porogaramu",
    managePreferences: "Koresha amahitamo ya porogaramu yawe n'ubutumwa",
    language: "Ururimi",
    languageDescription: "Hitamo ururimi wifuza gukoresha muri porogaramu",
    profile: "Umwirondoro",
    profileDescription: "Amakuru ya konti yawe",
    name: "Izina",

    // Food Management
    addFood: "Ongeraho Ibiryo",
    trackNewItem: "Kurikirana ibiryo bishya n'itariki yazo yo kurangira",
    editFoodItem: "Hindura Ibiryo",
    updateDetails: "Vugurura amakuru y'ibiryo byawe",
    foodName: "Izina ry'Ibiryo",
    category: "Icyiciro",
    selectCategory: "Hitamo icyiciro",
    quantity: "Umubare",
    unit: "Igipimo",
    purchaseDate: "Itariki yo Kugura",
    expirationDate: "Itariki yo Kurangira",
    notes: "Inyandiko",
    notesOptional: "Inyandiko (Ntabwo ari ngombwa)",
    additionalNotes: "Inyandiko zinyongera kuri iki kintu...",
    addItem: "Ongeraho",
    adding: "Turimo kwongera...",
    saveChanges: "Bika Impinduka",
    saving: "Turimo kubika...",
    cancel: "Hagarika",
    edit: "Hindura",

    // Food Categories
    fruits: "Imbuto",
    vegetables: "Imboga",
    dairy: "Amata n'ibicuruzwa byawo",
    meatFish: "Inyama n'Amafi",
    grainsCereals: "Ingano n'Ibinyampeke",
    beverages: "Ibinyobwa",
    snacks: "Ibiryo byo kurya",
    condiments: "Ibinyobwa",
    frozenFoods: "Ibiryo Byakonje",
    other: "Ibindi",

    // Food List
    yourFoodItems: "Ibiryo Byawe",
    searchFoodItems: "Shakisha ibiryo...",
    allStatus: "Imiterere Yose",
    fresh: "Bishya",
    expired: "Byarangiye",
    allCategories: "Ibyiciro Byose",
    noItemsFound: "Nta biryo byabonetse",
    noItemsYet: "Nta biryo byongewe",
    startByAdding: "Tangira wongeraho ibiryo bya mbere kugira ngo ukurikirane itariki yazo yo kurangira.",
    tryAdjusting: "Gerageza guhindura ibyo ushakisha cyangwa ibipimo.",

    // Status Messages
    expiresIn: "Bizarangira mu",
    expiredDaysAgo: "Byarangiye",
    freshFor: "Bizamara",
    expiresOn: "Bizarangira",
    day: "umunsi",
    days: "iminsi",
    nextIn: "bikurikiraho mu",

    // Notifications
    notifications: "Ubutumwa",
    markAllRead: "Menya byose nk'ibisomwe",
    noNotificationsYet: "Nta butumwa bwageze",
    foodExpired: "Ibiryo Byarangiye",
    expiredYesterday: "byarangiye ejo. Tekereza kubikuraho mu byo ufite.",
    foodExpiringSoon: "Ibiryo Bigiye Kurangira",
    foodExpiresToday: "Ibiryo Bizarangira Uyu Munsi",
    expiresNow: "bizarangira uyu munsi! Bikoreshe ubu cyangwa bizangirika.",

    // Notification Settings
    notificationSettings: "Amagenamiterere y'Ubutumwa",
    configureReminders: "Shiraho uko n'igihe uzabona ibyibutso byo kurangira",
    browserNotifications: "Ubutumwa bwa Mushakisha",
    desktopNotifications: "Akira ubutumwa bwa desktop ku biryo bigiye kurangira",
    dailyReminders: "Ibyibutso bya Buri Munsi",
    dailySummaries: "Bongeraho incamake za buri munsi z'ibiryo bigiye kurangira",
    dailyReminderTime: "Igihe cy'Ibyibutso bya Buri Munsi",
    expirationWarning: "Iburira ryo Kurangira",
    getNotifiedBefore: "Menyeshwa igihe ibintu bigiye kurangira",
    testNotification: "Gerageza Ubutumwa",
    notificationsBlocked:
      "Ubutumwa bwa mushakisha bwahagaritswe. Bushyire mu magenamiterere ya mushakisha kugira ngo ubone ubutumwa bwa desktop.",
    enableInBrowser: "Bushyire mu magenamiterere ya mushakisha kugira ngo ubone ubutumwa bwa desktop.",

    // Time options
    morning7: "7:00 mu gitondo",
    morning8: "8:00 mu gitondo",
    morning9: "9:00 mu gitondo",
    morning10: "10:00 mu gitondo",
    morning11: "11:00 mu gitondo",
    noon: "12:00 mu manywa",
    evening6: "6:00 nimugoroba",
    evening7: "7:00 nimugoroba",
    evening8: "8:00 nimugoroba",

    // Warning periods
    dayBefore: "umunsi 1 mbere",
    daysBefore: "iminsi mbere",
    weekBefore: "icyumweru 1 mbere",

    // Recent Items
    recentItems: "Ibiryo Bigezweho",
    latestAdditions: "Ibiryo byawe bigezweho vuba",

    // Common
    loading: "Birimo gutangura...",
    error: "Ikosa",
    success: "Byagenze neza",
    delete: "Siba",
    confirm: "Emeza",

    // Validation Messages
    fillAllFields: "Nyamuneka uzuza ibice byose",
    passwordsDontMatch: "Amagambo y'ibanga ntabwo ahura",
    passwordTooShort: "Ijambo ry'ibanga rigomba kuba rifite byibuze inyuguti 6",
    invalidCredentials: "Imeyili cyangwa ijambo ry'ibanga ntabwo ari byo",
    registrationFailed: "Kwiyandikisha byanze. Ongera ugerageze.",

    // Reminders
    back: "Inyuma",
    reminders: "Ibyibutso",
    remindersDescription: "Ibintu bikeneye kwitabwaho",
    expiredItemsDescription: "Aya masaha yarangiye rwose",
    expiredOn: "Byarangiye ku",
    expiringSoonDescription: "Bizarangira mu minsi 3",
    expiresToday: "Bizarangira uyu munsi",
    expiresTomorrow: "Bizarangira ejo",
    daysLeft: "iminsi isigaye",
    noReminders: "Nta byibutso byihutirwa",
    noRemindersDescription: "Ibiryo byose ni bishya! Ongera urebe nyuma.",
    backToDashboard: "Subira ku rubuga",
    muteToday: "Guhagarika uyu munsi",
    notificationsMuted: "Ubutumwa bwahagaritswe",
    notificationsUnmuted: "Ubutumwa bwakomeje",
    muteDescription: "Ntabwo ubona ubutumwa kugeza uyu munsi urangiye.",
    unmuteDescription: "Ubutumwa ubu burakora.",
    areYouSureLogout: "Uraze neza ko ushaka gusohoka?",
    logoutDescription: "Uraroherezwa ku rupapuro rw'itangiriro.",
    dashboard: "Incamake",
    welcomeBackName: "Murakaza neza,",
    trackManageNeverWaste: "Kurikirana, amashyirahamwe n'izindi ziryo ntizongere kwangirika.",
    loadingInventory: "Tutarimo gushaka ibiryo byanyu...",
    smartAlertSuggestion: "Inama y'Iburira Ryatanzwe",
    dairySuggestionText: "Ubitsa cyane ibikomoka ku mata. Turakubwira ko washyira iburira ryawe ku minsi 2 kugira ngo ukurikirane ubuziranenge bwabyo neza.",
    applyNow: "Koresha ubu",
    settingsUpdatedToast: "Amagenamiterere yavuguruwe",
    alertThresholdSetTo: "Iburira ryawe rishyize ku minsi 2.",
    confirmClearAll: "Siba ubutumwa bwose?",
    clearAllDescription: "Uraze neza ko ushaka gusiba ubutumwa bwose? Ibi ntibishobora guhinduka.",
  },
}

export function useTranslation(language: Language = "en") {
  return translations[language]
}

export function formatDaysText(days: number, language: Language = "en"): string {
  const t = translations[language]
  if (days === 1) {
    return `1 ${t.day}`
  }
  return `${days} ${t.days}`
}
