import React from 'react'

export default function BlurBg () {
    return (
        <svg style={{ cursor: 'pointer' }} width='12' height='12' viewBox='0 0 12 12' fill='none' xmlns='http://www.w3.org/2000/svg'>
            {/* <path
        d='M0.24275 11.7573C0.398229 11.9127 0.609076 12 0.828924 12C1.04877 12 1.25962 11.9127 1.4151 11.7573L6.00501 7.16734L10.5949 11.7573C10.7513 11.9083 10.9607 11.9918 11.1781 11.99C11.3955 11.9881 11.6034 11.9009 11.7572 11.7472C11.9109 11.5934 11.9981 11.3855 12 11.1681C12.0019 10.9507 11.9183 10.7413 11.7673 10.5849L7.17736 5.99499L11.7673 1.40509C11.9183 1.24872 12.0019 1.03929 12 0.821897C11.9981 0.60451 11.9109 0.39656 11.7572 0.242838C11.6034 0.0891159 11.3955 0.00192038 11.1781 3.13422e-05C10.9607 -0.0018577 10.7513 0.081711 10.5949 0.232739L6.00501 4.82264L1.4151 0.232739C1.25873 0.081711 1.0493 -0.0018577 0.831909 3.13422e-05C0.614521 0.00192038 0.406572 0.0891159 0.252849 0.242838C0.0991272 0.39656 0.0119316 0.60451 0.0100426 0.821897C0.00815355 1.03929 0.0917223 1.24872 0.24275 1.40509L4.83266 5.99499L0.24275 10.5849C0.0873173 10.7404 0 10.9512 0 11.1711C0 11.3909 0.0873173 11.6018 0.24275 11.7573Z'
        fill={fill}
      /> */}
            <defs><filter id="bbblurry-filter" x="-100%" y="-100%" width="400%" height="400%" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feGaussianBlur stdDeviation="47" x="0%" y="0%" width="100%" height="100%" in="SourceGraphic" edgeMode="none" result="blur"></feGaussianBlur></filter></defs><g filter="url(#bbblurry-filter)"><ellipse rx="148.5" ry="142" cx="586.1265369762074" cy="174.50827719948512" fill="#0e5dbcff"></ellipse><ellipse rx="148.5" ry="142" cx="226.63538152521312" cy="161.24551391601562" fill="#48cef0ff"></ellipse><ellipse rx="148.5" ry="142" cx="366.8365728204901" cy="364.33306884765625" fill="#8d36efe9"></ellipse></g>
        </svg>
    )
}

