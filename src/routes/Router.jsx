import { lazy } from 'react'
import { route } from 'shared/constants/AllRoutes'

const PublicRoute = lazy(() => import('routes/PublicRoutes'))
const PrivateRoute = lazy(() => import('routes/PrivateRoutes'))

// public Routes Files
const Login = lazy(() => import('views/auth/login'))
const ForgotPassword = lazy(() => import('views/auth/forgot-password'))
const ResetPassword = lazy(() => import('views/auth/reset-password'))

// Private Routes Files
const Profile = lazy(() => import('views/profile'))
const ChangePassword = lazy(() => import('views/profile/changePassword'))


//CRM Management
const Dashboard = lazy(() => import('views/crmManagement/dashboard'))
// const Statistics = lazy(() => import('views/crmManagement/statistics'))

// //User
// const UserManagement = lazy(() => import('views/user/userManagement'))
// const AddUser = lazy(() => import('views/user/userManagement/addUser'))
// const ViewUser = lazy(() => import('views/user/userManagement/viewUser'))
// const EditUser = lazy(() => import('views/user/userManagement/editUser'))
// const BotManagement = lazy(() => import('views/user/botManagement'))
// const KycVerification = lazy(() => import('views/user/kycVerification'))
// const PushNotification = lazy(() => import('views/user/pushNotification'))
// const AddNotification = lazy(() => import('views/user/pushNotification/addNotification'))

// //Poker
// const NLHManagement = lazy(() => import('views/poker/NLHManagement'))
// const AddNLHTable = lazy(() => import('views/poker/NLHManagement/addNLH'))
// const ViewNLHProfile = lazy(() => import('views/poker/NLHManagement/viewNLH'))
// const PLOManagement = lazy(() => import('views/poker/PLOManagement'))
// const OFCManagement = lazy(() => import('views/poker/OFCManagement'))

// //Tournament
// const Tickets = lazy(() => import('views/tournament/tickets'))
// const Prototype = lazy(() => import('views/tournament/prototype'))
// const AddPrototype = lazy(() => import('views/tournament/prototype/addPrototype'))
// const ViewPrototype = lazy(() => import('views/tournament/prototype/viewPrototype'))
// const Schedule = lazy(() => import('views/tournament/schedule'))
// const ViewSchedule = lazy(() => import('views/tournament/schedule/viewSchedule'))
// const AddSchedule = lazy(() => import('views/tournament/schedule/addSchedule'))

// //Finance
// const Transaction = lazy(() => import('views/finance/transaction'))
// const TDSManagement = lazy(() => import('views/finance/tds'))
// const WithdrawalManagement = lazy(() => import('views/finance/withdrawal'))

// //Logs Management
// const GameLogs = lazy(() => import('views/logsManagement/gameLogs'))
// const ViewGameLogs = lazy(() => import('views/logsManagement/gameLogs/viewGameLogs'))
// const AdminLogs = lazy(() => import('views/logsManagement/adminLogs'))

// //Promotion
// const Store = lazy(() => import('views/promotion/store'))
// const PromoCode = lazy(() => import('views/promotion/promocode'))
// const AddPromoCode = lazy(() => import('views/promotion/promocode/addPromoCode'))
// const ViewPromoCode = lazy(() => import('views/promotion/promocode/viewPromoCode'))
// const Bonus = lazy(() => import('views/promotion/bonus'))

// //Help Desk
// const MessageCenter = lazy(() => import('views/helpDesk/messageCenter'))
// const Report = lazy(() => import('views/helpDesk/report'))
// const EditReport = lazy(() => import('views/helpDesk/report/editReport'))
// const Banner = lazy(() => import('views/helpDesk/banner'))

//Settings
const Settings = lazy(() => import('views/settings'))

const PlayStorePage = lazy(() => import('views/playStorePage'))
const AppImages = lazy(() => import('views/playStorePage/AppImages'))
const Apk = lazy(() => import('views/playStorePage/Apk'))

//Home page
const OurResult = lazy(() => import('views/Home/OurResults'))
const HowToPlay = lazy(() => import('views/Home/HowToPlay'))
const WhyChooseUs = lazy(() => import('views/Home/WhyChooseUs'))
const MediaGlimpse = lazy(() => import('views/Home/MediaGlimpse'))
const Banner = lazy(() => import('views/Home/Banner'))
const HeroImages = lazy(() => import('views/Home/HeroImages'))
const FeatureImages = lazy(() => import('views/Home/FeatureImages'))
const Footer = lazy(() => import('views/footer'))
const DownloadSection = lazy(() => import('views/Home/DownloadSection'))


