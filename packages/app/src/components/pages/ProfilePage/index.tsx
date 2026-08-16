"use client"

import { IconAt } from "@tabler/icons-react"
import type { PropsWithChildren } from "react"

import type { AuthUser, SubscriptionResponse } from "@leadtech/common/contracts"

import { Heading } from "@/components/atoms/Heading"
import { Text } from "@/components/atoms/Text"
import { SubscriptionPanel } from "@/components/organisms/SubscriptionPanel"
import { WorkspaceTemplate } from "@/components/templates/WorkspaceTemplate"
import { en } from "@/data/locale/en"

type ProfilePageProps = PropsWithChildren<{
	principal: AuthUser
	subscription: SubscriptionResponse
}>

export const ProfilePage = ({ principal, subscription }: ProfilePageProps) => (
	<WorkspaceTemplate>
		<WorkspaceTemplate.Header>
			<div
				className='max-w-4xl'
				data-reveal>
				<Heading
					className='max-w-5xl text-[clamp(3rem,7vw,6rem)] leading-[0.92]'
					level={1}
					serif>
					{en.profile.title}
				</Heading>
				<Text className='mt-6 max-w-xl'>{en.profile.description}</Text>
			</div>
		</WorkspaceTemplate.Header>
		<WorkspaceTemplate.Content>
			<div className='grid gap-4 lg:grid-cols-[0.7fr_1.3fr]'>
				<section
					className='rounded-xl border border-sage-200 bg-sage-50 p-6 sm:p-8'
					data-reveal>
					<span className='grid size-10 place-items-center rounded-lg bg-blue-50 text-blue-600'>
						<IconAt
							size={21}
							stroke={1.8}
						/>
					</span>
					<Text
						className='mt-8 text-xs font-bold uppercase text-sage-600'
						unstyled>
						{en.profile.signedInAs}
					</Text>
					<Text
						className='mt-2 break-all text-lg font-semibold text-sage-950'
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
