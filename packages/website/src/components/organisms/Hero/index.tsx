import Image from "next/image"
import type { PropsWithChildren } from "react"

import { Container, Heading, Text } from "@/components/atoms"
import { ScrollIndicator } from "@/components/molecules"
import type { Dictionary } from "@/i18n/getDictionary"
import styles from "./index.module.css"

type HeroProps = PropsWithChildren<{
	copy: Dictionary["hero"]
}>

export const Hero = ({ copy }: HeroProps) => (
	<section className={styles.hero}>
		<Container size='wide'>
			<div
				className={styles.copy}
				data-reveal>
				<Text
					as='span'
					variant='eyebrow'>
					{copy.eyebrow}
				</Text>
				<Heading
					as='h1'
					size='display'>
					<Text
						as='span'
						unstyled>
						{copy.titleLead}
					</Text>
					<Text
						as='em'
						unstyled>
						{copy.titleAccent}
					</Text>
				</Heading>
				<div className={styles.support}>
					<Text
						size='lead'
						tone='muted'>
						{copy.description}
					</Text>
					<ScrollIndicator
						href='#benefits'
						label={copy.scrollLabel}
					/>
				</div>
			</div>
			<div
				className={styles.visualShell}
				data-media>
				<div className={styles.visualCore}>
					<Image
						alt={copy.imageAlt}
						className={styles.image}
						height={992}
						priority
						sizes='(max-width: 767px) 100vw, 94vw'
						src='/media/hero-editor.png'
						width={1586}
					/>
					<Text
						as='span'
						className={styles.note}
						unstyled>
						{copy.note}
					</Text>
				</div>
			</div>
		</Container>
	</section>
)
