import type { SubscriptionPlan } from "@leadtech/common/contracts"
import Image from "next/image"
import type { PropsWithChildren } from "react"

import { Container, Heading, Text } from "@/components/atoms"
import { PriceSummary } from "@/components/molecules"
import type { Dictionary } from "@/i18n/getDictionary"
import styles from "./index.module.css"

type PricingSectionProps = PropsWithChildren<{
	actionHref: string
	copy: Dictionary["pricing"]
	locale: string
	plan: SubscriptionPlan
}>

export const PricingSection = ({ actionHref, copy, locale, plan }: PricingSectionProps) => (
	<section
		className={styles.section}
		id='pricing'>
		<Container>
			<div
				className={styles.heading}
				data-reveal>
				<Text
					as='span'
					variant='eyebrow'>
					{copy.eyebrow}
				</Text>
				<Heading
					as='h2'
					size='section'>
					{copy.title}
				</Heading>
				<Text
					size='lead'
					tone='muted'>
					{copy.description}
				</Text>
			</div>
			<div className={styles.layout}>
				<PriceSummary
					actionHref={actionHref}
					copy={copy}
					locale={locale}
					plan={plan}
				/>
				<div
					className={styles.mediaShell}
					data-media>
					<div className={styles.mediaCore}>
						<Image
							alt={copy.imageAlt}
							height={992}
							sizes='(max-width: 767px) 100vw, 48vw'
							src='/media/pricing-card.png'
							width={1586}
						/>
					</div>
				</div>
			</div>
		</Container>
	</section>
)
