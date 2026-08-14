"use client"

import { Button } from "@/components/atoms/Button"
import { Heading } from "@/components/atoms/Heading"
import { Text } from "@/components/atoms/Text"
import { en } from "@/data/locale/en"

type ErrorPageProps = {
	error: Error & { digest?: string }
	reset: () => void
}

export default function ErrorPage({ reset }: ErrorPageProps) {
	return (
		<main className='grid min-h-screen place-items-center bg-canvas px-6 text-center'>
			<div className='max-w-lg'>
				<Heading
					className='text-5xl'
					level={1}
					serif>
					The page could not be prepared.
				</Heading>
				<Text className='mt-5'>Your data has not been changed. Try loading the page again.</Text>
				<Button
					className='mt-7'
					onClick={reset}>
					{en.common.retry}
				</Button>
			</div>
		</main>
	)
}
