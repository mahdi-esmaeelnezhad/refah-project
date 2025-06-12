export const InfoIcon = ({ onClick }: { onClick: () => void }) => {
  return (
    <svg
      width='35'
      height='35'
      viewBox='0 0 35 35'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      onClick={onClick}
    >
      <path
        d='M17.5001 2.91699C9.46466 2.91699 2.91675 9.46491 2.91675 17.5003C2.91675 25.5357 9.46466 32.0837 17.5001 32.0837C25.5355 32.0837 32.0834 25.5357 32.0834 17.5003C32.0834 9.46491 25.5355 2.91699 17.5001 2.91699ZM16.4063 11.667C16.4063 11.0691 16.9022 10.5732 17.5001 10.5732C18.098 10.5732 18.5938 11.0691 18.5938 11.667V18.9587C18.5938 19.5566 18.098 20.0524 17.5001 20.0524C16.9022 20.0524 16.4063 19.5566 16.4063 18.9587V11.667ZM18.8417 23.8878C18.7688 24.0774 18.6667 24.2232 18.5355 24.3691C18.3897 24.5003 18.2292 24.6024 18.0542 24.6753C17.8792 24.7482 17.6897 24.792 17.5001 24.792C17.3105 24.792 17.1209 24.7482 16.9459 24.6753C16.7709 24.6024 16.6105 24.5003 16.4647 24.3691C16.3334 24.2232 16.2313 24.0774 16.1584 23.8878C16.0855 23.7128 16.0417 23.5232 16.0417 23.3337C16.0417 23.1441 16.0855 22.9545 16.1584 22.7795C16.2313 22.6045 16.3334 22.4441 16.4647 22.2982C16.6105 22.167 16.7709 22.0649 16.9459 21.992C17.2959 21.8462 17.7042 21.8462 18.0542 21.992C18.2292 22.0649 18.3897 22.167 18.5355 22.2982C18.6667 22.4441 18.7688 22.6045 18.8417 22.7795C18.9147 22.9545 18.9584 23.1441 18.9584 23.3337C18.9584 23.5232 18.9147 23.7128 18.8417 23.8878Z'
        fill='#4973DE'
      />
    </svg>
  )
}

export const CloseIcon = ({ onClick }: { onClick: () => void }) => {
  return (
    <svg
      width='35'
      height='35'
      viewBox='0 0 35 35'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      onClick={onClick}
    >
      <path
        d='M11.3127 11.3125L23.6871 23.6869'
        stroke='black'
        stroke-width='3'
        stroke-linecap='round'
        stroke-linejoin='round'
      />
      <path
        d='M11.3129 23.6869L23.6873 11.3125'
        stroke='black'
        stroke-width='3'
        stroke-linecap='round'
        stroke-linejoin='round'
      />
    </svg>
  )
}

export const WifiIcon = () => {
  return (
    <svg
      width='26'
      height='20'
      viewBox='0 0 26 20'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M14.8539 15.6375C15.8672 16.612 15.8672 18.2211 14.8539 19.2296C14.3357 19.7395 13.6794 20.0001 13 20.0001C12.3207 20.0001 11.6759 19.7395 11.1462 19.2523C10.1329 18.2551 10.1329 16.6347 11.1462 15.6375C12.1595 14.6404 13.8291 14.6404 14.8424 15.6375H14.8539Z'
        fill='white'
      />
      <path
        d='M19.8512 10.6175C20.6573 11.3314 20.6803 12.5666 19.9318 13.3371C19.5403 13.7224 19.0452 13.9263 18.5271 13.9263C18.0089 13.9263 17.5598 13.745 17.1683 13.3824C14.6466 11.0028 11.365 11.0028 8.80872 13.3824C8.02572 14.1303 6.80518 14.0963 6.04521 13.3258C5.28525 12.5552 5.31979 11.3541 6.10278 10.6062C10.1444 6.78751 15.7981 6.78751 19.8512 10.6062V10.6175Z'
        fill='white'
      />
      <path
        d='M25.459 7.89758C25.0675 8.28285 24.5724 8.48682 24.0542 8.48682C23.5361 8.48682 23.064 8.30551 22.6955 7.94291C21.4749 6.76444 20.0932 5.81259 18.6308 5.12138C14.9807 3.399 10.9966 3.399 7.38105 5.12138C5.91869 5.81259 4.57148 6.76444 3.31639 7.94291C2.55643 8.69078 1.31285 8.69078 0.552882 7.92024C-0.207083 7.1497 -0.172539 5.94857 0.575911 5.2007C2.10735 3.71628 3.83455 2.53781 5.67689 1.66529C10.3979 -0.555678 15.614 -0.555678 20.3004 1.67662C22.1543 2.54914 23.87 3.72761 25.4014 5.21203C26.1844 5.92591 26.2074 7.16104 25.459 7.90891V7.89758Z'
        fill='white'
      />
    </svg>
  )
}

