export const route = {
  login: '/',
  forgotPassword: '/forgot-password',
  resetPassword: (token) => `/reset-password/${token}`,
  changePassword: '/change-password',
  editProfile: '/profile',

  dashboard: '/dashboard',
  transactionStats: '/Transaction-Stats',
  statistics: '/Statistics',

  reviewManagement: '/review-management',
  addReview: '/add-review',
  editReview: (id) => `/edit-review/${id}`,

  testimonialManagement: '/testimonial-management',
  addTestimonial: '/add-testimonial',
  editTestimonial: (id) => `/edit-testimonial/${id}`,

  playstore_page: '/playstore-page',
  app_images: '/app-images',
  our_results: '/our-results',
  how_to_play: '/how-to-play',
  why_choose_us: '/why-choose-us',
  media_glimpse: '/media-glimpse',
  banner_images: "/banner",
  hero_images: "/hero-images",
  feature_images: "/feature-images",
  apk: "/apk",
  download_section: "/download-section",

  contact_us: "/contact-us",
  user_response: "/user-responses",

  how_to_play_videos: "/how-to-play-videos",

  faq_category: "/faq-category",
  add_category: "/add-category",
  editFaqCategory: (id) => `/edit-faq-category/${id}`,

  questions: `/questions`,
  add_question: "/add-question",
  editQuestion: (id) => `/edit-question/${id}`,

  userManagement: '/user-management',
  addUser: '/add-new-user',
  viewUser: (id) => `/view-user-profile/${id}`,
  editUser: (id) => `/edit-user-profile/${id}`,

  botManagement: '/bot-management',
  kycVerification: '/KYC-verification',
  pushNotification: '/push-notification',
  addNotification: '/add-new-notification',

  nlhManagement: '/NLH',
  addNLHTable: '/add-new-table',
  viewNLH: (id) => `/view-table-details/${id}`,
  ploManagement: '/PLO',
  ofcManagement: '/OFC',

  tournament: '/tickets',
  prototype: '/prototype',
  addPrototype: '/add-new-prototype',
  viewPrototype: (id) => `/view-prototype/${id}`,
  schedule: '/schedule',
  viewSchedule: (id) => `/view-user-schedule/${id}`,
  editSchedule: (id) => `/add-new-schedule/${id}`,

  transaction: '/transaction-management',
  tdsManagement: '/TDS-management',
  withdrawal: '/withdrawal-management',

  gameLogs: '/game-logs',
  viewGameLogs: (id) => `/view-game-logs/${id}`,
  adminLogs: '/admin-logs',

  store: '/store',
  promoCode: '/promo-code',
  addPromoCode: '/add-new-promocode',
  viewPromoCode: (id) => `/view-promocode/${id}`,
  bonus: '/bonus',

  messageCenter: '/message-center',
  report: '/report',
  editReport: (id) => `/edit-user-report/${id}`,
  banner: '/banner',

  settings: '/settings',
  getAppLink: '/get-app-link',

  footer: "/footer",
  founders: "/founders",
  about_us: "/about-us",
  our_brand: "/our-brand",
  our_vision_content: "/our-vision-content",
  who_we_are: "/who-we-are",
  dynamic_player_content: "/dynamic-player-content",
  dynamic_player_images: "/dynamic-player-images",

  seo_home_page: '/seo-home-page',
  seo_about_page: '/seo-about-page',
  seo_playstore_page: '/seo-play-store-page',
  seo_faq_page: '/seo-faq-page',
  seo_contact_page: '/seo-contact-page',
  seo_howtoplay_page: '/seo-how-to-play-page',
}
