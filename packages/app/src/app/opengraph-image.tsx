import { ImageResponse } from "next/og"

import { en } from "@/data/locale/en"

export const alt = en.metadata.imageAlt
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

const OpenGraphImage = () =>
	new ImageResponse(
		<div
			style={{
				alignItems: "stretch",
				background: "#f2efe6",
				color: "#171814",
				display: "flex",
				fontFamily: "Satoshi, Helvetica Neue, Arial, sans-serif",
				height: "100%",
				padding: 48,
				width: "100%"
			}}>
			<div
				style={{
					alignItems: "stretch",
					background: "#fbf9f2",
					border: "2px solid rgba(23,24,20,.1)",
					borderRadius: 34,
					display: "flex",
					flex: 1,
					overflow: "hidden",
					padding: 8
				}}>
				<div
					style={{
						background: "#171814",
						borderRadius: 26,
						display: "flex",
						flex: 1,
						flexDirection: "column",
						justifyContent: "space-between",
						padding: 56
					}}>
					<div style={{ color: "#f2efe6", display: "flex", fontSize: 38, fontWeight: 700 }}>
						{en.brand.name}
					</div>
					<div style={{ display: "flex", flexDirection: "column" }}>
						<div
							style={{
								color: "#f2efe6",
								display: "flex",
								fontSize: 78,
								fontWeight: 500,
								lineHeight: 0.95,
								maxWidth: 850
							}}>
							{en.marketing.hero.titleLead} {en.marketing.hero.titleAccent}
						</div>
						<div
							style={{
								background: "#c7ff3d",
								borderRadius: 999,
								display: "flex",
								height: 18,
								marginTop: 34,
								width: 120
							}}
						/>
					</div>
				</div>
			</div>
		</div>,
		size
	)

export default OpenGraphImage
