import {
  faAddressCard,
  faContactBook,
  faGear,
  faHouse,
  faLink,
  faQuestion,
  faServer,
  faStar,
  faUserGroup,
} from "@fortawesome/free-solid-svg-icons";
import { iconGrid } from "assets/images/icons";

import { route } from "shared/constants/AllRoutes";

export const sidebarConfig = [
  // {
  //   path: route.dashboard,
  //   icon: faDashboard,
  //   title: "Dashboard",
  //   children: [
  //     {
  //       path: route.dashboard,
  //       icon: iconGrid,
  //       title: "Dashboard",
  //     },
  //     {
  //       path: route.statistics,
  //       icon: privacypolicy,
  //       title: "Statistics",
  //     },
  //   ],
  // },
  // {
  //   path: route.userManagement,
  //   icon: faUserGroup,
  //   title: 'User',
  //   children: [
  //     {
  //       path: route.userManagement,
  //       icon: iconGrid,
  //       title: 'User Management'
  //     },
  //     {
  //       path: route.botManagement,
  //       icon: iconGrid,
  //       title: 'Bot Management'
  //     },
  //     {
  //       path: route.kycVerification,
  //       icon: iconGrid,
  //       title: 'KYC Verification'
  //     },
  //     {
  //       path: route.pushNotification,
  //       icon: iconGrid,
  //       title: 'Push Notification'
  //     },
  //   ]
  // },
  {
    path: route.playstore_page,
    icon: faUserGroup,
    title: "Play Store",
    children: [
      {
        path: route.playstore_page,
        icon: iconGrid,
        title: "PlayStore Page",
      },
      {
        path: route.reviewManagement,
        icon: faGear,
        title: "Reviews Management",
      },
      {
        path: route.app_images,
        icon: faGear,
        title: "App Images",
      },
      {
        path: route.apk,
        icon: faGear,
        title: "Apk",
      },
    ],
  },
  {
    path: route.our_results,
    icon: faHouse,
    title: "Home Page",
    children: [
      {
        path: route.banner_images,
        icon: faGear,
        title: "Banner",
      },
      {
        path: route.our_results,
        icon: iconGrid,
        title: "Our results",
      },
      {
        path: route.hero_images,
        icon: iconGrid,
        title: "Hero Images",
      },
      {
        path: route.feature_images,
        icon: iconGrid,
        title: "Feature Images",
      },
      {
        path: route.how_to_play,
        icon: faGear,
        title: "How to Play",
      },
      {
        path: route.how_to_play_videos,
        icon: faGear,
        title: 'How to play Videos',
      },
      {
        path: route.why_choose_us,
        icon: faGear,
        title: "Why Choose us",
      },
      {
        path: route.footer,
        icon: faGear,
        title: "Footer",
      },
      {
        path: route.media_glimpse,
        icon: faGear,
        title: "Media Glimpse",
      },
      {
        path: route.download_section,
        icon: faGear,
        title: "Download Section",
      },
    ],
  },
  {
    path: route.about_us,
    icon: faAddressCard,
    title: "About Us",
    children: [
      {
        path: route.our_vision_content,
        icon: faGear,
        title: "Our Vision Content",
      },
      {
        path: route.our_brand,
        icon: faGear,
        title: "Our Brand",
      },
      {
        path: route.about_us,
        icon: faGear,
        title: "Meet our Team",
      },
      {
        path: route.who_we_are,
        icon: faGear,
        title: "Who we are",
      },
      {
        path: route.dynamic_player_content,
        icon: faGear,
        title: "Dynamic Player Content",
      },
      {
        path: route.dynamic_player_images,
        icon: faGear,
        title: "Dynamic Player Images",
      },
      {
        path: route.founders,
        icon: faGear,
        title: "Founders",
      }
    ],
  },
  {
    path: route.testimonialManagement,
    icon: faStar,
    title: "Testimonials",
  },
  {
    path: route.getAppLink,
    icon: faLink,
    title: "Get app Link",
  },
  {
    path: route.contact_us,
    icon: faContactBook,
    title: 'Contact Us',
    children: [
      {
        path: route.contact_us,
        icon: iconGrid,
        title: 'Admin Details'
      },
      {
        path: route.user_response,
        icon: iconGrid,
        title: 'User responses'
      },
    ]
  },
  {
    path: route.faq_category,
    icon: faQuestion,
    title: 'FAQ',
    children: [
      {
        path: route.faq_category,
        icon: iconGrid,
        title: 'FAQ Category'
      },
      {
        path: route.questions,
        icon: iconGrid,
        title: 'Questions'
      },
    ]
  },
  {
    path: route.seo_home_page,
    icon: faServer,
    title: 'SEO',
    children: [
      {
        path: route.seo_home_page,
        icon: iconGrid,
        title: 'Home Page'
      },
      {
        path: route.seo_about_page,
        icon: iconGrid,
        title: 'About Page'
      },
      {
        path: route.seo_playstore_page,
        icon: iconGrid,
        title: 'PlayStore Page'
      },
      {
        path: route.seo_faq_page,
        icon: iconGrid,
        title: 'FAQ Page'
      },
      {
        path: route.seo_contact_page,
        icon: iconGrid,
        title: 'Contact Us Page'
      },
      {
        path: route.seo_howtoplay_page,
        icon: iconGrid,
        title: 'How to Play Page'
      },
    ]
  },
 
];
