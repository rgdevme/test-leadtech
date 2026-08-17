"use client"

import { Button } from "@/components/atoms/Button"
import { Heading } from "@/components/atoms/Heading"
import { Text } from "@/components/atoms/Text"
import { en } from "@/data/locale/en"
import styles from "./error.module.css"

type ErrorPageProps = {
	error: Error & { digest?: string }
	reset: () => void
}

export default function ErrorPage({ reset }: ErrorPageProps) {
	return (
		<main className={styles.main}>
			<div className={styles.container}>
				<Heading
					as='h1'
					className={styles.heading}>
					The page could not be prepared.
				</Heading>
				<Text className={styles.text}>
					Your data has not been changed. Try loading the page again.
				</Text>
				<Button
					className={styles.action}
					onClick={reset}>
					{en.common.retry}
				</Button>
			</div>
		</main>
	)
}
