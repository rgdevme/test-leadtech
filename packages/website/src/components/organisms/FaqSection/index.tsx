import Image from "next/image"
import type { PropsWithChildren } from "react"

import { Container, Heading, Text } from "@/components/atoms"
import { FaqItem } from "@/components/molecules"
import type { Dictionary } from "@/i18n/getDictionary"
import styles from "./index.module.css"

type FaqSectionProps = PropsWithChildren<{
	copy: Dictionary["faq"]
}>

export const FaqSection = ({ copy }: FaqSectionProps) => (
	<section
		className={styles.section}
		id='faq'>
		<Container>
			<div
				className={styles.heading}
				data-reveal>
				<Text
					as='span'
					tone='inverse'
					variant='eyebrow'>
					{copy.eyebrow}
				</Text>
				<Heading
					as='h2'
					size='section'>
					{copy.title}
				</Heading>
			</div>
			<div className={styles.layout}>
				<div className={styles.items}>
					{copy.items.map(item => (
						<FaqItem
							key={item.question}
							{...item}
						/>
					))}
				</div>
				<div
					className={styles.mediaShell}
					data-media>
					<div className={styles.mediaCore}>
						<Image
							alt={copy.imageAlt}
							height={992}
							sizes='(max-width: 767px) 100vw, 42vw'
							src='/media/faq-accordion.png'
							width={1586}
						/>
					</div>
				</div>
			</div>
		</Container>
	</section>
)
