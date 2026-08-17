"use client"

import { IconAt, IconLogout } from "@tabler/icons-react"
import type { PropsWithChildren } from "react"

import type { AuthUser, SubscriptionResponse } from "@leadtech/common/contracts"

import { Button } from "@/components/atoms/Button"
import { Heading } from "@/components/atoms/Heading"
import { Text } from "@/components/atoms/Text"
import { SubscriptionPanel } from "@/components/organisms/SubscriptionPanel"
import { WorkspaceTemplate } from "@/components/templates/WorkspaceTemplate"
import { useLocale } from "@/hooks/useLocale"
import { useSignOut } from "@/hooks/useSignOut"
import styles from "./index.module.css"

type ProfilePageProps = PropsWithChildren<{
	principal: AuthUser
	subscription: SubscriptionResponse
}>

export const ProfilePage = ({ principal, subscription }: ProfilePageProps) => {
	const { dictionary } = useLocale()
	const { signOut, signingOut } = useSignOut()

	return (
		<WorkspaceTemplate>
			<WorkspaceTemplate.Header>
				<div
					className={styles.container}
					data-reveal>
					<Heading
						as='h2'
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
						<Button
							className={styles.action}
							loading={signingOut}
							onClick={() => void signOut()}
							variant='quiet'>
							<IconLogout
								aria-hidden='true'
								size={17}
								stroke={1.9}
							/>
							{dictionary.workspace.navigation.signOut}
						</Button>
					</section>
					<div data-reveal>
						<SubscriptionPanel subscription={subscription} />
					</div>
				</div>
			</WorkspaceTemplate.Content>
		</WorkspaceTemplate>
	)
}
