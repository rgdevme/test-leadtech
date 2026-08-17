"use client"

import { IconArrowLeft, IconArrowRight, IconCheck } from "@tabler/icons-react"
import { useRef, useState, type PropsWithChildren } from "react"

import { Heading } from "@/components/atoms/Heading"
import { Logo } from "@/components/atoms/Logo"
import { Text } from "@/components/atoms/Text"
import { useEditorialMotion } from "@/hooks/useEditorialMotion"
import { useLocale } from "@/hooks/useLocale"
import { routes } from "@/i18n/routes"
import styles from "./index.module.css"
import layoutStyles from "./layout.module.css"

type AuthTemplateProps = PropsWithChildren<{
	description: string
	title: string
}>

export const AuthTemplate = ({ children, description, title }: AuthTemplateProps) => {
	const { dictionary, locale } = useLocale()
	const scope = useRef<HTMLElement>(null)
	const [principleIndex, setPrincipleIndex] = useState(0)
	useEditorialMotion(scope)

	const showPrinciple = (direction: -1 | 1) => {
		const length = dictionary.workspace.auth.aside.principles.length
		setPrincipleIndex(current => (current + direction + length) % length)
	}

	return (
		<main
			className={layoutStyles.main}
			ref={scope}>
			<div className={layoutStyles.grid}>
				<section className={layoutStyles.section}>
					<div data-reveal>
						<Logo href={routes.signIn(locale)} />
					</div>

					<div
						className={layoutStyles.container}
						data-reveal>
						<Heading
							as='h1'
							className={layoutStyles.heading}>
							{title}
						</Heading>
						<Text className={layoutStyles.text}>{description}</Text>
						<div className={layoutStyles.container2}>{children}</div>
					</div>

					<Text
						className={layoutStyles.text2}
						data-reveal
						unstyled>
						{dictionary.brand.product}
					</Text>
				</section>

				<aside
					className={layoutStyles.aside}
					data-scroll-image>
					<div className={styles.texture} />
					<div className={layoutStyles.card}>
						<div
							className={layoutStyles.row}
							aria-hidden='true'>
							<span className={layoutStyles.badge} />
							<span className={layoutStyles.badge2} />
							<span className={layoutStyles.badge3} />
						</div>

						<blockquote className={layoutStyles.container3}>
							<Text
								className={layoutStyles.text3}
								unstyled>
								{dictionary.workspace.auth.aside.headline}
							</Text>
							<div className={layoutStyles.row2}>
								<IconCheck
									className={layoutStyles.icon}
									size={18}
									stroke={2}
								/>
								<Text unstyled>{dictionary.workspace.auth.aside.principles[principleIndex]}</Text>
							</div>
						</blockquote>

						<div className={layoutStyles.row3}>
							<button
								aria-label={dictionary.workspace.auth.aside.previous}
								className={layoutStyles.button}
								onClick={() => showPrinciple(-1)}
								type='button'>
								<IconArrowLeft
									size={18}
									stroke={1.8}
								/>
							</button>
							<button
								aria-label={dictionary.workspace.auth.aside.next}
								className={layoutStyles.button2}
								onClick={() => showPrinciple(1)}
								type='button'>
								<IconArrowRight
									size={18}
									stroke={1.8}
								/>
							</button>
						</div>
					</div>
				</aside>
			</div>
		</main>
	)
}
