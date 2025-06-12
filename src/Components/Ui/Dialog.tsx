import { useState } from 'react'
import { InfoIcon, CloseIcon } from '../icons'

export default function Dialog({
  title = "It's a simple dialog.",
  //   onConfirm = () => {},
  onCancel = () => {},
  triggerText = 'Open Dialog',
  children = 'This is a dialog',
  close = true,
  info = false,
  onInfo = () => {}
}) {
  const [isOpen, setIsOpen] = useState(false)

  const openDialog = () => setIsOpen(true)
  const closeDialog = () => setIsOpen(false)

  //   const handleConfirm = () => {
  //     onConfirm()
  //     closeDialog()
  //   }

  const handleInfo = () => {
    onInfo()
    closeDialog()
  }

  const handleCancel = () => {
    onCancel()
    closeDialog()
  }

  return (
    <>
      <button
        onClick={openDialog}
        className='rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2'
        type='button'
      >
        {triggerText}
      </button>

      {isOpen && (
        <div
          className='fixed inset-0 z-[999] grid h-screen w-screen place-items-center bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-300'
          onClick={handleCancel}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className='relative m-4 p-4 w-2/5 min-w-[40%] max-w-[40%] rounded-lg bg-white shadow-sm'
          >
            <div className='flex shrink-0 items-center pb-4 text-xl font-medium text-slate-800 justify-between'>
              {info && <InfoIcon onClick={handleInfo} />}
              {title}
              {close && <CloseIcon onClick={handleCancel} />}
            </div>
            <div className='relative py-4 leading-normal text-slate-600 font-light'>
              {children}
            </div>
            {/* <div className='flex shrink-0 flex-wrap items-center pt-4 justify-end'>
              <button
                onClick={handleCancel}
                className='rounded-md border border-transparent py-2 px-4 text-center text-sm transition-all text-slate-600 hover:bg-slate-100 focus:bg-slate-100 active:bg-slate-100 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none'
                type='button'
              >
                {cancelText}
              </button>
              <button
                onClick={handleConfirm}
                className='rounded-md bg-green-600 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-green-700 focus:shadow-none active:bg-green-700 hover:bg-green-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2'
                type='button'
              >
                {confirmText}
              </button>
            </div> */}
          </div>
        </div>
      )}
    </>
  )
}
