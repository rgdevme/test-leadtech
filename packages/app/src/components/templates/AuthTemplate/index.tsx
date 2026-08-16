"use client"

import { IconArrowLeft, IconArrowRight, IconCheck } from "@tabler/icons-react"
import { useRef, useState, type PropsWithChildren } from "react"

import { Heading } from "@/components/atoms/Heading"
import { Logo } from "@/components/atoms/Logo"
import { Text } from "@/components/atoms/Text"
import { en } from "@/data/locale/en"
import styles from "./index.module.css"
import { useEditorialMotion } from "@/hooks/useEditorialMotion"

type AuthTemplateProps = PropsWithChildren<{
	description: string
	title: string
}>

export const AuthTemplate = ({ children, description, title }: AuthTemplateProps) => {
	const scope = useRef<HTMLElement>(null)
	const [principleIndex, setPrincipleIndex] = useState(0)
	useEditorialMotion(scope)

	const showPrinciple = (direction: -1 | 1) => {
		const length = en.auth.aside.principles.length
		setPrincipleIndex(current => (current + direction + length) % length)
	}

	return (
		<main
			className='min-h-screen w-full max-w-full overflow-x-hidden bg-sage-50'
			ref={scope}>
			<div className='grid min-h-screen lg:grid-cols-[minmax(0,1fr)_minmax(28rem,0.8fr)]'>
				<section className='flex min-h-screen flex-col px-6 py-7 sm:px-10 lg:px-16 xl:px-24'>
					<div data-reveal>
						<Logo href='/sign-in' />
					</div>

					<div
						className='my-auto w-full max-w-lg py-20'
						data-reveal>
						<Heading
							className='max-w-5xl text-[clamp(2.8rem,6vw,4.75rem)] leading-[0.98]'
							level={1}
							serif>
							{title}
						</Heading>
						<Text className='mt-6 max-w-md text-base'>{description}</Text>
						<div className='mt-10'>{children}</div>
					</div>

					<Text
						className='text-xs text-sage-400'
						data-reveal
						unstyled>
						{en.brand.product}
					</Text>
				</section>

				<aside
					className='relative hidden overflow-hidden border-l border-sage-200 bg-sage-200 p-10 lg:flex xl:p-14'
					data-scroll-image>
					<div className={styles.texture} />
					<div className='relative flex w-full flex-col justify-between rounded-xl border border-sage-950/5 bg-sage-100 p-8 xl:p-12'>
						<div
							className='flex gap-2'
							aria-hidden='true'>
							<span className='size-2.5 rounded-full bg-sage-950/10' />
							<span className='size-2.5 rounded-full bg-sage-950/10' />
							<span className='size-2.5 rounded-full bg-sage-950/10' />
						</div>

						<blockquote className='max-w-xl py-16'>
							<Text
								className='font-serif text-[clamp(2.4rem,4vw,4.5rem)] leading-[0.98] text-sage-950'
								unstyled>
								{en.auth.aside.headline}
							</Text>
							<div className='mt-10 flex items-start gap-3 border-t border-sage-950/8 pt-6 text-sm leading-6 text-sage-600'>
								<IconCheck
									className='mt-0.5 shrink-0'
									size={18}
									stroke={2}
								/>
								<Text unstyled>{en.auth.aside.principles[principleIndex]}</Text>
							</div>
						</blockquote>

						<div className='flex justify-end gap-2'>
							<button
								aria-label={en.auth.aside.previous}
								className='grid size-10 place-items-center rounded-md border border-sage-950/8 bg-sage-50/60 text-sage-950 transition hover:bg-sage-50 active:scale-[0.96]'
								onClick={() => showPrinciple(-1)}
								type='button'>
								<IconArrowLeft
									size={18}
									stroke={1.8}
								/>
							</button>
							<button
								aria-label={en.auth.aside.next}
								className='grid size-10 place-items-center rounded-md border border-sage-950/8 bg-sage-50/60 text-sage-950 transition hover:bg-sage-50 active:scale-[0.96]'
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
