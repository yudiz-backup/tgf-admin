export const ONLY_NUMBER = /^[0-9]*$/
export const EMAIL = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\.[a-zA-Z]{2,})?$/
export const PASSWORD = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?+!@$%^&*-]).{8,15}$/
// eslint-disable-next-line no-useless-escape
export const URL_REGEX = /^(http(s)?:\/\/)[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'()*+,;=.]+$/
export const OTP = /^[0-9]{4}$/

export const TIMES = [
    {
        value:5,
        label:'5'
    },
    {
        value:10,
        label:'10'
    },
    {
        value:15,
        label:'15'
    },
    {
        value:20,
        label:'20'
    },
    {
        value:25,
        label:'25'
    },
    {
        value:30,
        label:'30'
    },
    {
        value:35,
        label:'35'
    },
    {
        value:40,
        label:'40'
    },
    {
        value:45,
        label:'45'
    },
    {
        value:50,
        label:'50'
    },
]

export const SocialLinks = [
    { label: "Select", value: "select" },
    { label: "Facebook", value: "facebook" },
    { label: "Linkedin", value: "linkedin" },
    { label: "Instagram", value: "instagram" },
  ];

  export const TestiMonialPages = [
    { label: "Select", value: "" },
    { label: "Home page", value: "T" },
    { label: "About Us", value: "A" },
  ];