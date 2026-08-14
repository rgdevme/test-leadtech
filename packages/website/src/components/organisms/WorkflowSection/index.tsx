import Image from "next/image";
import type { PropsWithChildren } from "react";

import { Container, Heading, Text } from "@/components/atoms";
import { WorkflowStep } from "@/components/molecules";
import type { Dictionary } from "@/i18n/getDictionary";

type WorkflowSectionProps = PropsWithChildren<{
  copy: Dictionary["workflow"];
}>;

export const WorkflowSection = ({ copy }: WorkflowSectionProps) => (
  <section className="section workflow" data-pin-section id="workflow">
    <Container size="wide">
      <div className="workflow__layout">
        <div className="workflow__copy" data-pin-copy>
          <Text as="span" className="eyebrow eyebrow--inverse" unstyled>
            {copy.eyebrow}
          </Text>
          <Heading as="h2" size="section">
            {copy.title}
          </Heading>
          <Text size="lead" tone="inverse">
            {copy.description}
          </Text>
        </div>
        <div className="workflow__story">
          <div className="workflow__media-shell" data-media>
            <div className="workflow__media-core">
              <Image
                alt={copy.imageAlt}
                className="workflow__desktop-image"
                height={1003}
                sizes="(max-width: 959px) 100vw, 62vw"
                src="/media/workflow-editor.png"
                width={1568}
              />
              <Image
                alt={copy.imageAlt}
                className="workflow__mobile-image"
                height={1672}
                sizes="(max-width: 767px) 86vw, 1px"
                src="/media/mobile-editor.png"
                width={941}
              />
            </div>
          </div>
          <div className="workflow__steps">
            {copy.steps.map((step) => (
              <WorkflowStep key={step.index} {...step} />
            ))}
          </div>
        </div>
      </div>
    </Container>
  </section>
);
