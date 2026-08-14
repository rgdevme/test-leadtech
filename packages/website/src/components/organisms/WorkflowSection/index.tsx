import Image from "next/image";
import type { PropsWithChildren } from "react";

import { Container, Heading, Text } from "@/components/atoms";
import { WorkflowStep } from "@/components/molecules";
import type { Dictionary } from "@/i18n/getDictionary";
import styles from "./index.module.css";

const fallbackWorkflowImage = "/media/mobile-editor.png";
const workflowImages = [
  fallbackWorkflowImage,
  "/media/hero-editor.png",
  "/media/trust-archive.png",
];

type WorkflowSectionProps = PropsWithChildren<{
  copy: Dictionary["workflow"];
}>;

export const WorkflowSection = ({ copy }: WorkflowSectionProps) => (
  <section className={styles.section} id="workflow">
    <Container size="wide">
      <div className={styles.layout}>
        <div className={styles.copy}>
          <Text as="span" tone="inverse" variant="eyebrow">
            {copy.eyebrow}
          </Text>
          <Heading as="h2" size="section">
            {copy.title}
          </Heading>
          <Text size="lead" tone="inverse">
            {copy.description}
          </Text>
        </div>
        <div className={styles.story}>
          <div className={styles.mediaShell} data-media>
            <div className={styles.mediaCore}>
              <Image
                alt={copy.imageAlt}
                className={styles.desktopImage}
                height={1003}
                sizes="(max-width: 959px) 100vw, 62vw"
                src="/media/workflow-editor.png"
                width={1568}
              />
              <Image
                alt={copy.imageAlt}
                className={styles.mobileImage}
                height={1672}
                sizes="(max-width: 767px) 86vw, 1px"
                src="/media/mobile-editor.png"
                width={941}
              />
            </div>
          </div>
          <div className={styles.steps}>
            {copy.steps.map((step, index) => (
              <WorkflowStep
                imageSrc={workflowImages[index] ?? fallbackWorkflowImage}
                key={step.index}
                {...step}
              />
            ))}
          </div>
        </div>
      </div>
    </Container>
  </section>
);
