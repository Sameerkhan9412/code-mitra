export default function IconBtn({
    text,
    onclick,
    children,
    disabled,
    outline = false,
    customClasses,
    type,
  }) {
    return (
      <button
        disabled={disabled}
        onClick={onclick}
        className={`flex items-center text-white bg-richblue-700 hover:bg-richblue-300 cursor-pointer gap-x-2 rounded-md py-2 px-5 font-semibold  `}
        type={type}
      >
        {children ? (
          <>
            <span className={`${outline && ""}`}>{text}</span>
            {children}
          </>
        ) : (
          text
        )}
      </button>
    )
  }