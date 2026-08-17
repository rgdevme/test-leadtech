"use client"

import { IconFilePlus } from "@tabler/icons-react"
import type { PropsWithChildren } from "react"

import { Button } from "@/components/atoms/Button"
import { Heading } from "@/components/atoms/Heading"
import { Text } from "@/components/atoms/Text"
import { useLocale } from "@/hooks/useLocale"
import styles from "./index.module.css"

type EmptyStateProps = PropsWithChildren<{
	canCreate: boolean
	creating: boolean
	onCreate: () => void
}>

export const EmptyState = ({ canCreate, creating, onCreate }: EmptyStateProps) => {
	const { dictionary } = useLocale()

	return (
		<section className={styles.section}>
			<div
				className={styles.container}
				data-reveal>
				<span className={styles.text}>
					<IconFilePlus
						size={24}
						stroke={1.8}
					/>
				</span>
				<Heading
					as='h2'
					className={styles.heading}>
					{dictionary.workspace.documents.emptyTitle}
				</Heading>
				<Text className={styles.text2}>{dictionary.workspace.documents.emptyDescription}</Text>
				<Button
					className={styles.action}
					loading={creating}
					onClick={onCreate}>
					{canCreate
						? dictionary.workspace.documents.create
						: dictionary.workspace.subscription.subscribe}
				</Button>
			</div>
		</section>
	)
}
