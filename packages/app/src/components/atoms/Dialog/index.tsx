"use client"

import { useEffect, useRef, type DialogHTMLAttributes, type PropsWithChildren } from "react"

type DialogProps = PropsWithChildren<
	DialogHTMLAttributes<HTMLDialogElement> & {
		labelledBy: string
		open: boolean
		onClose: () => void
	}
>

export const Dialog = ({ children, labelledBy, onClose, open, ...props }: DialogProps) => {
	const dialogRef = useRef<HTMLDialogElement>(null)

	useEffect(() => {
		const dialog = dialogRef.current
		if (!dialog) {
			return
		}

		if (open && !dialog.open) {
			dialog.showModal()
		}
		if (!open && dialog.open) {
			dialog.close()
		}
	}, [open])

	return (
		<dialog
			aria-labelledby={labelledBy}
			className='dialog-shell m-auto w-[min(92vw,64rem)] rounded-xl border border-line bg-white p-0 text-charcoal'
			onCancel={event => {
				event.preventDefault()
				onClose()
			}}
			onClick={event => {
				if (event.target === event.currentTarget) {
					onClose()
				}
			}}
			ref={dialogRef}
			{...props}>
			{children}
		</dialog>
	)
}
