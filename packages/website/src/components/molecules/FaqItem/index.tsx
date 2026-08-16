"use client"

import type { PropsWithChildren } from "react"
import { useId, useState } from "react"

import { Text } from "@/components/atoms"
import styles from "./index.module.css"

type FaqItemProps = PropsWithChildren<{
	answer: string
	question: string
}>

export const FaqItem = ({ answer, question }: FaqItemProps) => {
	const answerId = useId()
	const [open, setOpen] = useState(false)

	return (
		<article
			className={styles.item}
			data-open={open}
			data-reveal>
			<button
				aria-controls={answerId}
				aria-expanded={open}
				className={styles.summary}
				onClick={() => setOpen(current => !current)}
				type='button'>
				<Text
					as='span'
					unstyled>
					{question}
				</Text>
				<span
					aria-hidden='true'
					className={styles.mark}>
					<span />
					<span />
				</span>
			</button>
			<div className={styles.answerShell}>
				<div
					className={styles.answer}
					id={answerId}>
					<Text>{answer}</Text>
				</div>
			</div>
		</article>
	)
}
