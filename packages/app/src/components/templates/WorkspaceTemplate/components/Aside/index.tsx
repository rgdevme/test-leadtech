import type { PropsWithChildren } from "react"

type AsideProps = PropsWithChildren

export function Aside({ children }: AsideProps) {
	return (
		<aside className='mt-12 border-t border-sage-200 pt-8 lg:mt-0 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0'>
			{children}
		</aside>
	)
}
