import Image from "next/image"
import type { PropsWithChildren } from "react"

import { Container, Heading, Text } from "@/components/atoms"
import { BenefitItem } from "@/components/molecules"
import type { Dictionary } from "@/i18n/getDictionary"
import styles from "./index.module.css"

type BenefitsSectionProps = PropsWithChildren<{
	copy: Dictionary["benefits"]
}>

export const BenefitsSection = ({ copy }: BenefitsSectionProps) => (
	<section
		className={styles.section}
		id='benefits'>
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
			<div
				className={styles.mediaShell}
				data-media>
				<div className={styles.mediaCore}>
					<Image
						alt={copy.imageAlt}
						height={1024}
						sizes='(max-width: 767px) 100vw, 1120px'
						src='/media/benefits-editor.png'
						width={1536}
					/>
				</div>
			</div>
			<div className={styles.grid}>
				{copy.items.map(item => (
					<BenefitItem
						key={item.index}
						{...item}
					/>
				))}
			</div>
		</Container>
	</section>
)
