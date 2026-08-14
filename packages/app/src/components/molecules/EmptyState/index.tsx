import { IconFilePlus } from "@tabler/icons-react"
import type { PropsWithChildren } from "react"

import { Button } from "@/components/atoms/Button"
import { Heading } from "@/components/atoms/Heading"
import { Text } from "@/components/atoms/Text"
import { en } from "@/data/locale/en"

type EmptyStateProps = PropsWithChildren<{
	canCreate: boolean
	creating: boolean
	onCreate: () => void
}>

export const EmptyState = ({ canCreate, creating, onCreate }: EmptyStateProps) => (
	<section className='grid min-h-[32rem] place-items-center rounded-xl border border-line bg-white px-6 py-16 text-center'>
		<div
			className='max-w-md'
			data-reveal>
			<span className='mx-auto grid size-12 place-items-center rounded-lg bg-pale-blue text-accent-blue'>
				<IconFilePlus
					size={24}
					stroke={1.8}
				/>
			</span>
			<Heading
				className='mt-6 text-3xl'
				level={2}
				serif>
				{en.documents.emptyTitle}
			</Heading>
			<Text className='mt-3'>{en.documents.emptyDescription}</Text>
			<Button
				className='mt-7'
				loading={creating}
				onClick={onCreate}>
				{canCreate ? en.documents.create : en.subscription.subscribe}
			</Button>
		</div>
	</section>
)