//FAQ page
const FaqManagement = lazy(() => import('views/FAQ/index'))
const EditFaqCategory = lazy(() => import('views/FAQ/EditFaqCategory'))
const AddFaqCategory = lazy(() => import('views/FAQ/AddFaqCategory'))

//Questions
const QuestionManagement = lazy(() => import('views/FAQ/questions/index'))
const AddQuestion = lazy(() => import('views/FAQ/questions/AddQuestion'))
const EditQuestion = lazy(() => import('views/FAQ/questions/EditQuestion'))

//Contact us
const ContactUs = lazy(() => import('views/ContactUs/index'))
const UserResponse = lazy(() => import('views/ContactUs/UserResponse'))

const HowToPlayVideo = lazy(() => import('views/HowToPlay/HowToPlayVideo'))

//Get app link
const GetAppLink = lazy(() => import('views/GetAppLink/index'))

//Reviews
const ReviewsManagement = lazy(() => import('views/reviewsManagement'))
const AddReview = lazy(() => import('views/reviewsManagement/AddReview'))
const EditReview = lazy(() => import('views/reviewsManagement/EditReview'))

//TestiMonial
const TestimonialManagement = lazy(() => import('views/testimonialManagement'))
const AddTestimonial = lazy(() => import('views/testimonialManagement/AddTestimonial'))
const EditTestimonial = lazy(() => import('views/testimonialManagement/EditTestimonial'))

//About us
const Founders = lazy(() => import('views/Home/Founders'))
const AboutUs = lazy(() => import('views/AboutUs/index'))
const OurVision = lazy(() => import('views/AboutUs/OurVision'))
const OurBrand = lazy(() => import('views/AboutUs/OurBrand'))
const WhoWeAre = lazy(() => import('views/AboutUs/WhoWeAre'))
const DynamicPlayerContent = lazy(() => import('views/AboutUs/DynamicPlayerContent'))
const DynamicPlayerImages= lazy(() => import('views/AboutUs/DynamicPlayerContent/DynamicPlayerImages'))

//SEO
const homePageSEO = lazy(() => import('views/SEO/index'))
const AboutPageSEO = lazy(() => import('views/SEO/SeoAboutUs'))
const ContactPageSEO = lazy(() => import('views/SEO/SeoContactUs'))
const FaqPageSEO = lazy(() => import('views/SEO/SeoFaq'))
const HowToPlayPageSEO = lazy(() => import('views/SEO/SeoHowToPlay'))
const PlayStorePageSEO = lazy(() => import('views/SEO/SeoPlayStorePage'))

