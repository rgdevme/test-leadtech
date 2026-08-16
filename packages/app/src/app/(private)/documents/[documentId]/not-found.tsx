import { Heading } from "@/components/atoms/Heading"
import { Link } from "@/components/atoms/Link"
import { Text } from "@/components/atoms/Text"

export default function DocumentNotFound() {
	return (
		<main className='grid min-h-[calc(100vh-4.5rem)] place-items-center bg-sage-50 px-6 text-center'>
			<div className='max-w-lg'>
				<Heading
					className='text-5xl'
					level={1}
					serif>
					This document is not in your archive.
				</Heading>
				<Text className='mt-5'>It may have been removed, or it belongs to another account.</Text>
				<Link
					className='mt-7 inline-block'
					href='/documents'>
					Return to documents
				</Link>
			</div>
		</main>
	)
}
