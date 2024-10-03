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
        className={`flex items-center text-white ${
          outline ? "border border-white bg-transparent" : "bg-blue"
        } cursor-pointer gap-x-2 rounded-md py-2 px-5 font-semibold text-richblack-900 ${customClasses}`}
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