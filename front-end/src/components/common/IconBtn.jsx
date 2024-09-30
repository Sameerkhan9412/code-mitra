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
        className={`flex items-center ${
          outline ? "border bg-transparent" : "bg-blue"
        } cursor-pointer gap-x-2 rounded-md py-2 px-5 font-semibold  ${customClasses}`}
        type={type}
      >
        {children ? (
          <>
            <span className={`${outline && "text-white"}`}>{text}</span>
            {children}
          </>
        ) : (
          text
        )}
      </button>
    )
  }