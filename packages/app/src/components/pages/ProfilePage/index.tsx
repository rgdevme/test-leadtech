"use client"

import { IconAt } from "@tabler/icons-react"
import type { PropsWithChildren } from "react"

import type { AuthUser, SubscriptionResponse } from "@leadtech/common/contracts"

import { Heading } from "@/components/atoms/Heading"
import { Text } from "@/components/atoms/Text"
import { SubscriptionPanel } from "@/components/organisms/SubscriptionPanel"
import { WorkspaceTemplate } from "@/components/templates/WorkspaceTemplate"
import { useLocale } from "@/hooks/useLocale"
import styles from "./index.module.css"

type ProfilePageProps = PropsWithChildren<{
	principal: AuthUser
	subscription: SubscriptionResponse
}>

export const ProfilePage = ({ principal, subscription }: ProfilePageProps) => {
	const { dictionary } = useLocale()

	return (
		<WorkspaceTemplate>
			<WorkspaceTemplate.Header>
				<div
					className={styles.container}
					data-reveal>
					<Heading
						as='h1'
						className={styles.heading}>
						{dictionary.workspace.profile.title}
					</Heading>
					<Text className={styles.text}>{dictionary.workspace.profile.description}</Text>
				</div>
			</WorkspaceTemplate.Header>
			<WorkspaceTemplate.Content>
				<div className={styles.grid}>
					<section
						className={styles.section}
						data-reveal>
						<span className={styles.text2}>
							<IconAt
								size={21}
								stroke={1.8}
							/>
						</span>
						<Text
							className={styles.text3}
							unstyled>
							{dictionary.workspace.profile.signedInAs}
						</Text>
						<Text
							className={styles.text4}
							unstyled>
							{principal.email}
						</Text>
					</section>
					<div data-reveal>
						<SubscriptionPanel subscription={subscription} />
					</div>
				</div>
			</WorkspaceTemplate.Content>
		</WorkspaceTemplate>
	)
}
