"use client"

import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import type { RefObject } from "react"

gsap.registerPlugin(useGSAP, ScrollTrigger)

export const useMarketingMotion = (scope: RefObject<HTMLDivElement | null>) => {
	useGSAP(
		() => {
			const media = gsap.matchMedia()

			media.add("(prefers-reduced-motion: no-preference)", () => {
				gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach(element => {
					gsap.from(element, {
						opacity: 0,
						y: 48,
						filter: "blur(8px)",
						duration: 1,
						ease: "power3.out",
						scrollTrigger: {
							trigger: element,
							start: "top 88%",
							once: true
						}
					})
				})

				gsap.utils.toArray<HTMLElement>("[data-media]").forEach(element => {
					gsap.fromTo(
						element,
						{ scale: 0.9, opacity: 0.45 },
						{
							scale: 1,
							opacity: 1,
							ease: "none",
							scrollTrigger: {
								trigger: element,
								start: "top 92%",
								end: "center 55%",
								scrub: 0.8
							}
						}
					)
				})
			})

			return () => media.revert()
		},
		{ scope }
	)
}
