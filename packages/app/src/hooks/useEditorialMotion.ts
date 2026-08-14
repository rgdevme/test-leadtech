"use client"

import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import type { RefObject } from "react"

gsap.registerPlugin(useGSAP, ScrollTrigger)

export const useEditorialMotion = (scope: RefObject<HTMLElement | null>) => {
	useGSAP(
		() => {
			const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
			if (reducedMotion) {
				gsap.set("[data-reveal]", { opacity: 1, y: 0 })
				gsap.set("[data-scrub-copy] span", { opacity: 1 })
				gsap.set("[data-scroll-image]", { opacity: 1, scale: 1 })
				return
			}

			gsap.fromTo(
				"[data-reveal]",
				{ opacity: 0, y: 12 },
				{ opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: "power3.out" }
			)

			gsap.utils.toArray<HTMLElement>("[data-scrub-copy] span").forEach(word => {
				gsap.fromTo(
					word,
					{ opacity: 0.15 },
					{
						opacity: 1,
						ease: "none",
						scrollTrigger: {
							trigger: word,
							start: "top 88%",
							end: "top 62%",
							scrub: true
						}
					}
				)
			})

			gsap.utils.toArray<HTMLElement>("[data-scroll-image]").forEach(image => {
				gsap.fromTo(
					image,
					{ opacity: 0.72, scale: 0.86 },
					{
						opacity: 1,
						scale: 1,
						ease: "none",
						scrollTrigger: {
							trigger: image,
							start: "top bottom",
							end: "center center",
							scrub: true
						}
					}
				)
				gsap.to(image, {
					opacity: 0.35,
					ease: "none",
					scrollTrigger: {
						trigger: image,
						start: "center center",
						end: "bottom top",
						scrub: true
					}
				})
			})
		},
		{ scope }
	)
}