const RoutesDetails = [
  {
    defaultRoute: '',
    Component: PublicRoute,
    props: {},
    isPrivateRoute: false,
    children: [
      { path: '/login', Component: Login, exact: true },
      { path: route.forgotPassword, Component: ForgotPassword, exact: true },
      {
        path: route.resetPassword(':token'),
        Component: ResetPassword,
        exact: true
      }
    ]
  },
  {
    defaultRoute: '',
    Component: PrivateRoute,
    props: {},
    isPrivateRoute: true,
    children: [
      { path: route.editProfile, Component: Profile, exact: true },
      { path: route.changePassword, Component: ChangePassword, exact: true },

      { path: route.dashboard, Component: Dashboard, exact: true },
      // { path: route.statistics, Component: Statistics, exact: true },

      // { path: route.userManagement, Component: UserManagement, exact: true },
      // { path: route.addUser, Component: AddUser, exact: true },
      // { path: route.viewUser(':id'), Component: ViewUser, exact: true },
      // { path: route.editUser(':id'), Component: EditUser, exact: true },
      
      // { path: route.botManagement, Component: BotManagement, exact: true },
      // { path: route.kycVerification, Component: KycVerification, exact: true },
      // { path: route.pushNotification, Component: PushNotification, exact: true },
      // { path: route.addNotification, Component: AddNotification, exact: true },
      
      // { path: route.nlhManagement, Component: NLHManagement, exact: true },
      // { path: route.addNLHTable, Component: AddNLHTable, exact: true },
      // { path: route.viewNLH(':id'), Component: ViewNLHProfile, exact: true },
      // { path: route.ploManagement, Component: PLOManagement, exact: true },
      // { path: route.ofcManagement, Component: OFCManagement, exact: true },

      // { path: route.tournament, Component: Tickets, exact: true },
      // { path: route.prototype, Component: Prototype, exact: true },
      // { path: route.addPrototype, Component: AddPrototype, exact: true },
      // { path: route.viewPrototype(':id'), Component: ViewPrototype, exact: true },
      // { path: route.schedule, Component: Schedule, exact: true },
      // { path: route.viewSchedule(':id'), Component: ViewSchedule, exact: true },
      // { path: route.editSchedule(':id'), Component: AddSchedule, exact: true },

      // { path: route.transaction, Component: Transaction, exact: true },
      // { path: route.tdsManagement, Component: TDSManagement, exact: true },
      // { path: route.withdrawal, Component: WithdrawalManagement, exact: true },
      
      // { path: route.gameLogs, Component: GameLogs, exact: true },
      // { path: route.viewGameLogs(':id'), Component: ViewGameLogs, exact: true },
      // { path: route.adminLogs, Component: AdminLogs, exact: true },

      // { path: route.store, Component: Store, exact: true },
      // { path: route.promoCode, Component: PromoCode, exact: true },
      // { path: route.addPromoCode, Component: AddPromoCode, exact: true },
      // { path: route.viewPromoCode(':id'), Component: ViewPromoCode, exact: true },
      // { path: route.bonus, Component: Bonus, exact: true },

      // { path: route.messageCenter, Component: MessageCenter, exact: true },
      // { path: route.report, Component: Report, exact: true },
      // { path: route.editReport(':id'), Component: EditReport, exact: true },
      // { path: route.banner, Component: Banner, exact: true },

      { path: route.playstore_page, Component: PlayStorePage, exact: true },
      { path: route.apk, Component: Apk, exact: true },
      { path: route.app_images, Component: AppImages, exact: true },
      { path: route.our_results, Component: OurResult, exact: true },
      { path: route.how_to_play, Component: HowToPlay, exact: true },
      { path: route.why_choose_us, Component: WhyChooseUs, exact: true },
      { path: route.media_glimpse, Component: MediaGlimpse, exact: true },
      { path: route.banner_images, Component: Banner, exact: true },
      { path: route.hero_images, Component: HeroImages, exact: true },
      { path: route.feature_images, Component: FeatureImages, exact: true },
      { path: route.download_section, Component: DownloadSection, exact: true },

      { path: route.getAppLink, Component: GetAppLink, exact: true },

      { path: route.contact_us, Component: ContactUs, exact: true },
      { path: route.user_response, Component: UserResponse, exact: true },

      { path: route.settings, Component: Settings, exact: true },
      { path: route.reviewManagement, Component: ReviewsManagement, exact: true },
      { path: route.addReview, Component: AddReview, exact: true },
      { path: route.editReview(':id'), Component: EditReview, exact: true },

      { path: route.testimonialManagement, Component: TestimonialManagement, exact: true },
      { path: route.addTestimonial, Component: AddTestimonial, exact: true },
      { path: route.editTestimonial(':id'), Component: EditTestimonial, exact: true },

      { path: route.footer, Component: Footer, exact: true },
      { path: route.founders, Component: Founders, exact: true },
      { path: route.about_us, Component: AboutUs, exact: true },
      { path: route.our_vision_content, Component: OurVision, exact: true },
      { path: route.our_brand, Component: OurBrand, exact: true },
      { path: route.who_we_are, Component: WhoWeAre, exact: true },
      { path: route.dynamic_player_content, Component: DynamicPlayerContent, exact: true },
      { path: route.dynamic_player_images, Component: DynamicPlayerImages, exact: true },

      { path: route.how_to_play_videos, Component: HowToPlayVideo, exact: true },

      { path: route.faq_category, Component: FaqManagement, exact: true },
      { path: route.editFaqCategory(':id'), Component: EditFaqCategory, exact: true },
      { path: route.add_category, Component: AddFaqCategory, exact: true },


      { path: route.questions, Component: QuestionManagement, exact: true },
      { path: route.editQuestion(':id'), Component: EditQuestion, exact: true },
      { path: route.add_question, Component: AddQuestion, exact: true },


      { path: route.seo_home_page, Component: homePageSEO, exact: true },
      { path: route.seo_about_page, Component: AboutPageSEO, exact: true },
      { path: route.seo_contact_page, Component: ContactPageSEO, exact: true },
      { path: route.seo_faq_page, Component: FaqPageSEO, exact: true },
      { path: route.seo_howtoplay_page, Component: HowToPlayPageSEO, exact: true },
      { path: route.seo_playstore_page, Component: PlayStorePageSEO, exact: true },

    ]
  }
]

export default RoutesDetails
