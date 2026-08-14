"use client"

import { useEffect, useRef, type DialogHTMLAttributes, type PropsWithChildren } from "react"

import styles from "./index.module.css"

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
			className={styles.dialog}
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