export const CalendarIcon = () => {
  return (
    <svg
      width='21'
      height='24'
      viewBox='0 0 21 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M6.27783 1V4.16667'
        stroke='white'
        stroke-width='1.8'
        stroke-miterlimit='10'
        stroke-linecap='round'
        stroke-linejoin='round'
      />
      <path
        d='M14.7222 1V4.16667'
        stroke='white'
        stroke-width='1.8'
        stroke-miterlimit='10'
        stroke-linecap='round'
        stroke-linejoin='round'
      />
      <path
        d='M14.7222 2.58301C18.2372 2.77301 20 4.11356 20 9.07467V15.598C20 19.9469 18.9444 22.1213 13.6667 22.1213H7.33333C2.05556 22.1213 1 19.9469 1 15.598V9.07467C1 4.11356 2.76278 2.78356 6.27778 2.58301H14.7222Z'
        stroke='white'
        stroke-width='2'
        stroke-miterlimit='10'
        stroke-linecap='round'
        stroke-linejoin='round'
      />
      <path
        d='M19.7361 17.4668H1.26392'
        stroke='white'
        stroke-width='1.5'
        stroke-miterlimit='10'
        stroke-linecap='round'
        stroke-linejoin='round'
      />
      <path
        d='M12.6111 7.86133V13.6669'
        stroke='white'
        stroke-width='1.5'
        stroke-linecap='round'
      />
      <path
        d='M8.38892 7.86133L8.38892 13.6669'
        stroke='white'
        stroke-width='1.5'
        stroke-linecap='round'
      />
    </svg>
  )
}

export const NofiIcon = () => {
  return (
    <svg
      width='22'
      height='22'
      viewBox='0 0 22 22'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M9.68828 20.6523H14.7883C19.0383 20.6523 20.7383 18.9523 20.7383 14.7023V9.60234C20.7383 5.35234 19.0383 3.65234 14.7883 3.65234H9.68828C5.43828 3.65234 3.73828 5.35234 3.73828 9.60234V14.7023C3.73828 18.9523 5.43828 20.6523 9.68828 20.6523Z'
        stroke='white'
        stroke-width='2'
        stroke-linecap='round'
        stroke-linejoin='round'
      />
      <circle cx='5' cy='5' r='5' fill='white' />
    </svg>
  )
}

export const ProductsIcon = () => {
  return (
    <svg
      width='22'
      height='22'
      viewBox='0 0 22 22'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M1 8V6C1 3 3 1 6 1H16C19 1 21 3 21 6V8'
        stroke='white'
        stroke-width='1.8'
        stroke-miterlimit='10'
        stroke-linecap='round'
        stroke-linejoin='round'
      />
      <path
        d='M1 14V16C1 19 3 21 6 21H16C19 21 21 19 21 16V14'
        stroke='white'
        stroke-width='1.8'
        stroke-miterlimit='10'
        stroke-linecap='round'
        stroke-linejoin='round'
      />
      <path
        d='M5.69971 8.25977L10.9997 11.3298L16.2597 8.27979'
        stroke='white'
        stroke-width='1.5'
        stroke-linecap='round'
        stroke-linejoin='round'
      />
      <path
        d='M11 16.7703V11.3203'
        stroke='white'
        stroke-width='1.5'
        stroke-linecap='round'
        stroke-linejoin='round'
      />
      <path
        d='M9.76096 5.29055L6.56096 7.07058C5.84096 7.47058 5.24097 8.48057 5.24097 9.31057V12.7006C5.24097 13.5306 5.83096 14.5406 6.56096 14.9406L9.76096 16.7205C10.441 17.1005 11.561 17.1005 12.251 16.7205L15.451 14.9406C16.171 14.5406 16.771 13.5306 16.771 12.7006V9.31057C16.771 8.48057 16.181 7.47058 15.451 7.07058L12.251 5.29055C11.561 4.90055 10.441 4.90055 9.76096 5.29055Z'
        stroke='white'
        stroke-width='1.5'
        stroke-linecap='round'
        stroke-linejoin='round'
      />
    </svg>
  )
}

export const SavedFactorsIcon = () => {
  return (
    <svg
      width='20'
      height='21'
      viewBox='0 0 20 21'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M19 5.61538V14.8462C19 17.6154 17.5 19.4615 14 19.4615H6C2.5 19.4615 1 17.6154 1 14.8462V5.61538C1 2.84615 2.5 1 6 1H14C17.5 1 19 2.84615 19 5.61538Z'
        stroke='white'
        stroke-width='1.8'
        stroke-miterlimit='10'
        stroke-linecap='round'
        stroke-linejoin='round'
      />
      <path
        d='M13.499 1V8.25537C13.499 8.66153 12.979 8.8646 12.659 8.59691L10.3391 6.62156C10.1491 6.45541 9.849 6.45541 9.659 6.62156L7.33905 8.59691C7.01905 8.8646 6.49902 8.66153 6.49902 8.25537V1H13.499Z'
        stroke='white'
        stroke-width='1.5'
        stroke-miterlimit='10'
        stroke-linecap='round'
        stroke-linejoin='round'
      />
      <path
        d='M11.251 12.0771H15.501'
        stroke='white'
        stroke-width='1.5'
        stroke-miterlimit='10'
        stroke-linecap='round'
        stroke-linejoin='round'
      />
      <path
        d='M7.00098 15.7695H15.501'
        stroke='white'
        stroke-width='1.5'
        stroke-miterlimit='10'
        stroke-linecap='round'
        stroke-linejoin='round'
      />
    </svg>
  )
}
