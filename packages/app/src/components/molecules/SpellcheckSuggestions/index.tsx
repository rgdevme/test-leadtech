"use client"

import { IconEyeOff, IconX } from "@tabler/icons-react"
import { useEffect, type PropsWithChildren } from "react"

import { Button } from "@/components/atoms/Button"
import { IconButton } from "@/components/atoms/IconButton"
import styles from "./index.module.css"

type SpellcheckSuggestionsProps = PropsWithChildren<{
	anchor: {
		left: number
		top: number
	}
	closeLabel: string
	ignoreLabel: string
	label: string
	onClose: () => void
	onIgnore: () => void
	onSelect: (suggestion: string) => void
	suggestions: string[]
}>

export const SpellcheckSuggestions = ({
	anchor,
	closeLabel,
	ignoreLabel,
	label,
	onClose,
	onIgnore,
	onSelect,
	suggestions
}: SpellcheckSuggestionsProps) => {
	useEffect(() => {
		const closeFromOutside = (event: PointerEvent) => {
			const target = event.target
			if (
				target instanceof Element
				&& (target.closest("[data-spellcheck-menu]")
					|| target.closest("[data-spellcheck-error]"))
			) {
				return
			}
			onClose()
		}
		const closeFromViewportChange = () => onClose()

		document.addEventListener("pointerdown", closeFromOutside)
		window.addEventListener("resize", closeFromViewportChange)
		window.addEventListener("scroll", closeFromViewportChange, true)
		return () => {
			document.removeEventListener("pointerdown", closeFromOutside)
			window.removeEventListener("resize", closeFromViewportChange)
			window.removeEventListener("scroll", closeFromViewportChange, true)
		}
	}, [onClose])

	return (
		<div
			aria-label={label}
			className={styles.menu}
			data-spellcheck-menu
			role='menu'
			style={{ left: anchor.left, top: anchor.top }}>
			{suggestions.map(suggestion => (
				<Button
					className={styles.suggestion}
					key={suggestion}
					onClick={() => onSelect(suggestion)}
					role='menuitem'
					variant='quiet'>
					{suggestion}
				</Button>
			))}
			<IconButton
				className={styles.action}
				label={ignoreLabel}
				onClick={onIgnore}>
				<IconEyeOff
					size={16}
					stroke={1.9}
				/>
			</IconButton>
			<IconButton
				className={styles.action}
				label={closeLabel}
				onClick={onClose}>
				<IconX
					size={16}
					stroke={1.9}
				/>
			</IconButton>
		</div>
	)
}
